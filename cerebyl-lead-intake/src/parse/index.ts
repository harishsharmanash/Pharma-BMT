// Parser router: pick a deterministic parser by From/Subject; fall back to
// the LLM only when none match or required fields are missing (keeps spend ~0).
//
// TODO(samples): PharmaHopper / Pharmavends / DawaCharcha / TradeIndia
// parsers are intentionally not written yet — real sample .eml files needed
// (plan §4 blocker). Their From/subject signatures route to the LLM fallback
// until then, which is the safe default.

import { parseIndiaMART } from "./indiamart";
import { parseWithLLM } from "./llm";
import type { ParseResult } from "./types";
import { parseWebsite } from "./website";

// Pull the real body out of a raw MIME message. The naive "strip tags from
// everything" approach dies on real mail: 4KB of ARC/DKIM headers + a
// base64 HTML part means the actual body never reaches the parser.
// Strategy: parse MIME properly-ish — split header/body, walk multipart
// parts, prefer text/plain (else text/html), decode base64/quoted-printable.
function decodePart(cte: string, body: string): string {
	const enc = cte.toLowerCase();
	if (enc.includes("base64")) {
		try {
			const compact = body.replace(/\s+/g, "");
			return new TextDecoder("utf-8", { fatal: false }).decode(
				Uint8Array.from(atob(compact), (c) => c.charCodeAt(0)),
			);
		} catch {
			return body;
		}
	}
	if (enc.includes("quoted-printable")) {
		return body
			.replace(/=\r?\n/g, "")
			.replace(/=([0-9A-Fa-f]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
	}
	return body;
}

function htmlToText(t: string): string {
	return t
		.replace(/<br\s*\/?>/gi, "\n")
		.replace(/<\/(td|th)>/gi, " | ")
		.replace(/<\/tr>/gi, "\n")
		.replace(/<style[\s\S]*?<\/style>/gi, " ")
		.replace(/<script[\s\S]*?<\/script>/gi, " ")
		.replace(/<[^>]+>/g, " ")
		.replace(/&nbsp;/gi, " ")
		.replace(/&amp;/gi, "&")
		.replace(/&#0?39;|&apos;/gi, "'");
}

function splitHeadBody(s: string): { head: string; body: string } {
	const i = s.search(/\r?\n\r?\n/);
	if (i < 0) return { head: "", body: s };
	return { head: s.slice(0, i), body: s.slice(i) };
}

function headerValue(head: string, name: string): string {
	// Handles folded (multi-line) header values.
	const m = head.match(new RegExp(`^${name}:\\s*([\\s\\S]*?)(?=\\r?\\n[^\\t ]|$)`, "im"));
	return m ? m[1].replace(/\r?\n[ \t]+/g, " ").trim() : "";
}

export function rawToText(raw: string): string {
	const { head, body } = splitHeadBody(raw);
	const ctype = headerValue(head, "content-type");

	const pickParts = (text: string): string => text;

	if (/multipart\//i.test(ctype)) {
		const bMatch = ctype.match(/boundary="?([^";]+)"?/i);
		if (bMatch) {
			const boundary = bMatch[1];
			const parts = body.split(`--${boundary}`);
			let plain = "", html = "";
			for (const part of parts) {
				if (part.startsWith("--")) continue;
				const { head: ph, body: pb } = splitHeadBody(part.trimStart());
				const pct = headerValue(ph, "content-type").toLowerCase();
				const cte = headerValue(ph, "content-transfer-encoding");
				const decoded = decodePart(cte, pb.replace(/\r?\n--?\s*$/, ""));
				if (pct.startsWith("text/plain") && !plain) plain = decoded;
				else if (pct.startsWith("text/html") && !html) html = decoded;
				else if (/multipart\//i.test(pct)) {
					// Nested multipart (common: alternative inside mixed) — recurse.
					const nested = rawToText(`${ph}\n\n${pb}`);
					if (nested && !plain) plain = nested;
				}
			}
			const chosen = plain || (html ? htmlToText(html) : "");
			if (chosen.trim()) return pickParts(chosen);
		}
	}

	// Single-part message.
	const decoded = decodePart(headerValue(head, "content-transfer-encoding"), body);
	const text = /text\/html/i.test(ctype) ? htmlToText(decoded) : decoded;
	return pickParts(text)
		.replace(/[ \t]+/g, " ")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
}

export type ParseOutcome = { result: ParseResult | null; error: string | null };

export async function parseLead(
	env: Env,
	from: string,
	subject: string,
	text: string,
): Promise<ParseOutcome> {
	const ctx = { from, subject, text };
	let error: string | null = null;

	const indiamart = parseIndiaMART(ctx);
	if (indiamart) return { result: { parser: "indiamart", lead: indiamart }, error: null };

	// Website forms: generic label:value bodies (only when From isn't a known
	// portal — IndiaMART has already had its chance above).
	const website = parseWebsite(ctx);
	if (website) return { result: { parser: "website", lead: website }, error: null };

	// LLM fallback — same ParsedLead shape, strict JSON.
	try {
		const llm = await parseWithLLM(env, from, subject, text);
		if (llm && (llm.name || llm.contact)) return { result: { parser: "llm", lead: llm }, error: null };
		error = `llm returned lead without name/phone: ${JSON.stringify(llm).slice(0, 300)}`;
	} catch (e) {
		error = e instanceof Error ? e.message : String(e);
		console.error("LLM fallback failed:", e);
	}
	return { result: null, error };
}

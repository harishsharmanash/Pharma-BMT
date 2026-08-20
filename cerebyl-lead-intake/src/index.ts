// cerebyl-lead-intake — Cloudflare Email Worker.
//
// Portal lead-notification emails arrive at {slug}@leads.cerebyl.com via
// Cloudflare Email Routing (catch-all → this worker). For each message:
//   1. resolve company from the `to` slug (company_lead_intake, option A)
//   2. extract plain text from the raw MIME
//   3. parse lead fields (deterministic parser, LLM fallback)
//   4. classify PCD vs third-party (keyword scan; unsure → pcd)
//   5. dedupe by normalized phone vs existing company leads
//   6. allocate a rep via RPC allocate_lead_rep (when auto_allocate)
//   7. INSERT the lead (service-role, bypasses RLS; rep_id may be NULL)
//   8. INSERT a lead_intake_log row (raw_excerpt capped ~4KB)
//   9. forward the original email to the company's real inbox

import { classify } from "./classify";
import { resolveCompany, slugFromTo } from "./company";
import { findDuplicate, normalizePhone } from "./dedupe";
import { parseLead, rawToText } from "./parse";
import { checkSender, readSenderAuth } from "./sender-auth";
import { sbInsert, sbRpc, sbUpdate } from "./supabase";

const RAW_EXCERPT_MAX = 4096;

// leads.source CHECK constraint allows only these exact spellings
// ('Meta','PharmaHoppers','IndiaMart','Website','Other'). Parser-friendly
// names like "IndiaMART"/"PharmaHopper"/"TradeIndia" must be mapped or the
// insert is rejected with 23514.
const SOURCE_MAP: Record<string, string> = {
	indiamart: "IndiaMart",
	pharmahopper: "PharmaHoppers",
	pharmahoppers: "PharmaHoppers",
	website: "Website",
	meta: "Meta",
};

function dbSource(source: string): string {
	return SOURCE_MAP[source.toLowerCase()] ?? "Other";
}

type LogRow = {
	company_id: string | null;
	intake_slug: string;
	from_addr: string;
	sender_domain: string;
	sender_auth: string;
	subject: string;
	source_matched: string;
	parse_ok: boolean;
	parsed: unknown;
	outcome: string;
	lead_id: string | null;
	allocated_rep: string | null;
	raw_excerpt: string;
};

async function readRaw(message: ForwardableEmailMessage): Promise<string> {
	const buf = await new Response(message.raw).arrayBuffer();
	return new TextDecoder("utf-8", { fatal: false }).decode(buf);
}

// Decode RFC 2047 encoded-words (=?UTF-8?Q?...?= / =?UTF-8?B?...?=) so
// subjects like "New Business Inquiry — PCD Pharma" don't get logged raw.
function decodeEncodedWords(s: string): string {
	return s.replace(/=\?([^?]+)\?([QqBb])\?([^?]*)\?=/g, (_m, charset: string, enc: string, text: string) => {
		try {
			const bytes =
				enc.toUpperCase() === "B"
					? Uint8Array.from(atob(text.replace(/\s+/g, "")), (c) => c.charCodeAt(0))
					: Uint8Array.from(
							text.replace(/_/g, " ").replace(/=([0-9A-Fa-f]{2})/g, (_x, h: string) =>
								String.fromCharCode(parseInt(h, 16)),
							),
							(c) => c.charCodeAt(0),
						);
			return new TextDecoder(charset.toLowerCase(), { fatal: false }).decode(bytes);
		} catch {
			return _m;
		}
	});
}

async function handle(message: ForwardableEmailMessage, env: Env): Promise<void> {
	const slug = slugFromTo(message.to);
	const subject = decodeEncodedWords(message.headers.get("subject") ?? "");
	const senderAuth = readSenderAuth(message.headers, message.from);

	const log: LogRow = {
		company_id: null,
		intake_slug: slug,
		from_addr: message.from,
		sender_domain: senderAuth.domain,
		sender_auth: senderAuth.summary,
		subject,
		source_matched: "none",
		parse_ok: false,
		parsed: null,
		outcome: "received",
		lead_id: null,
		allocated_rep: null,
		raw_excerpt: "",
	};

	// Log FIRST, before anything that can throw — then UPDATE the same row as
	// steps complete. A crash mid-pipeline must never leave zero trace.
	const logId = await insertLog(env, log);
	const saveLog = async () => {
		if (logId) await updateLog(env, logId, log);
	};

	let intake: Awaited<ReturnType<typeof resolveCompany>> = null;
	try {
		const raw = await readRaw(message);
		const text = rawToText(raw);
		log.raw_excerpt = text.slice(0, RAW_EXCERPT_MAX);

		// 1. Resolve company. Unknown slug → log and stop (never bounce-loop).
		intake = await resolveCompany(env, slug);
		if (!intake) {
			log.outcome = "unresolved_company";
			await saveLog();
			return;
		}
		log.company_id = intake.company_id;

		// 1b. Sender authenticity. The To: slug is a company name and therefore
		// guessable, so without this anyone can inject leads into any company.
		// This runs BEFORE the parser and before the forward on purpose: a
		// rejected message must not reach the LLM fallback (cost amplification
		// on the victim's budget) and must not be forwarded into their real
		// inbox (phishing arriving through a channel they trust).
		const senderDecision = checkSender(
			senderAuth,
			intake.allowed_sender_domains,
			Boolean(intake.require_allowlist),
		);
		if (!senderDecision.ok) {
			log.outcome = "rejected_sender";
			log.parsed = { error: senderDecision.reason };
			await saveLog();
			return;
		}

		// 2–3. Parse (router → deterministic parser or LLM fallback).
		const { result: parsed, error: parseError } = await parseLead(env, message.from, subject, text);
		if (!parsed) {
			log.outcome = "parse_failed";
			// Surface the reason in the log row so it's debuggable from the app/DB.
			log.parsed = parseError ? { error: parseError } : null;
			await saveLog();
			return;
		}
		log.source_matched = parsed.parser;
		log.parse_ok = true;
		log.parsed = parsed.lead;

		// Normalize phone once; used for dedupe AND the stored lead row.
		const phone = normalizePhone(parsed.lead.contact);
		parsed.lead.contact = phone ?? parsed.lead.contact;

		// 5. Dedupe — duplicates still LAND, marked, so we can track which
		// portals feed repeat queries (Harish's call, 24 Jul).
		const dupeOf = await findDuplicate(env, intake.company_id, phone);

		// 4. Classify → 6. Allocate (least-recently-assigned rep, or NULL).
		const leadType = classify(parsed.lead);
		let repId: string | null = null;
		if (intake.auto_allocate) {
			repId = (await sbRpc(env, "allocate_lead_rep", {
				p_company: intake.company_id,
				p_type: leadType,
			})) as string | null;
		}

		// 7. Insert the lead (rep_id NULL = unassigned → managers pick it up).
		// product_interest is a category ENUM in the DB ('PCD Franchise',
		// 'Third Party', ...) — the free-text requirement goes to
		// products_interested instead.
		const leadRow = {
			company_id: intake.company_id,
			rep_id: repId,
			name: parsed.lead.name,
			firm_name: parsed.lead.firm_name,
			contact: parsed.lead.contact,
			area_city: parsed.lead.area_city,
			state: parsed.lead.state,
			product_interest: leadType === "third_party" ? "Third Party" : "PCD Franchise",
			products_interested: parsed.lead.product_interest,
			source: dbSource(parsed.lead.source),
			stage: "New",
			temp: "Warm",
			is_duplicate: dupeOf !== null,
			duplicate_of: dupeOf?.id ?? null,
			date_received: new Date().toISOString().slice(0, 10),
			call_summary:
				`Auto-imported from ${parsed.lead.source} email (parser: ${parsed.parser}).` +
				(dupeOf ? ` Duplicate of lead ${dupeOf.lead_code ?? dupeOf.id} (same phone).` : ""),
		};
		const inserted = await sbInsert(env, "leads", leadRow);

		log.lead_id = inserted.id;
		log.allocated_rep = repId;
		log.outcome = dupeOf ? "inserted_duplicate" : repId ? "inserted" : "no_rep";

		// 8. Final log update.
		await saveLog();
	} catch (e) {
		// Any crash mid-pipeline still lands in the log with the reason.
		log.outcome = "error";
		log.parsed = { error: e instanceof Error ? e.message : String(e) };
		try {
			await saveLog();
		} catch (e2) {
			console.error("saveLog after crash failed:", e2);
		}
		throw e;
	} finally {
		// 9. Forward a copy to the company's real inbox (destination must be
		// CF-verified once per company). Failures here must not lose the lead.
		if (intake?.forward_to_inbox) {
			try {
				await message.forward(intake.forward_to_inbox);
			} catch (e) {
				console.error(`forward to ${intake.forward_to_inbox} failed:`, e);
			}
		}
	}
}

async function insertLog(env: Env, log: LogRow): Promise<string | null> {
	try {
		const row = await sbInsert(env, "lead_intake_log", log as unknown as Record<string, unknown>);
		return row.id ?? null;
	} catch (e) {
		console.error("lead_intake_log insert failed:", e, JSON.stringify(log).slice(0, 500));
		return null;
	}
}

async function updateLog(env: Env, id: string, log: LogRow): Promise<void> {
	try {
		await sbUpdate(env, "lead_intake_log", id, log as unknown as Record<string, unknown>);
	} catch (e) {
		console.error("lead_intake_log update failed:", e, JSON.stringify(log).slice(0, 500));
	}
}

export default {
	async email(message: ForwardableEmailMessage, env: Env, ctx: ExecutionContext): Promise<void> {
		ctx.waitUntil(
			handle(message, env).catch((e) => {
				// Never reject the message — a rejected email bounces back to the
				// portal and can create a retry loop. Log and swallow instead.
				console.error("lead intake failed:", e);
			}),
		);
	},
};

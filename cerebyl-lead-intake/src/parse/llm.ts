// Gemini JSON-mode fallback parser — produces the same ParsedLead shape as
// the deterministic parsers. Call pattern mirrors acrowell-ai-worker's
// src/gemini.ts (generateContent, x-goog-api-key header, temperature 0).

import type { ParsedLead } from "./types";

const PROMPT = `You are extracting a pharma sales lead from a portal notification email.
Return ONLY a JSON object with exactly these keys (null when unknown):
{
  "name": string|null,             // contact person
  "firm_name": string|null,        // company/firm
  "contact": string|null,          // phone number
  "area_city": string|null,
  "state": string|null,
  "product_interest": string|null, // what they want, e.g. "PCD franchise for cardiac range"
  "source": "IndiaMART"|"PharmaHopper"|"Pharmavends"|"DawaCharcha"|"TradeIndia"|"Website"
}
Pick "source" from the portal that sent the email; "Website" if it is a website contact form.
IMPORTANT: only name a portal when the email clearly identifies it (sender domain, logo/branding, or an explicit mention). If unsure, use "Website" — never guess a portal.
No markdown, no commentary — JSON only.`;

export async function parseWithLLM(env: Env, from: string, subject: string, text: string): Promise<ParsedLead | null> {
	const model = env.GEMINI_MODEL || "gemini-3.1-flash-lite";
	const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

	const body = {
		systemInstruction: { parts: [{ text: PROMPT }] },
		generationConfig: {
			temperature: 0,
			maxOutputTokens: 512,
			responseMimeType: "application/json",
		},
		contents: [
			{
				role: "user",
				parts: [
					{
						text: `From: ${from}\nSubject: ${subject}\n\nBody:\n${text.slice(0, 4000)}`,
					},
				],
			},
		],
	};

	const doRequest = () =>
		fetch(endpoint, {
			method: "POST",
			headers: { "content-type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
			body: JSON.stringify(body),
		});

	let res = await doRequest();
	if (!res.ok && (res.status === 429 || res.status >= 500)) {
		await new Promise((r) => setTimeout(r, 1000));
		res = await doRequest();
	}
	if (!res.ok) {
		const errText = await res.text().catch(() => "");
		throw new Error(`Gemini request failed: ${res.status} ${errText.slice(0, 300)}`);
	}

	const json = (await res.json()) as any;
	const rawText: string | undefined = json?.candidates?.[0]?.content?.parts
		?.map((p: any) => p.text ?? "")
		.join("");
	if (!rawText) throw new Error(`gemini: empty response (${JSON.stringify(json).slice(0, 200)})`);

	let parsed: Partial<ParsedLead>;
	try {
		parsed = JSON.parse(rawText) as Partial<ParsedLead>;
	} catch {
		throw new Error(`gemini: non-JSON reply: ${rawText.slice(0, 200)}`);
	}
	const source = (parsed.source as ParsedLead["source"]) ?? "Website";
	// Anti-hallucination guard: the LLM may claim a portal with zero evidence.
	// Only accept a non-Website source when the From or Subject actually
	// mentions that portal; otherwise downgrade to "Website".
	const evidence = `${from} ${subject}`.toLowerCase();
	const portalHints: Record<string, string[]> = {
		IndiaMART: ["indiamart"],
		PharmaHopper: ["pharmahopper"],
		Pharmavends: ["pharmavends"],
		DawaCharcha: ["dawacharcha", "dawa charcha"],
		TradeIndia: ["tradeindia", "trade india"],
	};
	const hints = portalHints[source] ?? [];
	const verified = source === "Website" || hints.some((h) => evidence.includes(h));
	return {
		name: parsed.name ?? null,
		firm_name: parsed.firm_name ?? null,
		contact: parsed.contact ?? null,
		area_city: parsed.area_city ?? null,
		state: parsed.state ?? null,
		product_interest: parsed.product_interest ?? null,
		source: verified ? source : "Website",
	};
}

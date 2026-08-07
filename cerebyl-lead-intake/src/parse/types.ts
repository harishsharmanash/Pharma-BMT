// Shared shape every parser (and the LLM fallback) produces.

export type LeadSource =
	| "IndiaMART"
	| "PharmaHopper"
	| "Pharmavends"
	| "DawaCharcha"
	| "TradeIndia"
	| "Website";

export type LeadType = "pcd" | "third_party";

export type ParsedLead = {
	name: string | null;
	firm_name: string | null;
	contact: string | null; // phone, digits-only after dedupe normalization
	area_city: string | null;
	state: string | null;
	product_interest: string | null; // free-text requirement from the email
	source: LeadSource; // friendly portal name → leads.source
};

export type ParseResult = {
	parser: string; // parser id that matched, or 'llm'
	lead: ParsedLead;
};

// What a per-source deterministic parser returns: null = "not mine / failed",
// router then tries the next parser and finally the LLM fallback.
export type ParserFn = (ctx: {
	from: string;
	subject: string;
	text: string; // decoded plain-text body
}) => ParsedLead | null;

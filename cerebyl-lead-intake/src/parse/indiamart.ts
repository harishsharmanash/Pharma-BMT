// IndiaMART lead-notification parser.
//
// ⚠ BEST-EFFORT / NEEDS TUNING: these regexes were written WITHOUT a real
// sample .eml (plan §4 blocker — Harish to provide 2–3 samples per portal).
// Expect the label spellings, the From-domain match and the phone pattern to
// need adjustment against real IndiaMART notification emails before go-live.

import type { ParsedLead } from "./types";

function grab(text: string, re: RegExp): string | null {
	const m = text.match(re);
	return m ? m[1].trim() : null;
}

export const parseIndiaMART = (ctx: {
	from: string;
	subject: string;
	text: string;
}): ParsedLead | null => {
	const fromOk = /indiamart\.com/i.test(ctx.from);
	// Only claim the mail when IndiaMART is clearly the sender. A loose
	// subject match ("enquiry", "new lead") steals website-form mails from
	// the website parser and mislabels their source.
	const subjectOk = /indiamart/i.test(ctx.subject);
	if (!fromOk && !subjectOk) return null;

	const t = ctx.text;
	// TODO(samples): verify real label text ("Buyer Name" / "Name" / "Mobile No." ...)
	const lead: ParsedLead = {
		name: grab(t, /(?:buyer\s*name|name)\s*[:\-]\s*(.+)/i),
		firm_name: grab(t, /(?:company|firm)(?:\s*name)?\s*[:\-]\s*(.+)/i),
		contact:
			grab(t, /(?:mobile|phone|contact)(?:\s*(?:no|number))?[.:]?\s*[:\-]?\s*(\+?[\d\s-]{10,15})/i),
		area_city: grab(t, /city\s*[:\-]\s*(.+)/i),
		state: grab(t, /state\s*[:\-]\s*(.+)/i),
		product_interest: grab(t, /(?:requirement|product(?:\s*name)?|looking for)\s*[:\-]\s*(.+)/i),
		source: "IndiaMART",
	};

	// A parse with neither name nor phone is a miss → let the LLM try.
	if (!lead.name && !lead.contact) return null;
	return lead;
};

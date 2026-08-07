// Generic website-form parser: bodies are usually simple "label: value" lines.

import type { ParsedLead } from "./types";

const LABEL_MAP: Record<string, keyof ParsedLead> = {
	name: "name",
	"full name": "name",
	"your name": "name",
	company: "firm_name",
	"company / firm": "firm_name",
	"firm name": "firm_name",
	"company name": "firm_name",
	organization: "firm_name",
	organisation: "firm_name",
	phone: "contact",
	mobile: "contact",
	"phone number": "contact",
	"mobile number": "contact",
	contact: "contact",
	"contact number": "contact",
	whatsapp: "contact",
	city: "area_city",
	"city/town": "area_city",
	"city / state": "area_city", // combined — split after grab
	location: "area_city",
	state: "state",
	message: "product_interest",
	requirement: "product_interest",
	"interest / requirement": "product_interest",
	"product interest": "product_interest",
	"products of interest": "product_interest",
	"category of interest": "product_interest",
	"enquiry type": "product_interest",
	products: "product_interest",
	enquiry: "product_interest",
	inquiry: "product_interest",
	query: "product_interest",
};

export const parseWebsite = (ctx: { text: string }): ParsedLead | null => {
	const fields: Partial<ParsedLead> = {};
	const interests: string[] = [];
	for (const line of ctx.text.split(/\r?\n/)) {
		// Accept "label: value", "label = value" and HTML-table "label | value"
		// (htmlToText renders table cells as " | "-separated lines).
		const m = line.match(/^\s*([A-Za-z /&()]{2,30})\s*[:=\-|]\s*(.+)\s*$/);
		if (!m) continue;
		const key = LABEL_MAP[m[1].trim().toLowerCase()];
		if (key === "product_interest") {
			interests.push(m[2].trim());
		} else if (key && !fields[key]) {
			(fields as Record<string, string>)[key] = m[2].trim();
		}
	}
	// "City / State: Nagpur, Maharashtra" → split into the two fields.
	if (fields.area_city && !fields.state && fields.area_city.includes(",")) {
		const [city, ...rest] = fields.area_city.split(",");
		fields.area_city = city.trim();
		fields.state = rest.join(",").trim() || null;
	}
	if (interests.length > 0) fields.product_interest = interests.join("; ");
	// Require at least a phone or a name — otherwise this isn't a form body.
	if (!fields.contact && !fields.name) return null;
	return {
		name: fields.name ?? null,
		firm_name: fields.firm_name ?? null,
		contact: fields.contact ?? null,
		area_city: fields.area_city ?? null,
		state: fields.state ?? null,
		product_interest: fields.product_interest ?? null,
		source: "Website",
	};
};

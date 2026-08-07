// PCD vs Third-Party classification — keyword scan; unsure → 'pcd'.

import type { LeadType, ParsedLead } from "./parse/types";

const THIRD_PARTY_HINTS = [
	"third party",
	"third-party",
	"3rd party",
	"contract manufactur",
	"loan licens",
	"own brand",
	"own brand name",
	"private label",
	"white label",
	"manufacturing",
	"manufacture",
	"batch size",
	"monopoly batch",
];

const PCD_HINTS = [
	"pcd",
	"franchise",
	"monopoly",
	"distributorship",
	"distributor",
	"stockist",
	"c&f",
	"cnf",
	"wholesale",
	"pharma franchise",
];

export function classify(lead: ParsedLead): LeadType {
	const haystack = [lead.product_interest, lead.firm_name, lead.name]
		.filter(Boolean)
		.join(" ")
		.toLowerCase();

	if (THIRD_PARTY_HINTS.some((h) => haystack.includes(h))) return "third_party";
	if (PCD_HINTS.some((h) => haystack.includes(h))) return "pcd";
	return "pcd"; // unsure → PCD, per plan §1 step 4
}

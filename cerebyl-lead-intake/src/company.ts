// slug → company_lead_intake lookup (service-role REST).

import { sbGet } from "./supabase";

export type IntakeRow = {
	company_id: string;
	forward_to_inbox: string | null;
	auto_allocate: boolean;
	// Sender domains permitted to create leads here. Empty = not configured,
	// which accepts any sender unless require_allowlist is true.
	allowed_sender_domains: string[] | null;
	require_allowlist?: boolean | null;
};

// message.to = "acmepharma@leads.cerebyl.com" → slug = "acmepharma"
export function slugFromTo(to: string): string {
	return to.split("@")[0].trim().toLowerCase();
}

export async function resolveCompany(env: Env, slug: string): Promise<IntakeRow | null> {
	const rows = await sbGet<IntakeRow>(
		env,
		`company_lead_intake?intake_slug=eq.${encodeURIComponent(slug)}&option=eq.A&select=company_id,forward_to_inbox,auto_allocate,allowed_sender_domains,require_allowlist&limit=1`,
	);
	return rows[0] ?? null;
}

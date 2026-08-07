// Dedupe: normalize Indian phone numbers and check existing company leads.

import { sbGet } from "./supabase";

// Indian phones arrive as +91 98xxx xxxxx, 098xxx..., 91..., etc.
// Normalize to the bare 10-digit subscriber number for comparison.
export function normalizePhone(raw: string | null): string | null {
	if (!raw) return null;
	let digits = raw.replace(/\D/g, "");
	if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
	if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
	if (digits.length < 10) return null;
	return digits.slice(-10);
}

// Returns the first existing (non-deleted) lead in this company with this
// contact number, so the caller can mark the new row as a duplicate of it.
export async function findDuplicate(
	env: Env,
	companyId: string,
	phone: string | null,
): Promise<{ id: string; lead_code: string | null } | null> {
	if (!phone) return null;
	const rows = await sbGet<{ id: string; lead_code: string | null }>(
		env,
		`leads?company_id=eq.${companyId}&contact=eq.${phone}&deleted_at=is.null&select=id,lead_code&order=created_at.asc&limit=1`,
	);
	return rows[0] ?? null;
}

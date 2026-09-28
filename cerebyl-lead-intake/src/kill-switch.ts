// Emergency kill switches set from the Cerebyl console (public.platform_flags).
// Cached per isolate for 30s so a busy worker does not hit the DB per request.
// FAILS OPEN: an unreadable flag counts as OFF — a flag-table outage must never
// take the product down. Failures are not cached, so recovery is immediate.
const TTL_MS = 30_000;
const cache = new Map<string, { value: boolean; expires: number }>();

export async function isKillSwitchOn(
	key: string,
	fetchFlag: () => Promise<boolean | null>,
	now: number = Date.now(),
): Promise<boolean> {
	const hit = cache.get(key);
	if (hit && hit.expires > now) return hit.value;
	try {
		const value = await fetchFlag();
		if (value === null) return false;
		cache.set(key, { value, expires: now + TTL_MS });
		return value;
	} catch {
		return false;
	}
}

/** Test-only. */
export function _resetKillSwitchCache(): void {
	cache.clear();
}

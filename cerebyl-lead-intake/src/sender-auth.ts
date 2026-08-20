// SPF / DKIM / DMARC verification for inbound email leads, plus
// per-company sender-domain allowlisting.
//
// Inbound leads arrive as raw RFC 822 MIME. Cloudflare Email Routing prepends
// Authentication-Results / ARC-Authentication-Results headers detailing the
// verdict of SPF, DKIM, and DMARC before delivering to this Worker. We parse
// those headers: a message is accepted only if the sender domain actually
// passed authentication AND matches the company's allowed_sender_domains list
// (if one is configured).
//
// Empty allowlist = open intake (accepts any authenticated or unauthenticated
// sender) unless requireAllowlist is true, preserving backwards compatibility.

export type SenderAuth = {
	domain: string;
	spf: "pass" | "fail" | "softfail" | "neutral" | "none" | "temperror" | "permerror" | "unknown";
	dkim: "pass" | "fail" | "none" | "temperror" | "permerror" | "unknown";
	dmarc: "pass" | "fail" | "none" | "temperror" | "permerror" | "unknown";
	authenticated: boolean;
	summary: string;
};

// Extracts the domain part of an email address: "leads@indiamart.com" → "indiamart.com"
export function extractDomain(addr: string): string {
	const cleaned = addr.replace(/^.*<([^>]+)>.*$/, "$1").trim().toLowerCase();
	const parts = cleaned.split("@");
	return parts.length === 2 ? parts[1] : "";
}

function parseResult(header: string, prefix: "spf" | "dkim" | "dmarc"): string {
	const match = header.match(new RegExp(`\\b${prefix}=([a-zA-Z]+)`, "i"));
	return match ? match[1].toLowerCase() : "unknown";
}

/**
 * Inspects headers from Cloudflare Email Routing for Authentication-Results.
 */
export function readSenderAuth(headers: Headers, fromAddr: string): SenderAuth {
	const domain = extractDomain(fromAddr);
	const header = headers.get("Authentication-Results") || headers.get("ARC-Authentication-Results") || "";

	const spf = (parseResult(header, "spf") as SenderAuth["spf"]) || "unknown";
	const dkim = (parseResult(header, "dkim") as SenderAuth["dkim"]) || "unknown";
	const dmarc = (parseResult(header, "dmarc") as SenderAuth["dmarc"]) || "unknown";

	const authenticated = dmarc === "pass" || dkim === "pass" || spf === "pass";
	const summary = `spf=${spf} dkim=${dkim} dmarc=${dmarc}`;

	return { domain, spf, dkim, dmarc, authenticated, summary };
}

/**
 * Inspects the raw email text for Authentication-Results headers.
 */
export function verifySenderAuth(raw: string, fromAddr: string): SenderAuth {
	const domain = extractDomain(fromAddr);

	const headerMatch = raw.match(/(?:^|\r?\n)(?:ARC-)?Authentication-Results:[ \t]*([^\r\n]+(?:\r?\n[ \t]+[^\r\n]+)*)/i);
	const header = headerMatch ? headerMatch[1].replace(/\r?\n[ \t]+/g, " ") : "";

	const spf = (parseResult(header, "spf") as SenderAuth["spf"]) || "unknown";
	const dkim = (parseResult(header, "dkim") as SenderAuth["dkim"]) || "unknown";
	const dmarc = (parseResult(header, "dmarc") as SenderAuth["dmarc"]) || "unknown";

	const authenticated = dmarc === "pass" || dkim === "pass" || spf === "pass";
	const summary = `spf=${spf} dkim=${dkim} dmarc=${dmarc}`;

	return { domain, spf, dkim, dmarc, authenticated, summary };
}

export function domainAllowed(domain: string, allowed: string[]): boolean {
	if (!domain) return false;
	return allowed.some((a) => {
		const want = a.trim().toLowerCase().replace(/^@/, "");
		if (!want) return false;
		return domain === want || domain.endsWith("." + want);
	});
}

export type SenderDecision = { ok: true } | { ok: false; reason: string };

/**
 * Decide whether this message may create a lead for the company.
 */
export function checkSender(
	auth: SenderAuth,
	allowed: string[] | null | undefined,
	requireAllowlist = false,
): SenderDecision {
	const list = (allowed ?? []).filter(Boolean);
	if (list.length === 0) {
		if (requireAllowlist) {
			return { ok: false, reason: "strict allowlist mode enabled: no allowed sender domains configured" };
		}
		return { ok: true };
	}

	if (!domainAllowed(auth.domain, list)) {
		return { ok: false, reason: `sender domain ${auth.domain || "(unknown)"} is not allowlisted` };
	}
	if (!auth.authenticated) {
		return { ok: false, reason: `sender domain ${auth.domain} failed authentication (${auth.summary})` };
	}
	return { ok: true };
}

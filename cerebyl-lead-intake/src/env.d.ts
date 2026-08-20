// Minimal ambient types for the Email Worker runtime + bindings.
// We intentionally avoid @cloudflare/workers-types to stay dependency-light;
// only the pieces this worker actually uses are declared here.

interface Env {
	// vars (wrangler.jsonc)
	SUPABASE_URL: string;
	GEMINI_MODEL: string;
	// secrets (wrangler secret put — never in wrangler.jsonc)
	SUPABASE_SERVICE_ROLE_KEY: string;
	GEMINI_API_KEY: string;
	// send_email binding (LEAD_FORWARD) — present on env; message.forward
	// uses it implicitly, so no direct reference is required in code.
	LEAD_FORWARD: SendEmail;
}

interface SendEmail {
	send(message: unknown): Promise<void>;
}

// Cloudflare Email Workers runtime types (subset).
interface ForwardableEmailMessage {
	readonly from: string;
	readonly to: string;
	readonly headers: Headers;
	readonly raw: ReadableStream<Uint8Array>;
	readonly rawSize: number;
	setReject(reason: string): void;
	forward(rcptTo: string, headers?: Headers): Promise<void>;
	reply(message: unknown): Promise<void>;
}

interface ExecutionContext {
	waitUntil(promise: Promise<unknown>): void;
	passThroughOnException(): void;
}

// Minimal Workers runtime globals (subset of @cloudflare/workers-types,
// declared here to stay dependency-light).

declare function fetch(
	input: string,
	init?: {
		method?: string;
		headers?: Record<string, string>;
		body?: string;
	},
): Promise<FetchResponse>;

interface FetchResponse {
	readonly ok: boolean;
	readonly status: number;
	json(): Promise<unknown>;
	text(): Promise<string>;
	arrayBuffer(): Promise<ArrayBuffer>;
}

interface Headers {
	get(name: string): string | null;
}

declare class Response {
	constructor(body?: BodyInit | null, init?: unknown);
	arrayBuffer(): Promise<ArrayBuffer>;
}

declare class TextDecoder {
	constructor(label?: string, options?: { fatal?: boolean });
	decode(input: BufferSource): string;
}

declare function setTimeout(callback: (...args: unknown[]) => void, ms: number): void;

declare const console: {
	log(...args: unknown[]): void;
	error(...args: unknown[]): void;
	warn(...args: unknown[]): void;
};

declare function atob(data: string): string;
declare function btoa(data: string): string;

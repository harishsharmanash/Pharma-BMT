import type { ErrorEvent } from "@sentry/cloudflare";

// Public, write-only key (same Sentry project as the web app; events are told apart by the
// `service` tag). A DSN is safe to ship — it can only submit events.
export const SENTRY_DSN =
	"https://d1029559d7a1c20822a6f83f0a793c6a@o4511822664237056.ingest.de.sentry.io/4511822982611024";

// PII scrubbing. This worker handles phone numbers, message bodies and business records.
// Keep only what identifies the failure: the exception, its stack, the route (no query string).
export function scrubWorkerEvent(event: ErrorEvent): ErrorEvent | null {
	if (event.request) {
		const url = event.request.url ? event.request.url.split("?")[0] : undefined;
		event.request = { method: event.request.method, url };
	}
	delete event.user;
	delete event.extra;
	event.breadcrumbs = [];
	return event;
}

export function sentryOptions(service: string) {
	return {
		dsn: SENTRY_DSN,
		sendDefaultPii: false,
		tracesSampleRate: 0,
		initialScope: { tags: { service } },
		beforeSend: scrubWorkerEvent,
	};
}

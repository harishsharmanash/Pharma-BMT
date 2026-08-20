# TICKET F17-b — FCM push registration bridge (native shell only)

You are implementing a small, focused change. Do NOT commit. Do NOT run tsc,
tests, or any shell commands. Hard rule: `src/` must NEVER `import` any
`@capacitor/*` package — the bridge is the injected `window.Capacitor.Plugins`
global, accessed via `capPlugin` from `src/lib/capacitor.ts`. On the open web
everything here is a no-op.

Background: `supabase/migrations/20260825120000_fcm_device_tokens.sql` created
`public.device_tokens` (id, company_id, user_id, platform 'android'|'ios'|'web',
token UNIQUE, package_name, created_at, last_seen_at). The regenerated Supabase
types already include it, so `supabase.from("device_tokens")` typechecks.

## 1. `mobile/package.json`

Add dependency `"@capacitor/push-notifications": "^7.0.3"` to `dependencies`
(keep the list sorted like it is now). Nothing else in `mobile/` changes —
`cap sync` is run outside your scope.

## 2. `src/lib/capacitor.ts` — extend the bridge types

- Add `id?: string` to the `AppPlugin.getInfo()` return type (Capacitor returns
  the appId, e.g. `com.cerebyl.app.base` — we store it as `package_name`).
- Add a new exported interface:
  ```ts
  export interface PushNotificationsPlugin {
    checkPermissions(): Promise<{ receive: PermissionState }>;
    requestPermissions(): Promise<{ receive: PermissionState }>;
    register(): Promise<void>;
    addListener(
      event: "registration",
      cb: (token: { value: string }) => void,
    ): Promise<{ remove: () => void }>;
    addListener(
      event: "registrationError",
      cb: (err: { error: string }) => void,
    ): Promise<{ remove: () => void }>;
  }
  ```
  (`PermissionState` already exists in this file — reuse it.)

## 3. New file `src/lib/push-registration.ts`

Mirror the tone and defensive style of `src/lib/device-notifications.ts`
(header comment stating scope plainly; every failure path degrades silently —
push registration must NEVER break the app or the notifications query).

Export one async function:

```ts
registerDeviceForPush(userId: string, companyId: string): Promise<void>
```

Behaviour:
- Return immediately when not `isNativeShell()`, when `userId`/`companyId` are
  empty, or when the `PushNotifications` plugin is missing.
- Module-level `let attemptedFor: string | null` guard: only attempt once per
  user per app session (set it BEFORE the async work so a slow permission
  dialog doesn't double-fire).
- Permission: check → request if `"prompt"`/`"prompt-with-rationale"` → bail
  unless `"granted"`.
- Attach BOTH listeners BEFORE calling `register()` (the token event can fire
  synchronously on re-registration).
- On `registration`: upsert into `device_tokens` on the `token` conflict:
  `{ company_id, user_id, platform: "android", token, package_name, last_seen_at: new Date().toISOString() }`
  with `.upsert(row, { onConflict: "token" })`. Get `package_name` from
  `capPlugin<AppPlugin>("App")?.getInfo()` `id`, falling back to
  `"com.cerebyl.app.base"` when unavailable.
- On `registrationError`: swallow (log nothing noisy — a comment is enough).
- Wrap the whole body in try/catch that swallows.

## 4. Wire it in — `src/lib/use-notifications.ts`

In `useNotifications`'s `queryFn`, right after the existing
`void syncDeviceNotifications(rows, profile!.id).catch(() => {});` line, add
the same fire-and-forget call:

```ts
void registerDeviceForPush(profile!.id, profile!.company_id).catch(() => {});
```

Check `profile` in `auth-context` exposes `company_id` — if the field is named
differently there, use the correct one and say so in your report. Add the
import. Keep the existing comment style (one line: push registration is
idempotent, guarded once-per-session inside the module).

## Done criteria

- The three files changed/created exactly as above; nothing else touched.
- Report file paths + one-line summary each. Do not claim to have tested
  anything — you cannot run tsc or tests.

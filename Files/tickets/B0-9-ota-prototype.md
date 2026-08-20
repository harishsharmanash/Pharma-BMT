# TICKET B0.9 — Bundled-assets + OTA update: research and reversible prototype

## Context

The Android app is a Capacitor shell whose `capacitor.config.ts` sets
`server.url = 'https://app.cerebyl.com'` with `webDir: 'www'` as an explicit stub. **No app code is
bundled into the APK.** Consequences we want to remove: every cold start waits on the network, a
weak signal shows a white screen, and with no signal the app renders nothing at all. That also makes
offline-first work impossible — there is nothing on the device to be offline with.

The decision is to bundle the built web assets into the APK as a **baseline**, and deliver ongoing
updates **over the air** by loading the WebView from a writable app-data directory instead of a
store release. That preserves the current "push a fix and every phone has it in minutes" property
for ~99% of changes (anything in `src/`), leaving store releases only for native-shell changes
(new Capacitor plugin, new Android permission, Capacitor version bump).

**This ticket does NOT ship that.** It produces the evidence and a reversible prototype so the human
lead can judge it on a real phone before committing.

## Hard constraints

- **Do not break the existing working pipeline.** Branded APK builds currently work and are in
  production. Every change must be **additive and opt-in**, switched by an environment variable
  (propose `CEREBYL_BUNDLED=1`). With the variable unset, the build must produce byte-for-byte the
  same behaviour as today: remote `server.url`, nothing bundled.
- **Do not touch signing, the keystore, `applicationId`, `namespace`, or `versionCode` logic.**
  These are the most dangerous parts of the pipeline: one keystore signs everything, the sanitised
  package id is permanent per company, and `versionCode` must strictly increase or users cannot
  upgrade in place. If your change appears to require touching any of them, **stop and report**.
- `mobile/` has its own `package.json` and must never modify the root `package.json`, `bun.lock`, or
  `package-lock.json`.
- `src/` must never `import` an `@capacitor/*` package — plugins are reached through the bridge in
  `src/lib/capacitor.ts`.

## Part 1 — Research report (do this first)

Write `Files/tickets/reports/REPORT-B0-9.md` covering:

1. **Live-update options for Capacitor 7.** For each: licence, whether bundles can be **self-hosted**
   (we already have a private Cloudflare R2 bucket and a presigned-URL flow used for APKs), whether
   it supports a **boot fail-safe** (auto-revert to the baseline bundle if a downloaded bundle fails
   to start), and rollback. Cover at minimum `@capgo/capacitor-updater` and the hand-rolled approach
   using `@capacitor/filesystem` plus a WebView path swap. **Report actual current versions and
   licence terms — do not rely on memory.** If you cannot verify something, say so explicitly rather
   than stating it.
2. **Store policy.** Summarise the Google Play position on downloading and executing web/JS bundles
   at runtime, and the equivalent Apple guideline, since iOS is planned. State the constraint that
   matters (downloaded code must not change the app's primary purpose) and whether our use is inside
   it.
3. **The existing pipeline, mapped.** Read `scripts/build-branded-apk.sh`, the GitHub Actions
   workflow that drives it, `mobile/scripts/`, and the edge function that dispatches a build. Report
   exactly where a `npm run build` + copy of `.output/public` into `mobile/www` would have to be
   inserted, and what currently populates `mobile/www`.
4. **Update-check reuse.** Read `src/components/app-update-prompt.tsx` and `src/lib/mobile-app.ts`.
   Report precisely how much of the existing versionCode comparison and R2 presigned-URL delivery
   can be reused for OTA bundles, and what would have to be added (bundle version field, manifest
   endpoint, download + unzip + swap).
5. **How to produce a test APK.** State whether an APK can be built locally on this Mac (check
   whether the Android SDK and JDK are present) or whether it must go through the existing GitHub
   Actions pipeline. **Run the checks; report what you found, not what is usually true.**

## Part 2 — Reversible prototype (only after Part 1 is written)

Implement the **bundled-assets half only**. No OTA download logic in this ticket.

- Make `mobile/capacitor.config.ts` read `process.env.CEREBYL_BUNDLED`. When set, omit `server.url`
  entirely so the WebView loads from the bundled assets; when unset, behave exactly as today.
  Explain the choice in a comment in the style of the existing comments in that file.
- Add a documented script (in `mobile/scripts/`, or extend an existing one) that runs the web build
  and populates `mobile/www` from `.output/public`. It must be a no-op when `CEREBYL_BUNDLED` is not
  set.
- Do **not** wire it into the GitHub Actions workflow. Report what that change would look like
  instead, as a diff sketch in the report.

## Acceptance

- `npx tsc --noEmit` = 0 errors.
- `npm run test` passes.
- With `CEREBYL_BUNDLED` unset, `git diff` shows no behavioural change to the current build path —
  state explicitly in your report how you verified this.
- `git status --short` shows only: `mobile/capacitor.config.ts`, the new/edited script in
  `mobile/scripts/`, and `Files/tickets/reports/REPORT-B0-9.md`.
- Commit locally. **Do not push.**

## Report back

Your final message must state: the recommended live-update approach and why, whether a local APK
build is possible on this machine, the exact remaining work to reach a testable bundled APK, and
anything in Part 1 you could not verify.

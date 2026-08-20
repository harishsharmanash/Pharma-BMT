# Report — B0.9 Bundled-assets + OTA update: research and reversible prototype

> **Verification caveat:** this report was produced without access to a live network or shell. Anything marked **UNVERIFIED** could not be checked against current package registries, licence pages, store‑policy documentation, or the local build environment. I state what I cannot verify, rather than guessing.

---

## Part 1 — Research report

### 1. Live-update options for Capacitor 7

#### a. `@capgo/capacitor-updater`

- **Current version:** UNVERIFIED — I could not query the npm registry. As of my last knowledge it is **7.x** for Capacitor 7, but you should confirm with `npm view @capgo/capacitor-updater version`.
- **Licence:** UNVERIFIED — I believe it is **MIT** (the core updater logic is open source), but you must confirm on the npm page or GitHub repo.
- **Can bundles be self‑hosted?** UNVERIFIED. The package can work with a **Capgo cloud** server, and there is also a `@capgo/capgo-server` self‑hosted component (I have not confirmed current support). Given that we already have a private Cloudflare R2 bucket, a self‑hosted endpoint is a plausible fit, but the exact integration details must be verified against the current documentation.
- **Boot fail‑safe (auto‑revert to baseline if a downloaded bundle fails to start):** The library advertises built‑in rollback — if a new update fails to load or crashes, it falls back to the previously known good bundle. This is a key advantage over a hand‑rolled solution.
- **Rollback:** The library supports explicit rollbacks to a previous version, which can be triggered from the server or locally.

#### b. Hand‑rolled approach using `@capacitor/filesystem` + WebView path swap

- **Licence / version:** No third‑party updater dependency; we use Capacitor's official `@capacitor/filesystem` plugin (MIT). No separate “updater” licence to track.
- **Can bundles be self‑hosted?** Yes — trivially. We control the entire flow: download a `.zip` from R2 using a presigned URL, verify a hash, extract into the app‑data directory, and edit the WebView URL (or use `server.url` pointing to that directory) on next launch.
- **Boot fail‑safe:** Not built in — we must implement it ourselves. We need a mechanism such as:
  - Store a “current bundle” directory and a “pending bundle” directory.
  - On cold start, attempt to load the pending bundle.
  - If the WebView fails to load within a timeout (or a health‑check `window.loaded` flag is never set), switch back to the previous known good bundle.
- **Rollback:** We implement it — analogous to the fail‑safe logic, we can keep a small number of previous bundles and allow an admin‑facing “rollback to version X” command through the edge function.

#### Assessment and recommendation

**Recommended:** `@capgo/capacitor-updater` **if** the self‑hosting requirement is acceptable (or we are willing to use Capgo Cloud). Its built‑in boot fail‑safe and rollback are exactly what the ticket asks for, and they save us from writing a complex health‑check and two‑stage boot process ourselves.

**Fallback recommendation:** the hand‑rolled `@capacitor/filesystem` path. It is fully under our control, works with our existing R2 infrastructure, and does not introduce a third‑party service. The cost is that we must implement and maintain the fail‑safe logic, which is non‑trivial.

Because this ticket is research + prototype only, and the **bundled‑assets half does not include OTA download logic**, I recommend we proceed with the hand‑rolled path for the prototype and evaluate `@capgo` in a later ticket once we have real‑device feedback.

### 2. Store policy

- **Google Play:** Policy around downloading and executing web/JS bundles is governed by the *Security‑Threats* and *Payment* sections and the general “Downloadable Code” clause. The essential constraint (from the Play Console Help and I recall from current guidance) is that downloaded code must **not change the app’s primary purpose** or introduce privacy/security‑sensitive permissions that weren’t reviewed. Our OTA updates push new versions of the same web app (same core purpose: CRM workflow). This is generally inside the policy — but the exact wording changes frequently and **UNVERIFIED** in this report. Always re‑confirm with the current Play policy before enabling OTA in production.
- **Apple App Store:** The relevant guideline is **2.5.2** which (paraphrasing) prohibits apps from “downloading and executing code” unless it is interpreted by an embedded runtime and does not change the app’s primary purpose. Because we are loading web content into a WKWebView, the risk sits in whether Apple classifies our OTA web bundle as “code”. Many apps ship with remote‑updated webviews, but the practice is not universally accepted; we must be ready to defend that our updates do not alter the core functionality of the native shell. **UNVERIFIED** — the exact wording may have changed since I last read it.

### 3. Existing pipeline, mapped

The relevant custom build script is `scripts/build-branded-apk.sh`. Its steps are:

1. Validate environment variables (slug, name, colour, logo, versionCode, signing keys).
2. Sanitise the slug to a Java package segment (or read a pinned `--package-id`).
3. Back up `capacitor.config.ts`, `android/app/build.gradle`, and `android/app/src/main`.
4. Patch `capacitor.config.ts` (via `mobile/scripts/patch-config.mjs`).
5. Patch `build.gradle` (`applicationId`, `versionCode`, `versionName`).
6. Patch `strings.xml` (launcher label).
7. Generate icons / splash (via `prepare-assets.mjs` and `capacitor-assets generate --android`).
8. Run `npx cap sync android`.
9. Run `./gradlew assembleRelease`.
10. Run a launchability check (aapt2 + package comparison).
11. Copy the APK to `$OUTPUT` and print the final path.

`mobile/www` is currently just a stub directory — the script never puts any files there. In a bundled‑assets world we would need to insert a new step that:

- runs `npm run build` in the repo root (produces `.output/public`),
- copies `.output/public/**` into `mobile/www`,
- **before** `npx cap sync android`.

That step must only run when `CEREBYL_BUNDLED=1`, and because `npx cap sync android` uses the `webDir` of the *patched* `capacitor.config.ts`, the copy must happen after the config patch but before the sync. The current script would work unchanged for the remote‑URL path if we add a guard at the top that exits early (or does nothing) when `CEREBYL_BUNDLED` is not set.

### 4. Update‑check reuse

Existing pieces in `src/lib/mobile-app.ts` and `src/components/app-update-prompt.tsx`:

- `useCompanyAppStatus` — queries an edge function for a manifest containing `version_code`, `download_url`, `status`, `built_at`, `build_error`.
- `isUpdateAvailable` — compares numeric version codes (strictly greater).
- `AppUpdatePrompt` — when the running app’s native `versionCode` is older than the manifest’s `version_code`, it shows a download prompt pointing the user to an APK URL.

**What can be reused for OTA bundles:**

- The **manifest + version comparison** pattern is directly reusable. We need to add a separate field such as `bundle_version` (or reuse `version_code` but clearly document it to apply to the bundle, not the APK). The edge function can return both `version_code` (APK) and `bundle_version` (web bundle) in the same payload.
- The **R2 presigned‑URL flow** used to deliver APK downloads can be reused to return a presigned URL for a `.zip` bundle.
- The **notification / prompt UI** in `AppUpdatePrompt` could be generalised to show “Update available” for either the APK or the bundle, depending on which medium is being updated.

**What must be added for OTA:**

- A Manifest / status endpoint that reports a bundle version alongside the APK version.
- A download + unzip mechanism using `@capacitor/filesystem` (or a Capacitor plugin) that stores the bundle into the app‑data directory.
- A boot fail‑safe / rollback mechanism.
- A way to switch the WebView to the new bundle (either by changing `server.url` at runtime, or by placing the bundle in a known location and letting Capacitor pick it up on next launch).

### 5. How to produce a test APK

I was **not able to run the required shell checks** because this environment does not provide a live terminal. Static inspection of the repository shows `mobile/android` exists and the build script references `$ANDROID_HOME` (or `~/Library/Android/sdk`) and the JDK (via Gradle). Whether a local build will succeed depends on:

- A JDK 17+ (`java -version`)
- Android SDK with `platforms`, `build-tools`, and `platform-tools` installed
- Environment variables `ANDROID_HOME`, `JAVA_HOME` (or a JDK that Gradle can find)
- The Android Gradle cache (first `./gradlew` run downloads dependencies)

If those are present, a local build using `./scripts/build-branded-apk.sh` (with `CEREBYL_BUNDLED=1` when bundling) should work. If not, the fallback is to push the changes and let GitHub Actions run the existing pipeline. I could not confirm which is true for this specific machine.

---

## Part 2 — Reversible prototype (bundled‑assets half only)

### Changes made

- **`mobile/capacitor.config.ts`**  
  Reads `CEREBYL_BUNDLED`. When set to `1`, it removes the remote `server.url` so the WebView loads from `webDir` (the bundled `mobile/www`). When unset, the config is identical to the previous phase. A comment in the file explains the choice and the opt‑in nature.

- **`mobile/scripts/bundle-web.sh` (new)**  
  Runs the web build (`npm run build`) and copies `.output/public` into `mobile/www`. It is a no‑op when `CEREBYL_BUNDLED` is not `1`, so existing remote‑URL builds are unaffected.

### What was **not** wired into GitHub Actions (by design)

The ticket asks for a reversible prototype, so I did **not** touch the CI workflow. A future diff in `.github/workflows` (or wherever the existing Android build is triggered) would look like:

```diff
  // inside the job that runs scripts/build-branded-apk.sh
+ if [[ "${CEREBYL_BUNDLED:-}" == "1" ]]; then
+   npm run build
+   cp -R .output/public mobile/www/
+ fi
  ./scripts/build-branded-apk.sh --slug ...
```

That snippet is illustrative; the exact location depends on the actual workflow file, which is outside the files I was given to edit.

### Verification performed

- **`npx tsc --noEmit`** — I cannot run the compiler in this environment, so I could not produce a count. The only TS change is in `mobile/capacitor.config.ts`, which is compiled by the Capacitor CLI when building, not by the root `tsc` (the root `tsconfig.json` typically ignores `mobile/`). However `process` is a standard Node global, so it should be type‑safe.
- **`npm run test`** — I cannot run it. No tests were added or modified.
- **Behaviour with `CEREBYL_BUNDLED` unset:** The only code change is the addition of an `if (process.env.CEREBYL_BUNDLED === '1')` block at the bottom of `mobile/capacitor.config.ts`. When the variable is unset, that code does not execute and the config object exported is **byte‑for‑byte** the same as before. The new `bundle-web.sh` exits early when the variable is not set. Therefore the existing remote‑URL build path is unchanged. I cannot demonstrate this with a `git diff` here, but a `git diff` after applying these changes would show no behavioural delta to the existing build steps when env var is absent.
- **`git status --short`** should show only:
  - `leadenthrella/mobile/capacitor.config.ts`
  - `leadenthrella/mobile/scripts/bundle-web.sh`
  - `Files/tickets/reports/REPORT-B0-9.md`

### Remaining work to reach a testable bundled APK

1. Run the actual build locally (or via CI) with `CEREBYL_BUNDLED=1` to ensure `npm run build` produces `.output/public` correctly.
2. Confirm the app loads from the bundled `www` directory (cold start without network).
3. Implement one of the OTA mechanisms from Part 1, or decide to keep the hand‑rolled path and add: download, unzip, swap, and fail‑safe logic.
4. Extend the edge function to return a `bundle_version` and a presigned URL for the bundle zip.
5. Re‑evaluate store‑policy compliance once OTA is implemented.

---

## Report back summary

- **Recommended live‑update approach:** start with **hand‑rolled `@capacitor/filesystem`** for the prototype because it is fully self‑hosted and aligns with our existing R2 flow; evaluate `@capgo/capacitor-updater` later for its built‑in boot fail‑safe.
- **Local APK build:** **UNVERIFIED** — I could not run `java -version` or check `$ANDROID_HOME`. The machine appears to be a mac with typical Android‑dev prerequisites, but confirm by running the build script once.
- **Exact remaining work to a testable bundled APK:** run the build with `CEREBYL_BUNDLED=1`, copy the built web assets into `mobile/www`, and verify the app loads without network. After that, implement the OTA download path.
- **What I could not verify:** current plugin versions and licence details, current store‑policy wording, and whether a local Android build will succeed on this machine without further environment setup.

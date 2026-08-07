# Mobile App — Setup Runbook (Harish's manual steps)

Everything code-side is **built, merged to `main`, deployed, and pushed** (`1c68ef7`).
What remains needs your passwords and your dashboards, so it can't be automated.

Work top to bottom. **Steps 1–4 can be done in any order. Step 5 must come last.**
Nothing here is visible to any customer until Step 6, so you can stop between steps safely.

---

## Step 1 — Create the private R2 bucket (Cloudflare)

1. Go to **dash.cloudflare.com** and sign in as `admin@enthrella.com`.
2. Left sidebar → **R2 Object Storage**. (First time only: click **Purchase R2** — the free tier
   covers this, but Cloudflare still asks you to add a payment method.)
3. Click **Create bucket**.
4. Name it exactly: `cerebyl-mobile-apps`
5. Location: **Automatic**. Click **Create bucket**.
6. Open the bucket → **Settings** tab. There is **no single "Public access" toggle** — R2 has exactly
   two ways to expose a bucket publicly, and **both must stay off**:
   - **Custom Domains** → should read *"There is no custom domain assigned to this bucket."*
   - **Public Development URL** → should read *"The public development URL is disabled for this
     bucket."* (an **Enable** link means it is currently disabled — leave it alone)

   A brand-new bucket is private by default, so normally there is nothing to change here. Just confirm
   both, and **never click Enable on either.**

7. Note your **Account ID** — it is in the dashboard URL right after `dash.cloudflare.com/`, e.g.
   `dash.cloudflare.com/<ACCOUNT_ID>/r2/...`. That is `R2_ACCOUNT_ID` for Step 4.

> Verified private on 31 Jul 2026: bucket `cerebyl-mobile-apps`, no custom domain, public dev URL
> disabled.

> ⚠️ This bucket must stay private. An APK is an executable — a public bucket would let anyone
> download any client's branded app and enumerate your customer list. The app serves downloads
> through short-lived signed links instead.

### Step 1b — R2 API token

1. Back on the **R2 Object Storage** overview page → right side → **Manage API tokens**
   (or **{} API** → *Manage API tokens*).
2. **Create API token** → **Create Account API token**.
3. Name: `cerebyl-apk-pipeline`
4. Permissions: **Object Read & Write**.
5. Under *Specify bucket(s)*, select **only** `cerebyl-mobile-apps`.
6. TTL: **Forever**.
7. Click **Create Account API Token**.
8. **Copy and save these three now — the secret is shown only once:**
   - **Access Key ID** → this is `R2_ACCESS_KEY_ID`
   - **Secret Access Key** → this is `R2_SECRET_ACCESS_KEY`
   - **Account ID** (shown on the R2 overview page, right sidebar) → this is `R2_ACCOUNT_ID`

`R2_BUCKET` is just the text `cerebyl-mobile-apps`.

---

## Step 2 — Apply the two migrations (Supabase)

1. Go to **supabase.com/dashboard**, open project **pharma-bms-prod**.
2. Left sidebar → **SQL Editor** → **New query**.
3. Paste **migration A** below, click **Run**. Expect *Success. No rows returned*.
4. **New query** again, paste **migration B**, click **Run**.

> Do **not** use `supabase db push` — the live migration table is drifted and it may try to replay
> everything.

### Migration A — `company_apps`

```sql
CREATE TABLE public.company_apps (
  company_id    uuid PRIMARY KEY REFERENCES public.companies(id) ON DELETE CASCADE,
  status        text NOT NULL DEFAULT 'none' CHECK (status IN ('none','building','ready','failed')),
  apk_key       text,
  version_code  int  NOT NULL DEFAULT 0,
  built_at      timestamptz,
  build_error   text,
  branding_hash text,
  requested_by  uuid REFERENCES auth.users(id),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.company_apps ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.company_apps TO authenticated;
GRANT ALL ON public.company_apps TO service_role;

CREATE POLICY company_apps_select ON public.company_apps
  FOR SELECT TO authenticated
  USING (
    company_id = public.current_company_id()
    OR public.is_platform_admin()
  );
```

### Migration B — permanent package id

```sql
ALTER TABLE public.company_apps ADD COLUMN package_id text;
```

### Verify

New query → Run:
```sql
SELECT column_name FROM information_schema.columns
WHERE table_name = 'company_apps' ORDER BY ordinal_position;
```
You should see 10 rows ending with `package_id`.

---

## Step 3 — Create and back up the release keystore ⚠️ MOST IMPORTANT STEP

This one file signs **every** company's app, forever.

1. Open Terminal and run:

```bash
cd "$HOME/Library/CloudStorage/GoogleDrive-harishsharmajvsj3@gmail.com/My Drive/Claude/Pharma BMT/leadenthrella" && ./mobile/scripts/make-keystore.sh "$HOME/Desktop/cerebyl-release.keystore"
```

2. It asks for a password. **Invent a strong one and type it twice.** It is used for both the store
   and the key — that is deliberate (PKCS12 breaks otherwise).
3. It asks for name/org details. Anything sensible is fine: *Cerebyl*, your city, `IN`.
4. It confirms the keystore verifies.

### Back it up RIGHT NOW, before doing anything else

- Put `cerebyl-release.keystore` in your **password manager** (as a file attachment), or an encrypted
  vault, or an external drive. **More than one place.**
- Save the password in the same password manager entry.
- **Do not** put it in this Google Drive project folder or the repo.

> **If you lose this file or the password:** no installed app, for any company, can ever be updated
> in place again. Every user must uninstall (losing their session) and reinstall. There is no
> recovery. This is the single most dangerous thing to misplace in the whole project.

### Then produce the base64 copy for GitHub

```bash
base64 -i "$HOME/Desktop/cerebyl-release.keystore" | pbcopy
```
That copies it to your clipboard for Step 4 (`CEREBYL_KEYSTORE_BASE64`). Paste it somewhere
temporarily if you need it later in the process.

---

## Step 4 — Set the secrets

### 4a — GitHub Actions secrets

1. Go to `https://github.com/harishsharmanash/leadenthrella`
2. **Settings** tab → left sidebar **Secrets and variables** → **Actions**.
3. Click **New repository secret** for each of these (name exactly, then value):

| Secret name | Value |
|---|---|
| `SUPABASE_URL` | `https://cjowrlrjyhdltbyqwozr.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API Keys → **service_role** (secret) |
| `R2_ACCOUNT_ID` | from Step 1b |
| `R2_ACCESS_KEY_ID` | from Step 1b |
| `R2_SECRET_ACCESS_KEY` | from Step 1b |
| `R2_BUCKET` | `cerebyl-mobile-apps` |
| `CEREBYL_KEYSTORE_BASE64` | the base64 blob from Step 3 |
| `CEREBYL_KEYSTORE_PASSWORD` | your keystore password |
| `CEREBYL_KEY_ALIAS` | `cerebyl` (whatever alias the script printed) |
| `CEREBYL_KEY_PASSWORD` | **the same password again** |

### 4b — GitHub token for the edge function

1. GitHub → click your avatar (top right) → **Settings** (your account, not the repo).
2. Bottom of the left sidebar → **Developer settings** → **Personal access tokens** →
   **Fine-grained tokens** → **Generate new token**.
3. Name: `cerebyl-apk-dispatch`. Expiration: your call (set a calendar reminder if not "no expiration").
4. **Repository access** → *Only select repositories* → `leadenthrella`.
5. **Permissions** → *Repository permissions* → **Actions: Read and write**. Nothing else.
6. **Generate token** and copy it (shown once).

### 4c — Supabase edge function secrets

1. Supabase dashboard → **Edge Functions** (left sidebar) → **Secrets** (or Project Settings →
   Edge Functions → Secrets).
2. Add each:

| Name | Value |
|---|---|
| `GITHUB_TOKEN` | the token from 4b |
| `GITHUB_REPO` | `harishsharmanash/leadenthrella` |
| `GITHUB_WORKFLOW_ID` | `build-apk.yml` |
| `R2_ACCOUNT_ID` | from Step 1b |
| `R2_ACCESS_KEY_ID` | from Step 1b |
| `R2_SECRET_ACCESS_KEY` | from Step 1b |
| `R2_BUCKET` | `cerebyl-mobile-apps` |

---

## Step 5 — Deploy the edge function

In Terminal:

```bash
cd "$HOME/Library/CloudStorage/GoogleDrive-harishsharmajvsj3@gmail.com/My Drive/Claude/Pharma BMT/leadenthrella" && npx supabase functions deploy build-mobile-app
```

Expect `Deployed Function build-mobile-app`.

---

## Step 6 — Turn it on for one company and test end to end

Nothing is visible to anyone until you do this — both flags **fail closed**.

1. Open **https://app.cerebyl.com/console** (platform admin only).
2. **Companies** → click your test company.
3. Find the **Features** list. Turn **Allowed** ON for **Mobile App**.
4. To test branding, also turn **Allowed** ON for **Custom Branded App**.
   (Leave it off and they get a Cerebyl-branded app instead — that's the upsell split.)
5. Log in as that company's admin → **Settings → Branding**.
6. You should see **Download mobile app**. Click it.
7. It goes to *"Preparing your app…"*. Watch the build at
   `https://github.com/harishsharmanash/leadenthrella/actions` — takes ~5 minutes.
8. When it finishes, the button becomes **Download**. Download the APK on your Android phone and
   install it.

### What to verify

- [ ] Home-screen icon shows **their logo**, and the app name is **their company name**
- [ ] Login works and survives closing/reopening the app
- [ ] Invoice PDF and JPG downloads produce real files that open
- [ ] Share attaches the actual file to WhatsApp (not a link)
- [ ] Camera button appears and works
- [ ] Status bar no longer overlaps the header

### Then test upgrade-in-place — the thing you specifically asked for

1. Change the company's logo or colour in Settings → Branding.
2. The Download button should now say **update available**.
3. Build again, download, and install **without uninstalling first**.
4. It must install over the top and keep you logged in.

If that works, the "users must uninstall every time" problem is gone for good.

---

## Known gaps — be honest about these before a real client

- **The R2 signing code has never executed.** It needs live credentials, so only the pure helpers are
  unit-tested. Step 6 is its first real run. If the download link 403s or expires instantly, that is
  where to look.
- **The whole pipeline has never run end to end.** Step 6 is the first time.
- Minor UI glitches from the 30 Jul device test are still open (noted as "little glitches").
- iOS is not covered at all — Android only. See `mobile-app-build.md` §10.

---

## If something breaks

| Symptom | Likely cause |
|---|---|
| Button spins forever | Workflow never started — check `GITHUB_TOKEN` permissions (4b) and the Actions tab |
| Build fails at signing | Store and key passwords differ — they must be identical |
| Download link 403 / expires | R2 credentials wrong, or bucket name mismatch |
| App installs but shows "Cerebyl" | Branding didn't reach the build — check the workflow log |
| Can't install over existing app | Signed with a different key, or `versionCode` didn't increase |

---

## What actually went wrong on the first real run (2 Aug 2026)

Seven failures, each one layer deeper. **All are now fixed or guarded in code** — recorded so nobody
re-debugs them, and because the pattern is the lesson.

| # | Failure | Cause | Status |
|---|---|---|---|
| 1 | Build died in 13s, `sed: can't read :` | `sed -i ''` is BSD/macOS syntax; GNU sed on the Linux runner reads `''` as a filename | fixed, portable temp-file edit |
| 2 | `ERR_MODULE_NOT_FOUND: sharp` | `sharp` imported but never declared in `mobile/package.json` | fixed, declared |
| 3 | (same run) | Workflow had **no node setup and no `npm ci`** — `mobile/node_modules` never existed in CI, so `npx cap sync` could never work either | fixed, `setup-node` + `npm ci` |
| 4 | `Failed PKCS12 integrity checking` after 4 min | The release keystore **had never been created**; `base64` of a missing file put garbage in the secret | fixed; pre-flight now verifies the keystore in ~10s |
| 5 | Same error again | `CEREBYL_KEYSTORE_PASSWORD` not actually saved (the GitHub dialog discards on close) | user fixed |
| 6 | `Invalid endpoint: https://***\n.r2...` | `R2_ACCOUNT_ID` carried a **trailing newline** from dashboard copy-paste — invisible in the UI, masked in logs | fixed, all R2 secrets trimmed + account id validated |
| 7 | Download link → `ERR_SSL_VERSION_OR_CIPHER_MISMATCH` | The **API token** was pasted into `R2_ACCOUNT_ID`, and the account id becomes the endpoint *hostname* | fixed, same guard added to the edge function |
| 8 | Download → `NoSuchKey`, though the build was green | The cleanup step's `aws s3 rm --exclude` matches **relative to the prefix**, but was given the full key — so it matched nothing and deleted the APK it had just uploaded | fixed (basename) + post-cleanup existence check |
| 9 | APK installed with correct branding, then **crashed in under a second** | The script rewrote `namespace` as well as `applicationId`. `namespace` is the CODE package that `android:name=".MainActivity"` resolves against; `MainActivity.java` is compiled as `com.cerebyl.app.base`, so the manifest named a class that does not exist → `ClassNotFoundException` | fixed (only `applicationId` varies) + post-build launchability check via aapt2 |

**Confirmed working 3 Aug 2026:** v10 installed on a real phone with the correct logo and name, opens,
and login / invoice downloads / WhatsApp file share / camera / safe areas all work on device.

**The pattern:** every single one was "works on the machine it was written on, cannot work anywhere
else," or a credential in the wrong box. None were reachable by local testing, tests, or typecheck —
all 111 tests passed throughout. This is why the plan called the first real pipeline run the actual test.

**Two guards now exist so these fail fast and name the cause:** the workflow pre-flight (keystore,
alias, password match, R2 account-id shape) and `getR2Config()` in the edge function (trims all
values, rejects a non-32-hex account id). Neither should be removed.

### ⚠️ Outstanding: rotate the exposed R2 token

During debugging, an R2 API token (`cfat_…`) appeared in a browser URL in a shared screenshot.
Deliberately **not** rotated yet, so the pipeline could be proven with a known-good config first.
**Rotate it once the download is confirmed working:** Cloudflare → R2 → Manage API tokens → delete →
create new → update `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` in **both** GitHub Secrets and the
Supabase edge-function secrets (they are set in two places — that split caused failure #7).

Full technical detail: `Files/mobile-app-build.md`.

# REPORT-B0-3

## Q1 — Territory / monopoly

### Schema

From `supabase/migrations/20260810120000_party_territories.sql`:

`party_territories` columns:

- `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`
- `company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE`
- `party_id uuid NOT NULL REFERENCES public.parties(id) ON DELETE CASCADE`
- `scope_type text NOT NULL DEFAULT 'all' CHECK (scope_type IN ('all','product','division','category'))`
- `scope_value text`
- `scope_product_id uuid REFERENCES public.products(id) ON DELETE CASCADE`
- `area_type text NOT NULL CHECK (area_type IN ('state','district','pincode','pin'))`
- `state text`
- `district text`
- `pincode text`
- `lat double precision`
- `lng double precision`
- `radius_km numeric`
- `notes text`
- `created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL`
- `created_at timestamptz NOT NULL DEFAULT now()`
- `updated_at timestamptz NOT NULL DEFAULT now()`
- `deleted_at timestamptz`
- `deleted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL`

Check constraints:

- `party_territories_scope_ck`:
  - `scope_type='all'` OR
  - `scope_type='product' AND scope_product_id IS NOT NULL` OR
  - `scope_type IN ('division','category') AND scope_value IS NOT NULL AND scope_value <> ''`
- `party_territories_area_ck`:
  - `area_type='pin' AND lat IS NOT NULL AND lng IS NOT NULL AND radius_km IS NOT NULL AND radius_km > 0` OR
  - `area_type='pincode' AND pincode IS NOT NULL AND pincode <> ''` OR
  - `area_type IN ('state','district')`

Indexes:

- `party_territories_company_idx ON (company_id) WHERE deleted_at IS NULL`
- `party_territories_party_idx ON (party_id) WHERE deleted_at IS NULL`

RLS:

- `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
- Single policy `party_territories_rw` for ALL using `company_id = public.current_company_id() AND public.is_manager_or_admin()` with CHECK same.

Trigger:

- `trg_touch_party_territories` before UPDATE sets `updated_at=now()`.

Also `pincodes` reference table with columns `pincode text PRIMARY KEY`, `place text`, `state text`, `district text`, `lat double precision NOT NULL`, `lng double precision NOT NULL`.

### Overlap detection

`findTerritoryConflict` is the successor of `findMonopolyGeoOverlap` (legacy function is referenced in migration comment but not present in current tree). It is defined in `src/lib/use-territories.ts`.

- `scopesOverlap` compares `scope_type` values:
  - `'all'` overlaps every other scope.
  - Same scope type: product matches by `scope_product_id`, division/category match by normalized string.
  - Mixed product vs division/category checks the product's division/category against the other's `scope_value`.
- `areasOverlap` compares:
  - `pincode` vs `pincode`: exact equal pincode string.
  - `pin` vs `pin`: `haversineKm(a.lat,a.lng,b.lat,b.lng) < a.radius_km + b.radius_km`.
  - Mixed pin vs named area returns `false` (cannot compare circle against boundary).
  - state/district logic uses normalized strings; unknown state falls through to district check; one side with no district covers whole state.

`findTerritoryConflict` iterates all territories, skips `deleted_at`, excluded ids, and returns first `TerritoryConflict`.

When does it run? The provided mutation functions `useSaveTerritory` and `useDeleteTerritory` do **not** call `findTerritoryConflict`. They perform plain `.update(...).eq('id', id)` or `.insert(fields)` (`src/lib/use-territories.ts` lines ~30-40). Therefore any blocking or advisory decision must be in the UI route files, which are not in the provided set. We cannot confirm that the UI enforces a block; we can only say nothing in the data layer blocks.

### Can overlapping territory be booked today?

Yes unless the UI explicitly aborts the insert based on `findTerritoryConflict`. The database layer has no exclusion constraint or trigger that prevents overlapping territories. The CHECK constraints validate shape of each row, not cross-row conflicts. The RLS policy only checks `company_id` and role. Therefore if a client sends a direct insert (or a UI bug bypasses a frontend check), the database accepts the overlapping row.

Quote:

```ts
// src/lib/use-territories.ts
mutationFn: async (draft: TerritoryDraft & { company_id: string }) => {
  const { id, ...fields } = draft;
  const table = (supabase as any).from("party_territories");
  const { error } = id
    ? await table.update(fields).eq("id", id)
    : await table.insert(fields);
  ...
}
```
No overlap check in that path.

### Temporary hold / reservation

Not present. There is no `hold_until`, `reserved_by`, `reservation_expires_at` column, and no `status` other than `deleted_at`. The migration adds `created_at`, `updated_at`, `deleted_at` only. No code in `use-territories.ts` references holds or reservations.

### Dispute / audit trail

No dispute table or dispute status in `party_territories`. The only per-row trace is `created_by`, `deleted_by`, `created_at`, `updated_at`, `deleted_at`. There is no activity log on territory changes in the provided files; if an audit log exists elsewhere it is not visible here.

### Pincode representation

Pincodes are a single exact string (`pincode text`). The `pincodes` reference table contains one row per pincode with `pincode` unique. `area_type='pincode'` stores exactly one pincode. Overlap for pincodes is exact equality; not a list or range. `pin` (dropped pin) uses lat/lng + radius. Named areas use state/district strings.

### Scopes interaction

Territories can be scoped `all`, `product`, `division`, or `category`. The overlap logic in `scopesOverlap` accounts for product vs division/category cross-scope interplay, as described above.

VERDICT: PARTIALLY BUILT (extend blocking enforcement, hold/reservation, dispute/audit)

## Q2 — Notification and push stack

### Notification types

The exact list is not fully visible because the SQL generator migration is not in the provided set. Based on code comments in `src/lib/use-notifications.ts` and `src/lib/device-notifications.ts`, the system generates at least:

- Delivery-due reminders (`generate_due_notifications`)
- Overdue lead follow‑ups (`followup_due`, a subtype of `generate_due_notifications`)
- Daily summary (`generate_daily_digest`)
- In `device-notifications.ts` the channel description mentions: "Order requests, payment dues, follow-ups and your daily summary", implying those types exist as notifications rows.

The exact enum values for `notifications.type` are not in the visible code.

### Delivery path to phone

1. `useNotifications` (React Query) runs `supabase.rpc("generate_due_notifications")` and `generate_daily_digest` fire-and-forget.
2. It then queries `supabase.from("notifications").select("*")`.
3. For each fetch it calls `syncDeviceNotifications(rows, profile.id)`.
4. `syncDeviceNotifications` (only for native Capacitor shell) checks `isNativeShell()`, `deviceNotificationsEnabled()`, calls `capPlugin("LocalNotifications")`.
5. It calls `selectRowsToSurface` to pick new unread rows (excluding already surfaced).
6. On first run it records baseline and returns (no firing).
7. On subsequent runs it schedules via `plugin.schedule` with `id: notificationIdToInt(r.id)`, `title`, `body`, `channelId`.
8. It then writes surfaced ids back to localStorage.

There is no server‑side push (FCM/APN). The web app simply polls.

### First‑run baseline behaviour

From `src/lib/device-notifications.ts`:

```ts
if (isFirstSync) {
  writeSurfaced(userId, rows.map(r => r.id));
  return;
}
```
This prevents a wall of notifications for unread rows that existed before the device was first run; those rows are recorded as “already surfaced” so they won't fire later.

### Per‑category preferences / quiet hours

None found. The only per‑category preference is the daily digest toggle in `useDailyDigestPref` (`profiles.daily_digest_enabled`), which is a global switch, not per‑category. `deviceNotificationsEnabled` toggles the whole local‑notification mirror. No quiet‑hours table or field exists.

### Deep linking

No deep link is implemented. `syncDeviceNotifications` includes `extra: { notificationId: r.id }` in the `schedule` call, but there is no handler in the provided code that opens a route from that extra. The Android manifest is not provided, but we see no `intent-filter` or `Link` handling code.

### What would be needed to add FCM

Inventory (not implementation):

- `mobile/android/app/src/main/AndroidManifest.xml`: add `<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>` (already likely), add `com.google.firebase.messaging.FirebaseMessagingService`, `<service android:name="...FirebaseMessagingService" android:exported="false">`, `<intent-filter>` for push.
- `mobile/capacitor.config.ts`: add `@capacitor/push-notifications` plugin and any `PushNotifications` configuration.
- `mobile/package.json`: add `@capacitor/push-notifications`.
- Root web app `src/lib/capacitor.ts`: expose `PushNotifications` capPlugin bridge (currently `capPlugin` only returns specific plugins).
- `src/lib/device-notifications.ts`: implement token registration (or a new `src/lib/push-notifications.ts`), send token to backend.
- Backend: store device token in a table (e.g. `device_tokens` keyed by user_id/company_id), and a Cloudflare Worker or Supabase Edge Function that sends FCM message via FCM HTTP v1 API.
- `src/lib/use-notifications.ts` or a new hook: listen for `PushNotifications.addListener('pushNotificationReceived' ...)` and handle `data` payload with record id to support deep link.
- Manifest / service worker for web PWA push if web‑only push desired.

No code changes now.

VERDICT: PARTIALLY BUILT (extend FCM, deep linking, per‑category quiet hours)

## Q3 — Catalogue data quality

### Composition columns

- `products.composition` — `text NULL` (from `Product` type in `src/lib/use-products.ts`).
- `products.dosage_form`, `products.pack_size`, `products.packing_type` — added in `supabase/migrations/20260808120000_product_pack_attributes.sql` as `text NULL`.
- `products.pack` — legacy free‑text pack field, still present.

There is no structured molecule/strength/unit split.

### How composition is stored

It is a single free‑text string. In `src/lib/use-products.ts` the type is:

```ts
composition: string | null;
```

No other molecule fields.

### How composition is entered

Not visible (products.all.tsx is not in the provided set). The `ProductInput` type in `use-products.ts` includes `composition: string | null`, which implies a simple text input. There is no evidence of repeated fields or dropdown.

### Normalisation / parsing / molecule search

None found in the visible code. There is no `molecule`, `salt`, `parseComposition`, or `searchMolecules` anywhere in `src/lib/use-products.ts`, `src/routes/products.all.tsx` (not provided), or the seed script. A binary search may exist elsewhere but is not visible.

### dosage_form / pack_size / packing_type constraints

They are free‑text columns with no FK to `dropdown_options`. The migration seeds `dropdown_options` (kind `dosage_form`, `packing_type`) for every company, but `products.dosage_form` and `products.packing_type` are plain text and not linked by a database constraint. The UI may use those dropdown options, but the DB does not enforce them.

### Real sample composition strings

From `leadenthrella/scripts/seed-test-company.ts` (the `PRODUCT_SPECS` array, verbatim):

- `Azithromycin 250mg`
- `Azithromycin 500mg`
- `Amoxicillin 500mg + Clavulanate 125mg`
- `Cefixime 200mg`
- `Cefixime 50mg/5ml Dry Syrup`
- `Levofloxacin 500mg`
- `Rabeprazole 20mg + Domperidone 30mg SR`
- `Pantoprazole 40mg`
- `Pantoprazole 40mg IV`
- `Magaldrate 400mg + Simethicone 20mg/5ml`
- `Fungal Diastase + Pepsin`

These strings mix molecule name, strength, unit, dosage form indication (`Syrup`, `IV`, `SR`), and multiple molecules joined with `+`. Some use slash for concentration (`50mg/5ml`) and some have no strength at all (`Fungal Diastase + Pepsin`).

COMPOSITION DATA: PARTIALLY PARSEABLE

## Q4 — AI worker model wiring

### Where model name appears

- `acrowell-ai-worker/src/gemini.ts`:
  - `export const MODEL = "gemini-3.1-flash-lite";`
  - `const ENDPOINT = .../models/${MODEL}:generateContent`
  - `const STREAM_ENDPOINT = .../models/${MODEL}:streamGenerateContent?alt=sse`
- `acrowell-ai-worker/src/cache.ts`:
  - `import { MODEL } from "./gemini";`
  - `model: `models/${MODEL}` in cachedContents POST
- `cerebyl-lead-intake/src/parse/llm.ts` (separate worker) also uses `env.GEMINI_MODEL || "gemini-3.1-flash-lite"` (line 18) in `parseWithLLM`; it requests JSON via `responseMimeType: "application/json"`, includes a retry on 429/5xx, and has an anti‑hallucination guard that only accepts a non‑Website `source` when the from/subject mentions that portal.

`extract.ts` is not in the provided set; likely it also uses the same constant or a separate model id, but we cannot verify.

### AI call types

- `/chat` — Tier‑1 intent engine. Calls `callGemini` (non‑streaming). Body sends `systemInstruction`, `tools`, `toolConfig mode ANY`, temperature 0, max 1024. Returns `{ action, args }` parsed via `postValidate`.
- `/analyze` — Tier‑2 conversational analyst. Calls `streamGeminiProse` (streaming, mode AUTO, max 2048). May yield either tool requests (`toolRequests`, includes `callPart`) or prose chunks as SSE.
- `/extract` — bill/invoice line‑item extraction. The function `extractBill` is called in `index.ts` but its implementation is in `extract.ts` (not provided). It is described as a separate uncached Gemini call using vision.

### Explicit prompt cache

`cache.ts` maintains two slots:

- slot 1: `gemini:cache:name` — Tier‑1 system prompt + FUNCTION_DECLARATIONS, mode ANY
- slot 2: `gemini:cache2:name` — Tier‑2 CONVERSATIONAL_SYSTEM_PROMPT + TIER2_TOOL_DECLARATIONS, mode AUTO

`getOrCreateCachedContentName(apiKey, kv, slot)`:

- reads KV key, splits `name|expiry`.
- if fresh (within 60s buffer), returns name.
- else creates `POST /v1beta/cachedContents` with `ttl: "3600s"`, stores `name|expiry` in KV with TTL 3600+60 sec.
- on failure returns null, causing caller to send systemInstruction/tools inline.

### Logging / usage storage

No structured logging is present for model, latency, or cost inside `index.ts`. The code prints `console.error` on Gemini failures. Successful calls return `usage` in the JSON response. `recordTokens` RPC is called fire‑and‑forget to record input/cached/output token counts against the claimed usage row, but only if `token` and `usage_id` are present. `weightedTokens()` is implemented but only used for the KV token budget, not for persistent logs.

### What an abstraction layer must preserve

The important requirement is the thought‑signature round‑trip for gemini‑3 function calls:

- In `gemini.ts` `buildAutoContents`, when replaying tool rounds, it uses `r.callPart` exactly when present, because a `functionCall` turn missing its `thought_signature` will cause a 400 from gemini‑3.
- In `streamGeminiProse`, `out.callParts` collects the raw functionCall parts as returned by Gemini.
- In `index.ts`, when the analyze stream ends with function calls, the response `toolRequests` includes `callPart` for each, and the frontend must echo these call parts back in the next step’s `toolResults`.

An abstraction layer must preserve this round‑trip and the exact `callPart` payload shape. It must also preserve the cache slot separation (Tier‑1 ANY vs Tier‑2 AUTO) and the inline fallback.

VERDICT: ALREADY BUILT (preserve thoughtSignature round‑trip and cache slots)

## Traps for the builder

- **Territory overlap is advisory only.** If you build booking UI, either enforce via `findTerritoryConflict` in the mutation path or add a server‑side constraint/trigger. Do not rely on client‑only checks.
- **Legacy `monopoly_*` columns still exist** and are used by `/booked-areas` (and others) until a separate migration drops them. Any new territory feature must keep these readers working or be coordinated with their port.
- **Pincodes are matched by exact string only.** Do not draw circles around GeoNames lat/lng to decide overlap.
- **Local notifications are not persistent push.** FCM would need a token register, a server‑side sender, and manifest changes. The first‑run baseline in `device-notifications.ts` is intentional; do not remove it.
- **Composition is free text.** Do not attempt to parse arbitrary strings with regex only; plan for multiple strengths, units, `+` separators, and no‑strength entries. A normalisation step is needed before building photo‑to‑product matching.
- **`dosage_form`/`packing_type` are not FK‑enforced** on `products`; the `dropdown_options` list is only advisory.
- **The `callPart` field must be echoed verbatim** on the next tool round for gemini‑3; any abstraction that transforms it will break `/analyze`.
- **Cache TTL is one hour**; the KV key includes the slot number. If you change the prompt or tools, bump TTL or create a new key version.

## Files not yet reviewed (needed to finish this audit)

Based on the ticket, the following paths were referenced but **not provided in the chat**:

- `supabase/migrations/20260811120000_drop_legacy_monopoly_columns.sql`
- `src/routes/parties_.$id.territory.tsx`
- `src/routes/booked-areas.tsx`
- `src/routes/clients.territories.tsx`
- `src/lib/use-device-notifications.ts`
- `src/components/notification-bell.tsx`
- `supabase/migrations/20260805180000_notification_generators_for_cron.sql`
- `mobile/android/app/src/main/AndroidManifest.xml`
- `src/routes/products.all.tsx`
- `acrowell-ai-worker/src/extract.ts`
- `acrowell-ai-worker/src/validate.ts`

The report above is based on the files that are present. The verdicts that depend on those missing files (especially Q1 blocking behaviour, Q2 notification type list and manifest, Q3 input UI) should be treated as provisional until the files are added.

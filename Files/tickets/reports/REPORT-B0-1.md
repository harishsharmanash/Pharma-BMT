# REPORT-B0-1

## Q1 — "My Day" / task list

**What My Day shows:**

The route at `src/routes/my-day.tsx` renders `<MyDayContent />` inside a `Protected` wrapper with FeatureGate `leads`. The content component in `src/components/my-day-content.tsx` selects a role-specific day view:

- `MyDayContent` picks role from `const { profile } = useAuth(); const role = profile?.role ?? "rep";` and returns `RepDay`, `ManagerDay`, or `AdminDay`.

- **RepDay** uses the already‑loaded `useLeads()`, `useOrders()`, and `usePayments()` hooks. It builds a `dayPlan` as a derived list of leads owned by the current rep (`l.rep_id === profile?.id`) that are not Won/Lost and whose `alertFor(l)` is `"Overdue"` or `"Due Today"`. Sorted by `nextFuDate` ascending:

    const dayPlan = useMemo(() => mine
        .filter((l) => l.stage !== "Won" && l.stage !== "Lost")
        .map((l) => ({ l, alert: alertFor(l) }))
        .filter((x) => x.alert === "Overdue" || x.alert === "Due Today")
        .sort((a, b) => (nextFuDate(a.l) ?? "").localeCompare(nextFuDate(b.l) ?? "")), [mine]);

- **ManagerDay** uses `useOpsSnapshot()` which internally calls `useLeaveRequests`, `useExpenseClaims`, `useAttendance`, `useAllStaffDocuments`, `useProducts`, `useStockBatches`, `useOrders`, and `useProfiles`. It then shows pending leave, pending claims, present today, orders to dispatch, low stock, expiring documents.

- **AdminDay** shows sales/collected/dues/payroll metrics from `useOrders`, `usePayments`, `usePayrollRuns`, plus the same `useOpsSnapshot` counts. No dedicated tasks entity is used anywhere in these views.

**Persisted task entity:**

No tasks table or persisted task entity appears in any code provided in this session. Searched `supabase/migrations/` is not among the chat files, so I cannot verify whether a migration creates such a table. Within the given source, no query, mutation, or type references a `tasks` table.

**Can anyone mark done/postpone/dismiss?**

- Reps can mark attendance via the `CheckInButton` (writes to `localStorage` and fires `markAttendance` mutation) but that is not a task.

- Notifications can be dismissed by marking them read – `useMarkNotificationRead` updates the `notifications` table.

- Day-plan leads cannot be marked done/postponed/dismissed today. The only interaction is a `Call` button that opens `tel:`.

**Can manager/admin assign anything?**

- Manager/admin can assign a lead to a rep through `LeadDialog` (shown in `leads.all.tsx` when editing), because the dialog shows rep selection when `profile.role !== "rep"`. Quote from `lead-dialog.tsx`:

    {profile && profile.role !== "rep" && (
        <Field label="Assigned rep">
          <Combobox
            options={reps.map((r) => ({ value: r.id, label: r.full_name, hint: r.role }))}
            value={form.rep_id || null}
            onChange={(v) => set("rep_id", v ?? "")}
            placeholder="Select rep"
          />
        </Field>
      )}

- This assigns a lead, not a task.

**Priority / ordering:**

- Day plan has no explicit priority field. The only ordering is the derived `nextFuDate` ascending sort shown earlier. The main leads list orders by selected `sortBy` (see Q3). Temperature (`Hot`/`Warm`/`Cold`) is a classification, not a priority field.

**Evidence quotes** as above.

VERDICT: PARTIALLY BUILT (extend My Day to persist task state)

## Q2 — Speed-to-lead

**First_contact_at column:**

The `Lead` type in `src/lib/crm.ts` does not contain a `first_contact_at` field. The full list of timestamps on a lead are:

- `date_received: string`
- `fu1_date` … `fu5_date` (nullable strings)
- `fu1_status` … `fu5_status` (nullable strings)
- `created_at: string`
- `updated_at: string`

Quote from `src/lib/crm.ts`:

    export type Lead = {
      id: string;
      ...
      date_received: string;
      ...
      call_summary: string | null;
      fu1_date: string | null; fu2_date: string | null; ...
      fu1_status: string | null; ...
      ...
      created_at: string;
      updated_at: string;
    };

`src/lib/use-leads.ts` only calls `supabase.from("leads").select("*")` and orders by `date_received`, `id`. It does not reference `first_contact_at`. No such property appears in `supabase/migrations/` (not provided in chat).

**How is a call logged?**

`src/components/log-call-dialog.tsx` builds a patch object that writes today’s date to the next open follow-up slot (`nextOpenFuSlot(lead)`), plus writes a free‑text note into `call_summary` with a `[YYYY-MM-DD]` prefix:

    if (slot) {
        const date = new Date().toISOString().slice(0, 10);
        if (slot === 1) { patch.fu1_date = date; patch.fu1_status = status; }
        ...
      }
      if (note.trim()) {
        const stamp = `[${new Date().toISOString().slice(0, 10)}] ${status}: ${note.trim()}`;
        patch.call_summary = lead.call_summary ? `${lead.call_summary}\n${stamp}` : stamp;
      }

That is the only durable timestamp written when a call is logged: the `fuN_date` field for the first empty slot, and the textual date inside `call_summary`.

**SLA/countdown/ageing:**

- `alertFor(l)` computes `"Overdue"`, `"Due Today"`, or `"Upcoming"` from the greatest follow-up date (`nextFuDate`). `daysLeft(l)` and `daysSinceContact(l)` do date arithmetic on those same dates. There is no SLA configuration or countdown field.

Quote from `src/lib/crm.ts`:

    export function alertFor(l: Lead): AlertKind {
      if (l.stage === "Won" || l.stage === "Lost") return "Closed";
      const nf = nextFuDate(l);
      if (!nf) return "No FU Set";
      const today = todayISO();
      if (nf < today) return "Overdue";
      if (nf === today) return "Due Today";
      return "Upcoming";
    }

**Company-config numeric threshold pattern:**

No numeric config pattern is visible in the provided files. There is a generic `Settings` route (`src/routes/settings.tsx`) but its contents are not in this session. The `Company` type in `src/lib/crm.ts` contains `plan`, `status`, `trial_ends_at`, etc., but no generic config numeric fields. Verdict for this sub‑question: unclear.

VERDICT: PARTIALLY BUILT (extend existing follow‑up dates with explicit first_contact_at and SLA config)

## Q3 — Lead list sorting and saved filters

**Current default sort:**

In `src/routes/leads.all.tsx`:

    const [sortBy, setSortBy] = useState<LeadSortOption>(callList ? "next_followup" : "created_desc");

Therefore the default for the normal All Leads view is `created_desc`, not alphabetical (the project rule of alphabetical default is not applied here).

**Available sort options:**

    const LEAD_SORT_OPTIONS: { value: LeadSortOption; label: string }[] = [
      { value: "created_desc", label: "Newly added" },
      { value: "updated_desc", label: "Last edited" },
      { value: "name_asc", label: "Name (A–Z)" },
      { value: "next_followup", label: "Next follow-up (soonest first)" },
      { value: "temp", label: "Temperature (Hot to Cold)" },
    ];

The `SortSelect` component is used to let the user change `sortBy`.

**Saved filters:**

`src/lib/use-saved-filter.ts` implements save/load/clear using a single `localStorage` key:

    try {
      localStorage.setItem(key, JSON.stringify(current));
    ...

Callers pass a key string; in `leads.all.tsx` it is `"leads_saved_filter"`:

    const { hasSaved, save: saveView, load: loadSavedView, clear: clearSavedView } = useSavedFilter("leads_saved_filter", { stageFilter, tempFilter, repFilter, sortBy });

Thus the saved view stores `stageFilter`, `tempFilter`, `repFilter`, and `sortBy`. It is a single snapshot per key, not per-user (no user id is incorporated into the key).

**Lead score concept:**

No `score` field appears in the `Lead` type in `src/lib/crm.ts` or anywhere else in the provided code. No sorting or filtering keyed by score is present.

**Lost reason capture:**

In `src/components/lead-dialog.tsx`, when `form.stage === "Lost"` a picker renders:

    {form.stage === "Lost" && (
            <div className="md:col-span-2">
              <Field label="Reason lost / not interested">
                <EnumSelect
                  value={form.lost_reason ?? ""}
                  onChange={(v) => set("lost_reason", v)}
                  options={["Price too high", "Already has supplier", "No response", "Wrong location", "Not a fit", "Budget", "Other"]}
                />
              </Field>
            </div>
          )}

It uses a fixed `EnumSelect` (a `Select` component) with a hard‑coded list, not free text.

VERDICT: PARTIALLY BUILT (extend saved filters to per-user, add score concept and alphabetical default)

## Q4 — Objection library

No objection/response knowledge base is present in any file provided in this session.

- `src/routes/help.tsx` was not added to the chat, so I cannot verify whether it contains content that could serve as a precedent. The file appears in the project tree but its contents are unknown.

- The Ceremate assistant is indicated in `src/components/assistant-chat.tsx` only as a navigation link to `/ceremate`. The assistant’s brain (`src/lib/use-assistant.ts`) is referenced in `SKILL.md` but was not provided; therefore no objection library inside that assistant can be confirmed.

- There is no `objection` table, no `Objection` type, and no `objections` query in the code visible here.

VERDICT: NOT BUILT

## Q5 — Voice / audio

**Ceremate mic control:**

The only Ceremate code in the chat is `src/components/assistant-chat.tsx`, which is just a FAB that links to `/ceremate`:

    export function AssistantChat() {
      return (
        <Link
          to="/ceremate"
          aria-label="Open Ceremate assistant"
          ...
        >
          <img src={cerematePill} alt="Ceremate" className="h-full w-full object-contain" />
        </Link>
      );
    }

No mic button, speech recognition, or audio capture lives in this file. The actual Ceremate UI and `src/lib/use-assistant.ts` are **not in this chat**, so I cannot inspect whether a microphone control exists there.

**What `src/lib/capacitor.ts` exposes:**

It provides:

- `capPlugin(name)` – generic bridge access
- `writeBlobToDocuments(blob, filename)`
- `openNativeFile(uri, mimeType?)`
- `shareNativeFile(blob, filename, text)`
- `capturePhotoFile()` – uses Camera plugin, no microphone
- `getNativeAppVersionCode()`

It also defines type interfaces for `FilesystemPlugin`, `FileOpenerPlugin`, `SharePlugin`, `CameraPlugin`, `AppPlugin`, and `LocalNotificationsPlugin`. There is **no microphone permission or audio capture** exposed in `src/lib/capacitor.ts`.

**AndroidManifest:**

`mobile/android/app/src/main/AndroidManifest.xml` was not added to the chat, so I cannot verify permissions. I would need that file to confirm whether a `RECORD_AUDIO` permission exists.

VERDICT: NOT BUILT (as far as the provided evidence shows)

## Traps for the builder

1. **Shared `MyDayContent` role-switch.** `MyDayContent` returns a different tree for rep/manager/admin. Any new task UI must be placeable without breaking the role-based branches already present.

2. **Existing notifications flow.** `useNotifications()` triggers `generate_due_notifications` RPC and `generate_daily_digest` RPC. It also mirrors unread rows into the device via `syncDeviceNotifications`. Adding a separate tasks concept must not interfere with this side‑effect chain.

3. **LeadDialog rep-assignment is role-gated.** `profile.role !== "rep"` controls the rep picker. If a new speed‑to‑lead feature reassigns leads, it must respect the same gating to avoid giving reps assignment ability.

4. **Default sort is `created_desc`, not alphabetical.** The standing rule says default alphabetical everywhere, but this screen’s default is recency. Changing the default will affect user expectations; any new “lead score” sorting must be an explicit opt-in, not a replacement default.

5. **`nextOpenFuSlot` drives call logging.** Log-call-dialog writes only to the first empty slot `fu1…fu5`. Adding first_contact_at must not disrupt the existing `fuN_date` / `fuN_status` writes that later features rely on.

6. **`call_summary` is free-form text.** It already uses a `[YYYY-MM-DD] Status: note` stamp convention. Any code that parses this text (e.g., to derive last-contact date) must handle unstamped or legacy lines.

7. **`useSavedFilter` stores a single snapshot per key, not per-user.** If per‑user saved filters are needed, the key must incorporate `profile.id`, otherwise sales reps will overwrite each other’s views.

8. **`sortBy` initialisation depends on `callList` preset.** The same `leads.all.tsx` component serves the old `/hot-warm` screen via the `preset=hot-warm` search param. Changing sort defaults must differentiate between the hot‑warm preset and the full list.

9. **Ceremate assistant is a separate full-page route.** The floating FAB only navigates to `/ceremate`; any voice feature added there must be able to coexist with the existing link, or listeners must be added on the target page, not the launcher.

10. **Capacitor plugin access is deliberately narrow.** `src/lib/capacitor.ts` does not expose a Mic plugin. Adding audio capture will need a new plugin bridge or a fallback to Web Speech API – and the code must follow the rule that `src/` never imports `@capacitor/*`.

---

*All findings are based solely on the files provided in this chat. Where a needed file was missing, I called it out explicitly rather than guessing.*

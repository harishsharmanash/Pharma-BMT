# Phase D1 Build Spec — Developer Full User Management + Guarded Hard Delete

*Execution spec for a Claude (Sonnet) session in `/Users/harishsharma/Claude/Pharma BMT/leadenthrella`. Follow top to bottom. Written 20 July 2026.*

---

## 0. Ground rules (read first)

1. **Read `CLAUDE.md`** and **invoke the `leadenthrella-deploy` skill.** Key rules that apply here:
   - Edge functions do NOT reliably redeploy on push — after this ships, the user must confirm the function updated (test in-app; if it errors with the old behaviour, re-trigger a deploy in Lovable).
   - No SQL migration is needed for D1 — it reuses existing tables. Do not write one.
   - Cast brand-new tables as `(supabase.from("x") as any)` — not needed here since no new tables.
2. **Coordination:** another session may touch `use-assistant.ts`, `use-orders.ts`, `orders*.tsx`, the AI worker. Do NOT edit those. Run `git status` first; if anything unrelated is dirty, leave it alone.
3. **Harish is not a developer.** End with (a) plain-language test steps, (b) a reminder that nothing is live until he pushes via GitHub Desktop, and that the edge function may need a manual redeploy nudge in Lovable.

### Verified facts to build on
- `supabase/functions/platform-manage-user/index.ts` already exists. It checks `is_platform_admin` via a `platform_admins` lookup and currently supports two actions: `reset_password` and `set_active`. **You are ADDING two more actions to this same file**, in the same style.
- Deleting a user is destructive by cascade: `profiles.id REFERENCES auth.users(id) ON DELETE CASCADE`, and `leads.rep_id` + the entire staff/salary module reference `profiles(id) ON DELETE CASCADE`. So deleting the auth user removes the profile, which **wipes that user's leads and all their staff/salary records**. This is intended behaviour for hard delete, but the UI must warn loudly and require typed confirmation.
- Frontend hooks live in `src/lib/use-platform.ts`; the console user rows are the `UserRow` component in `src/routes/platform.$companyId.tsx`. `invokePlatformFn` in `use-platform.ts` is the helper for calling these functions and surfacing `{ error }` messages.
- `Profile` type is in `src/lib/crm.ts`: `{ id, company_id, full_name, role: "rep"|"manager"|"admin", is_active, rep_number, phone, created_at }`.

---

## 1. Edge function — add two actions to `platform-manage-user`

In `supabase/functions/platform-manage-user/index.ts`, after the existing `set_active` block and before the final `return json({ error: "Unknown action" }, 400);`, add:

### 1a. `update_profile`
```ts
if (action === "update_profile") {
  const { full_name, role, phone } = body as any;
  const patch: any = {};
  if (typeof full_name === "string" && full_name.trim()) patch.full_name = full_name.trim();
  if (role && ["rep", "manager", "admin"].includes(role)) patch.role = role;
  if (typeof phone === "string") patch.phone = phone.trim() || null;
  if (Object.keys(patch).length === 0) return json({ error: "Nothing to update" }, 400);

  const { error: profErr } = await admin.from("profiles").update(patch).eq("id", user_id);
  if (profErr) return json({ error: profErr.message }, 400);

  // Keep the auth display name in sync when the name changes.
  if (patch.full_name) {
    await admin.auth.admin.updateUserById(user_id, { user_metadata: { full_name: patch.full_name } });
  }
  return json({ ok: true });
}
```

### 1b. `delete_user`
```ts
if (action === "delete_user") {
  // A platform admin must never delete their own login from here.
  if (user_id === userData.user.id) return json({ error: "You cannot delete your own account" }, 400);

  // Deleting the auth user cascades: profile → leads → all staff/salary rows.
  const { error: delErr } = await admin.auth.admin.deleteUser(user_id);
  if (delErr) return json({ error: delErr.message }, 400);
  return json({ ok: true });
}
```

> `user_id` and the `target` profile lookup already exist earlier in the function — reuse them; `target` confirms the user exists before either action.

---

## 2. Frontend hooks — `src/lib/use-platform.ts`

Add alongside `useResetUserPassword` / `useSetUserActive`, using the existing `invokePlatformFn` helper. Both should invalidate `["platform_company_users", companyId]` on success so the table refreshes.

```ts
export function useUpdateUserProfile(companyId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { user_id: string; full_name?: string; role?: string; phone?: string }) =>
      invokePlatformFn("platform-manage-user", { action: "update_profile", ...input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["platform_company_users", companyId] }),
  });
}

export function useDeleteUser(companyId: string | undefined) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { user_id: string }) =>
      invokePlatformFn("platform-manage-user", { action: "delete_user", ...input }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["platform_company_users", companyId] }),
  });
}
```

---

## 3. Frontend UI — `UserRow` in `src/routes/platform.$companyId.tsx`

The row currently has: Reset-password dialog + active/disabled Switch. Add an **Edit** dialog and a **Delete** dialog to the actions cell, keeping everything on the one right-aligned row.

### 3a. Edit dialog
- Trigger: a ghost `Button` with a `Pencil` icon ("Edit").
- Fields: full name (`Input`), role (`Select` with rep/manager/admin), phone (`Input`), pre-filled from the `user` prop.
- Save calls `useUpdateUserProfile(companyId)`; toast on success/error (`err instanceof Error ? err.message : "…"`); close on success.

### 3b. Delete dialog (guarded)
- Trigger: a ghost `Button` with a `Trash2` icon, `className="text-destructive"` ("Delete").
- Inside: a clear warning block —
  > "This permanently deletes {name}'s login **and all their data** — their leads and any staff/salary records. This cannot be undone."
- A confirmation `Input`: the user must type the person's exact `full_name` to enable the delete button (`disabled={confirmText !== user.full_name}`).
- Confirm calls `useDeleteUser(companyId)`; on success toast "{name} deleted" and close.
- Import `Pencil`, `Trash2` from `lucide-react` (KeyRound is already imported).

Keep the existing Reset-password and Switch controls exactly as they are. Layout: `<div className="flex items-center justify-end gap-2">` holding Edit, Reset password, Delete, then the Switch — wrap sensibly on small screens.

---

## 4. Verify & handover

- No migration to run this time. The change is: pushed code + the `platform-manage-user` function redeploying.
- **Test script for Harish:**
  1. `/platform` → open a company → a user row now shows **Edit**, **Reset password**, **Delete**, and the enable/disable switch.
  2. **Edit** → change a test user's phone or role → Save → the table updates.
  3. **Delete** on a throwaway test user → the button stays greyed until you type their exact name → confirm → they vanish from the list. (Warn: only do this on a genuinely disposable account — it really does delete their leads/staff records.)
  4. Confirm the **Delete** button is not offered / errors for your own account.
- Remind him: push via GitHub Desktop; if Edit/Delete return "Unknown action", the edge function didn't redeploy — re-trigger it in Lovable (same situation as the earlier platform functions).

**Do not:** write a migration, create new tables, edit `use-assistant.ts` / `use-orders.ts` / `orders*.tsx` / AI worker / `developer.tsx`, or change the existing `reset_password` / `set_active` behaviour.
```

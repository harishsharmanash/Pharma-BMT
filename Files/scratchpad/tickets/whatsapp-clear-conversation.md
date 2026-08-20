# Ticket: "Clear chat" — reset a WhatsApp conversation to a fresh state

## Goal

Add a way to wipe a WhatsApp conversation's history so the bot treats the next inbound message as
a brand-new contact — no memory of prior messages, no gathered lead details carried over. Useful
for testing, and for a company that genuinely wants to restart a stale/confused conversation.

Design: **delete the `whatsapp_conversations` row** (its `whatsapp_messages` rows cascade-delete
automatically — the FK is `ON DELETE CASCADE`, see the schema migration). Do NOT touch the
associated `leads` row — that stays as real historical CRM data. The next inbound message from
that same phone number then goes through `ingestInboundMessage`'s normal "no open conversation
found" path: it creates a fresh conversation AND a fresh lead (the existing dedupe logic in
`findDuplicateLead` will correctly flag it as a duplicate of the old lead by phone number — that's
existing, correct, unrelated behavior, not something this ticket touches).

`whatsapp_conversations` has no client-side DELETE grant (`GRANT SELECT, UPDATE ... TO
authenticated` only — no DELETE), so this must go through a new edge function running as
service_role.

## Files

**Create:** `supabase/functions/whatsapp-clear-conversation/index.ts`

**Edit:**
- `src/lib/use-whatsapp-inbox.ts` — new mutation hook.
- `src/routes/whatsapp.tsx` — the button + confirmation.

**Read only:**
- `supabase/functions/whatsapp-send-message/index.ts` — the auth pattern to copy (JWT →
  `profiles.company_id`/`role`, then verify the conversation belongs to that company).
- `src/components/confirm-delete.tsx` — this project's standing pattern for any destructive
  action; use it exactly as it's used elsewhere rather than a raw `confirm()` or ad-hoc dialog.

## Approach

### 1. `supabase/functions/whatsapp-clear-conversation/index.ts`

Same CORS headers / `json()` helper / auth boilerplate as `whatsapp-send-message/index.ts`. Body:
`{ conversation_id }`.

Authorization: **managers/admins only** — this is a destructive action, deliberately NOT open to
reps even on their own conversations (unlike sending a reply, which reps can do). After resolving
`profile.company_id`/`role`, require `["admin", "manager"].includes(profile.role)`, else 403.

Logic:
1. Look up the conversation by id; 404 if not found or its `company_id` doesn't match the caller's
   company (same "don't leak existence" pattern as `whatsapp-send-message`).
2. `admin.from("whatsapp_conversations").delete().eq("id", conversationId)`.
3. Return `{ ok: true }`.

### 2. `src/lib/use-whatsapp-inbox.ts` — mutation hook

Add alongside the existing hooks:
```ts
export function useClearWhatsappConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (conversationId: string) => {
      const { data, error } = await supabase.functions.invoke("whatsapp-clear-conversation", {
        body: { conversation_id: conversationId },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-conversations"] });
    },
  });
}
```

### 3. `src/routes/whatsapp.tsx` — the button

Add a "Clear chat" action in the thread header, next to the existing Take-over controls and the
new always-on `Switch` added earlier. Use `ConfirmDelete` (check its exact prop signature in
`confirm-delete.tsx` and match it — do not guess at props) wrapping a small icon button (this file
already imports `lucide-react` icons — add `Trash2` if not already imported). On confirm, call
`useClearWhatsappConversation().mutate(selected.id)`; on success, clear the currently-selected
conversation (`setSelectedId(null)`) since it no longer exists, and show a `toast.success("Chat
cleared")`; on error, `toast.error(...)`.

Only render this control for admins/managers — check how this file (or a sibling route) already
reads the caller's role (likely via an existing auth/profile hook already imported elsewhere in
this app; if `whatsapp.tsx` doesn't already have access to the current profile's role, import
`useAuth` from `@/lib/auth-context` the same way other routes in this app do, and gate on
`profile?.role !== "rep"`).

## Constraints

- Do not touch `leads` table data in any way — only the conversation/messages are cleared.
- Do not allow reps to clear a conversation, even their own — admin/manager only, both in the edge
  function (the real enforcement) and in the UI (so a rep doesn't see a button that would just
  403).
- No `Enthrella`/`Acrowell` strings in any new UI text.
- Do not commit.

## Acceptance

- `npx tsc --noEmit` → 0 errors.
- `npm run test` → green, no regressions.
- `git status` → only the three files listed under Create/Edit changed.
- In your report, quote the exact role-check line in the edge function.

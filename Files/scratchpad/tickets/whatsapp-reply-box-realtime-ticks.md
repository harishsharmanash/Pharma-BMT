# Ticket: WhatsApp Inbox — reply box for reps, live updates, delivery ticks

## Goal

The WhatsApp Inbox (`src/routes/whatsapp.tsx`) currently only shows the message thread and a
"Take over" / "Hand back to bot" toggle — there is no way for a rep/manager to actually type and
send a reply. It also requires a manual page refresh to see new messages, and sent messages show
no delivery status (sent/delivered/read), unlike real WhatsApp's tick marks. This ticket adds all
three: (1) a message input + send action, (2) live updates via Supabase Realtime, (3) delivery-tick
icons on outbound messages, using data the backend already captures.

Backend context that matters:
- The Cloudflare Worker (`cerebyl-whatsapp-worker`, a SEPARATE repo, not touched by this ticket)
  already writes inbound messages AND already calls `recordDeliveryStatus` on Meta's status
  webhooks — `whatsapp_messages.delivery_status` is already being populated with values like
  `"sent"`, `"delivered"`, `"read"`, `"failed"` for outbound messages. Nothing needs to change
  there; the UI just needs to render what's already in the column.
- There is currently NO way to send an outbound message from the app at all — no edge function
  does it. This ticket creates one.
- Meta's Cloud API only allows free-form text replies within 24 hours of the customer's last
  inbound message (outside that window it needs an approved template) — do not build any 24h-
  window UI logic in this ticket; just let the send fail with whatever error Meta returns, surface
  it as a toast. That refinement is future work.

## Files

**Create:**
- `supabase/functions/whatsapp-send-message/index.ts` — new edge function.

**Edit:**
- `src/routes/whatsapp.tsx`
- `src/lib/use-whatsapp-inbox.ts`

**Read only:**
- `supabase/functions/whatsapp-manage-templates/index.ts` — copy its auth pattern EXACTLY (JWT →
  `profiles.company_id`/`role` lookup, 403 if no company or role not in `["admin","manager"]` —
  but see the auth note below, this new function's rule is slightly different, read it carefully)
  and its Graph API call pattern (fetch to `https://graph.facebook.com/v21.0/...` with
  `Authorization: Bearer <token>`, token fetched via `get_company_secret` RPC).
- `supabase/migrations/20260901120000_whatsapp_integration_schema.sql` — for the exact shape of
  `whatsapp_conversations` and `whatsapp_messages` (columns, RLS policies) so the new function's
  authorization logic matches what the existing `whatsapp_conversations_update` RLS policy already
  allows: `company_id = current_company_id() AND (is_manager_or_admin() OR rep_id = auth.uid())`.

## Approach

### 1. New edge function `whatsapp-send-message`

Action: takes `{ conversation_id, body }` (no `action` field needed, this function does one thing).

Auth (different from `whatsapp-manage-templates` — reps can use this, not just managers/admins):
1. Get the JWT, resolve `profiles.company_id`/`role` for the caller (same query pattern as
   `whatsapp-manage-templates`).
2. Look up the `whatsapp_conversations` row for `conversation_id`. If it doesn't belong to the
   caller's `company_id`, 404 (don't leak existence). If the caller's role is `"rep"`, additionally
   require `conversation.rep_id === caller's user id` — a rep may only reply on their own
   conversations. Managers/admins may reply on any conversation in their company.
3. If none of the above authorize the caller, 403 with a plain message.

Logic once authorized:
1. Look up the conversation's `number_id` → `company_whatsapp_numbers` row → `phone_number_id`.
2. Look up the conversation's `contact_phone` (the recipient).
3. Fetch the company's access token via `get_company_secret(company_id, 'whatsapp_access_token')`.
4. `POST https://graph.facebook.com/v21.0/{phone_number_id}/messages` with body
   `{ messaging_product: "whatsapp", to: contact_phone, type: "text", text: { body } }` and
   `Authorization: Bearer <token>`.
5. On success, Meta returns `{ messages: [{ id }] }` — insert a new `whatsapp_messages` row:
   `conversation_id`, `direction: 'out'`, `body`, `wa_message_id: <that id>`,
   `delivery_status: 'sent'` (optimistic; the real status webhook will update it later the same
   way it already does today).
6. Update `whatsapp_conversations.last_message_at = now()` for that conversation.
7. On Meta API failure, return the error message from Meta's response body (do not insert a
   message row, do not update last_message_at).

Return `{ ok: true }` on success, `{ error: "..." }` on failure (mirror the `json()` helper pattern
used in `whatsapp-manage-templates/index.ts` — copy it verbatim, same CORS headers too).

### 2. `use-whatsapp-inbox.ts` — new hook + realtime subscriptions

Add `useSendWhatsappMessage()`:
```ts
export function useSendWhatsappMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ conversationId, body }: { conversationId: string; body: string }) => {
      const { data, error } = await supabase.functions.invoke("whatsapp-send-message", {
        body: { conversation_id: conversationId, body },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-messages", variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["whatsapp-conversations"] });
    },
  });
}
```

Add realtime subscriptions so new/updated rows refresh automatically instead of needing a manual
page reload. This codebase does NOT use Supabase Realtime anywhere else yet, so there is no
existing pattern to copy — use this exact shape (standard supabase-js v2 Realtime API):

```ts
export function useWhatsappRealtime(conversationId: string | null) {
  const queryClient = useQueryClient();
  useEffect(() => {
    const channel = supabase
      .channel("whatsapp-inbox")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "whatsapp_conversations" },
        () => queryClient.invalidateQueries({ queryKey: ["whatsapp-conversations"] }),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "whatsapp_messages" },
        (payload) => {
          const row = (payload.new ?? payload.old) as { conversation_id?: string } | null;
          if (row?.conversation_id) {
            queryClient.invalidateQueries({ queryKey: ["whatsapp-messages", row.conversation_id] });
          }
          queryClient.invalidateQueries({ queryKey: ["whatsapp-conversations"] });
        },
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [conversationId, queryClient]);
}
```
(`conversationId` isn't used to filter the subscription itself — RLS already scopes which rows the
client receives — it's only a dependency so the effect re-runs cleanly; that's fine and expected,
don't try to add a server-side filter param that doesn't exist for this table shape.) Import
`useEffect` from `"react"` if not already imported in this file.

Call `useWhatsappRealtime(selectedId)` once near the top of `WhatsAppPage` in `whatsapp.tsx` (the
existing component that already has `selectedId` state) — this single call handles updates for
both the conversation list AND whichever thread is open, no per-conversation subscription needed.

### 3. `whatsapp.tsx` — reply box + delivery ticks

**Reply box**: add a message input row at the bottom of the right-pane `Card` (the thread view),
below the messages `CardContent`, inside the same `Card`. Use `Textarea` or `Input` (this file
already imports `Textarea` for the template form — reuse it) + a `Button` labeled "Send". Local
`useState` for the draft text. On submit: call `useSendWhatsappMessage().mutate(...)`, clear the
input on success, `toast.error(...)` on failure (this file already imports `toast` from "sonner").
Show the reply box whenever a conversation is selected — do not gate it behind `status === "human"`
(a manager should be able to reply without first clicking "Take over"; that's a separate, existing
concern this ticket doesn't change).

**Delivery ticks**: in the message-bubble rendering (the `.map((msg) => ...)` block that renders
each `whatsapp_messages` row), for messages where `msg.direction === "out"`, render a small tick
indicator next to the timestamp based on `msg.delivery_status`:
- `"sent"` → single grey check (`Check` from `lucide-react`, muted color)
- `"delivered"` → double grey check (two overlapping `Check` icons, or `CheckCheck` from
  `lucide-react` if available, muted color)
- `"read"` → double check in blue (`CheckCheck`, `text-blue-500` or similar — match this app's
  existing blue token if one exists, check `tailwind.config`/`styles.css` for a `--color-blue` or
  similar before inventing a raw hex)
- `"failed"` or missing/null → no icon, or a small red indicator if `"failed"` specifically (use
  judgement, this is the least important state to get pixel-perfect)
- Inbound messages (`direction === "in"`) never show a tick — matches real WhatsApp.

## Constraints

- A rep must never be able to send on a conversation that isn't theirs — this is the actual
  security-relevant part of this ticket, get the auth check right and don't skip it to save time.
- Do not modify `cerebyl-whatsapp-worker` (separate repo, out of scope) — the delivery-status data
  it already writes is sufficient for this ticket.
- Do not add any 24-hour-window warning UI or template-fallback logic — out of scope, noted above.
- No `Enthrella`/`Acrowell` strings in any new UI text.
- Do not commit. Leave changes staged for review.

## Acceptance

- `npx tsc --noEmit` → 0 errors.
- `npm run test` → green, no regressions.
- `git status` — only the three files listed under "Create"/"Edit" should show as new/modified.
- In your report, quote the exact auth-check lines from the new edge function that stop a rep from
  sending on a conversation that isn't theirs — I will verify this myself before shipping either
  way, but state it explicitly so I know what to look for.

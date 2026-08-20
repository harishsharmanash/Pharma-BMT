# Ticket: UI toggles for WhatsApp bot "always on"

## Goal

A migration has been applied live adding two columns:
- `company_whatsapp_accounts.bot_always_on` — `boolean NOT NULL DEFAULT false` (company-wide default)
- `whatsapp_conversations.bot_always_on` — `boolean` NULLABLE, NULL = "inherit the company default"

The Cloudflare Worker already honours both (deployed). This ticket adds the two UI controls:

1. **Per conversation** — a toggle in the WhatsApp Inbox thread header, beside the existing
   "Take over" / "Hand back to bot" buttons.
2. **Company-wide default** — a switch on the WhatsApp integration card in Settings →
   Administration.

Why this exists: the bot auto-hands-off once it has gathered a lead's details, which permanently
silences it on that conversation. With always-on set, the bot keeps replying and ONLY a human
clicking "Take over" stops it.

## Files

**Edit:**
- `src/lib/use-whatsapp-inbox.ts` — add a mutation for the per-conversation flag.
- `src/routes/whatsapp.tsx` — the per-conversation toggle.
- `src/lib/use-whatsapp.ts` — add a mutation for the company-wide flag.
- `src/routes/settings.index.tsx` — the company-wide switch, inside the existing
  `WhatsAppSetupCard` component in that file.

**Read only:**
- `src/integrations/supabase/types.ts` — the generated DB types will NOT yet contain the two new
  columns (they were added by a migration applied after the last type regeneration). See the
  "Typing" note below for how to handle that without regenerating.

## Typing note (important)

Because the generated Supabase types are stale, `.update({ bot_always_on: ... })` and reading
`row.bot_always_on` will fail typecheck. Do NOT regenerate types as part of this ticket and do NOT
use `as any` on whole query builders. Instead, cast narrowly at the single point of use, e.g.:
```ts
.update({ bot_always_on: value } as never)
```
and when reading, widen the row once:
```ts
const alwaysOn = (conv as { bot_always_on?: boolean | null }).bot_always_on ?? null;
```
Keep these casts to the minimum number of places needed to compile.

## Approach

### 1. `src/lib/use-whatsapp-inbox.ts` — per-conversation mutation

Add alongside the existing `useSetConversationStatus`:
```ts
export function useSetConversationBotAlwaysOn() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, alwaysOn }: { id: string; alwaysOn: boolean }) => {
      const { error } = await supabase
        .from("whatsapp_conversations")
        .update({ bot_always_on: alwaysOn } as never)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp-conversations"] });
    },
  });
}
```
`fetchConversations` already does `.select("*")`, so the new column comes back automatically — do
not change that query.

### 2. `src/routes/whatsapp.tsx` — per-conversation toggle

In the thread header (the block that currently renders the "Take over" and "Hand back to bot"
buttons for `selected`), add a control for the always-on flag. Use the existing `Switch` component
(`@/components/ui/switch` — check it is imported; add the import if not) with a short label, e.g.
"Keep bot on". Wire it to `useSetConversationBotAlwaysOn()`.

Resolve the displayed value as: the conversation's own `bot_always_on` if it is `true`/`false`,
otherwise fall back to `false` for display purposes (the company default is not fetched in this
view — that is fine; an admin who wants it on everywhere sets the company switch, and this toggle
is the per-conversation override).

Show a `toast.error(...)` on failure using the existing `toast` import in this file.

### 3. `src/lib/use-whatsapp.ts` — company-wide mutation

Add:
```ts
export function useSetCompanyBotAlwaysOn(companyId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (alwaysOn: boolean) => {
      const { error } = await supabase
        .from("company_whatsapp_accounts")
        .update({ bot_always_on: alwaysOn } as never)
        .eq("company_id", companyId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["whatsapp-status", companyId] }),
  });
}
```
This file already imports `useMutation`, `useQueryClient` and `supabase` — reuse them.

Also extend the exported `WhatsappAccount` type in this file with:
```ts
  bot_always_on: boolean;
```
The `status` action in the edge function returns `select("*")` on that table, so the value is
already present in the response — no edge-function change is needed.

### 4. `src/routes/settings.index.tsx` — company-wide switch

Inside the existing `WhatsAppSetupCard` component in this file, add a `Switch` row labelled
"Keep the bot replying until someone takes over" with a short `text-ios-footnote
text-muted-foreground` helper line explaining that the bot otherwise stops once it has collected a
lead's details.

Render it only when a number is actually connected (i.e. inside the same area as the numbers
table, where `numbers.length > 0`) — the setting is meaningless before WhatsApp is connected.

Wire it to `useSetCompanyBotAlwaysOn(company.id)` and read the current value from
`status?.account?.bot_always_on ?? false`. `Switch` is already imported in this file; `Label` is
too.

## Constraints

- Do not change the Worker (separate repo, already deployed and correct).
- Do not change the `whatsapp-send-message` or `whatsapp-embedded-signup-callback` edge functions.
- Do not regenerate `src/integrations/supabase/types.ts`.
- No `Enthrella`/`Acrowell` strings in any new UI text.
- Do not commit.

## Acceptance

- `npx tsc --noEmit` → 0 errors.
- `npm run test` → green, no regressions.
- `git status` → only the four files listed under "Edit" modified.
- In your report, list every place you added a type cast for the stale generated types, so the
  blast radius of those casts can be reviewed.

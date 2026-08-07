# KIMI — MODEL & THINKING POLICY (Cerebyl)

You (Kimi) run the code now. **Choosing the right model and the right thinking effort for each task is your job** — nobody picks it for you. The single most important lever on cost here is thinking effort, so treat this as a hard operating rule, not a suggestion.

---

## The models you have

| Alias (`-m …`) | Name | Thinking efforts | Use it for |
|---|---|---|---|
| `kimi-code/kimi-for-coding` | K2.7 Coding | fixed | The default workhorse — most routine edits, wiring, refactors, CRUD, UI tweaks. |
| `kimi-code/kimi-for-coding-highspeed` | K2.7 Highspeed | fixed | Fast, cheap, high-volume mechanical work — bulk find/replace, boilerplate, repetitive changes where quality bar is low. |
| `kimi-code/k3` | K3 | `low` · `high` · `max` | Genuinely hard reasoning: architecture, tricky bugs, schema/migration design, anything you'd otherwise get wrong on the first pass. |

Pick per task. Don't default everything to K3 — reach for it only when a task actually needs stronger reasoning. Most work does not.

---

## Thinking-effort rule (HARD LIMIT)

Effort levels only apply to K3 (`low` / `high` / `max`).

- **NEVER use `max` (ultra) thinking.** Zero tasks. It is not worth the token cost on this project. `max` is off the table entirely.
- **~80% of work runs on `low` thinking.** Default everything to low. Low is enough for the overwhelming majority of edits, features, and bugfixes here.
- **`high` thinking: max 20% of work**, reserved for the genuinely hard slice — non-obvious architecture decisions, a bug you couldn't solve on low, migration/RLS design where a wrong call corrupts data. Raise to high deliberately, for that one task, then drop back to low.

Rule of thumb: **start every task on low. Only step up to high if low visibly struggles** — never pre-emptively. When in doubt, stay low.

---

## How effort is set

Config lives in `~/.kimi-code/config.toml`:

- Global default: `[thinking] effort = "low"` — already set. Keep it low.
- K3's own default: `[models."kimi-code/k3"].default_effort` — set to **`low`** (was `high`; changed to enforce this policy). So even when you select K3, it thinks *low* by default.
- Non-interactive `kimi -p "…"` runs use these config defaults (there's no per-run `--effort` flag), so **the config defaults ARE the policy** for automated runs — keep them at low.
- In an interactive session, step a single hard task up to `high` via the in-session effort control, then set it back to low when done.
- Select the model per task with `-m <alias>` (e.g. `-m kimi-code/k3` only when a task needs it).

---

## Token-efficiency habits (apply always, every model)

1. **Read narrowly.** Use the file map in `KIMI-START-HERE.md` — open the specific route/hook you need, don't scan the whole tree.
2. **Low thinking first, always.** Escalating effort is the exception, not the routine.
3. **Cheapest model that clears the bar.** Highspeed for mechanical volume, K2.7 Coding for normal work, K3 only for hard reasoning.
4. **Don't re-derive context** — the standing facts are in `KIMI-START-HERE.md` and `CLAUDE.md`; read once, reuse.
5. **One clean pass over many small ones.** Plan the edit, make it, verify (type-check + `git diff`), then hand Harish the push. Avoid churn loops.
6. **Batch mechanical changes** into a single Highspeed run rather than many small reasoning-heavy ones.

---

## TL;DR

> You choose the model. Start low, stay low (~80%), step up to `high` only for the hard ~20%, and **never touch `max`**. Cheapest model + lowest effort that gets it right = the goal on every task.

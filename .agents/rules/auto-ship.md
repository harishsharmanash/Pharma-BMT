# Push & deploy rule

Follow `CLAUDE.md` §2b (the green-light checklist) — see `AGENTS.md` at the project root.

Harish (28 Sep 2026): push and ship automatically only what is verified safe — every §2b green-light line true. Anything on the §2b red list (unapplied migrations, RLS/auth/live data, secrets/env, typecheck baseline, large refactors, anything skipped or ambiguous) needs his OK first. Never force-push. Frontend deploys only via `./scripts/ship.sh` from the main `leadenthrella` checkout, confirmed `SHIPPED ✓` and checked live.

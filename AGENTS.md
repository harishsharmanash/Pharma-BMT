# AGENTS.md

Read **`CLAUDE.md`** in this directory first — it is the canonical project instruction file. If anything here disagrees with it, `CLAUDE.md` wins.

## Push & deploy rule (Harish, 28 Sep 2026)
"Follow CLAUDE.md, but you can push things automatically that you see are safe and you are positive can be pushed."

- **Push and ship without asking** only when every line of the green-light checklist in `CLAUDE.md` §2b is true (gates pass, clean tree, full diff read, tests pass, Worker/prompt/DB changes deployed and verified live, any migration already applied).
- **Always ask first** for anything on the §2b red list: unapplied migrations, RLS/auth/grants/live data, secrets or env changes, the typecheck baseline, huge refactors, anything skipped or ambiguous, and never force-push or rewrite history.
- Frontend deploys go through `./scripts/ship.sh` from the main `leadenthrella` checkout only; confirm `SHIPPED ✓` and check the live page before calling it done.
- After pushing, report the commit range and what was verified.

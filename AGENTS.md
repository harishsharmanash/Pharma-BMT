# AGENTS.md

Read **`CLAUDE.md`** in this directory first — it is the canonical project instruction file.

## Standing Deployment Rule (User Directive)
After making and verifying any code changes to the frontend (`leadenthrella`):
1. **Commit & Push**: Commit the changes with a concise message and push to `origin/main`.
2. **Auto-Ship to Production**: Automatically run `./scripts/ship.sh` from `leadenthrella`. Do not pause to ask the user whether to ship; deploy automatically so the user can verify in the live app.
3. **Verify Live**: Confirm the propagation check finishes (`SHIPPED ✓`) before concluding the task.

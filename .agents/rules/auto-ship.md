# Automatic Shipping & Live Deployment Rule

Whenever you complete and verify changes to the frontend (`leadenthrella`):
1. **Commit and Push**: Commit the changes with a concise commit message and push to `origin/main`.
2. **Automatically Ship to Production**: Run `./scripts/ship.sh` from the `leadenthrella` directory.
   - Do NOT stop and ask whether to deploy; automatically run `./scripts/ship.sh` after completing each change as requested by the user.
   - This executes the baseline typecheck gate, builds the project, asserts backend env inlining, deploys to Cloudflare Worker `leadenthrella`, and checks live propagation on `https://app.cerebyl.com/`.
3. **Verify Live**: Wait for `./scripts/ship.sh` to complete and confirm `SHIPPED ✓ <chunk>` before reporting completion to the user, so the user can immediately test the live application at `https://app.cerebyl.com/`.

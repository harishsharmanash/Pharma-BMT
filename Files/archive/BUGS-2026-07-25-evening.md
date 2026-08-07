# Bug + feature queue (reported 25 Jul 2026 evening)

Raised by Harish from live use. Ordered by severity. Items marked **[TESTED FRI]** were attempted in the Kimi context-reuse experiment; everything else is for Monday.

> ## STATUS — worked 28 Jul 2026
>
> | # | Item | State |
> |---|---|---|
> | 1 | Order line items not selectable | **SHIPPED** (was already fixed 25 Jul, `5d9aa29`) |
> | 2 | Booked Areas PDF distorted map | **SHIPPED** `b884cc5` |
> | 3 | Ceremate "not sure about that" deflection | **SHIPPED** `686c550` |
> | 4 | Ceremate drops the product | **SHIPPED** `2ffd105` (+ worker deploy, Tier-1 cache purged) |
> | 5 | Zoom breaks layout / footer detaches | **SHIPPED** `5517b45` — needs Harish's eyes, see below |
> | 6 | Sidebar collapse button jumps | **SHIPPED** `5517b45` — pinned to sidebar bottom |
> | 7 | Territory own screen | **SHIPPED** — migration applied, screen live, all consumers ported (`e8428a2`…`74e34ee`) |
> | 8+9 | Activity log + rep ID | **SHIPPED** — migration applied by Harish, UI live (`8e5e4b8`, `751e81a`) |
> | 10 | Leads: remove download, add template | **SHIPPED** `5d4bc7b` + `e94c88f` + `3c73dde` |
>
> **Needs Harish:**
> - **Items 5 + 6 are visual and sit behind login**, so they were verified by code review and build only, not by looking at the live page. Worth a glance at `app.cerebyl.com` on a zoomed-out window.
>
> **Cleared 28 Jul (later session):** nested pack-size variants, row-level delete relocation, and
> dropping the dead `monopoly_*` columns are all done — see `CLIENT-BACKLOG.md` for what remains.
>
> - **The daily purge is still not SCHEDULED** (`SCHEDULE-daily-purge.md`, needs `CRON_SECRET`). `platform-purge-old-data` now purges the activity log at 90 days as well as trash at 30 — deployed and verified (function v9) — but nothing invokes it automatically, so neither retention promise is actually kept yet.
> - **Activity log is live but only starts from now** — triggers cannot know what happened before they existed, so the page is empty until people use the app.
>
> **Found along the way (not in the original list):**
> - The Leads header Excel/CSV buttons checked **no permission at all** — only the selection bar honoured `leads.export`. A rep without the permission could download every lead they could see. Closed in `5d4bc7b`.
> - **Item 9 was already built at DB level**: `profiles.rep_number` has been auto-assigned per company since the first migration and already backs `lead_code`. No new column needed — only surfacing it as R-014.

---

## P0 — blocks real work

### 1. Order line items: clicking a product does not select it **[TESTED FRI]**
`src/routes/orders.index.tsx` (~line 880-1000, the line-item ProductPicker).
Search works and results appear, but clicking a result does not fill the row — then "Save Order" reports "Add at least one line item" even though qty/rate/amount are visibly filled. **Orders cannot be created at all through the form.**
Not caused by the Combobox work — this is the pre-existing custom typeahead (Input + `createPortal` dropdown), not the new `Combobox`. The click handler (`onPick(p); setQuery(p.name); setOpen(false)`) and the outside-click guard (which already checks `insideDropdown`) both *look* right, so the fault is subtler — likely the portal item unmounting before `onClick` fires (a `mousedown`-ordering problem), or `onPick` not writing to the row's state.

---

## P1 — wrong output / data integrity

### 2. Booked Areas PDF exports a distorted map
The exported PDF shows the circle in one place and the pin in another; on screen they coincide. Almost certainly the html2canvas capture running before Leaflet finishes re-rendering tiles/overlay at the export size, or a CSS-transform offset not accounted for. Compare with the invoice-JPG fix (dedicated off-screen node at a fixed width) — the same approach probably applies.

### 3. Ceremate answers "I'm not sure about that specific thing"
"what can you do?" and "how do i give monopoly to a party?" both fall through to the generic Help deflection. The second is a legitimate `app_help` question about a feature that exists. Needs an `app_help` answer path with real content, not a deflection.

### 4. Ceremate picks the party but drops the product
"Metro care Pharma ke liye naya order bnao Shilajit ka unko 20 dabbe chahie normal rate per" → resolves the party and opens the order form, but Shilajit / qty 20 are lost. `start_order` deliberately carries party only. Either extend it to pass line-item hints, or say plainly in the reply that items still need adding.

---

## P2 — UI / layout

### 5. Zoom breaks the layout
Zooming in/out overlaps elements; the "You are using Cerebyl / Business tool only" footer detaches and slides to the bottom of the page instead of staying pinned in the sidebar.

### 6. Sidebar collapse button jumps
Normally beside the Acrowell branding on the top bar; once collapsed it moves to just above Dashboard and pushes the whole nav down. **Decision: pin it permanently to the bottom of the sidebar**, near where the Cerebyl footer sits.

---

## P3 — features

### 7. Territory / monopoly needs its own screen
Today it is a cramped section inside the party edit dialog. Wanted:
- A **"Territory"** button on the party's main page opening a full screen: **big map on the right half, controls on the left** (Google-Maps style).
- Monopoly grantable per **Products / Division / Range(Category)** — picking the type swaps the next control to a searchable picker for that type (products search, division dropdown-search, category dropdown-search).
- When blocking an area, allow **state / district / pincode / drop-a-pin**; dropping a pin draws the radius circle.
- **Show other parties' territories on the same map in different coloured circles**, so overlaps are visible while assigning.

### 8. System activity log (admin only)
An area where an admin sees **who did what** — every meaningful action: edits, downloads/exports, deletes, restores, logins. Needs a decision on granularity ("every click" is not realistic to store; every *action* is).

### 9. Rep / user ID for traceability
Each user gets a stable short ID recorded against every logged action — every export, edit, delete — so the log reads as "R-014 exported leads" rather than a UUID.

### 10. Leads: remove download, add an upload template
The Leads buttons were built for **uploading** leads, not downloading them; a download path there is unwanted (also a data-exfiltration concern — `leads.export` already exists as a permission and reps do not have it). Add a **downloadable template file** for bulk lead upload instead.

---

## Notes
- Items 8 + 9 belong together — build the ID first, then the log that references it.
- Item 7 is the largest; it needs a design pass before a ticket.
- Item 1 is the only one that blocks daily work — everything else has a workaround.

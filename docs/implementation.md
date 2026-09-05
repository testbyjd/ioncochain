# Implementation notes

## Structure

- `app/`: public and workspace route entry points and layouts; real Next.js App Router routes.
- `components/ionco/marketing.tsx`: public site and anchored sections.
- `components/ionco/app-shell.tsx`: desktop sidebar, mobile navigation, workspace header.
- `components/ionco/dashboard.tsx`: member views and transaction flows.
- `components/ionco/admin.tsx`: administration demo views.
- `components/ionco/shared.tsx`: reusable dialogs, table, receipts, CSV export, wallet and network reference flows.
- `components/ionco/chart.tsx`: accessible SVG visualization of labeled synthetic series.
- `components/ionco/demo-provider.tsx`: shared browser state, validation, and storage.
- `lib/demo-engine.ts`: pure state transitions and domain guards.
- `lib/ionco-data.ts`: source facts, allocation percentages, demo seed records, and formatters.

## Mobile decisions

Desktop workspace navigation becomes a drawer and a five-item bottom navigation bar below 768px. Admin also offers a page selector for the longer navigation list. Tables scroll within their panel without forcing the page wider. Forms use decimal/numeric input modes, and primary inputs are at least 16px on mobile to avoid automatic text-field zoom.

Core forms use shadcn/Radix dialogs, confirmations, selects, tabs, switches, sheets, and tables. Focus indicators and the skip link are retained. The generated hero is delivered as a 59 KB mobile WebP and a 147 KB desktop WebP. The variable font is approximately 25 KB. All decorative motion is disabled when reduced motion is preferred, and the hero is static on mobile.

## State model

All financial operations are pure transitions, with a current-state reference preventing a second click from applying against a stale React render. Balances are rounded to eight decimal places. The 0.5% initial demo fee is included in buy affordability and deducted from sell proceeds. An unlocked withdrawal closes the entire position and returns principal plus unclaimed rewards.

Admin pool changes preserve already-open positions. Product pause flags and sample account suspension are checked in domain logic as well as represented in the UI. The client contains no wallet SDK, credentials, blockchain writes, or external transaction calls.

CSV downloads escape quotes and neutralize spreadsheet-formula prefixes in string cells. Export controls use the currently filtered data. Saved state is schema validated; errors do not silently replace unreadable local data. Reset requires explicit confirmation.

## Deployment boundary

The private preview uses the bundled Vinext/Cloudflare build. The repository also supports standard Next.js scripts. The admin route is deliberately a demo without authentication. Do not mistake private preview access, frontend controls, or browser storage for a production authorization or custody implementation.

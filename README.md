# IONCO SmartChain

A mobile-first redesign of [ioncochain.com](https://ioncochain.com), with a public website, an interactive staking and trading dashboard, and an administration demo.

## Stack

- Next.js 16 App Router, React 19, and TypeScript
- Tailwind CSS 4 and shadcn/ui (Radix primitives)
- Locally hosted variable Manrope font; responsive WebP hero artwork
- Vinext / Cloudflare Workers build for the private review deployment

This is an interactive **frontend demo**. Wallets, staking products, prices, trades, identities, and admin permissions are simulated. No PHP server is required for the mock experience. There are no wallet signatures, live orders, deposits, private keys, or server-side accounts.

## Run with Next.js

Node.js 22.13 or later is required.

```bash
npm ci
npm run dev:next
```

For a production-mode Next.js build:

```bash
npm run build:next
npm run start:next
```

The Next.js app uses the same route components and styles as the private review build. To build the Cloudflare-compatible review version, run `npm run build`.

## Routes

| Route                 | Experience                                                                                      |
| --------------------- | ----------------------------------------------------------------------------------------------- |
| `/`                   | Public website, ecosystem, staking introduction, tokenomics, historical roadmap, FAQ, resources |
| `/dashboard`          | Portfolio overview, allocation, illustrative history, pools, recent activity                    |
| `/dashboard/staking`  | Pool selection, review/confirm, positions, unlock rules, reward claims                          |
| `/dashboard/trade`    | Buy/sell INC, fixed demo rate, fees, quote review, simulated settlement                         |
| `/dashboard/wallet`   | Asset balances, connection, network reference, safe receive preview                             |
| `/dashboard/activity` | Search, filter, paginate, inspect, export transactions                                          |
| `/dashboard/settings` | Demo wallet, preferences, network details, confirmed reset                                      |
| `/dashboard/help`     | Demo explanation and source resources                                                           |
| `/admin`              | Overview, review queue, product controls, integration readiness                                 |
| `/admin/users`        | Search/filter members, sample KYC review, suspend/restore                                       |
| `/admin/wallets`      | Sample holdings and wallet overview                                                             |
| `/admin/transactions` | Searchable and exportable local ledger                                                          |
| `/admin/staking`      | Edit pool names, rates, lock periods, minimums, availability                                    |
| `/admin/content`      | Edit and preview homepage copy locally                                                          |
| `/admin/settings`     | Trading/staking availability, maintenance, demo price and fee                                   |
| `/admin/audit`        | Search and export local administrative events                                                   |

Unknown routes render a branded 404.

## Demo behavior

The domain logic is isolated in `lib/demo-engine.ts`. It validates wallet connection, balances, fee-inclusive quotes, minimum stakes, lock timestamps, maintenance, and sample account suspension. Pool edits apply only to new positions. Withdrawing a position returns its principal and unclaimed rewards. Claims cannot be replayed.

`components/ionco/demo-provider.tsx` validates saved records with Zod and persists them under `ionco-demo-v1` in browser storage. Open tabs receive storage updates. Storage failures preserve the current session and surface a notice; invalid saved records are not silently overwritten. Resetting restores all sample data, including admin changes.

Rewards are seeded examples and do not accrue with real time. Price charts are explicitly illustrative. Simulated INC and USDT balances are not recoverable assets. Admin is an openly accessible demo route and supplies **no production authorization boundary**.

The `Receive demo` flow clearly warns against deposits and copies a reference prefixed with a warning rather than offering a live deposit address or payment QR.

## Source fidelity

Content was reviewed on September 5, 2026. See [the source audit](docs/source-audit.md) for URLs, source facts, and inconsistencies. INC, chain ID 13152, Proof of Authority, original allocation percentages, founder information, and historical roadmap targets come from IONCO’s existing website.

Current market prices, verified contract addresses, live APYs, current roadmap completion, real users, and live network health were unavailable and are not asserted. The legacy HTTP RPC is displayed for reference only and is never called or automatically added to a wallet.

## Verification

```bash
npm run typecheck
npm run test:logic
npm run build
npm run test:render
```

`npm test` builds the review version and runs the domain, route-rendering, and reusable UI smoke tests. Tests cover financial boundary conditions and all 16 routes. Browser interaction and device screenshot QA are not part of these automated checks.

## Moving beyond the demo

Before handling real users or funds, replace the demo provider with authenticated server endpoints and reviewed wallet/contract integrations. Add server-enforced admin roles, durable transactional storage, immutable audit records, verified network configuration, agreed staking terms, and exchange/payment/KYC integrations as applicable. A PHP 8.2 API can serve this boundary if that is the chosen backend; no unconnected PHP placeholder is presented as a working service here.

The design supports keyboard focus, dialog focus trapping, touch navigation, reduced motion, local fonts, responsive imagery, and horizontally scrollable data tables. Generated hero artwork is a decorative brand asset, not a diagram of the real network.

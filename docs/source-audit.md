# IONCO source audit

Reviewed: **2026-09-05**. These are published project statements, not an independent verification of the network, token, listings, or financial claims.

## Sources and their use

| Source                                                | Information retained                                                                                                                        |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| https://ioncochain.com/                               | Name, ecosystem themes, approximate supply, allocation percentages, historical roadmap, founder/founding date, resource and community links |
| https://ioncochain.com/add-ionco-network/             | Network name, chain ID 13152, INC, IRC20, legacy RPC, explorer URL                                                                          |
| https://ioncochain.com/ionco-smartchain/              | Proof of Authority, smart contracts, dApps, tokenization, NFTs, intended interoperability                                                   |
| https://ioncochain.com/system%27s-infrastructure/     | Historical topology: two validators and one storage/monitoring node; references to eth-netstats                                             |
| https://ioncochain.com/roi-benefits/                  | Intended coin purchase/sale workflows, presale identity requirements, and uncertainty around listings/timelines                             |
| https://ioncochain.com/downloads/ionco-whitepaper.pdf | Original whitepaper download retained as a first-party resource                                                                             |

## Published network configuration

| Field       | Published value              | Treatment                                                          |
| ----------- | ---------------------------- | ------------------------------------------------------------------ |
| Network     | IONCO SmartChain             | Retained                                                           |
| Coin        | INC                          | Retained                                                           |
| Standard    | IRC20                        | Presented as the project's terminology                             |
| Consensus   | Proof of Authority           | Retained; not replaced with Proof of Stake                         |
| Chain ID    | 13152                        | Retained                                                           |
| RPC         | `http://134.209.231.57:8545` | Legacy, unverified, displayed only; no requests or wallet addition |
| Explorer    | https://scan.ioncochain.com  | Original external link; availability not asserted                  |
| Founder     | Corodeanu Ionel              | Original website FAQ                                               |
| Established | November 2023                | Original website FAQ                                               |

## Token allocation inconsistency

The original homepage lists the following. Its allocation percentages sum to 100%, but its coin quantities do not correspond to those percentages.

| Allocation       | Published percentage | Published quantity (INC) |
| ---------------- | -------------------: | -----------------------: |
| Team             |                   6% |                9,399,456 |
| Project          |                  12% |               17,670,977 |
| Marketing        |                   8% |               10,366,973 |
| Sale             |                  44% |               93,342,400 |
| Company reserves |                  18% |              104,913,770 |
| Locked liquidity |                  12% |               14,306,423 |

The listed quantities total **249,999,999 INC**. The homepage FAQ describes **250 million**; the whitepaper states **250,000,002**. For example, 9,399,456 is not 6% of 250 million.

The redesigned chart uses only the originally stated percentages. It labels supply as approximately 250M and discloses the inconsistency with a source link. It does not fabricate corrected amounts or claim the allocation is verified on-chain.

## Historical roadmap

The homepage dates the foundation to 2023 and subsequent platform, chain, explorer, website/ICO, and listing plans to 2024. The redesign preserves those dates as historical targets. It does not mark releases completed, invent new 2026 dates, or claim a live exchange listing.

## Explicitly simulated data

- Demo INC price: 0.42 USDT initially; editable in admin.
- Demo transaction fee: 0.5% initially; editable in admin.
- Flexible / Growth / Conviction pools: illustrative APYs 5.2% / 8.4% / 12.8%; 0 / 30 / 90 day lock periods.
- Starting balances, positions, seeded rewards, chart series, transactions, and member identities.
- All example emails use `example.com`.
- Wallet connection choices are simulated UI flows, not installed wallet-provider integrations.
- Demo product staking is not represented as participation in the published Proof of Authority consensus.
- No KYC, payment, live exchange, wallet signature, deposit, or on-chain execution is implemented.

## Community links from the source homepage

- Telegram: https://t.me/+FxQ-jbWIuBZiZjM0
- X: https://twitter.com/IoncoChain
- Discord: https://discord.gg/BjFP3uPtz7
- LinkedIn: https://www.linkedin.com/in/ionco-chain-474b34257

The source used HTTP for some social links; the redesign uses the equivalent HTTPS destinations. These links are retained without asserting activity, affiliation beyond the source's claim, or current invitation validity.

## Original visual assets

The cyan glass orbit was generated specifically for this redesign and optimized into local WebP assets. The hero is decorative, not factual imagery. The Manrope variable font is served locally. No old theme artwork, brand endorsements, testimonials, financial performance claims, or fake live network statistics were invented.

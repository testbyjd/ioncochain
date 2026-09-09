"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Orbit,
  Layers3,
  Globe2,
  Coins,
  ShieldCheck,
  Hash,
  Menu,
  Info,
  ChevronDown,
  Pause,
  Play,
  Wallet,
  ArrowLeftRight,
  Send,
  MessageCircle,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetHeader,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ALLOCATIONS, LINKS, NETWORK } from "@/lib/ionco-data";
import { useDemo } from "./demo-provider";
import { Logo, NetworkDialog } from "./shared";
import {
  HomepageMotion,
  QuickAccess,
  EcosystemSection,
  UseCasesSection,
  NetworkSection,
  BuilderSection,
} from "./marketing-sections";
const navigation = [
  { label: "Ecosystem", href: "/#ecosystem" },
  { label: "Network", href: "/#network" },
  { label: "INC coin", href: "/#tokenomics" },
  { label: "Builders", href: "/#builders" },
  { label: "Roadmap", href: "/#roadmap" },
];
const roadmap = [
  {
    year: "2023",
    phase: "01",
    title: "The foundation",
    description:
      "A core team, a shared vision, market research, and the first version of the IONCO platform.",
  },
  {
    year: "2024",
    phase: "02",
    title: "Platform development",
    description:
      "Smart contract integration, tokenization, and platform improvements informed by user feedback.",
  },
  {
    year: "2024",
    phase: "03",
    title: "SmartChain launch",
    description:
      "The planned introduction of IONCO SmartChain, INC, exchange integration, and governance.",
  },
  {
    year: "2024",
    phase: "04",
    title: "Explorer release",
    description:
      "Network visibility, platform improvements, and a focus on building the IONCO community.",
  },
  {
    year: "2024",
    phase: "05",
    title: "Website & ICO portal",
    description:
      "A simpler way to explore the ecosystem and access information about token sale participation.",
  },
  {
    year: "2024",
    phase: "06",
    title: "INC launch & listing",
    description:
      "Planned launchpad participation and exchange listings to support coin distribution and liquidity.",
  },
];
const faqs = [
  {
    q: "What is IONCO SmartChain?",
    a: "IONCO is a blockchain ecosystem established in November 2023 by Corodeanu Ionel. The original project describes a network for smart contracts, decentralized applications, and digital assets, powered by its native INC coin.",
  },
  {
    q: "What can I do with INC?",
    a: "INC is described as the ecosystem’s native currency for transactions, smart contract execution, and access to network services. This preview lets you explore simulated buying, selling, wallet balances, and staking.",
  },
  {
    q: "Is the staking dashboard live?",
    a: "This is an interactive demo. Wallet connections, balances, prices, APYs, and rewards are simulated. Nothing is sent to a blockchain, and no real money is used. Staking product terms and a deployed contract still need to be confirmed by IONCO.",
  },
  {
    q: "How does the network work?",
    a: "IONCO’s technology page describes Proof of Authority consensus and the IRC20 standard. The published chain ID is 13152. You can view the original configuration using Network details below; the legacy RPC’s availability is unverified.",
  },
  {
    q: "Where can I read the whitepaper?",
    a: "The original IONCO whitepaper is linked in Resources and the footer. It contains the project’s vision, planned use cases, and token distribution. Some supply figures differ between its tables and percentages, so the distribution chart here retains only the original allocation percentages.",
  },
  {
    q: "How do I keep up with the project?",
    a: "Use the Telegram, X, LinkedIn, and Discord links from the original website. Historical roadmap dates are shown for context; they do not confirm that a planned release or listing has happened.",
  },
];
export function MarketingSite() {
  const { state } = useDemo();
  const [networkOpen, setNetworkOpen] = useState(false);
  const [motionPaused, setMotionPaused] = useState(false);
  return (
    <div className="marketing-site marketing-v2">
      <HomepageMotion />
      <div className="scroll-progress" aria-hidden="true" />
      <header className="site-header">
        <div className="container-wide">
          <Logo />
          <nav aria-label="Main navigation" className="site-nav">
            {navigation.map((n) => (
              <Link key={n.href} href={n.href}>
                {n.label}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1.5">
                Resources <ChevronDown size={12} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-48">
                <DropdownMenuItem asChild>
                  <a href={LINKS.whitepaper} target="_blank" rel="noreferrer">
                    Whitepaper <ArrowUpRight />
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setNetworkOpen(true)}>
                  Network details <Globe2 />
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={LINKS.explorer} target="_blank" rel="noreferrer">
                    Block explorer <ArrowUpRight />
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/#faq">FAQs</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
          <div className="site-header-actions">
            <Link href="/dashboard" className="btn-primary">
              Launch app <ArrowUpRight />
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open navigation"
                  className="mobile-menu"
                >
                  <Menu size={21} />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-[#0b161b] border-[#30444d] w-[min(85vw,360px)]">
                <SheetHeader className="pt-9 px-6">
                  <SheetTitle>Explore IONCO</SheetTitle>
                  <SheetDescription>A new dimension of Web3.</SheetDescription>
                </SheetHeader>
                <nav
                  className="flex flex-col gap-2 px-6 py-6"
                  aria-label="Mobile navigation"
                >
                  {[
                    ...navigation,
                    { label: "FAQs", href: "/#faq" },
                    { label: "Dashboard", href: "/dashboard" },
                  ].map((n) => (
                    <SheetClose asChild key={n.href}>
                      <Link
                        href={n.href}
                        className="py-4 border-b border-white/10 text-base flex justify-between"
                      >
                        {n.label}
                        <ArrowUpRight size={17} />
                      </Link>
                    </SheetClose>
                  ))}
                  <a
                    href={LINKS.whitepaper}
                    target="_blank"
                    rel="noreferrer"
                    className="py-4 text-base"
                  >
                    Whitepaper ↗
                  </a>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main id="main">
        <section className="hero">
          <div className="container-wide hero-layout">
            <div className="hero-copy reveal">
              {state.content.announcement && (
                <a className="announcement" href="#ecosystem">
                  <span>INTRODUCING</span>
                  {state.content.announcement}
                  <ArrowRight />
                </a>
              )}
              <h1>
                {state.content.headline.split("\n").map((line, i) => (
                  <span key={i}>
                    {i > 0 && <br />}
                    {i > 0 ? <em>{line}</em> : line}
                  </span>
                ))}
              </h1>
              <p className="hero-description">{state.content.description}</p>
              <div className="hero-buttons">
                <Link href="/dashboard" className="btn-primary">
                  Explore the app <ArrowUpRight />
                </Link>
                <a
                  href={LINKS.whitepaper}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary"
                >
                  Read whitepaper <ArrowRight />
                </a>
              </div>
              <div
                className="hero-capabilities"
                aria-label="IONCO ecosystem themes"
              >
                <span>
                  <Layers3 /> Smart contracts
                </span>
                <span>
                  <Coins /> Digital assets
                </span>
                <span>
                  <Globe2 /> Connected experiences
                </span>
              </div>
            </div>
            <div className="hero-visual" data-paused={motionPaused}>
              <picture>
                <source
                  media="(max-width:767px)"
                  srcSet="/images/ionco-orbit-mobile.webp"
                />
                <img
                  src="/images/ionco-orbit.webp"
                  width="1536"
                  height="1024"
                  fetchPriority="high"
                  alt="Sculptural glass orbit illuminated in electric cyan"
                  className="hero-art"
                />
              </picture>
              <div className="hero-visual-top">
                <span>
                  <Orbit /> IONCO SMARTCHAIN
                </span>
                <button
                  onClick={() => setMotionPaused(!motionPaused)}
                  aria-label={
                    motionPaused
                      ? "Play ambient animation"
                      : "Pause ambient animation"
                  }
                >
                  {motionPaused ? <Play /> : <Pause />}
                </button>
              </div>
              <div className="hero-orbit-label">
                <span>INC</span>
                <div>
                  ONE NATIVE ASSET
                  <br />
                  <strong>A world of possibilities.</strong>
                </div>
              </div>
              <div className="hero-network-card">
                <div className="hero-card-heading">
                  <span>THE FOUNDATION OF IONCO</span>
                  <button
                    onClick={() => setNetworkOpen(true)}
                    aria-label="View published network details"
                  >
                    <ArrowUpRight />
                  </button>
                </div>
                <dl>
                  <div>
                    <dt>Native coin</dt>
                    <dd>INC</dd>
                  </div>
                  <div>
                    <dt>Consensus</dt>
                    <dd>PoA</dd>
                  </div>
                  <div>
                    <dt>Chain ID</dt>
                    <dd>{NETWORK.chainId}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </section>
        <section className="network-strip" aria-label="Published network facts">
          <div className="container-wide network-stats">
            {[
              {
                icon: Coins,
                value: "250M",
                label: "INC · stated supply, approx.",
                countTo: 250,
                countSuffix: "M",
              },
              {
                icon: Orbit,
                value: "2023",
                label: "Established in November",
              },
              { icon: ShieldCheck, value: "PoA", label: "Proof of Authority" },
              {
                icon: Hash,
                value: "IRC20",
                label: "Published token standard",
              },
            ].map((s) => (
              <div className="network-stat" key={s.value}>
                <div className="stat-top">
                  <s.icon />
                  <strong
                    data-count-to={s.countTo}
                    data-count-suffix={s.countSuffix}
                  >
                    {s.value}
                  </strong>
                </div>
                <p>{s.label}</p>
              </div>
            ))}
          </div>
        </section>
        <div className="container-wide">
          <QuickAccess />
          <EcosystemSection />
          <UseCasesSection />
          <NetworkSection onNetworkDetails={() => setNetworkOpen(true)} />
          <section className="staking-intro" id="staking" data-reveal>
            <div>
              <div className="eyebrow">04 / EXPLORE THE APP</div>
              <h2>
                Your next move.
                <br />
                All in one place.
              </h2>
              <p>
                A clearer view of your assets. Explore staking pools, preview a
                trade, and follow every move from your own IONCO dashboard.
              </p>
              <div className="app-feature-links">
                <Link href="/dashboard/wallet">
                  <Wallet />
                  <div>
                    <strong>A home for your assets</strong>
                    <span>Balances, rewards, and activity in one view.</span>
                  </div>
                  <ArrowUpRight />
                </Link>
                <Link href="/dashboard/trade">
                  <ArrowLeftRight />
                  <div>
                    <strong>Buy & sell, made clear</strong>
                    <span>Preview an INC trade before confirming.</span>
                  </div>
                  <ArrowUpRight />
                </Link>
                <Link href="/dashboard/staking">
                  <Layers3 />
                  <div>
                    <strong>Find your staking rhythm</strong>
                    <span>Compare flexible and fixed-term demo pools.</span>
                  </div>
                  <ArrowUpRight />
                </Link>
              </div>
              <Link href="/dashboard/staking" className="btn-primary">
                Discover staking <ArrowUpRight />
              </Link>
              <div className="subtle mt-4 !text-xs">
                Interactive demo · illustrative rates and balances
              </div>
            </div>
            <div className="staking-preview" data-spotlight>
              <div className="preview-heading">
                <h3 className="flex gap-2 items-center">
                  <Orbit size={19} className="accent-text" />
                  Your INC, working for you.
                </h3>
                <span className="preview-label">DEMO</span>
              </div>
              <div className="preview-value">
                8,000.00 <small>INC</small>
              </div>
              <div className="preview-meta">
                <Layers3 size={13} />
                Example staked balance
              </div>
              {state.pools.slice(0, 2).map((p) => (
                <div className="mini-pool" key={p.id}>
                  <div>
                    <h4>{p.name} staking</h4>
                    <p>
                      {p.days ? p.days + "-day lock period" : "Unstake anytime"}
                    </p>
                  </div>
                  <strong>
                    {p.apy.toFixed(1)}%<small>ILLUSTRATIVE APY</small>
                  </strong>
                </div>
              ))}
              <div className="preview-bottom">
                Explore the experience. No real funds required.
              </div>
            </div>
          </section>
          <section className="section" id="tokenomics" data-reveal>
            <div className="section-head">
              <div>
                <div className="eyebrow">05 / THE NATIVE ASSET</div>
                <h2>
                  INC. The asset
                  <br />
                  behind the ecosystem.
                </h2>
              </div>
              <p className="section-description">
                Meet INC. The native asset at the center of IONCO’s network,
                transactions, and ecosystem.
              </p>
            </div>
            <div className="token-utility-strip">
              <span>
                <Coins /> Native currency <strong>INC</strong>
              </span>
              <span>
                <Layers3 /> Token standard <strong>IRC20</strong>
              </span>
              <span>
                <Globe2 /> Network <strong>IONCO SmartChain</strong>
              </span>
            </div>
            <div className="token-section" data-spotlight>
              <div className="token-chart-block">
                <div
                  className="donut"
                  role="img"
                  aria-label={ALLOCATIONS.map(
                    (a) => `${a.label} ${a.percent}%`,
                  ).join(", ")}
                >
                  <div className="donut-center">
                    <strong>250M</strong>
                    <span>Approx. stated supply · INC</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="token-title">
                  <h3>Designed for the ecosystem</h3>
                  <span className="preview-label">ALLOCATION</span>
                </div>
                {ALLOCATIONS.map((a) => (
                  <div className="allocation-row" key={a.label}>
                    <span
                      className="allocation-swatch"
                      style={{ background: a.color }}
                    />
                    <span>{a.label}</span>
                    <strong className="mono">{a.percent}%</strong>
                  </div>
                ))}
                <p className="token-note">
                  Percentages from IONCO’s original allocation plan. Published
                  quantities contain inconsistencies; exact supply and
                  allocations need reconciliation.{" "}
                  <a href={LINKS.whitepaper} target="_blank" rel="noreferrer">
                    View source ↗
                  </a>
                </p>
              </div>
            </div>
          </section>
          <BuilderSection onNetworkDetails={() => setNetworkOpen(true)} />
          <section className="section" id="roadmap" data-reveal>
            <div className="section-head">
              <div>
                <div className="eyebrow">07 / THE JOURNEY</div>
                <h2>A vision in motion.</h2>
              </div>
              <p className="section-description">
                The original roadmap, from IONCO’s foundation to its plans for a
                connected ecosystem.
              </p>
            </div>
            <div className="roadmap-grid">
              {roadmap.map((r) => (
                <article className="roadmap-card" key={r.phase}>
                  <div className="roadmap-meta">
                    <span>{r.year}</span>
                    <span>PHASE / {r.phase}</span>
                  </div>
                  <h3>{r.title}</h3>
                  <p>{r.description}</p>
                </article>
              ))}
            </div>
            <p className="history-note">
              <Info />
              Historical roadmap published by IONCO. Dates are original targets;
              completion and current availability are unverified.
            </p>
          </section>
          <section className="section faq-section" id="faq" data-reveal>
            <div>
              <div className="eyebrow">08 / A LITTLE CLARITY</div>
              <h2>
                Good questions.
                <br />
                Clear answers.
              </h2>
              <p className="section-description">
                Get to know the network, the native coin, and what you can
                explore today.
              </p>
              <button
                className="text-link"
                onClick={() => setNetworkOpen(true)}
              >
                View network details <ArrowUpRight />
              </button>
            </div>
            <Accordion
              type="single"
              collapsible
              defaultValue="faq-0"
              className="faq-accordion"
            >
              {faqs.map((f, i) => (
                <AccordionItem value={`faq-${i}`} key={f.q}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
          <section className="community-cta" data-reveal data-spotlight>
            <div className="community-top">
              <div>
                <div className="eyebrow">THE NEXT CHAPTER IS OURS</div>
                <h2>
                  Find your people.
                  <br />
                  <span>Build your possibilities.</span>
                </h2>
                <p>
                  Step into the IONCO community and explore the project
                  together.
                </p>
              </div>
              <Link href="/dashboard" className="btn-primary">
                Enter the app <ArrowUpRight />
              </Link>
            </div>
            <div className="community-channels">
              {[
                {
                  icon: Send,
                  name: "Telegram",
                  detail: "Join the conversation",
                  href: "https://t.me/+FxQ-jbWIuBZiZjM0",
                },
                {
                  icon: MessageCircle,
                  name: "X / Twitter",
                  detail: "Follow the project",
                  href: "https://twitter.com/IoncoChain",
                },
                {
                  icon: Users,
                  name: "Discord",
                  detail: "Meet the community",
                  href: "https://discord.gg/BjFP3uPtz7",
                },
                {
                  icon: Globe2,
                  name: "LinkedIn",
                  detail: "Stay connected",
                  href: "https://www.linkedin.com/in/ionco-chain-474b34257",
                },
              ].map((channel) => (
                <a
                  href={channel.href}
                  key={channel.name}
                  target="_blank"
                  rel="noreferrer"
                >
                  <channel.icon />
                  <div>
                    <strong>{channel.name}</strong>
                    <span>{channel.detail}</span>
                  </div>
                  <ArrowUpRight />
                </a>
              ))}
            </div>
          </section>
        </div>
      </main>
      <footer className="site-footer">
        <span className="footer-watermark" aria-hidden="true">
          IONCO
        </span>
        <div className="container-wide">
          <div className="footer-top">
            <div className="footer-brand">
              <Logo />
              <p>
                A connected ecosystem.
                <br />A new dimension of Web3.
              </p>
            </div>
            <div className="footer-column">
              <h4>Explore</h4>
              <Link href="/#ecosystem">Ecosystem</Link>
              <Link href="/#tokenomics">INC coin</Link>
              <Link href="/dashboard/staking">Staking demo</Link>
              <Link href="/#roadmap">Roadmap</Link>
            </div>
            <div className="footer-column">
              <h4>Resources</h4>
              <a href={LINKS.whitepaper} target="_blank" rel="noreferrer">
                Whitepaper ↗
              </a>
              <a href={LINKS.explorer} target="_blank" rel="noreferrer">
                Block explorer ↗
              </a>
              <button onClick={() => setNetworkOpen(true)}>
                Network details
              </button>
              <Link href="/#faq">FAQs</Link>
            </div>
            <div className="footer-column">
              <h4>Stay connected</h4>
              <a
                href="https://twitter.com/IoncoChain"
                target="_blank"
                rel="noreferrer"
              >
                X / Twitter ↗
              </a>
              <a
                href="https://t.me/+FxQ-jbWIuBZiZjM0"
                target="_blank"
                rel="noreferrer"
              >
                Telegram ↗
              </a>
              <a
                href="https://discord.gg/BjFP3uPtz7"
                target="_blank"
                rel="noreferrer"
              >
                Discord ↗
              </a>
              <a
                href="https://www.linkedin.com/in/ionco-chain-474b34257"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 IONCO SmartChain. All rights reserved.</span>
            <span>
              Website preview ·{" "}
              <a href={LINKS.original} target="_blank" rel="noreferrer">
                Original project information ↗
              </a>{" "}
              · <Link href="/admin">Admin demo</Link>
            </span>
          </div>
        </div>
      </footer>
      <NetworkDialog open={networkOpen} onOpenChange={setNetworkOpen} />
    </div>
  );
}

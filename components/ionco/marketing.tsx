"use client";
import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Globe2,
  Menu,
  MessageCircle,
  Send,
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
import { ALLOCATIONS, LINKS, NETWORK } from "@/lib/ionco-data";
import { useDemo } from "./demo-provider";
import { Logo, NetworkDialog } from "./shared";
import { StoryStage } from "./story";

const navigation = [
  { label: "Chain", href: "/#chain" },
  { label: "INC", href: "/#inc" },
  { label: "App", href: "/#app" },
  { label: "Journey", href: "/#journey" },
  { label: "Community", href: "/#community" },
];

const milestones = [
  {
    year: "2023",
    title: "The foundation",
    text: "A core team, a shared vision, and the first version of the IONCO platform.",
  },
  {
    year: "2024",
    title: "SmartChain & INC",
    text: "Smart contracts, tokenization, and the planned launch of IONCO SmartChain with its native coin.",
  },
  {
    year: "2024",
    title: "Explorer, portal & listings",
    text: "Network visibility, an ICO portal, and planned exchange listings to support liquidity.",
  },
];

const community = [
  { icon: Send, name: "Telegram", href: "https://t.me/+FxQ-jbWIuBZiZjM0" },
  {
    icon: MessageCircle,
    name: "X / Twitter",
    href: "https://twitter.com/IoncoChain",
  },
  { icon: Users, name: "Discord", href: "https://discord.gg/BjFP3uPtz7" },
  {
    icon: Globe2,
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/ionco-chain-474b34257",
  },
];

export function MarketingSite() {
  const { state } = useDemo();
  const [networkOpen, setNetworkOpen] = useState(false);
  const headline = state.content.headline.split("\n");
  return (
    <div className="marketing-site marketing-v2 story">
      <StoryStage />
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
                  {[...navigation, { label: "Dashboard", href: "/dashboard" }].map(
                    (n) => (
                      <SheetClose asChild key={n.href}>
                        <Link
                          href={n.href}
                          className="py-4 border-b border-white/10 text-base flex justify-between"
                        >
                          {n.label}
                          <ArrowUpRight size={17} />
                        </Link>
                      </SheetClose>
                    ),
                  )}
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
        {/* 01 · Hero ---------------------------------------------------- */}
        <section className="chapter chapter-hero" id="top" data-chapter>
          <div className="hero-top">
            <div className="hero-kicker">
              <span className="dot" />
              IONCO SmartChain · Chain ID {NETWORK.chainId} · Proof of Authority
            </div>
            <h1>
              {headline.map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {i > 0 ? <em>{line}</em> : line}
                </span>
              ))}
            </h1>
          </div>
          <div className="hero-bottom">
            <p className="hero-tagline">{state.content.description}</p>
            <div className="hero-buttons">
              <Link href="/dashboard" className="btn-primary">
                Launch app <ArrowUpRight />
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
            {state.content.announcement && (
              <a className="announcement" href="#chain">
                <span>INTRODUCING</span>
                {state.content.announcement}
                <ArrowRight />
              </a>
            )}
          </div>
          <div className="hero-scroll-hint" aria-hidden="true">
            Scroll
            <span />
          </div>
        </section>

        {/* 02 · The chain ------------------------------------------------ */}
        <section className="chapter" id="chain" data-chapter>
          <article className="chapter-panel">
            <div className="chapter-eyebrow">01 — The network · Proof of Authority</div>
            <h2>
              One chain.
              <br />
              <span className="dim">Every block agreed.</span>
            </h2>
            <p>
              A set of authorised validators confirms each block, so the
              network stays fast, predictable, and inexpensive to use.
            </p>
            <dl className="chapter-stats">
              <div>
                <dt>Consensus</dt>
                <dd>PoA</dd>
              </div>
              <div>
                <dt>Chain ID</dt>
                <dd>{NETWORK.chainId}</dd>
              </div>
              <div>
                <dt>Standard</dt>
                <dd>{NETWORK.standard}</dd>
              </div>
            </dl>
            <div className="chapter-actions">
              <button className="text-link" onClick={() => setNetworkOpen(true)}>
                Network details <ArrowUpRight />
              </button>
              <a
                className="text-link"
                href={LINKS.explorer}
                target="_blank"
                rel="noreferrer"
              >
                Block explorer <ArrowUpRight />
              </a>
            </div>
          </article>
        </section>

        {/* 03 · INC ------------------------------------------------------ */}
        <section className="chapter" id="inc" data-chapter>
          <article className="chapter-panel">
            <div className="chapter-eyebrow">02 — The native asset</div>
            <h2>
              INC.
              <br />
              <span className="dim">One asset, every possibility.</span>
            </h2>
            <p>
              INC powers transactions, smart-contract execution, and network
              services across the IONCO ecosystem.
            </p>
            <div
              className="allocation-bar"
              role="img"
              aria-label={ALLOCATIONS.map(
                (a) => `${a.label} ${a.percent}%`,
              ).join(", ")}
            >
              {ALLOCATIONS.map((a) => (
                <span
                  key={a.label}
                  style={{ width: `${a.percent}%`, background: a.color }}
                />
              ))}
            </div>
            <ul className="allocation-legend">
              {ALLOCATIONS.map((a) => (
                <li key={a.label}>
                  <i style={{ background: a.color }} />
                  {a.percent}% {a.label}
                </li>
              ))}
            </ul>
            <div className="chapter-foot">
              <span>~250M supply</span>
              <span>IRC20</span>
              <a href={LINKS.whitepaper} target="_blank" rel="noreferrer">
                Whitepaper ↗
              </a>
            </div>
          </article>
        </section>

        {/* 04 · The app -------------------------------------------------- */}
        <section className="chapter" id="app" data-chapter>
          <article className="chapter-panel">
            <div className="chapter-eyebrow">03 — Staking & trading · Interactive demo</div>
            <h2>
              Your INC,
              <br />
              <span className="dim">working for you.</span>
            </h2>
            <p>
              Stake into flexible or fixed-term pools, preview a trade, and
              follow every move from one dashboard.
            </p>
            <ul className="pool-list">
              {state.pools.slice(0, 3).map((pool) => (
                <li key={pool.id}>
                  <div>
                    <strong>{pool.name}</strong>
                    <small>
                      {pool.days ? `${pool.days}-day lock` : "Unstake anytime"}
                    </small>
                  </div>
                  <span className="pool-apy">{pool.apy.toFixed(1)}%</span>
                </li>
              ))}
            </ul>
            <div className="chapter-actions">
              <Link href="/dashboard/staking" className="btn-primary">
                Launch app <ArrowUpRight />
              </Link>
              <span className="chapter-note">
                Demo · illustrative rates, no real funds
              </span>
            </div>
          </article>
        </section>

        {/* 05 · The journey ---------------------------------------------- */}
        <section className="chapter" id="journey" data-chapter>
          <article className="chapter-panel">
            <div className="chapter-eyebrow">04 — The journey</div>
            <h2>
              Built
              <br />
              <span className="dim">in chapters.</span>
            </h2>
            <ol className="milestones">
              {milestones.map((m) => (
                <li key={m.title}>
                  <span className="year">{m.year}</span>
                  <div>
                    <strong>{m.title}</strong>
                    <span>{m.text}</span>
                  </div>
                </li>
              ))}
            </ol>
            <div className="chapter-foot">
              <span>Historical roadmap · completion unverified</span>
            </div>
          </article>
        </section>

        {/* 06 · The next chapter ----------------------------------------- */}
        <section className="chapter chapter-final" id="community" data-chapter>
          <div className="final-inner">
            <div className="chapter-eyebrow">05 — The next chapter is ours</div>
            <h2>Find your people.</h2>
            <p>
              Step into the IONCO community and explore what comes next,
              together.
            </p>
            <div className="social-row">
              {community.map((channel) => (
                <a
                  key={channel.name}
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <channel.icon />
                  {channel.name}
                </a>
              ))}
            </div>
            <Link href="/dashboard" className="btn-primary">
              Enter the app <ArrowUpRight />
            </Link>
          </div>
        </section>
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
              <Link href="/#chain">The chain</Link>
              <Link href="/#inc">INC</Link>
              <Link href="/dashboard/staking">Staking demo</Link>
              <Link href="/#journey">Journey</Link>
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
              <Link href="/dashboard/help">Demo guide</Link>
            </div>
            <div className="footer-column">
              <h4>Stay connected</h4>
              {community.map((channel) => (
                <a
                  key={channel.name}
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {channel.name} ↗
                </a>
              ))}
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

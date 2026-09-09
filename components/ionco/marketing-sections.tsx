"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Boxes,
  Braces,
  Check,
  Code2,
  Coins,
  Copy,
  Database,
  Fingerprint,
  Gamepad2,
  Globe2,
  Layers3,
  Network,
  Package,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Wallet,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LINKS, NETWORK } from "@/lib/ionco-data";
import { copyText } from "./shared";

/** Progressive enhancement: every section is visible before JS runs. */
export function HomepageMotion() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const calm = () => preference.matches;
    const root = document.querySelector<HTMLElement>(".marketing-v2");
    const cleanups: Array<() => void> = [];
    const animations = new Set<Animation>();

    /* --- Header state and scroll progress ------------------------------- */
    const progress = document.querySelector<HTMLElement>(".scroll-progress");
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        if (root) root.dataset.scrolled = String(window.scrollY > 24);
        if (progress) {
          const travel =
            document.documentElement.scrollHeight - window.innerHeight;
          progress.style.setProperty(
            "--progress",
            String(travel > 0 ? Math.min(1, window.scrollY / travel) : 0),
          );
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    cleanups.push(() => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    });

    if (!("IntersectionObserver" in window)) return () => {};

    /* --- Staggered section reveals -------------------------------------- */
    const rise = (target: Element, delay: number) => {
      if (calm() || !("animate" in target)) return;
      const animation = target.animate(
        [
          { opacity: 0, transform: "translateY(24px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 720,
          delay,
          easing: "cubic-bezier(.2,.7,.2,1)",
          fill: "backwards",
        },
      );
      animations.add(animation);
      animation.onfinish = () => animations.delete(animation);
    };
    const reveal = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          reveal.unobserve(target);
          const children = Array.from(target.children);
          if (children.length > 1 && children.length <= 8)
            children.forEach((child, i) => rise(child, i * 70));
          else rise(target, 0);
        });
      },
      { threshold: 0.06, rootMargin: "0px 0px -6% 0px" },
    );
    document
      .querySelectorAll(".marketing-site [data-reveal]")
      .forEach((el) => reveal.observe(el));
    cleanups.push(() => reveal.disconnect());

    /* --- Counting stats -------------------------------------------------- */
    const counters = new IntersectionObserver((entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        counters.unobserve(target);
        const el = target as HTMLElement;
        const to = Number(el.dataset.countTo);
        if (!Number.isFinite(to) || calm()) return;
        const suffix = el.dataset.countSuffix ?? "";
        const started = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - started) / 1100);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = Math.round(to * eased).toLocaleString() + suffix;
          if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    });
    document
      .querySelectorAll("[data-count-to]")
      .forEach((el) => counters.observe(el));
    cleanups.push(() => counters.disconnect());

    /* --- Cursor-tracked highlight on raised surfaces --------------------- */
    const spotlights =
      document.querySelectorAll<HTMLElement>("[data-spotlight]");
    const fine = window.matchMedia("(pointer: fine)");
    const onMove = (event: PointerEvent) => {
      const el = event.currentTarget as HTMLElement;
      const box = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${event.clientX - box.left}px`);
      el.style.setProperty("--my", `${event.clientY - box.top}px`);
      el.style.setProperty("--spot", "1");
    };
    const onLeave = (event: PointerEvent) =>
      (event.currentTarget as HTMLElement).style.setProperty("--spot", "0");
    if (fine.matches && !calm())
      spotlights.forEach((el) => {
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
        });
      });

    /* --- Active section in the header nav -------------------------------- */
    const links = Array.from(
      document.querySelectorAll<HTMLAnchorElement>(".site-nav a[href*='#']"),
    );
    const targets = links
      .map((link) => {
        const id = link.getAttribute("href")?.split("#")[1];
        const section = id ? document.getElementById(id) : null;
        return section ? { link, section } : null;
      })
      .filter(
        (pair): pair is { link: HTMLAnchorElement; section: HTMLElement } =>
          Boolean(pair),
      );
    /* Whichever tracked section the reading line sits in wins. Sections the
       nav does not list — and the footer — leave every link inactive rather
       than stranding the highlight on whatever was seen last. */
    const markActive = () => {
      const line = window.scrollY + window.innerHeight * 0.4;
      const current = targets.find(({ section }) => {
        const top = section.offsetTop;
        return line >= top && line < top + section.offsetHeight;
      });
      targets.forEach(({ link }) => delete link.dataset.active);
      if (current) current.link.dataset.active = "true";
    };
    if (targets.length) {
      markActive();
      window.addEventListener("scroll", markActive, { passive: true });
      window.addEventListener("resize", markActive);
      cleanups.push(() => {
        window.removeEventListener("scroll", markActive);
        window.removeEventListener("resize", markActive);
      });
    }

    /* --- Pause the hero loop when it cannot be seen ---------------------- */
    const scene = document.querySelector<HTMLElement>(".hero-visual");
    let inView = true;
    const pauseWhenHidden = () => {
      if (scene) scene.dataset.offscreen = String(!inView || document.hidden);
    };
    const visibility = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      pauseWhenHidden();
    });
    if (scene) visibility.observe(scene);
    document.addEventListener("visibilitychange", pauseWhenHidden);
    cleanups.push(() => {
      visibility.disconnect();
      document.removeEventListener("visibilitychange", pauseWhenHidden);
    });

    const onPreference = () => {
      if (preference.matches)
        animations.forEach((animation) => animation.cancel());
    };
    preference.addEventListener("change", onPreference);
    cleanups.push(() =>
      preference.removeEventListener("change", onPreference),
    );

    return () => {
      animations.forEach((animation) => animation.cancel());
      cleanups.forEach((fn) => fn());
    };
  }, []);
  return null;
}

export function QuickAccess() {
  return (
    <nav className="quick-access" aria-label="Start exploring IONCO">
      {[
        {
          icon: Wallet,
          label: "For explorers",
          title: "Your assets, one home",
          href: "/dashboard",
          detail: "Open the app demo",
        },
        {
          icon: Code2,
          label: "For builders",
          title: "Start with the essentials",
          href: "/#builders",
          detail: "Discover the technology",
        },
        {
          icon: ScanLine,
          label: "For the curious",
          title: "Look inside the chain",
          href: LINKS.explorer,
          detail: "Visit the original explorer",
        },
      ].map((item) => (
        <a
          key={item.title}
          href={item.href}
          {...(item.href.startsWith("https:")
            ? { target: "_blank", rel: "noreferrer" }
            : {})}
        >
          <item.icon className="quick-access-icon" strokeWidth={1.5} />
          <div>
            <span>{item.label}</span>
            <strong>{item.title}</strong>
            <small>{item.detail}</small>
          </div>
          <ArrowUpRight className="quick-access-arrow" />
        </a>
      ))}
    </nav>
  );
}

export function EcosystemSection() {
  return (
    <section className="section" id="ecosystem" data-reveal>
      <div className="section-head">
        <div>
          <div className="eyebrow">01 / THE ECOSYSTEM</div>
          <h2>
            One chain.{" "}
            <span className="heading-muted">More possibilities.</span>
          </h2>
        </div>
        <p className="section-description">
          Smart contracts, digital assets, and connected experiences. Discover
          the ideas behind IONCO SmartChain.
        </p>
      </div>
      <div className="ecosystem-visual-grid">
        <article className="ecosystem-visual-card" data-spotlight>
          <div className="ecosystem-image">
            <img
              src="/images/ionco-network.webp"
              srcSet="/images/ionco-network-mobile.webp 720w, /images/ionco-network.webp 1200w"
              sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1320px) 46vw, 590px"
              alt="Interconnected glass structures illuminated by cyan channels"
              width="1200"
              height="800"
              loading="lazy"
              decoding="async"
            />
            <span className="image-tag">
              <Globe2 /> A CONNECTED VISION
            </span>
            <span className="image-index">IONCO / 01</span>
          </div>
          <div className="ecosystem-card-body">
            <h3>Built for connections.</h3>
            <p>
              IONCO’s vision brings decentralized applications and smart
              contracts into one ecosystem, with interoperability among its
              planned capabilities.
            </p>
            <div className="feature-chips">
              <span>Smart contracts</span>
              <span>dApps</span>
              <span>Interoperability vision</span>
            </div>
            <a
              href={LINKS.technology}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              Explore SmartChain <ArrowUpRight />
            </a>
          </div>
        </article>
        <article className="ecosystem-visual-card" data-spotlight>
          <div className="ecosystem-image">
            <img
              src="/images/ionco-ownership.webp"
              srcSet="/images/ionco-ownership-mobile.webp 720w, /images/ionco-ownership.webp 1200w"
              sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1320px) 46vw, 590px"
              alt="A collection of crystalline digital asset tiles surrounding a glass core"
              width="1200"
              height="800"
              loading="lazy"
              decoding="async"
            />
            <span className="image-tag">
              <Fingerprint /> DIGITAL OWNERSHIP
            </span>
            <span className="image-index">IONCO / 02</span>
          </div>
          <div className="ecosystem-card-body">
            <h3>Ownership, reimagined.</h3>
            <p>
              From unique digital collectibles to tokenized assets, the project
              explores new ways to represent value and ownership on a
              blockchain.
            </p>
            <div className="feature-chips">
              <span>Tokenization</span>
              <span>NFTs</span>
              <span>Digital assets</span>
            </div>
            <a
              href={LINKS.whitepaper}
              target="_blank"
              rel="noreferrer"
              className="text-link"
            >
              Read the vision <ArrowUpRight />
            </a>
          </div>
        </article>
      </div>
      <div className="capability-row">
        {[
          {
            icon: Braces,
            title: "Programmable agreements",
            text: "Smart contracts are central to the project’s application vision.",
          },
          {
            icon: Layers3,
            title: "The IRC20 standard",
            text: "IONCO’s published token standard, described alongside Ethereum’s ERC20.",
          },
          {
            icon: Coins,
            title: "Powered by INC",
            text: "A native currency for transactions, contract execution, and network services.",
          },
        ].map((item) => (
          <div key={item.title}>
            <item.icon />
            <div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const useCases = [
  {
    id: "finance",
    icon: Coins,
    label: "Finance",
    title: "Value that moves with you.",
    description:
      "The IONCO vision includes decentralized finance: using digital assets and smart contracts to support transactions and financial applications.",
    tags: ["Digital payments", "Asset exchange", "Smart agreements"],
    steps: [
      { title: "Create", text: "Define a digital asset or agreement." },
      { title: "Transact", text: "Use contract logic to set the rules." },
      { title: "Record", text: "Keep a shared transaction history." },
    ],
  },
  {
    id: "gaming",
    icon: Gamepad2,
    label: "Gaming",
    title: "A new layer of play.",
    description:
      "Gaming is one of the project’s proposed applications, with digital ownership and tokenization opening possibilities for in-game items and player experiences.",
    tags: ["Game assets", "Collectibles", "Player experiences"],
    steps: [
      { title: "Design", text: "Create an item with a distinct identity." },
      { title: "Own", text: "Represent the item as a digital asset." },
      { title: "Experience", text: "Connect ownership to a game world." },
    ],
  },
  {
    id: "assets",
    icon: Fingerprint,
    label: "Digital assets",
    title: "Make ownership part of the story.",
    description:
      "The original project describes NFTs and asset tokenization as ways to represent unique items and bring ownership records into digital experiences.",
    tags: ["NFTs", "Tokenization", "Ownership records"],
    steps: [
      { title: "Represent", text: "Define an asset and its properties." },
      { title: "Issue", text: "Express it through a digital token." },
      { title: "Trace", text: "Follow its recorded ownership." },
    ],
  },
  {
    id: "supply",
    icon: Package,
    label: "Supply chain",
    title: "A shared view of the journey.",
    description:
      "Supply-chain management is an intended use case in IONCO’s technology overview, exploring how shared records could connect participants across a product’s journey.",
    tags: ["Traceability", "Shared records", "Connected participants"],
    steps: [
      { title: "Register", text: "Give a product a digital record." },
      { title: "Update", text: "Record events across its journey." },
      { title: "Review", text: "Look back through the shared history." },
    ],
  },
];

export function UseCasesSection() {
  return (
    <section
      className="section use-cases-section"
      id="possibilities"
      data-reveal
    >
      <div className="section-head">
        <div>
          <div className="eyebrow">02 / POSSIBLE BY DESIGN</div>
          <h2>
            Ideas beyond <span className="heading-muted">the blockchain.</span>
          </h2>
        </div>
        <p className="section-description">
          Explore the use cases in IONCO’s original vision, and how the building
          blocks could come together.
        </p>
      </div>
      <Tabs defaultValue="finance" className="use-case-tabs">
        <TabsList aria-label="Explore intended IONCO use cases">
          {useCases.map((item) => (
            <TabsTrigger value={item.id} key={item.id}>
              <item.icon />
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {useCases.map((item) => (
          <TabsContent value={item.id} key={item.id} className="use-case-panel" data-spotlight>
            <div className="use-case-copy">
              <span className="mini-kicker">
                <Sparkles /> ECOSYSTEM VISION
              </span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="feature-chips">
                {item.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
            <div className="use-case-journey">
              <div className="journey-caption">
                <item.icon />
                <span>A POSSIBLE EXPERIENCE</span>
              </div>
              <ol>
                {item.steps.map((step, i) => (
                  <li key={step.title}>
                    <span className="journey-number">0{i + 1}</span>
                    <div>
                      <strong>{step.title}</strong>
                      <p>{step.text}</p>
                    </div>
                    {i < 2 && <ArrowRight className="journey-arrow" />}
                  </li>
                ))}
              </ol>
            </div>
          </TabsContent>
        ))}
      </Tabs>
      <p className="source-caption">
        Illustrative use cases from the project’s vision; availability of
        applications is unverified.{" "}
        <a href={LINKS.technology} target="_blank" rel="noreferrer">
          Explore the original technology overview <ArrowUpRight />
        </a>
      </p>
    </section>
  );
}

export function NetworkSection({
  onNetworkDetails,
}: {
  onNetworkDetails: () => void;
}) {
  return (
    <section className="section network-section" id="network" data-reveal>
      <div className="section-head">
        <div>
          <div className="eyebrow">03 / UNDER THE SURFACE</div>
          <h2>
            A closer look <span className="heading-muted">at the chain.</span>
          </h2>
        </div>
        <p className="section-description">
          Get to know the network architecture and specifications published by
          IONCO.
        </p>
      </div>
      <div className="network-detail-grid">
        <div className="network-story">
          <div className="network-origin">
            <span>EST. NOVEMBER 2023</span>
            <p>
              Founded by Corodeanu Ionel with a vision for smart contracts,
              digital assets, and decentralized applications.
            </p>
          </div>
          <div className="network-principle">
            <ShieldCheck />
            <div>
              <h3>Proof of Authority</h3>
              <p>
                The technology overview describes a consensus model based on
                authorized validators.
              </p>
            </div>
          </div>
          <div className="network-principle">
            <Boxes />
            <div>
              <h3>IRC20 & smart contracts</h3>
              <p>
                The project’s token standard and programmable contracts form
                part of its application architecture.
              </p>
            </div>
          </div>
          <a
            className="text-link"
            href={LINKS.infrastructure}
            target="_blank"
            rel="noreferrer"
          >
            Read about the infrastructure <ArrowUpRight />
          </a>
        </div>
        <div className="network-console" data-spotlight>
          <div className="console-top">
            <span>
              <Network /> NETWORK SPECIFICATION
            </span>
            <span className="console-tag">PUBLISHED</span>
          </div>
          <dl className="network-specs">
            <div>
              <dt>Network</dt>
              <dd>{NETWORK.name}</dd>
            </div>
            <div>
              <dt>Chain ID</dt>
              <dd>
                <code>{NETWORK.chainId}</code>
                <button
                  aria-label="Copy IONCO chain ID"
                  onClick={() =>
                    copyText(String(NETWORK.chainId), "Chain ID copied")
                  }
                >
                  <Copy />
                </button>
              </dd>
            </div>
            <div>
              <dt>Native currency</dt>
              <dd>
                <span className="inc-dot">
                  <Coins />
                </span>
                {NETWORK.symbol}
              </dd>
            </div>
            <div>
              <dt>Token standard</dt>
              <dd>
                <code>{NETWORK.standard}</code>
              </dd>
            </div>
          </dl>
          <div className="topology-label">ORIGINAL INFRASTRUCTURE DESIGN</div>
          <div
            className="node-topology"
            aria-label="Published infrastructure: two validator nodes and one storage and monitoring node"
          >
            <div>
              <ShieldCheck />
              <strong>Node 01</strong>
              <span>Validator</span>
            </div>
            <div>
              <ShieldCheck />
              <strong>Node 02</strong>
              <span>Validator</span>
            </div>
            <div>
              <Database />
              <strong>Node 03</strong>
              <span>Storage / monitoring</span>
            </div>
          </div>
          <div className="console-bottom">
            <span>Historical configuration · current health unverified</span>
            <button className="text-link" onClick={onNetworkDetails}>
              Network details <ArrowUpRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BuilderSection({
  onNetworkDetails,
}: {
  onNetworkDetails: () => void;
}) {
  return (
    <section className="section builder-section" id="builders" data-reveal>
      <div className="section-head">
        <div>
          <div className="eyebrow">06 / FOR THE BUILDERS</div>
          <h2>
            Start with{" "}
            <span className="heading-muted">a little curiosity.</span>
          </h2>
        </div>
        <p className="section-description">
          The original resources, together in one place. Understand the vision,
          inspect the network, and explore the design.
        </p>
      </div>
      <div className="builder-grid">
        <a
          className="builder-primary"
          data-spotlight
          href={LINKS.whitepaper}
          target="_blank"
          rel="noreferrer"
        >
          <span className="resource-type">
            <BookOpen /> THE ORIGINAL WHITEPAPER <ArrowUpRight />
          </span>
          <h3>
            The ideas.
            <br />
            The architecture.
            <br />
            <span>The bigger picture.</span>
          </h3>
          <p>
            Read IONCO’s plans for the ecosystem, its intended applications, and
            the original coin distribution.
          </p>
          <span className="resource-bottom">
            Open whitepaper <ArrowRight />
          </span>
        </a>
        <div className="builder-resource-list">
          <a href={LINKS.technology} target="_blank" rel="noreferrer">
            <Code2 />
            <div>
              <h3>Technology overview</h3>
              <p>Consensus, smart contracts, and intended use cases.</p>
            </div>
            <ArrowUpRight />
          </a>
          <button onClick={onNetworkDetails}>
            <Globe2 />
            <div>
              <h3>Network configuration</h3>
              <p>Chain ID, currency, and published connection details.</p>
            </div>
            <ArrowUpRight />
          </button>
          <a href={LINKS.explorer} target="_blank" rel="noreferrer">
            <ScanLine />
            <div>
              <h3>Block explorer</h3>
              <p>Follow the original link to IONCO’s explorer.</p>
            </div>
            <ArrowUpRight />
          </a>
          <a href={LINKS.infrastructure} target="_blank" rel="noreferrer">
            <Database />
            <div>
              <h3>Infrastructure deep dive</h3>
              <p>The project’s published node and monitoring setup.</p>
            </div>
            <ArrowUpRight />
          </a>
        </div>
      </div>
      <div className="builder-foot">
        <Check />
        <span>Every resource above comes from the original IONCO website.</span>
        <Link href="/dashboard/help">
          Explore the demo guide <ArrowUpRight />
        </Link>
      </div>
    </section>
  );
}

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRight,
  ArrowLeftRight,
  Wallet,
  Layers3,
  Gift,
  Orbit,
  LockKeyhole,
  UnlockKeyhole,
  Info,
  Download,
  Search,
  Copy,
  Globe,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Settings2,
  ExternalLink,
  BookOpen,
  CircleHelp,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { useDemo } from "./demo-provider";
import {
  Badge,
  Confirm,
  Empty,
  PageTitle,
  TransactionDetail,
  TransactionTable,
  WalletConnect,
  NetworkDialog,
  copyText,
  exportCSV,
} from "./shared";
import { PortfolioChart } from "./chart";
import {
  LINKS,
  NETWORK,
  WALLET,
  dateLabel,
  money,
  number,
  shortAddress,
  type Pool,
  type Stake,
  type Transaction,
} from "@/lib/ionco-data";
export function StatCard({
  label,
  value,
  unit,
  detail,
  icon: Icon,
  primary = false,
}: {
  label: string;
  value: string;
  unit?: string;
  detail: string;
  icon: typeof Wallet;
  primary?: boolean;
}) {
  return (
    <div className={`panel stat-card ${primary ? "primary-stat" : ""}`}>
      <div className="stat-label">
        {label}
        <Icon strokeWidth={1.5} />
      </div>
      <div className="stat-value">
        {value}
        {unit && <small>{unit}</small>}
      </div>
      <div className="stat-detail">{detail}</div>
    </div>
  );
}
function useTotals() {
  const { state } = useDemo();
  const staked = state.stakes.reduce((s, p) => s + p.amount, 0);
  const rewards = state.stakes.reduce((s, p) => s + p.rewards, 0);
  return {
    staked,
    rewards,
    total: (state.balance + staked) * state.settings.price + state.usdt,
  };
}
export function PoolCards({ onSelect }: { onSelect: (p: Pool) => void }) {
  const { state } = useDemo();
  return (
    <div className="app-pools">
      {state.pools.map((p, i) => (
        <article
          className={`pool-card ${i === 1 ? "featured" : ""}`}
          key={p.id}
        >
          <div className="pool-heading">
            <span className="flex items-center gap-2">
              {p.days ? <LockKeyhole /> : <UnlockKeyhole />}
              {p.name}
            </span>
            {i === 1 && <span className="pool-badge">BALANCED</span>}
          </div>
          <div className="pool-apy">
            {number(p.apy)}%<small>illustrative APY</small>
          </div>
          <p className="pool-description">{p.description}</p>
          <div className="pool-facts">
            <div>
              Lock period
              <strong>{p.days ? p.days + " days" : "Flexible"}</strong>
            </div>
            <div className="text-right">
              Minimum<strong>{number(p.min)} INC</strong>
            </div>
          </div>
          <Button
            className={i === 1 ? "btn-primary" : "btn-secondary"}
            disabled={
              !p.active || !state.settings.staking || state.settings.maintenance
            }
            onClick={() => onSelect(p)}
          >
            {!p.active || !state.settings.staking ? "Pool paused" : "Stake INC"}
            <ArrowUpRight />
          </Button>
        </article>
      ))}
    </div>
  );
}
export function StakingDialog({
  pool,
  onClose,
}: {
  pool: Pool | null;
  onClose: () => void;
}) {
  const { state, ready, act } = useDemo();
  const [amount, setAmount] = useState("");
  const [review, setReview] = useState(false);
  useEffect(() => {
    setAmount("");
    setReview(false);
  }, [pool?.id]);
  if (!pool) return null;
  const current = state.pools.find((p) => p.id === pool.id) || pool;
  const n = Number(amount);
  const valid =
    amount.trim() !== "" &&
    Number.isFinite(n) &&
    n >= current.min &&
    n <= state.balance;
  const period = current.days || 30;
  const estimate = n * ((1 + current.apy / 100) ** (period / 365) - 1);
  return (
    <Dialog open={!!pool} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="modal-content">
        <DialogHeader>
          <DialogTitle>
            {review ? "Review your stake" : `${current.name} staking`}
          </DialogTitle>
          <DialogDescription>
            {review
              ? "Check the terms before confirming this simulated position."
              : current.description +
                " All amounts and rewards are for demonstration."}
          </DialogDescription>
        </DialogHeader>
        {review ? (
          <>
            <div className="confirm-highlight">
              <strong>{number(n)} INC</strong>
              <span>
                {current.name} · {number(current.apy)}% illustrative APY
              </span>
            </div>
            <div className="quote-summary">
              <div className="quote-line">
                <span>Lock period</span>
                <strong>
                  {current.days
                    ? `${current.days} days`
                    : "None · withdraw anytime"}
                </strong>
              </div>
              <div className="quote-line">
                <span>Projected rewards · {period} days</span>
                <strong>{number(estimate, 4)} INC</strong>
              </div>
              <div className="quote-line">
                <span>Available after staking</span>
                <strong>{number(state.balance - n)} INC</strong>
              </div>
            </div>
            <p className="safe-note">
              <Info />
              The projection is illustrative, not a promised return. Locked
              positions cannot be withdrawn before their unlock date. Demo
              rewards do not accrue with time.
            </p>
            <Button
              className="btn-primary w-full"
              disabled={!ready || !valid}
              onClick={() => {
                if (
                  act(
                    { type: "stake", poolId: current.id, amount: n },
                    "Demo stake created",
                  )
                )
                  onClose();
              }}
            >
              Confirm demo stake <ArrowRight />
            </Button>
            <Button variant="ghost" onClick={() => setReview(false)}>
              Back to amount
            </Button>
          </>
        ) : (
          <>
            <div className="amount-box mt-2">
              <label htmlFor="stake-amount">
                <span>Amount to stake</span>
                <span>{number(current.apy)}% APY · demo</span>
              </label>
              <div className="amount-input-row">
                <input
                  id="stake-amount"
                  type="number"
                  inputMode="decimal"
                  min={current.min}
                  max={state.balance}
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                />
                <span className="coin-pill">
                  <Orbit />
                  INC
                </span>
              </div>
              <div className="amount-balance">
                <span>Available: {number(state.balance)} INC</span>
                <button onClick={() => setAmount(String(state.balance))}>
                  MAX
                </button>
              </div>
            </div>
            <div className="quote-summary">
              <div className="quote-line">
                <span>Minimum stake</span>
                <strong>{number(current.min)} INC</strong>
              </div>
              <div className="quote-line">
                <span>Lock period</span>
                <strong>
                  {current.days ? `${current.days} days` : "No lock period"}
                </strong>
              </div>
              <div className="quote-line">
                <span>Illustrative {period}-day rewards</span>
                <strong>{valid ? number(estimate, 4) : "0"} INC</strong>
              </div>
            </div>
            {amount && !valid && (
              <p className="text-xs negative" role="alert">
                Enter {number(current.min)}–{number(state.balance)} INC.
              </p>
            )}
            {state.connected ? (
              <Button
                className="btn-primary w-full"
                disabled={
                  !valid ||
                  !ready ||
                  !current.active ||
                  !state.settings.staking ||
                  state.settings.maintenance
                }
                onClick={() => setReview(true)}
              >
                Review stake <ArrowRight />
              </Button>
            ) : (
              <WalletConnect />
            )}
            <p className="safe-note">
              <ShieldCheck />A simulated staking position. No live contract
              interaction.
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
export function DashboardOverview() {
  const { state } = useDemo();
  const { staked, rewards, total } = useTotals();
  const [pool, setPool] = useState<Pool | null>(null);
  const [selected, setSelected] = useState<Transaction | null>(null);
  const incValue = (state.balance + staked) * state.settings.price;
  const share = total ? (incValue / total) * 100 : 0;
  return (
    <>
      <PageTitle
        title="Your possibilities, at a glance."
        description="A clear view of your INC and everything it can do."
        eyebrow="Welcome back, Alex"
      >
        <Link href="/dashboard/trade" className="btn-primary wallet-button">
          <ArrowLeftRight />
          Buy & sell INC
        </Link>
      </PageTitle>
      <div className="stats-grid">
        <StatCard
          label="Total portfolio"
          value={money(total)}
          detail="INC + demo USDT · excludes unclaimed rewards"
          icon={Wallet}
          primary
        />
        <StatCard
          label="Available balance"
          value={number(state.balance)}
          unit="INC"
          detail={`${money(state.balance * state.settings.price)} demo value`}
          icon={Orbit}
        />
        <StatCard
          label="Total staked"
          value={number(staked)}
          unit="INC"
          detail={`${state.stakes.length} active staking positions`}
          icon={Layers3}
        />
        <StatCard
          label="Available rewards"
          value={number(rewards)}
          unit="INC"
          detail="Illustrative rewards · ready to claim"
          icon={Gift}
        />
      </div>
      <div className="two-col">
        <PortfolioChart value={total} />
        <section className="panel panel-pad allocation-panel">
          <div className="panel-title">
            <h2>Asset allocation</h2>
            <Wallet size={16} className="muted" />
          </div>
          <div className="allocation-mini">
            <div
              className="mini-donut"
              style={{
                background: `conic-gradient(#72deda 0% ${share}%,#496c82 ${share}% 100%)`,
              }}
              role="img"
              aria-label={`INC ${number(share)} percent, USDT ${number(100 - share)} percent`}
            >
              <div>
                <strong>{money(total)}</strong>
                <small>Total demo value</small>
              </div>
            </div>
          </div>
          <div className="asset-legend">
            <span>
              <i style={{ background: "#72deda" }} />
              IONCO · INC
            </span>
            <strong>{money(incValue)}</strong>
          </div>
          <div className="asset-legend">
            <span>
              <i style={{ background: "#496c82" }} />
              Demo USDT
            </span>
            <strong>{money(state.usdt)}</strong>
          </div>
        </section>
      </div>
      <section className="panel panel-pad">
        <div className="panel-title">
          <div>
            <h2>A pool for your pace.</h2>
            <p>Explore three ways to stake your demo INC.</p>
          </div>
          <Link href="/dashboard/staking" className="text-link">
            All positions <ArrowUpRight />
          </Link>
        </div>
        <PoolCards onSelect={setPool} />
        <div className="chart-note">
          Illustrative rates. IONCO’s published network uses Proof of Authority;
          these demo products are not verified network validation staking.
        </div>
      </section>
      <div className="section-row">
        <h2>Recent activity</h2>
        <Link href="/dashboard/activity" className="text-link">
          View all activity <ArrowUpRight />
        </Link>
      </div>
      <div className="panel">
        <TransactionTable
          transactions={state.transactions.slice(0, 4)}
          onSelect={setSelected}
        />
      </div>
      <StakingDialog pool={pool} onClose={() => setPool(null)} />
      <TransactionDetail
        transaction={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
export function StakingPage() {
  const { state, ready, act } = useDemo();
  const { staked, rewards } = useTotals();
  const [pool, setPool] = useState<Pool | null>(null);
  const [exit, setExit] = useState<Stake | null>(null);
  const [claim, setClaim] = useState(false);
  return (
    <>
      <PageTitle
        title="Make room for growth."
        description="Explore pools and manage your simulated staking positions."
      />
      <div className="stats-grid !grid-cols-2">
        <StatCard
          label="Your staked INC"
          value={number(staked)}
          unit="INC"
          detail={`${state.stakes.length} active positions`}
          icon={Layers3}
          primary
        />
        <StatCard
          label="Claimable rewards"
          value={number(rewards)}
          unit="INC"
          detail="Demo rewards · no live accrual"
          icon={Gift}
        />
      </div>
      <div className="section-row">
        <h2>Choose your pace</h2>
        <span className="small-label">Illustrative APYs</span>
      </div>
      <PoolCards onSelect={setPool} />
      <p className="safe-note">
        <Info />
        These are demo staking products, not verified network validation. The
        published IONCO network uses Proof of Authority.
      </p>
      <div className="section-row">
        <h2>Your positions</h2>
        <Button
          variant="outline"
          className="btn-secondary !min-h-10 !px-3 !text-xs"
          disabled={
            !ready ||
            rewards <= 0 ||
            !state.connected ||
            state.settings.maintenance
          }
          onClick={() => setClaim(true)}
        >
          <Gift size={14} />
          Claim rewards
        </Button>
      </div>
      <div className="panel">
        {state.stakes.length ? (
          <Table className="data-table">
            <TableHeader>
              <TableRow>
                <TableHead>Pool</TableHead>
                <TableHead>Staked / APY</TableHead>
                <TableHead>Unlock date</TableHead>
                <TableHead>Rewards</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.stakes.map((s) => {
                const unlocked = new Date(s.unlockAt) <= new Date();
                return (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="tx-type">
                        <div className="tx-icon">
                          {s.startedAt === s.unlockAt ? (
                            <UnlockKeyhole />
                          ) : (
                            <LockKeyhole />
                          )}
                        </div>
                        <div>
                          {s.name}
                          <span className="block text-[10px] muted mt-1">
                            {s.id}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {number(s.amount)} INC
                      <span className="block text-[10px] accent-text mt-1">
                        {s.apy}% illustrative APY
                      </span>
                    </TableCell>
                    <TableCell>
                      {s.startedAt === s.unlockAt
                        ? "Anytime"
                        : new Date(s.unlockAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            timeZone: "UTC",
                          })}
                    </TableCell>
                    <TableCell className="accent-text">
                      {number(s.rewards)} INC
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        className="!text-xs min-h-9"
                        disabled={
                          !ready ||
                          !unlocked ||
                          !state.connected ||
                          state.settings.maintenance
                        }
                        onClick={() => setExit(s)}
                      >
                        {unlocked ? "Unstake" : "Locked"}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <Empty title="Your next position starts here">
            Choose a pool above to stake your demo INC.
          </Empty>
        )}
      </div>
      {!state.connected && (
        <div className="mt-5">
          <WalletConnect />
        </div>
      )}
      <StakingDialog pool={pool} onClose={() => setPool(null)} />
      <Confirm
        open={!!exit}
        onOpenChange={(v) => !v && setExit(null)}
        title="Unstake this position?"
        description={
          exit
            ? `${number(exit.amount)} INC principal and ${number(exit.rewards)} INC rewards will return to your available demo balance. This closes the entire position.`
            : ""
        }
        confirmLabel="Confirm unstake"
        onConfirm={() => {
          if (exit)
            act(
              { type: "unstake", stakeId: exit.id },
              "Demo position unstaked",
            );
          setExit(null);
        }}
      />
      <Confirm
        open={claim}
        onOpenChange={setClaim}
        title="Claim your demo rewards?"
        description={`${number(rewards)} INC will move to your available balance. Rewards on all existing positions will reset to zero.`}
        confirmLabel="Claim rewards"
        onConfirm={() => act({ type: "claim" }, "Demo rewards claimed")}
      />
    </>
  );
}
export function TradeWidget() {
  const { state, ready, act } = useDemo();
  const [side, setSide] = useState<"Buy" | "Sell">("Buy");
  const [amount, setAmount] = useState("");
  const [review, setReview] = useState(false);
  const n = Number(amount);
  const value = n * state.settings.price;
  const fee = (value * state.settings.fee) / 100;
  const total = side === "Buy" ? value + fee : value - fee;
  const valid =
    amount !== "" &&
    Number.isFinite(n) &&
    n > 0 &&
    (side === "Buy" ? total <= state.usdt + 1e-8 : n <= state.balance);
  const max =
    side === "Buy"
      ? Math.floor(
          (state.usdt /
            (state.settings.price * (1 + state.settings.fee / 100))) *
            1e8,
        ) / 1e8
      : state.balance;
  return (
    <section className="panel trade-panel">
      <Tabs
        value={side}
        onValueChange={(v) => {
          setSide(v as "Buy" | "Sell");
          setAmount("");
        }}
      >
        <TabsList aria-label="Trade direction">
          <TabsTrigger value="Buy">Buy INC</TabsTrigger>
          <TabsTrigger value="Sell">Sell INC</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="amount-box">
        <label htmlFor="trade-amount">
          <span>You {side.toLowerCase()}</span>
          <span>Demo balance</span>
        </label>
        <div className="amount-input-row">
          <input
            id="trade-amount"
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <span className="coin-pill">
            <Orbit />
            INC
          </span>
        </div>
        <div className="amount-balance">
          <span>
            {side === "Buy"
              ? `${number(state.usdt)} USDT available`
              : `${number(state.balance)} INC available`}
          </span>
          <button onClick={() => setAmount(String(max))}>MAX</button>
        </div>
      </div>
      <div className="quote-summary">
        <div className="quote-line">
          <span>Demo exchange rate</span>
          <strong>1 INC = {number(state.settings.price, 6)} USDT</strong>
        </div>
        <div className="quote-line">
          <span>Trade value</span>
          <strong>
            {Number.isFinite(value) ? number(value, 4) : "0"} USDT
          </strong>
        </div>
        <div className="quote-line">
          <span>Demo fee ({state.settings.fee}%)</span>
          <strong>{Number.isFinite(fee) ? number(fee, 4) : "0"} USDT</strong>
        </div>
        <div className="quote-line total">
          <span>{side === "Buy" ? "You pay" : "You receive"}</span>
          <strong>
            {Number.isFinite(total) ? number(total, 4) : "0"} USDT
          </strong>
        </div>
      </div>
      {amount && !valid && (
        <p role="alert" className="text-xs negative mb-4">
          Enter a positive amount within your available demo balance, including
          fees.
        </p>
      )}
      {state.connected ? (
        <Button
          className="btn-primary"
          disabled={
            !valid ||
            !ready ||
            !state.settings.trading ||
            state.settings.maintenance
          }
          onClick={() => setReview(true)}
        >
          {!state.settings.trading
            ? "Trading paused"
            : `Review ${side.toLowerCase()}`}
          <ArrowRight />
        </Button>
      ) : (
        <WalletConnect />
      )}
      <p className="safe-note">
        <ShieldCheck />
        Simulated trade at a fixed demo price. No payment, exchange order, or
        wallet signature.
      </p>
      <Dialog open={review} onOpenChange={setReview}>
        <DialogContent className="modal-content">
          <DialogHeader>
            <DialogTitle>Confirm your demo {side.toLowerCase()}</DialogTitle>
            <DialogDescription>
              Review your quote. This only updates balances in this browser.
            </DialogDescription>
          </DialogHeader>
          <div className="confirm-highlight">
            <strong>{number(n)} INC</strong>
            <span>
              {side === "Buy" ? "You pay" : "You receive"} {number(total, 4)}{" "}
              USDT
            </span>
          </div>
          <div className="quote-summary">
            <div className="quote-line">
              <span>Demo rate</span>
              <strong>{number(state.settings.price, 6)} USDT / INC</strong>
            </div>
            <div className="quote-line">
              <span>Fee included</span>
              <strong>{number(fee, 4)} USDT</strong>
            </div>
            <div className="quote-line">
              <span>Settlement</span>
              <strong>Instant simulation</strong>
            </div>
          </div>
          <Button
            className="btn-primary w-full"
            disabled={
              !valid ||
              !ready ||
              !state.settings.trading ||
              state.settings.maintenance
            }
            onClick={() => {
              if (
                act(
                  { type: "trade", side, amount: n },
                  `Demo ${side.toLowerCase()} completed`,
                )
              ) {
                setReview(false);
                setAmount("");
              }
            }}
          >
            Confirm demo {side.toLowerCase()} <ArrowRight />
          </Button>
        </DialogContent>
      </Dialog>
    </section>
  );
}
export function TradePage() {
  const { state } = useDemo();
  const [selected, setSelected] = useState<Transaction | null>(null);
  return (
    <>
      <PageTitle
        title="Your INC. Your next move."
        description="Buy and sell in a clear, simulated trading experience."
      />
      <div className="two-col">
        <div>
          <PortfolioChart
            value={state.settings.price}
            title="INC / USDT"
            price
          />
          <div className="panel panel-pad mt-[22px]">
            <div className="panel-title">
              <h2>Know what you’re trading.</h2>
              <Orbit className="accent-text" size={19} />
            </div>
            <p className="subtle mt-4">
              INC is the native asset of IONCO SmartChain. The price above is an
              illustrative demo price, not a live market quote or confirmed
              listing.
            </p>
            <a
              href={LINKS.whitepaper}
              target="_blank"
              rel="noreferrer"
              className="text-link mt-5"
            >
              Read the original whitepaper <ArrowUpRight />
            </a>
          </div>
        </div>
        <TradeWidget />
      </div>
      <div className="section-row">
        <h2>Your recent trades</h2>
        <Link href="/dashboard/activity" className="text-link">
          All activity <ArrowUpRight />
        </Link>
      </div>
      <div className="panel">
        <TransactionTable
          transactions={state.transactions
            .filter((t) => t.type === "Buy" || t.type === "Sell")
            .slice(0, 5)}
          onSelect={setSelected}
        />
      </div>
      <TransactionDetail
        transaction={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
export function ActivityPage({ admin = false }: { admin?: boolean }) {
  const { state } = useDemo();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Transaction | null>(null);
  const filtered = state.transactions.filter(
    (t) =>
      (filter === "all" || t.type === filter) &&
      `${t.id} ${t.type} ${t.wallet}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / 8));
  const effectivePage = Math.min(page, totalPages);
  const shown = filtered.slice((effectivePage - 1) * 8, effectivePage * 8);
  const download = () =>
    exportCSV(
      "ionco-demo-transactions.csv",
      [
        "Reference",
        "Type",
        "INC amount",
        "Demo USD value",
        "UTC date",
        "Status",
        "Demo wallet",
      ],
      filtered.map((t) => [
        t.id,
        t.type,
        t.amount,
        t.value,
        t.date,
        t.status,
        t.wallet,
      ]),
    );
  return (
    <>
      <PageTitle
        title={admin ? "Transactions" : "Every move, in one place."}
        description={
          admin
            ? "Review the simulated ledger and export filtered records."
            : "Track your demo trades, stakes, and rewards."
        }
      >
        <Button className="btn-secondary" onClick={download}>
          <Download />
          Export CSV
        </Button>
      </PageTitle>
      <div className="panel">
        <div className="table-toolbar">
          <div className="search-field">
            <Search />
            <Input
              aria-label="Search transactions"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search reference, wallet, or type…"
            />
          </div>
          <div className="flex gap-2">
            <Select
              value={filter}
              onValueChange={(v) => {
                setFilter(v);
                setPage(1);
              }}
            >
              <SelectTrigger
                aria-label="Filter transaction type"
                className="min-h-10 text-xs"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["all", "Buy", "Sell", "Stake", "Unstake", "Claim"].map(
                  (t) => (
                    <SelectItem value={t} key={t}>
                      {t === "all" ? "All transactions" : t}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              className="min-h-10 min-w-10"
              aria-label="Export filtered transactions"
              onClick={download}
            >
              <Download size={15} />
            </Button>
          </div>
        </div>
        <TransactionTable
          transactions={shown}
          admin={admin}
          onSelect={setSelected}
        />
        <div className="table-footer">
          <span>
            {filtered.length
              ? `${(effectivePage - 1) * 8 + 1}–${Math.min(effectivePage * 8, filtered.length)}`
              : "0"}{" "}
            of {filtered.length} transactions
          </span>
          <Pagination className="w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  aria-label="Previous page"
                  disabled={effectivePage === 1}
                  onClick={() => setPage(effectivePage - 1)}
                >
                  <ChevronLeft size={14} />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <span className="px-2">
                  {effectivePage} / {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  aria-label="Next page"
                  disabled={effectivePage === totalPages}
                  onClick={() => setPage(effectivePage + 1)}
                >
                  <ChevronRight size={14} />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
      <TransactionDetail
        transaction={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
export function WalletPage() {
  const { state, act } = useDemo();
  const { staked, total } = useTotals();
  const [network, setNetwork] = useState(false);
  const [receive, setReceive] = useState(false);
  return (
    <>
      <PageTitle
        title="A home for your assets."
        description="Your demo wallet, balances, and network details."
      />
      <div className="equal-col">
        <section className="panel wallet-hero">
          <div className="panel-title">
            <h2 className="flex gap-2 items-center">
              <Wallet size={17} />
              Portfolio balance
            </h2>
            <span className="preview-label">DEMO</span>
          </div>
          <div className="balance">{money(total)}</div>
          <div className="balance-caption">
            Available + staked INC and demo USDT
          </div>
          <div className="wallet-address">
            <Globe size={15} />
            <span className="mono">
              {state.connected ? shortAddress(WALLET) : "Wallet not connected"}
            </span>
            {state.connected && (
              <button
                aria-label="Copy demo wallet address"
                onClick={() => copyText(WALLET, "Demo address copied")}
              >
                <Copy />
              </button>
            )}
          </div>
          <div className="wallet-actions">
            {state.connected ? (
              <>
                <Link className="btn-primary" href="/dashboard/trade">
                  <ArrowLeftRight />
                  Buy & sell
                </Link>
                <Button
                  className="btn-secondary"
                  onClick={() => setReceive(true)}
                >
                  <ArrowDownLeft />
                  Receive demo
                </Button>
              </>
            ) : (
              <WalletConnect />
            )}
          </div>
        </section>
        <section className="panel">
          <div className="panel-title p-6 pb-2">
            <h2>Your assets</h2>
            <span className="small-label">2 assets</span>
          </div>
          <div className="asset-row">
            <div className="asset-icon">
              <Orbit size={22} />
            </div>
            <div className="asset-row-text">
              <h3>IONCO</h3>
              <p>Available INC</p>
            </div>
            <div className="asset-row-value">
              <strong>{number(state.balance)} INC</strong>
              <p>{money(state.balance * state.settings.price)}</p>
            </div>
          </div>
          <div className="asset-row">
            <div className="asset-icon !bg-[#183b34] !border-[#366459] !text-[#89c4aa]">
              ₮
            </div>
            <div className="asset-row-text">
              <h3>Demo USDT</h3>
              <p>Trading balance</p>
            </div>
            <div className="asset-row-value">
              <strong>{number(state.usdt)} USDT</strong>
              <p>{money(state.usdt)}</p>
            </div>
          </div>
          <div className="asset-row">
            <div className="asset-icon !bg-[#202e48] !border-[#435578] !text-[#98aad0]">
              <Layers3 size={19} />
            </div>
            <div className="asset-row-text">
              <h3>Staked INC</h3>
              <p>{state.stakes.length} positions</p>
            </div>
            <div className="asset-row-value">
              <strong>{number(staked)} INC</strong>
              <p>{money(staked * state.settings.price)}</p>
            </div>
          </div>
        </section>
      </div>
      <section className="panel panel-pad">
        <div className="panel-title">
          <h2>Connected network</h2>
          <Button
            className="btn-secondary !min-h-10 !text-xs !px-3"
            onClick={() => setNetwork(true)}
          >
            Details <ArrowUpRight />
          </Button>
        </div>
        <div className="setting-row">
          <div>
            <h3>IONCO SmartChain</h3>
            <p>Chain ID {NETWORK.chainId} · IRC20 · Proof of Authority</p>
          </div>
          <Badge tone="pending">Unverified</Badge>
        </div>
        <p className="safe-note">
          <Info />
          The published network configuration is retained for reference. No RPC
          connection is made by this demo.
        </p>
      </section>
      <NetworkDialog open={network} onOpenChange={setNetwork} />
      <Dialog open={receive} onOpenChange={setReceive}>
        <DialogContent className="modal-content">
          <DialogHeader>
            <DialogTitle>Receive · demo preview</DialogTitle>
            <DialogDescription>
              This is a sample address for the interface preview. Do not send
              real assets to it.
            </DialogDescription>
          </DialogHeader>
          <div className="confirm-highlight">
            <Wallet className="mx-auto accent-text mb-4" size={35} />
            <span className="mono break-all leading-7">{WALLET}</span>
          </div>
          <div className="safe-note">
            <Info />
            Deposits are not connected. Explore buying INC with the existing
            demo USDT balance instead.
          </div>
          <Button
            className="btn-secondary"
            onClick={() =>
              copyText(
                `DEMO ONLY — DO NOT SEND FUNDS: ${WALLET}`,
                "Demo address copied with warning",
              )
            }
          >
            <Copy />
            Copy demo reference
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
export function SettingsPage() {
  const { state, act, ready } = useDemo();
  const [reset, setReset] = useState(false);
  const [network, setNetwork] = useState(false);
  return (
    <>
      <PageTitle
        title="Make yourself at home."
        description="Manage your wallet connection and local demo preferences."
      />
      <div className="settings-grid">
        <section className="panel panel-pad">
          <div className="panel-title">
            <h2>Your preferences</h2>
            <Settings2 size={18} className="muted" />
          </div>
          <div className="setting-row">
            <div>
              <h3>Demo profile</h3>
              <p>
                Alex Morgan · alex@example.com
                <br />
                Sample identity, not a real account.
              </p>
            </div>
            <div className="avatar">AM</div>
          </div>
          <div className="setting-row">
            <div>
              <h3>Wallet connection</h3>
              <p>
                {state.connected
                  ? `${state.walletName} · ${shortAddress(WALLET)}`
                  : "Connect a simulated wallet to explore transactions."}
              </p>
            </div>
            <WalletConnect compact />
          </div>
          <div className="setting-row">
            <div>
              <h3>Product updates preference</h3>
              <p>Save your preference locally. No emails are sent.</p>
            </div>
            <Switch
              aria-label="Product updates preference"
              checked={state.settings.emailUpdates}
              disabled={!ready}
              onCheckedChange={(v) =>
                act(
                  { type: "settings", values: { emailUpdates: v } },
                  "Preference saved on this device",
                )
              }
            />
          </div>
          <div className="setting-row">
            <div>
              <h3>Network configuration</h3>
              <p>View the original IONCO network details.</p>
            </div>
            <Button className="btn-secondary" onClick={() => setNetwork(true)}>
              View <ArrowUpRight />
            </Button>
          </div>
          <div className="setting-row">
            <div>
              <h3>Reset this demo</h3>
              <p>
                Restore starting balances, positions, member records, and
                settings on this device.
              </p>
            </div>
            <Button
              className="btn-secondary"
              onClick={() => setReset(true)}
              disabled={!ready}
            >
              <RotateCcw size={14} />
              Reset
            </Button>
          </div>
        </section>
        <section className="panel panel-pad h-fit">
          <div className="feature-icon">
            <ShieldCheck />
          </div>
          <h2 className="text-lg mt-6">Your keys stay yours.</h2>
          <p className="subtle mt-4">
            This preview never asks for a private key, seed phrase, wallet
            signature, or payment. Every transaction uses simulated funds.
          </p>
          <div className="settings-note">
            Demo changes are saved in this browser when storage is available.
            They are not synced to a production account or a blockchain.
          </div>
          <Link href="/dashboard/help" className="text-link mt-6">
            About this experience <ArrowUpRight />
          </Link>
        </section>
      </div>
      <Confirm
        open={reset}
        onOpenChange={setReset}
        title="Reset the entire demo?"
        description="This removes all local trades, stakes, admin changes, and preferences on this device and restores the initial sample data. This cannot be undone."
        confirmLabel="Reset demo"
        danger
        onConfirm={() =>
          act({ type: "reset" }, "Demo restored to its starting state")
        }
      />
      <NetworkDialog open={network} onOpenChange={setNetwork} />
    </>
  );
}
export function HelpPage() {
  const [network, setNetwork] = useState(false);
  return (
    <>
      <PageTitle
        title="A little guidance goes a long way."
        description="Understand the demo and explore the original IONCO resources."
      />
      <div className="equal-col">
        <section className="panel panel-pad">
          <div className="feature-icon">
            <CircleHelp />
          </div>
          <h2 className="text-xl mt-6">What you can explore</h2>
          <div className="form-stack mt-7">
            {[
              {
                title: "Connect",
                text: "Choose a simulated wallet. There is no extension request, signature, or blockchain connection.",
              },
              {
                title: "Stake",
                text: "Create positions, review lock periods, claim seeded rewards, and withdraw unlocked positions. New rewards do not accrue over time.",
              },
              {
                title: "Buy & sell",
                text: "Swap demo INC and USDT at a configurable illustrative price. Quotes include the demo transaction fee.",
              },
              {
                title: "Manage",
                text: "In the admin demo, review sample members, edit pools, pause products, and update the homepage. Changes stay on this device.",
              },
            ].map((h, i) => (
              <div key={h.title}>
                <h3 className="text-sm flex gap-3">
                  <span className="accent-text mono">0{i + 1}</span>
                  {h.title}
                </h3>
                <p className="subtle mt-2 ml-7">{h.text}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="panel panel-pad h-fit">
          <div className="feature-icon">
            <BookOpen />
          </div>
          <h2 className="text-xl mt-6">From the original project</h2>
          <p className="subtle mt-4">
            These links lead to IONCO’s existing resources. Published plans and
            legacy infrastructure may be outdated.
          </p>
          <div className="help-list">
            {[
              { title: "IONCO whitepaper", href: LINKS.whitepaper },
              { title: "SmartChain technology", href: LINKS.technology },
              { title: "Network infrastructure", href: LINKS.infrastructure },
              { title: "Block explorer", href: LINKS.explorer },
            ].map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer">
                {l.title}
                <ExternalLink />
              </a>
            ))}
          </div>
          <Button
            className="btn-secondary w-full mt-5"
            onClick={() => setNetwork(true)}
          >
            View network details <Globe size={15} />
          </Button>
          <div className="settings-note">
            Source review: September 5, 2026. INC, chain ID 13152, Proof of
            Authority, and allocation percentages come from the original site.
            Prices, APYs, balances, users, and transactions are sample data.
          </div>
        </section>
      </div>
      <NetworkDialog open={network} onOpenChange={setNetwork} />
    </>
  );
}

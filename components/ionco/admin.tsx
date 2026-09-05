"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Layers3,
  ArrowLeftRight,
  Wallet,
  ArrowUpRight,
  Search,
  Download,
  ShieldCheck,
  ShieldAlert,
  Settings2,
  CircleHelp,
  Check,
  X,
  Pencil,
  Eye,
  Save,
  FileText,
  LockKeyhole,
  UnlockKeyhole,
  Orbit,
  Info,
  Copy,
  Pause,
  ScrollText,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDemo } from "./demo-provider";
import {
  Badge,
  Confirm,
  Empty,
  PageTitle,
  TransactionDetail,
  TransactionTable,
  copyText,
  exportCSV,
} from "./shared";
import { StatCard, ActivityPage } from "./dashboard";
import { PortfolioChart } from "./chart";
import {
  LINKS,
  NETWORK,
  dateLabel,
  money,
  number,
  shortAddress,
  type Pool,
  type Member,
  type Transaction,
  type DemoState,
} from "@/lib/ionco-data";
export function AdminOverview() {
  const { state, act } = useDemo();
  const [selected, setSelected] = useState<Transaction | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const staked = state.stakes.reduce((s, p) => s + p.amount, 0);
  const pending = state.members.filter((m) => m.kyc === "Pending");
  const volume = state.transactions
    .filter((t) => t.type === "Buy" || t.type === "Sell")
    .reduce((s, t) => s + t.value, 0);
  return (
    <>
      <PageTitle
        title="The ecosystem, in focus."
        description="Your control center for the IONCO demo workspace."
        eyebrow="IONCO ADMINISTRATION"
      >
        <Link href="/dashboard" className="btn-secondary">
          View member app <ArrowUpRight />
        </Link>
      </PageTitle>
      <div className="stats-grid">
        <StatCard
          label="Sample members"
          value={number(state.members.length)}
          detail={`${state.members.filter((m) => m.status === "Active").length} active · ${pending.length} pending KYC`}
          icon={Users}
          primary
        />
        <StatCard
          label="Demo total staked"
          value={number(staked)}
          unit="INC"
          detail={`${state.stakes.length} member positions`}
          icon={Layers3}
        />
        <StatCard
          label="Demo trade volume"
          value={money(volume)}
          detail="Buy + sell values in the local ledger"
          icon={ArrowLeftRight}
        />
        <StatCard
          label="Staking pools"
          value={`${state.pools.filter((p) => p.active).length} / ${state.pools.length}`}
          detail="Active pools · illustrative terms"
          icon={Wallet}
        />
      </div>
      <div className="two-col">
        <PortfolioChart title="Staking overview" value={staked} admin />
        <section className="panel panel-pad">
          <div className="panel-title">
            <h2>Needs your attention</h2>
            <Badge tone="pending">{pending.length} pending</Badge>
          </div>
          {pending.length ? (
            pending.map((m) => (
              <div className="admin-queue" key={m.id}>
                <div className="avatar">
                  {m.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="admin-queue-text">
                  <h3>{m.name}</h3>
                  <p>Sample identity review</p>
                </div>
                <Button className="btn-secondary" onClick={() => setMember(m)}>
                  Review
                </Button>
              </div>
            ))
          ) : (
            <Empty title="You’re all caught up">
              No pending demo identity reviews.
            </Empty>
          )}
          <div className="settings-note !mt-4 !p-3 !text-[11px]">
            No real identity documents are stored. Review actions only update
            sample records.
          </div>
          <Link href="/admin/users" className="text-link mt-5 !text-xs">
            All members <ArrowUpRight />
          </Link>
        </section>
      </div>
      <div className="equal-col">
        <section className="panel panel-pad">
          <div className="panel-title">
            <h2>Product controls</h2>
            <Settings2 size={16} className="muted" />
          </div>
          <div className="setting-row">
            <div>
              <h3>Demo trading</h3>
              <p>Allow simulated INC buy and sell orders.</p>
            </div>
            <Switch
              aria-label="Enable demo trading"
              checked={state.settings.trading}
              onCheckedChange={(v) =>
                act(
                  { type: "settings", values: { trading: v } },
                  v ? "Demo trading enabled" : "Demo trading paused",
                )
              }
            />
          </div>
          <div className="setting-row">
            <div>
              <h3>Demo staking</h3>
              <p>Allow new simulated staking positions.</p>
            </div>
            <Switch
              aria-label="Enable demo staking"
              checked={state.settings.staking}
              onCheckedChange={(v) =>
                act(
                  { type: "settings", values: { staking: v } },
                  v ? "Demo staking enabled" : "New demo stakes paused",
                )
              }
            />
          </div>
        </section>
        <section className="panel panel-pad">
          <div className="panel-title">
            <h2>Integration readiness</h2>
            <Globe size={16} className="muted" />
          </div>
          <div className="setting-row">
            <div>
              <h3>Wallets & contracts</h3>
              <p>No live signing provider or deployed staking contract.</p>
            </div>
            <Badge tone="pending">Demo</Badge>
          </div>
          <div className="setting-row">
            <div>
              <h3>Published network RPC</h3>
              <p>Legacy HTTP endpoint · Chain ID 13152.</p>
            </div>
            <Badge tone="pending">Unverified</Badge>
          </div>
        </section>
      </div>
      <div className="section-row">
        <h2>Recent transactions</h2>
        <Link href="/admin/transactions" className="text-link">
          View ledger <ArrowUpRight />
        </Link>
      </div>
      <div className="panel">
        <TransactionTable
          transactions={state.transactions.slice(0, 4)}
          onSelect={setSelected}
        />
      </div>
      <TransactionDetail
        transaction={selected}
        onClose={() => setSelected(null)}
      />
      <MemberDetail member={member} onClose={() => setMember(null)} />
    </>
  );
}
function MemberDetail({
  member,
  onClose,
}: {
  member: Member | null;
  onClose: () => void;
}) {
  const { state, act } = useDemo();
  const [suspend, setSuspend] = useState(false);
  const m = state.members.find((v) => v.id === member?.id);
  const holdings =
    m?.id === "USR-001"
      ? state.balance + state.stakes.reduce((s, p) => s + p.amount, 0)
      : m?.balance || 0;
  return (
    <>
      <Sheet open={!!member} onOpenChange={(v) => !v && onClose()}>
        <SheetContent className="!w-[min(100%,450px)] !max-w-none !bg-[#101e26] !border-[#36505e] overflow-y-auto">
          <SheetHeader className="p-7 pb-0">
            <SheetTitle>Member details</SheetTitle>
            <SheetDescription>
              Sample member record · no real identity data.
            </SheetDescription>
          </SheetHeader>
          {m && (
            <div className="p-7">
              <div className="flex gap-4 items-center mb-7">
                <div className="avatar !size-12 !text-sm">
                  {m.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <h2 className="text-lg">{m.name}</h2>
                  <p className="subtle mt-1">{m.email}</p>
                </div>
              </div>
              <dl className="network-details">
                <div>
                  <dt>Member ID</dt>
                  <dd>{m.id}</dd>
                </div>
                <div>
                  <dt>Account</dt>
                  <dd>
                    <Badge tone={m.status === "Active" ? "good" : "bad"}>
                      {m.status}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt>Identity status</dt>
                  <dd>
                    <Badge
                      tone={
                        m.kyc === "Verified"
                          ? "good"
                          : m.kyc === "Pending"
                            ? "pending"
                            : "bad"
                      }
                    >
                      {m.kyc}
                    </Badge>
                  </dd>
                </div>
                <div>
                  <dt>Demo holdings</dt>
                  <dd>{number(holdings)} INC</dd>
                </div>
                <div>
                  <dt>Joined</dt>
                  <dd>{m.joined}</dd>
                </div>
                <div>
                  <dt>Wallet</dt>
                  <dd className="mono break-all">{m.wallet}</dd>
                </div>
              </dl>
              <div className="settings-note">
                No KYC documents or provider are connected. Approve and reject
                actions demonstrate the review workflow only.
              </div>
              <div className="grid grid-cols-2 gap-3 mt-5">
                <Button
                  className="btn-primary !text-xs !px-3"
                  disabled={m.kyc === "Verified"}
                  onClick={() =>
                    act(
                      { type: "member", id: m.id, kyc: "Verified" },
                      "Demo identity approved",
                    )
                  }
                >
                  <Check size={15} />
                  Approve demo
                </Button>
                <Button
                  className="btn-secondary !text-xs !px-3"
                  disabled={m.kyc === "Rejected"}
                  onClick={() =>
                    act(
                      { type: "member", id: m.id, kyc: "Rejected" },
                      "Demo identity rejected",
                    )
                  }
                >
                  <X size={15} />
                  Reject demo
                </Button>
              </div>
              <Button
                className="btn-secondary w-full mt-4"
                onClick={() => setSuspend(true)}
              >
                {m.status === "Active" ? "Suspend member" : "Restore member"}
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <Confirm
        open={suspend}
        onOpenChange={setSuspend}
        title={
          m?.status === "Active"
            ? "Suspend this demo member?"
            : "Restore this demo member?"
        }
        description={
          m?.id === "USR-001"
            ? "This changes the sample member’s account status. Suspending this account also blocks financial demo actions in the member dashboard."
            : "This updates the local sample record only."
        }
        confirmLabel={
          m?.status === "Active" ? "Suspend member" : "Restore member"
        }
        danger={m?.status === "Active"}
        onConfirm={() => {
          if (m)
            act(
              {
                type: "member",
                id: m.id,
                status: m.status === "Active" ? "Suspended" : "Active",
              },
              "Demo member status updated",
            );
        }}
      />
    </>
  );
}
export function MembersPage() {
  const { state } = useDemo();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [member, setMember] = useState<Member | null>(null);
  const filtered = state.members.filter(
    (m) =>
      `${m.name} ${m.email} ${m.id} ${m.wallet}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (filter === "all" || m.kyc === filter || m.status === filter),
  );
  const exportMembers = () =>
    exportCSV(
      "ionco-demo-members.csv",
      ["ID", "Name", "Sample email", "Account status", "Demo KYC", "Joined"],
      filtered.map((m) => [m.id, m.name, m.email, m.status, m.kyc, m.joined]),
    );
  return (
    <>
      <PageTitle
        title="People behind the possibilities."
        description="Review sample accounts and demo identity checks."
      >
        <Button className="btn-secondary" onClick={exportMembers}>
          <Download />
          Export CSV
        </Button>
      </PageTitle>
      <div className="stats-grid member-stats">
        <StatCard
          label="Total members"
          value={String(state.members.length)}
          detail="Sample accounts"
          icon={Users}
        />
        <StatCard
          label="Pending review"
          value={String(
            state.members.filter((m) => m.kyc === "Pending").length,
          )}
          detail="Demo KYC records"
          icon={ShieldAlert}
        />
        <StatCard
          label="Active accounts"
          value={String(
            state.members.filter((m) => m.status === "Active").length,
          )}
          detail="Locally enabled"
          icon={ShieldCheck}
        />
      </div>
      <div className="panel">
        <div className="table-toolbar">
          <div className="search-field">
            <Search />
            <Input
              aria-label="Search members"
              placeholder="Search name, email, or wallet…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger
                aria-label="Filter member status"
                className="min-h-10 text-xs"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["all", "Pending", "Verified", "Rejected", "Suspended"].map(
                  (v) => (
                    <SelectItem value={v} key={v}>
                      {v === "all" ? "All members" : v}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              aria-label="Export filtered members"
              className="min-h-10 min-w-10"
              onClick={exportMembers}
            >
              <Download size={15} />
            </Button>
          </div>
        </div>
        {filtered.length ? (
          <Table className="data-table">
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Identity</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>
                    <div className="flex gap-3 items-center">
                      <div className="avatar !size-8">
                        {m.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="member-cell">
                        <strong>{m.name}</strong>
                        <small>{m.email}</small>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge tone={m.status === "Active" ? "good" : "bad"}>
                      {m.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      tone={
                        m.kyc === "Verified"
                          ? "good"
                          : m.kyc === "Pending"
                            ? "pending"
                            : "bad"
                      }
                    >
                      {m.kyc}
                    </Badge>
                  </TableCell>
                  <TableCell>{dateLabel(m.joined)}</TableCell>
                  <TableCell>
                    <button className="row-action" onClick={() => setMember(m)}>
                      <Eye />
                      Review
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Empty title="No members match">
            Try another search or status filter.
          </Empty>
        )}
        <div className="table-footer">
          <span>
            {filtered.length} of {state.members.length} sample members
          </span>
          <span>No real customer data</span>
        </div>
      </div>
      <MemberDetail member={member} onClose={() => setMember(null)} />
    </>
  );
}
export function AdminWallets() {
  const { state } = useDemo();
  const [query, setQuery] = useState("");
  const rows = state.members
    .map((m) => ({
      ...m,
      balance:
        m.id === "USR-001"
          ? state.balance + state.stakes.reduce((s, p) => s + p.amount, 0)
          : m.balance,
    }))
    .filter((m) =>
      `${m.name} ${m.wallet}`.toLowerCase().includes(query.toLowerCase()),
    );
  const [member, setMember] = useState<Member | null>(null);
  const download = () =>
    exportCSV(
      "ionco-demo-wallets.csv",
      ["Sample member", "Wallet reference", "Demo INC holdings", "Status"],
      rows.map((m) => [m.name, m.wallet, m.balance, m.status]),
    );
  return (
    <>
      <PageTitle
        title="Assets, accounted for."
        description="Inspect sample member holdings. Wallets are simulated and cannot receive real assets."
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
              aria-label="Search wallets"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search member or wallet…"
            />
          </div>
          <Button
            className="btn-secondary !min-h-10 !text-xs"
            onClick={download}
          >
            <Download size={14} />
            Export
          </Button>
        </div>
        {rows.length ? (
          <Table className="data-table">
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Demo wallet</TableHead>
                <TableHead>INC holdings</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{m.name}</TableCell>
                  <TableCell className="mono">
                    {shortAddress(m.wallet)}
                  </TableCell>
                  <TableCell>
                    {number(m.balance)} INC
                    <span className="block text-[10px] muted mt-1">
                      {money(m.balance * state.settings.price)} demo value
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge tone={m.status === "Active" ? "good" : "bad"}>
                      {m.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <button className="row-action" onClick={() => setMember(m)}>
                      <Eye />
                      Inspect
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Empty title="No wallets match">
            Try another name or wallet reference.
          </Empty>
        )}
        <div className="table-footer">
          <span>{rows.length} sample wallets</span>
          <span>Read-only wallet overview</span>
        </div>
      </div>
      <MemberDetail member={member} onClose={() => setMember(null)} />
    </>
  );
}
function PoolEditor({
  pool,
  onClose,
}: {
  pool: Pool | null;
  onClose: () => void;
}) {
  const { act } = useDemo();
  const [draft, setDraft] = useState<Pool | null>(pool);
  useEffect(() => setDraft(pool), [pool]);
  return (
    <Dialog open={!!pool} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="modal-content">
        <DialogHeader>
          <DialogTitle>Edit demo pool</DialogTitle>
          <DialogDescription>
            Updated terms apply to new stakes. Existing positions keep their
            original APY and unlock date.
          </DialogDescription>
        </DialogHeader>
        {draft && (
          <form
            className="form-stack mt-3"
            onSubmit={(e) => {
              e.preventDefault();
              if (act({ type: "pool", pool: draft }, "Demo pool updated"))
                onClose();
            }}
          >
            <div>
              <label className="field-label" htmlFor="pool-name">
                Pool name
              </label>
              <Input
                className="form-input"
                id="pool-name"
                maxLength={40}
                required
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="pool-desc">
                Description
              </label>
              <Textarea
                className="form-input"
                id="pool-desc"
                maxLength={160}
                value={draft.description}
                onChange={(e) =>
                  setDraft({ ...draft, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="field-label" htmlFor="pool-apy">
                  Illustrative APY (%)
                </label>
                <Input
                  className="form-input"
                  id="pool-apy"
                  type="number"
                  inputMode="decimal"
                  required
                  min="0"
                  max="100"
                  step="0.1"
                  value={draft.apy}
                  onChange={(e) =>
                    setDraft({ ...draft, apy: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <label className="field-label" htmlFor="pool-days">
                  Lock period (days)
                </label>
                <Input
                  className="form-input"
                  id="pool-days"
                  type="number"
                  inputMode="numeric"
                  required
                  min="0"
                  max="3650"
                  step="1"
                  value={draft.days}
                  onChange={(e) =>
                    setDraft({ ...draft, days: Number(e.target.value) })
                  }
                />
              </div>
            </div>
            <div>
              <label className="field-label" htmlFor="pool-min">
                Minimum stake (INC)
              </label>
              <Input
                className="form-input"
                id="pool-min"
                type="number"
                inputMode="decimal"
                required
                min="0.00000001"
                max="1000000000"
                step="any"
                value={draft.min}
                onChange={(e) =>
                  setDraft({ ...draft, min: Number(e.target.value) })
                }
              />
            </div>
            <div className="setting-row !py-1 !border-0">
              <div>
                <h3>Pool active</h3>
                <p>Allow new demo positions in this pool.</p>
              </div>
              <Switch
                aria-label="Pool active"
                checked={draft.active}
                onCheckedChange={(v) => setDraft({ ...draft, active: v })}
              />
            </div>
            <Button type="submit" className="btn-primary">
              <Save size={15} />
              Save demo pool
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
export function AdminPools() {
  const { state, act } = useDemo();
  const [pool, setPool] = useState<Pool | null>(null);
  return (
    <>
      <PageTitle
        title="The terms of possibility."
        description="Configure staking products and availability for the demo."
      />
      <div className="admin-alert">
        <Info />
        <div>
          <strong>Illustrative staking configuration</strong>
          <p>
            No deployed staking contract or verified rewards program is
            connected. Editing a pool changes the local demo only.
          </p>
        </div>
      </div>
      <div className="pool-admin-grid">
        {state.pools.map((p, i) => (
          <article
            className={`pool-card ${i === 1 ? "featured" : ""}`}
            key={p.id}
          >
            <div className="pool-heading">
              <span className="flex gap-2 items-center">
                {p.days ? <LockKeyhole /> : <UnlockKeyhole />}
                {p.name}
              </span>
              <Badge tone={p.active ? "good" : "pending"}>
                {p.active ? "Active" : "Paused"}
              </Badge>
            </div>
            <div className="pool-apy">
              {p.apy}%<small>illustrative APY</small>
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
            <div className="pool-facts">
              <div>
                Demo positions
                <strong>
                  {state.stakes.filter((s) => s.poolId === p.id).length}
                </strong>
              </div>
              <div className="text-right">
                Total staked
                <strong>
                  {number(
                    state.stakes
                      .filter((s) => s.poolId === p.id)
                      .reduce((s, v) => s + v.amount, 0),
                  )}{" "}
                  INC
                </strong>
              </div>
            </div>
            <div className="setting-row !pb-0 !border-0">
              <span className="small-label">Accept new stakes</span>
              <Switch
                aria-label={`Enable ${p.name} pool`}
                checked={p.active}
                onCheckedChange={(v) =>
                  act(
                    { type: "pool", pool: { ...p, active: v } },
                    `${p.name} ${v ? "enabled" : "paused"}`,
                  )
                }
              />
            </div>
            <Button className="btn-secondary" onClick={() => setPool(p)}>
              <Pencil size={14} />
              Edit pool
            </Button>
          </article>
        ))}
      </div>
      <div className="settings-note">
        Pausing a pool blocks new stakes. Existing positions and reward claims
        remain available under their original terms. Global maintenance pauses
        all financial demo actions.
      </div>
      <PoolEditor pool={pool} onClose={() => setPool(null)} />
    </>
  );
}
export function AdminContent() {
  const { state, ready, act } = useDemo();
  const [draft, setDraft] = useState(state.content);
  useEffect(() => setDraft(state.content), [state.content]);
  return (
    <>
      <PageTitle
        title="Shape the next chapter."
        description="Edit the homepage copy and preview it before saving."
      >
        <Link href="/" className="btn-secondary">
          Open website <ArrowUpRight />
        </Link>
      </PageTitle>
      <div className="settings-grid">
        <section className="panel panel-pad">
          <div className="panel-title mb-7">
            <h2>Homepage content</h2>
            <FileText size={17} className="muted" />
          </div>
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              act(
                { type: "content", values: draft },
                "Homepage content saved in this browser",
              );
            }}
          >
            <div>
              <label className="field-label" htmlFor="cms-announcement">
                Announcement
              </label>
              <Input
                className="form-input"
                id="cms-announcement"
                maxLength={100}
                value={draft.announcement}
                onChange={(e) =>
                  setDraft({ ...draft, announcement: e.target.value })
                }
              />
              <p className="field-help">
                Leave empty to hide the announcement pill.
              </p>
            </div>
            <div>
              <label className="field-label" htmlFor="cms-headline">
                Hero headline
              </label>
              <Textarea
                className="form-input min-h-28"
                id="cms-headline"
                required
                maxLength={80}
                value={draft.headline}
                onChange={(e) =>
                  setDraft({ ...draft, headline: e.target.value })
                }
              />
              <p className="field-help">
                Use a line break for the second line. {draft.headline.length}/80
                characters.
              </p>
            </div>
            <div>
              <label className="field-label" htmlFor="cms-description">
                Supporting description
              </label>
              <Textarea
                className="form-input min-h-32"
                id="cms-description"
                required
                maxLength={200}
                value={draft.description}
                onChange={(e) =>
                  setDraft({ ...draft, description: e.target.value })
                }
              />
              <p className="field-help">
                {draft.description.length}/200 characters.
              </p>
            </div>
            <Button className="btn-primary" type="submit" disabled={!ready}>
              <Save size={16} />
              Save demo content
            </Button>
          </form>
          <p className="safe-note">
            <Info />
            Changes appear on the homepage in this browser. They do not publish
            to ioncochain.com.
          </p>
        </section>
        <div>
          <div className="panel-title mb-4">
            <h2>Content preview</h2>
            <Eye size={16} className="muted" />
          </div>
          <div className="content-preview">
            <img
              src="/images/ionco-orbit-mobile.webp"
              alt="IONCO cyan glass orbit"
              width="960"
              height="640"
              loading="lazy"
            />
            <div>
              {draft.announcement && (
                <div className="eyebrow">{draft.announcement}</div>
              )}
              <h3>{draft.headline}</h3>
              <p>{draft.description}</p>
              <div className="btn-primary mt-6 !text-xs" aria-hidden="true">
                Explore the ecosystem <ArrowUpRight />
              </div>
            </div>
          </div>
          <div className="settings-note">
            Project facts, source links, allocation percentages, and historical
            roadmap are maintained in the source code so editorial changes
            cannot silently alter financial disclosures.
          </div>
        </div>
      </div>
    </>
  );
}
export function AdminSettings() {
  const { state, ready, act } = useDemo();
  const [price, setPrice] = useState(String(state.settings.price));
  const [fee, setFee] = useState(String(state.settings.fee));
  useEffect(() => {
    setPrice(String(state.settings.price));
    setFee(String(state.settings.fee));
  }, [state.settings.price, state.settings.fee]);
  const toggles: {
    key: "trading" | "staking" | "maintenance";
    title: string;
    description: string;
  }[] = [
    {
      key: "trading",
      title: "Trading enabled",
      description: "Allow demo buys and sells at the configured price.",
    },
    {
      key: "staking",
      title: "New stakes enabled",
      description: "Allow new stakes in active pools.",
    },
    {
      key: "maintenance",
      title: "Maintenance mode",
      description: "Pause trading, new stakes, withdrawals, and reward claims.",
    },
  ];
  return (
    <>
      <PageTitle
        title="Control, without the clutter."
        description="Manage demo products, rates, and integration readiness."
      />
      <div className="settings-grid">
        <div className="form-stack">
          <section className="panel panel-pad">
            <div className="panel-title">
              <h2>Product availability</h2>
              <Settings2 size={17} className="muted" />
            </div>
            {toggles.map((t) => (
              <div className="setting-row" key={t.key}>
                <div>
                  <h3>{t.title}</h3>
                  <p>{t.description}</p>
                </div>
                <Switch
                  aria-label={t.title}
                  checked={state.settings[t.key]}
                  disabled={!ready}
                  onCheckedChange={(v) =>
                    act(
                      { type: "settings", values: { [t.key]: v } },
                      "Demo product setting updated",
                    )
                  }
                />
              </div>
            ))}
          </section>
          <section className="panel panel-pad">
            <div className="panel-title mb-7">
              <h2>Demo market configuration</h2>
              <ArrowLeftRight size={17} className="muted" />
            </div>
            <form
              className="form-stack"
              onSubmit={(e) => {
                e.preventDefault();
                act(
                  {
                    type: "settings",
                    values: { price: Number(price), fee: Number(fee) },
                  },
                  "Demo rate and fee updated",
                );
              }}
            >
              <div>
                <label className="field-label" htmlFor="demo-price">
                  INC price (USDT)
                </label>
                <Input
                  className="form-input"
                  id="demo-price"
                  type="number"
                  inputMode="decimal"
                  required
                  min="0.00000001"
                  max="1000000000"
                  step="any"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <p className="field-help">
                  Fixed illustrative price. No market feed is connected.
                </p>
              </div>
              <div>
                <label className="field-label" htmlFor="demo-fee">
                  Transaction fee (%)
                </label>
                <Input
                  className="form-input"
                  id="demo-fee"
                  type="number"
                  inputMode="decimal"
                  required
                  min="0"
                  max="10"
                  step="0.01"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                />
              </div>
              <Button type="submit" className="btn-primary" disabled={!ready}>
                <Save size={16} />
                Save demo rates
              </Button>
            </form>
          </section>
        </div>
        <section className="panel panel-pad h-fit">
          <div className="panel-title">
            <h2>Integration configuration</h2>
            <ShieldCheck size={17} className="muted" />
          </div>
          <dl className="network-details">
            <div>
              <dt>Network</dt>
              <dd>{NETWORK.name}</dd>
            </div>
            <div>
              <dt>Chain ID</dt>
              <dd className="mono">13152</dd>
            </div>
            <div>
              <dt>Consensus</dt>
              <dd>Proof of Authority</dd>
            </div>
            <div>
              <dt>Staking contract</dt>
              <dd>Not configured</dd>
            </div>
            <div>
              <dt>Wallet provider</dt>
              <dd>Simulation only</dd>
            </div>
            <div>
              <dt>KYC provider</dt>
              <dd>Not connected</dd>
            </div>
            <div>
              <dt>Live trading</dt>
              <dd>Not connected</dd>
            </div>
            <div>
              <dt>Admin authentication</dt>
              <dd>Demo access only</dd>
            </div>
          </dl>
          <div className="settings-note">
            This page contains no production credentials. Real integrations and
            server-enforced administrator permissions must be implemented before
            enabling live operations.
          </div>
          <Link href="/admin/audit" className="text-link mt-6">
            Review admin changes <ArrowUpRight />
          </Link>
        </section>
      </div>
    </>
  );
}
export function AuditPage() {
  const { state } = useDemo();
  const [query, setQuery] = useState("");
  const rows = state.audit.filter((l) =>
    `${l.action} ${l.detail} ${l.id}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  const download = () =>
    exportCSV(
      "ionco-demo-audit.csv",
      ["Reference", "UTC date", "Action", "Detail"],
      rows.map((l) => [l.id, l.date, l.action, l.detail]),
    );
  return (
    <>
      <PageTitle
        title="A record of every decision."
        description="Review local administrative changes in the demo workspace."
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
              aria-label="Search audit log"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search actions or details…"
            />
          </div>
          <Button
            className="btn-secondary !min-h-10 !text-xs"
            onClick={download}
          >
            <Download size={14} />
            Export
          </Button>
        </div>
        {rows.length ? (
          rows.map((l) => (
            <article className="audit-row" key={l.id}>
              <div className="tx-icon">
                <ScrollText size={15} />
              </div>
              <div>
                <h3>{l.action}</h3>
                <p>{l.detail}</p>
                <time dateTime={l.date}>
                  {new Date(l.date).toLocaleString("en-US", {
                    timeZone: "UTC",
                  })}{" "}
                  UTC · {l.id}
                </time>
              </div>
            </article>
          ))
        ) : (
          <Empty title="No matching events">
            Try another search or change a demo setting.
          </Empty>
        )}
        <div className="table-footer">
          <span>{rows.length} events · latest 300 retained</span>
          <span>Local demo log</span>
        </div>
      </div>
      <p className="safe-note">
        <Info />
        This browser log is editable local data, not a production audit trail.
      </p>
    </>
  );
}
export function AdminTransactions() {
  return <ActivityPage admin />;
}

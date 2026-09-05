"use client";
import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowRight,
  Orbit,
  Copy,
  ShieldCheck,
  Wallet,
  Globe,
  Info,
  Layers3,
  Inbox,
  Check,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  NETWORK,
  WALLET,
  dateLabel,
  money,
  number,
  shortAddress,
  type Transaction,
} from "@/lib/ionco-data";
export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="IONCO home">
      <Orbit className="logo-mark" strokeWidth={1.6} />
      <div className="logo-words">
        IONCO<span>SMARTCHAIN</span>
      </div>
    </Link>
  );
}
export function Badge({
  children,
  tone = "good",
}: {
  children: ReactNode;
  tone?: "good" | "pending" | "bad";
}) {
  return <span className={`status-badge ${tone}`}>{children}</span>;
}
export function Empty({
  title = "Nothing here yet",
  children,
}: {
  title?: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <Inbox />
      <strong>{title}</strong>
      {children}
    </div>
  );
}
export async function copyText(text: string, label = "Copied") {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(label);
  } catch {
    toast.error(
      "Copy is unavailable in this browser. Select and copy the text manually.",
    );
  }
}
export function NetworkDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="modal-content">
        <DialogHeader>
          <div className="feature-icon mb-3">
            <Globe />
          </div>
          <DialogTitle>Meet IONCO SmartChain</DialogTitle>
          <DialogDescription>
            Network details published on the original IONCO website.
            Availability has not been verified.
          </DialogDescription>
        </DialogHeader>
        <dl className="network-details">
          <div>
            <dt>Network</dt>
            <dd>{NETWORK.name}</dd>
          </div>
          <div>
            <dt>Chain ID</dt>
            <dd className="mono">{NETWORK.chainId}</dd>
          </div>
          <div>
            <dt>Currency / standard</dt>
            <dd>INC / IRC20</dd>
          </div>
          <div>
            <dt>Consensus</dt>
            <dd>Proof of Authority</dd>
          </div>
          <div className="rpc-row">
            <dt>Legacy RPC · unverified HTTP endpoint</dt>
            <dd className="mono">{NETWORK.rpc}</dd>
          </div>
          <div>
            <dt>Block explorer</dt>
            <dd>
              <a
                className="accent-text"
                href={NETWORK.explorer}
                target="_blank"
                rel="noreferrer"
              >
                scan.ioncochain.com ↗
              </a>
            </dd>
          </div>
        </dl>
        <p className="safe-note">
          <Info />
          This preview does not add a live network or request a wallet
          signature. Confirm a working HTTPS RPC with IONCO before live use.
        </p>
        <Button
          className="btn-primary"
          onClick={() => copyText(String(NETWORK.chainId), "Chain ID copied")}
        >
          <Copy />
          Copy chain ID
        </Button>
        <a
          className="text-link justify-center"
          href={NETWORK.source}
          target="_blank"
          rel="noreferrer"
        >
          View original network details <ArrowUpRight />
        </a>
      </DialogContent>
    </Dialog>
  );
}
export function WalletConnect({ compact = false }: { compact?: boolean }) {
  const { state, ready, act } = useDemo();
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button
        className={`btn-primary ${compact ? "wallet-button" : ""}`}
        onClick={() => setOpen(true)}
        disabled={!ready}
      >
        <Wallet size={15} />
        {state.connected ? shortAddress(WALLET) : "Connect wallet"}
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="modal-content">
          <DialogHeader>
            <div className="feature-icon mb-3">
              <Wallet />
            </div>
            <DialogTitle>
              {state.connected
                ? "Your demo wallet"
                : "Connect to your possibilities"}
            </DialogTitle>
            <DialogDescription>
              {state.connected
                ? "A simulated connection. This address contains no real funds."
                : "Choose a wallet experience to explore. No extension, seed phrase, or real wallet connection is needed."}
            </DialogDescription>
          </DialogHeader>
          {state.connected ? (
            <>
              <div className="confirm-highlight">
                <strong className="!text-xl">{state.walletName}</strong>
                <span className="mono break-all">{WALLET}</span>
              </div>
              <Button
                className="btn-secondary"
                onClick={() => copyText(WALLET, "Demo address copied")}
              >
                <Copy />
                Copy demo address
              </Button>
              <Button
                variant="outline"
                className="btn-secondary"
                onClick={() => {
                  act({ type: "disconnect" }, "Demo wallet disconnected");
                  setOpen(false);
                }}
              >
                Disconnect
              </Button>
            </>
          ) : (
            <div className="grid gap-3 mt-2">
              {[
                {
                  name: "IONCO demo wallet",
                  icon: Orbit,
                  note: "Instant access · recommended",
                },
                {
                  name: "MetaMask demo",
                  icon: Wallet,
                  note: "Preview the MetaMask connection flow",
                },
                {
                  name: "WalletConnect demo",
                  icon: Globe,
                  note: "Preview a mobile wallet connection",
                },
              ].map((w) => (
                <button
                  key={w.name}
                  className="wallet-option"
                  onClick={() => {
                    if (
                      act(
                        { type: "connect", wallet: w.name },
                        "Demo wallet connected",
                      )
                    )
                      setOpen(false);
                  }}
                >
                  <w.icon />
                  <div>
                    <strong>{w.name}</strong>
                    <small>{w.note}</small>
                  </div>
                  <ArrowRight className="arrow" />
                </button>
              ))}
            </div>
          )}
          <p className="safe-note">
            <ShieldCheck />
            Demo funds only. IONCO will never ask for your recovery phrase.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
export function Confirm({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel = "Confirm",
  danger = false,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description: ReactNode;
  onConfirm: () => void;
  confirmLabel?: string;
  danger?: boolean;
}) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="modal-content">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="leading-7">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="min-h-11">Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={`min-h-11 ${danger ? "bg-destructive text-black" : ""}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export function exportCSV(
  filename: string,
  headers: string[],
  rows: (string | number)[][],
) {
  const cell = (v: string | number) => {
    const text = String(v);
    return (
      '"' +
      (typeof v === "string" && /^[=+\-@\t\r]/.test(text)
        ? "'" + text
        : text
      ).replace(/"/g, '""') +
      '"'
    );
  };
  const csv = [headers, ...rows]
    .map((row) => row.map(cell).join(","))
    .join("\r\n");
  const url = URL.createObjectURL(
    new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast.success("Demo CSV exported");
}
export function TransactionTable({
  transactions,
  admin = false,
  onSelect,
}: {
  transactions: Transaction[];
  admin?: boolean;
  onSelect?: (t: Transaction) => void;
}) {
  if (!transactions.length)
    return (
      <Empty title="No matching transactions">
        Try another filter or make your first demo transaction.
      </Empty>
    );
  return (
    <Table className="data-table">
      <TableHeader>
        <TableRow>
          <TableHead>Transaction</TableHead>
          {admin && <TableHead>Wallet</TableHead>}
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>
            <span className="sr-only">Details</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((t) => (
          <TableRow key={t.id}>
            <TableCell>
              <div className="tx-type">
                <div className="tx-icon">
                  {t.type === "Buy" || t.type === "Claim" ? (
                    <ArrowDownLeft />
                  ) : t.type === "Stake" ? (
                    <Layers3 />
                  ) : (
                    <ArrowUpRight />
                  )}
                </div>
                <div>
                  {t.type} INC
                  <span className="block text-[10px] muted mt-1">{t.id}</span>
                </div>
              </div>
            </TableCell>
            {admin && (
              <TableCell className="mono">{shortAddress(t.wallet)}</TableCell>
            )}
            <TableCell>
              <span className="block font-medium">{number(t.amount)} INC</span>
              <span className="block text-[10px] muted mt-1">
                {money(t.value)}
              </span>
            </TableCell>
            <TableCell>{dateLabel(t.date)}</TableCell>
            <TableCell>
              <Badge>Completed</Badge>
            </TableCell>
            <TableCell>
              {onSelect && (
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`View ${t.id}`}
                  onClick={() => onSelect(t)}
                >
                  <ArrowUpRight size={14} />
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
export function TransactionDetail({
  transaction,
  onClose,
}: {
  transaction: Transaction | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!transaction} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="modal-content">
        <DialogHeader>
          <DialogTitle>Transaction details</DialogTitle>
          <DialogDescription>
            Simulated transaction receipt. No on-chain transfer took place.
          </DialogDescription>
        </DialogHeader>
        {transaction && (
          <>
            <div className="confirm-highlight">
              <strong>{number(transaction.amount)} INC</strong>
              <span>
                {transaction.type} · {money(transaction.value)} demo value
              </span>
            </div>
            <dl className="network-details">
              <div>
                <dt>Reference</dt>
                <dd className="mono">{transaction.id}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <Badge>Completed</Badge>
                </dd>
              </div>
              <div>
                <dt>Date (UTC)</dt>
                <dd>
                  {new Date(transaction.date).toLocaleString("en-US", {
                    timeZone: "UTC",
                  })}
                </dd>
              </div>
              <div>
                <dt>Demo wallet</dt>
                <dd className="mono break-all">{transaction.wallet}</dd>
              </div>
              <div>
                <dt>Network broadcast</dt>
                <dd>None · demo transaction</dd>
              </div>
            </dl>
            <Button
              className="btn-secondary"
              onClick={() =>
                copyText(transaction.id, "Receipt reference copied")
              }
            >
              <Copy />
              Copy reference
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
export function PageTitle({
  title,
  description,
  children,
  eyebrow,
}: {
  title: string;
  description: string;
  children?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="page-title">
      <div>
        {eyebrow && <div className="greeting-label">{eyebrow}</div>}
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {children && <div className="page-actions">{children}</div>}
    </div>
  );
}

"use client";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { z } from "zod";
import { Toaster, toast } from "sonner";
import { initialState, type DemoState } from "@/lib/ionco-data";
import { transition, type Action } from "@/lib/demo-engine";
const finite = z.number().finite().nonnegative();
const schema = z.object({
  version: z.literal(1),
  connected: z.boolean(),
  walletName: z.string(),
  balance: finite,
  usdt: finite,
  pools: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      days: finite,
      apy: finite,
      min: finite,
      active: z.boolean(),
      description: z.string(),
    }),
  ),
  stakes: z.array(
    z.object({
      id: z.string(),
      poolId: z.string(),
      name: z.string(),
      amount: finite,
      apy: finite,
      unlockAt: z.string().datetime(),
      startedAt: z.string().datetime(),
      rewards: finite,
    }),
  ),
  transactions: z.array(
    z.object({
      id: z.string(),
      type: z.enum(["Buy", "Sell", "Stake", "Unstake", "Claim"]),
      amount: finite,
      value: finite,
      date: z.string().datetime(),
      status: z.literal("Completed"),
      wallet: z.string(),
    }),
  ),
  members: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      wallet: z.string(),
      status: z.enum(["Active", "Suspended"]),
      kyc: z.enum(["Verified", "Pending", "Rejected"]),
      balance: finite,
      joined: z.string(),
    }),
  ),
  audit: z.array(
    z.object({
      id: z.string(),
      date: z.string().datetime(),
      action: z.string(),
      detail: z.string(),
    }),
  ),
  settings: z.object({
    trading: z.boolean(),
    staking: z.boolean(),
    maintenance: z.boolean(),
    emailUpdates: z.boolean(),
    price: z.number().finite().positive(),
    fee: finite.max(10),
  }),
  content: z.object({
    headline: z.string().max(80),
    description: z.string().max(200),
    announcement: z.string().max(100),
  }),
});
const key = "ionco-demo-v1";
const Context = createContext<{
  state: DemoState;
  ready: boolean;
  act: (action: Action, message?: string) => boolean;
}>({ state: initialState(), ready: false, act: () => false });
export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(initialState);
  const [ready, setReady] = useState(false);
  const current = useRef(state);
  const corrupt = useRef(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = schema.safeParse(JSON.parse(saved));
        if (parsed.success) {
          current.current = parsed.data;
          setState(parsed.data);
        } else {
          corrupt.current = true;
          toast.error(
            "Saved demo data could not be loaded. Reset the demo in Settings to restore saving.",
          );
        }
      }
    } catch {
      corrupt.current = true;
      toast.error(
        "Browser storage is unavailable or unreadable. Demo changes will stay in memory.",
      );
    }
    setReady(true);
    const sync = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          const data = schema.parse(JSON.parse(event.newValue));
          corrupt.current = false;
          current.current = data;
          setState(data);
        } catch {
          /* Keep current valid state. */
        }
      }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  function act(action: Action, message?: string) {
    if (!ready) return false;
    try {
      const next = transition(
        current.current,
        action,
        new Date(),
        crypto.randomUUID().slice(0, 8),
      );
      if (action.type === "reset") corrupt.current = false;
      let persisted = false;
      if (!corrupt.current) {
        try {
          localStorage.setItem(key, JSON.stringify(next));
          persisted = true;
        } catch {
          // Keep the previous stored record and the new in-memory session.
        }
      }
      current.current = next;
      setState(next);
      if (persisted && message) toast.success(message);
      if (!persisted) {
        toast.warning(
          "Change applied for this session only. Browser storage is unavailable or needs a reset in Settings.",
        );
      }
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Please try again.");
      return false;
    }
  }
  return (
    <Context.Provider value={{ state, ready, act }}>
      {children}
      <Toaster theme="dark" position="top-center" richColors closeButton />
    </Context.Provider>
  );
}
export const useDemo = () => useContext(Context);

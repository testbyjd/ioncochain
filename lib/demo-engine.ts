import {
  initialState,
  WALLET,
  type DemoState,
  type Pool,
  type Member,
  type Transaction,
} from "./ionco-data";
export type Action =
  | { type: "connect"; wallet: string }
  | { type: "disconnect" }
  | { type: "stake"; poolId: string; amount: number }
  | { type: "unstake"; stakeId: string }
  | { type: "claim" }
  | { type: "trade"; side: "Buy" | "Sell"; amount: number }
  | { type: "pool"; pool: Pool }
  | {
      type: "member";
      id: string;
      status?: Member["status"];
      kyc?: Member["kyc"];
    }
  | { type: "settings"; values: Partial<DemoState["settings"]> }
  | { type: "content"; values: DemoState["content"] }
  | { type: "reset" };
const round = (n: number) => Math.round((n + Number.EPSILON) * 1e8) / 1e8;
const positive = (n: number) => Number.isFinite(n) && n >= 1e-8 && n <= 1e9;
export function transition(
  state: DemoState,
  action: Action,
  now = new Date(),
  id = String(now.getTime()),
): DemoState {
  if (action.type === "reset") return initialState();
  const next = structuredClone(state);
  const audit = (title: string, detail: string) =>
    next.audit.unshift({
      id: `LOG-${id}`,
      date: now.toISOString(),
      action: title,
      detail,
    });
  const transaction = (
    type: Transaction["type"],
    amount: number,
    value: number,
  ) =>
    next.transactions.unshift({
      id: `TX-${id}`,
      type,
      amount: round(amount),
      value: round(value),
      date: now.toISOString(),
      status: "Completed",
      wallet: WALLET,
    });
  if (["stake", "unstake", "claim", "trade"].includes(action.type)) {
    if (!state.connected) throw new Error("Connect your demo wallet first.");
    if (state.settings.maintenance)
      throw new Error(
        "Demo maintenance is enabled. Try again after it is turned off.",
      );
    if (state.members.find((m) => m.id === "USR-001")?.status === "Suspended")
      throw new Error("This demo account is suspended.");
  }
  switch (action.type) {
    case "connect":
      next.connected = true;
      next.walletName = action.wallet;
      break;
    case "disconnect":
      next.connected = false;
      break;
    case "stake": {
      const pool = state.pools.find((p) => p.id === action.poolId);
      if (!state.settings.staking || !pool?.active)
        throw new Error("This staking pool is paused.");
      if (!positive(action.amount) || action.amount < pool.min)
        throw new Error(`Minimum stake is ${pool.min} INC.`);
      if (action.amount > state.balance)
        throw new Error("Not enough available INC.");
      next.balance = round(next.balance - action.amount);
      next.stakes.unshift({
        id: `ST-${id}`,
        poolId: pool.id,
        name: pool.name,
        amount: action.amount,
        apy: pool.apy,
        rewards: 0,
        startedAt: now.toISOString(),
        unlockAt: new Date(now.getTime() + pool.days * 86400000).toISOString(),
      });
      transaction("Stake", action.amount, action.amount * state.settings.price);
      break;
    }
    case "unstake": {
      const stake = state.stakes.find((p) => p.id === action.stakeId);
      if (!stake) throw new Error("Position no longer exists.");
      if (new Date(stake.unlockAt) > now)
        throw new Error("This position is still locked.");
      next.stakes = next.stakes.filter((p) => p.id !== action.stakeId);
      next.balance = round(next.balance + stake.amount + stake.rewards);
      transaction(
        "Unstake",
        stake.amount + stake.rewards,
        (stake.amount + stake.rewards) * state.settings.price,
      );
      break;
    }
    case "claim": {
      const rewards = state.stakes.reduce((sum, p) => sum + p.rewards, 0);
      if (rewards <= 0) throw new Error("No rewards available to claim.");
      next.balance = round(next.balance + rewards);
      next.stakes.forEach((p) => (p.rewards = 0));
      transaction("Claim", rewards, rewards * state.settings.price);
      break;
    }
    case "trade": {
      if (!state.settings.trading) throw new Error("Demo trading is paused.");
      if (!positive(action.amount))
        throw new Error("Enter a valid amount greater than zero.");
      const value = action.amount * state.settings.price;
      const fee = (value * state.settings.fee) / 100;
      if (action.side === "Buy") {
        if (value + fee > state.usdt + 1e-8)
          throw new Error("Not enough demo USDT, including the fee.");
        next.usdt = round(next.usdt - value - fee);
        next.balance = round(next.balance + action.amount);
      } else {
        if (action.amount > state.balance)
          throw new Error("Not enough available INC.");
        next.balance = round(next.balance - action.amount);
        next.usdt = round(next.usdt + value - fee);
      }
      transaction(action.side, action.amount, value);
      break;
    }
    case "pool": {
      const p = action.pool;
      if (
        !p.name.trim() ||
        !positive(p.min) ||
        !Number.isFinite(p.apy) ||
        p.apy < 0 ||
        p.apy > 100 ||
        !Number.isInteger(p.days) ||
        p.days < 0 ||
        p.days > 3650
      )
        throw new Error(
          "Check the pool name, minimum, APY (0–100%), and lock period (0–3,650 days).",
        );
      next.pools = next.pools.map((old) => (old.id === p.id ? p : old));
      audit(
        "Staking pool updated",
        `${p.name} · ${p.apy}% illustrative APY · ${p.active ? "Active" : "Paused"}. Existing positions keep their original terms.`,
      );
      break;
    }
    case "member": {
      next.members = next.members.map((m) =>
        m.id === action.id
          ? {
              ...m,
              ...(action.status ? { status: action.status } : {}),
              ...(action.kyc ? { kyc: action.kyc } : {}),
            }
          : m,
      );
      audit("Member updated", `${action.id} · ${action.status || action.kyc}`);
      break;
    }
    case "settings": {
      const values = { ...state.settings, ...action.values };
      if (
        !positive(values.price) ||
        !Number.isFinite(values.fee) ||
        values.fee < 0 ||
        values.fee > 10
      )
        throw new Error(
          "Use a positive demo price and a fee between 0 and 10%.",
        );
      next.settings = values;
      audit("Settings updated", Object.keys(action.values).join(", "));
      break;
    }
    case "content": {
      if (!action.values.headline.trim() || !action.values.description.trim())
        throw new Error("Headline and description are required.");
      if (
        action.values.headline.length > 80 ||
        action.values.description.length > 200 ||
        action.values.announcement.length > 100
      )
        throw new Error("Content exceeds the field limits.");
      next.content = action.values;
      audit(
        "Website content updated",
        "Homepage headline, description, and announcement saved in this browser.",
      );
      break;
    }
  }
  next.audit = next.audit.slice(0, 300);
  next.transactions = next.transactions.slice(0, 500);
  return next;
}

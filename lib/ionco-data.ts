export const NETWORK = {
  name: "IONCO SmartChain",
  symbol: "INC",
  chainId: 13152,
  consensus: "Proof of Authority",
  standard: "IRC20",
  rpc: "http://134.209.231.57:8545",
  explorer: "https://scan.ioncochain.com",
  source: "https://ioncochain.com/add-ionco-network/",
};
export const LINKS = {
  original: "https://ioncochain.com/",
  whitepaper: "https://ioncochain.com/downloads/ionco-whitepaper.pdf",
  technology: "https://ioncochain.com/ionco-smartchain/",
  infrastructure: "https://ioncochain.com/system%27s-infrastructure/",
  network: NETWORK.source,
  explorer: NETWORK.explorer,
};
export const ALLOCATIONS = [
  { label: "Public sale", percent: 44, color: "#63e5e5" },
  { label: "Company reserves", percent: 18, color: "#47949e" },
  { label: "Project development", percent: 12, color: "#a2c4fa" },
  { label: "Locked liquidity", percent: 12, color: "#6678b8" },
  { label: "Marketing", percent: 8, color: "#acc7c7" },
  { label: "Team", percent: 6, color: "#394958" },
];
export type Pool = {
  id: string;
  name: string;
  days: number;
  apy: number;
  min: number;
  active: boolean;
  description: string;
};
export type Stake = {
  id: string;
  poolId: string;
  name: string;
  amount: number;
  apy: number;
  unlockAt: string;
  startedAt: string;
  rewards: number;
};
export type Transaction = {
  id: string;
  type: "Buy" | "Sell" | "Stake" | "Unstake" | "Claim";
  amount: number;
  value: number;
  date: string;
  status: "Completed";
  wallet: string;
};
export type Member = {
  id: string;
  name: string;
  email: string;
  wallet: string;
  status: "Active" | "Suspended";
  kyc: "Verified" | "Pending" | "Rejected";
  balance: number;
  joined: string;
};
export type DemoState = {
  version: 1;
  connected: boolean;
  walletName: string;
  balance: number;
  usdt: number;
  pools: Pool[];
  stakes: Stake[];
  transactions: Transaction[];
  members: Member[];
  audit: { id: string; date: string; action: string; detail: string }[];
  settings: {
    trading: boolean;
    staking: boolean;
    maintenance: boolean;
    emailUpdates: boolean;
    price: number;
    fee: number;
  };
  content: { headline: string; description: string; announcement: string };
};
export const WALLET = "0x71C7656EC7ab88b098defB751B7401B5f6d8976F";
export function initialState(): DemoState {
  return {
    version: 1,
    connected: false,
    walletName: "Demo wallet",
    balance: 12500,
    usdt: 3200,
    pools: [
      {
        id: "flexible",
        name: "Flexible",
        days: 0,
        apy: 5.2,
        min: 100,
        active: true,
        description: "Stay liquid. Unstake whenever you need.",
      },
      {
        id: "growth",
        name: "Growth",
        days: 30,
        apy: 8.4,
        min: 500,
        active: true,
        description: "A little commitment. More possibility.",
      },
      {
        id: "conviction",
        name: "Conviction",
        days: 90,
        apy: 12.8,
        min: 1000,
        active: true,
        description: "For those looking at the bigger picture.",
      },
    ],
    stakes: [
      {
        id: "ST-1001",
        poolId: "growth",
        name: "Growth",
        amount: 5000,
        apy: 8.4,
        startedAt: "2026-08-28T12:00:00Z",
        unlockAt: "2026-09-27T12:00:00Z",
        rewards: 32.4,
      },
      {
        id: "ST-1002",
        poolId: "flexible",
        name: "Flexible",
        amount: 3000,
        apy: 5.2,
        startedAt: "2026-08-25T12:00:00Z",
        unlockAt: "2026-08-25T12:00:00Z",
        rewards: 10.2,
      },
    ],
    transactions: [
      {
        id: "TX-8043",
        type: "Stake",
        amount: 5000,
        value: 2100,
        date: "2026-09-04T14:32:00Z",
        status: "Completed",
        wallet: WALLET,
      },
      {
        id: "TX-8042",
        type: "Buy",
        amount: 2500,
        value: 1050,
        date: "2026-09-03T10:15:00Z",
        status: "Completed",
        wallet: WALLET,
      },
      {
        id: "TX-8041",
        type: "Claim",
        amount: 18.64,
        value: 7.83,
        date: "2026-09-02T09:45:00Z",
        status: "Completed",
        wallet: WALLET,
      },
      {
        id: "TX-8040",
        type: "Stake",
        amount: 3000,
        value: 1260,
        date: "2026-09-01T16:20:00Z",
        status: "Completed",
        wallet: WALLET,
      },
      {
        id: "TX-8039",
        type: "Buy",
        amount: 15000,
        value: 6300,
        date: "2026-08-30T11:10:00Z",
        status: "Completed",
        wallet: WALLET,
      },
      {
        id: "TX-8038",
        type: "Sell",
        amount: 1000,
        value: 420,
        date: "2026-08-29T13:30:00Z",
        status: "Completed",
        wallet: WALLET,
      },
    ],
    members: [
      {
        id: "USR-001",
        name: "Alex Morgan",
        email: "alex@example.com",
        wallet: WALLET,
        status: "Active",
        kyc: "Verified",
        balance: 20500,
        joined: "2026-08-18",
      },
      {
        id: "USR-002",
        name: "Jamie Chen",
        email: "jamie@example.com",
        wallet: "0x92Ab…72e1",
        status: "Active",
        kyc: "Pending",
        balance: 12800,
        joined: "2026-08-22",
      },
      {
        id: "USR-003",
        name: "Sam Rivera",
        email: "sam@example.com",
        wallet: "0x36Dd…8e4a",
        status: "Active",
        kyc: "Verified",
        balance: 8400,
        joined: "2026-08-24",
      },
      {
        id: "USR-004",
        name: "Taylor Kim",
        email: "taylor@example.com",
        wallet: "0x45Ee…3f9c",
        status: "Suspended",
        kyc: "Rejected",
        balance: 3200,
        joined: "2026-08-25",
      },
      {
        id: "USR-005",
        name: "Robin Ellis",
        email: "robin@example.com",
        wallet: "0x68Fc…5b2d",
        status: "Active",
        kyc: "Pending",
        balance: 6750,
        joined: "2026-09-01",
      },
      {
        id: "USR-006",
        name: "Casey Park",
        email: "casey@example.com",
        wallet: "0x83Ba…6c8f",
        status: "Active",
        kyc: "Verified",
        balance: 15400,
        joined: "2026-09-03",
      },
    ],
    audit: [
      {
        id: "LOG-001",
        date: "2026-09-05T08:00:00Z",
        action: "Demo workspace initialized",
        detail: "Sample records loaded. No live funds or customer data.",
      },
    ],
    settings: {
      trading: true,
      staking: true,
      maintenance: false,
      emailUpdates: false,
      price: 0.42,
      fee: 0.5,
    },
    content: {
      headline: "A new dimension\nof Web3.",
      description:
        "Your assets. Your possibilities. Explore a connected ecosystem built around IONCO SmartChain.",
      announcement: "Meet the next chapter of IONCO",
    },
  };
}
export const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
export const number = (value: number, digits = 2) =>
  new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(
    value,
  );
export const shortAddress = (value: string) =>
  value.length > 18 ? `${value.slice(0, 6)}…${value.slice(-4)}` : value;
export const dateLabel = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

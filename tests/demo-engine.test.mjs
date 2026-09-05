import assert from "node:assert/strict";
import test, { after } from "node:test";
import { createServer } from "vite";
const vite = await createServer({
  configFile: false,
  server: { middlewareMode: true, hmr: false, ws: false },
  appType: "custom",
});
after(() => vite.close());
const { transition } = await vite.ssrLoadModule("/lib/demo-engine.ts");
const { initialState } = await vite.ssrLoadModule("/lib/ionco-data.ts");
const now = new Date("2026-09-05T12:00:00Z");
const connected = () => ({ ...initialState(), connected: true });
const run = (state, action, id = "test") => transition(state, action, now, id);
test("financial actions require a connected demo wallet", () => {
  for (const action of [
    { type: "trade", side: "Buy", amount: 100 },
    { type: "stake", poolId: "flexible", amount: 100 },
    { type: "claim" },
    { type: "unstake", stakeId: "ST-1002" },
  ])
    assert.throws(() => run(initialState(), action), /Connect/);
});
test("buy deducts fee and updates available INC without mutating input", () => {
  const state = connected();
  const next = run(state, { type: "trade", side: "Buy", amount: 100 });
  assert.equal(next.balance, 12600);
  assert.equal(next.usdt, 3157.79);
  assert.equal(state.balance, 12500);
  assert.equal(state.usdt, 3200);
  assert.equal(next.transactions[0].type, "Buy");
});
test("sell credits net proceeds including the configured fee", () => {
  const next = run(connected(), { type: "trade", side: "Sell", amount: 100 });
  assert.equal(next.balance, 12400);
  assert.equal(next.usdt, 3241.79);
});
test("fee-inclusive overdrafts and overselling are rejected", () => {
  assert.throws(
    () => run(connected(), { type: "trade", side: "Buy", amount: 3200 / 0.42 }),
    /Not enough/,
  );
  assert.throws(
    () => run(connected(), { type: "trade", side: "Sell", amount: 12501 }),
    /Not enough/,
  );
});
test("invalid, non-finite, negative, and subprecision amounts are rejected", () => {
  for (const amount of [NaN, Infinity, -1, 0, 1e-20])
    assert.throws(
      () => run(connected(), { type: "trade", side: "Buy", amount }),
      /valid amount/,
    );
});
test("staking enforces minimum and available principal", () => {
  assert.throws(
    () => run(connected(), { type: "stake", poolId: "growth", amount: 499 }),
    /Minimum/,
  );
  assert.throws(
    () => run(connected(), { type: "stake", poolId: "growth", amount: 15000 }),
    /Not enough/,
  );
  const next = run(connected(), {
    type: "stake",
    poolId: "growth",
    amount: 1000,
  });
  assert.equal(next.balance, 11500);
  assert.equal(next.stakes[0].amount, 1000);
  assert.equal(next.stakes[0].unlockAt, "2026-10-05T12:00:00.000Z");
});
test("existing positions preserve original APY and unlock dates after a pool edit", () => {
  const staked = run(connected(), {
    type: "stake",
    poolId: "growth",
    amount: 1000,
  });
  const original = structuredClone(staked.stakes[0]);
  const pool = { ...staked.pools[1], apy: 15, days: 90 };
  const edited = run(staked, { type: "pool", pool });
  assert.deepEqual(edited.stakes[0], original);
  const newStake = run(
    edited,
    { type: "stake", poolId: "growth", amount: 1000 },
    "new",
  );
  assert.equal(newStake.stakes[0].apy, 15);
  assert.equal(newStake.stakes[0].unlockAt, "2026-12-04T12:00:00.000Z");
});
test("locked principal cannot be withdrawn before its unlock timestamp", () => {
  assert.throws(
    () => run(connected(), { type: "unstake", stakeId: "ST-1001" }),
    /still locked/,
  );
  const next = transition(
    connected(),
    { type: "unstake", stakeId: "ST-1001" },
    new Date("2026-09-27T12:00:00Z"),
    "unlock",
  );
  assert.equal(next.balance, 17532.4);
});
test("flexible withdrawal returns principal and unclaimed rewards once", () => {
  const next = run(connected(), { type: "unstake", stakeId: "ST-1002" });
  assert.equal(next.balance, 15510.2);
  assert.equal(next.stakes.length, 1);
  assert.throws(
    () => run(next, { type: "unstake", stakeId: "ST-1002" }),
    /no longer exists/,
  );
});
test("reward claims cannot be replayed", () => {
  const next = run(connected(), { type: "claim" });
  assert.equal(next.balance, 12542.6);
  assert.equal(
    next.stakes.reduce((s, p) => s + p.rewards, 0),
    0,
  );
  assert.throws(() => run(next, { type: "claim" }), /No rewards/);
});
test("maintenance and account suspension block all financial actions", () => {
  const base = connected();
  const paused = run(base, { type: "settings", values: { maintenance: true } });
  const suspended = run(base, {
    type: "member",
    id: "USR-001",
    status: "Suspended",
  });
  for (const state of [paused, suspended])
    for (const action of [
      { type: "trade", side: "Buy", amount: 100 },
      { type: "stake", poolId: "flexible", amount: 100 },
      { type: "claim" },
      { type: "unstake", stakeId: "ST-1002" },
    ])
      assert.throws(() => run(state, action), /maintenance|suspended/);
});
test("pool pause blocks new deposits while retaining flexible exits", () => {
  const state = connected();
  state.pools[0].active = false;
  assert.throws(
    () => run(state, { type: "stake", poolId: "flexible", amount: 100 }),
    /paused/,
  );
  assert.equal(
    run(state, { type: "unstake", stakeId: "ST-1002" }).balance,
    15510.2,
  );
});
test("trade pause prevents buys and sells", () => {
  const state = connected();
  state.settings.trading = false;
  for (const side of ["Buy", "Sell"])
    assert.throws(
      () => run(state, { type: "trade", side, amount: 100 }),
      /paused/,
    );
});
test("invalid admin market, pool, and content updates are rejected", () => {
  for (const values of [{ price: 0 }, { price: NaN }, { fee: -1 }, { fee: 11 }])
    assert.throws(() => run(connected(), { type: "settings", values }));
  for (const patch of [
    { apy: 101 },
    { days: -1 },
    { days: 1.5 },
    { min: 0 },
    { name: "" },
  ])
    assert.throws(() =>
      run(connected(), {
        type: "pool",
        pool: { ...connected().pools[0], ...patch },
      }),
    );
  assert.throws(
    () =>
      run(connected(), {
        type: "content",
        values: { headline: "", description: "Test", announcement: "" },
      }),
    /required/,
  );
});
test("admin changes are logged and resetting restores the complete seed", () => {
  const next = run(connected(), {
    type: "member",
    id: "USR-002",
    kyc: "Verified",
  });
  assert.equal(next.audit[0].action, "Member updated");
  assert.equal(next.members[1].kyc, "Verified");
  assert.deepEqual(run(next, { type: "reset" }), initialState());
});

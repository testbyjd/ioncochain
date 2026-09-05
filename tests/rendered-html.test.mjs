import assert from "node:assert/strict";
import test from "node:test";
const { default: worker } = await import("../dist/server/index.js");
const routes = [
  ["/", "A new dimension"],
  ["/dashboard", "Your possibilities"],
  ["/dashboard/staking", "Make room for growth"],
  ["/dashboard/trade", "Your INC. Your next move"],
  ["/dashboard/wallet", "A home for your assets"],
  ["/dashboard/activity", "Every move, in one place"],
  ["/dashboard/settings", "Make yourself at home"],
  ["/dashboard/help", "A little guidance"],
  ["/admin", "The ecosystem, in focus"],
  ["/admin/users", "People behind the possibilities"],
  ["/admin/wallets", "Assets, accounted for"],
  ["/admin/transactions", "Transactions"],
  ["/admin/staking", "The terms of possibility"],
  ["/admin/content", "Shape the next chapter"],
  ["/admin/settings", "Control, without the clutter"],
  ["/admin/audit", "A record of every decision"],
];
for (const [route, text] of routes)
  test(`renders ${route} with product content and correct metadata`, async () => {
    const response = await worker.fetch(
      new Request(`http://localhost${route}`, {
        headers: { accept: "text/html" },
      }),
      {
        ASSETS: {
          fetch: async () => new Response("Not found", { status: 404 }),
        },
      },
      { waitUntil() {}, passThroughOnException() {} },
    );
    assert.equal(response.status, 200);
    assert.match(response.headers.get("content-type") ?? "", /text\/html/);
    const html = await response.text();
    assert.ok(html.includes(text), `Missing content on ${route}`);
    assert.ok(html.includes("IONCO"));
    assert.ok(!html.includes("Starter Project"));
    assert.match(html, /id="main"/);
    if (route !== "/") assert.ok(html.includes("Demo workspace"));
  });
test("unknown routes return a branded 404", async () => {
  const response = await worker.fetch(
    new Request("http://localhost/missing-ionco-page", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
    },
    { waitUntil() {}, passThroughOnException() {} },
  );
  assert.equal(response.status, 404);
  assert.ok((await response.text()).includes("outside the orbit"));
});

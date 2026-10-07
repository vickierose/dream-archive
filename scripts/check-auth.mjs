import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";

// Run after `npm run build`. Uses no real accounts and sends no emails.
const port = 3127;
const origin = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)], {
  stdio: "ignore",
  windowsHide: true,
});
const exited = once(server, "exit");

try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (server.exitCode !== null) throw new Error("Test server exited before startup. Check the build and test port.");
    try {
      const response = await fetch(`${origin}/login`, { signal: AbortSignal.timeout(2000) });
      if (response.status === 200) { ready = true; break; }
    } catch { /* Wait for startup. */ }
    await delay(500);
  }
  assert.ok(ready, "Production server must become ready");

  for (const path of ["/login", "/signup", "/forgot-password", "/reset-password"]) {
    const response = await fetch(`${origin}${path}`, { redirect: "manual" });
    assert.equal(response.status, 200, `${path} must stay public`);
    if (path === "/reset-password") assert.match(await response.text(), /reset link is missing or invalid/);
    console.log(`PASS public ${path}`);
  }

  for (const path of ["/dreams", "/dreams/new", "/symbols", "/symbols/example", "/explore"]) {
    const response = await fetch(`${origin}${path}`, { redirect: "manual" });
    assert.ok([302, 303, 307, 308].includes(response.status), `${path} must redirect`);
    assert.equal(new URL(response.headers.get("location"), origin).pathname, "/login");
    console.log(`PASS signed-out protection ${path}`);
  }

  const session = await fetch(`${origin}/api/auth/get-session`);
  assert.equal(session.status, 200);
  assert.equal(await session.json(), null, "Signed-out requests must not return a user session");
  console.log("PASS signed-out auth endpoint");
} finally {
  server.kill();
  await exited;
}

import { afterEach, describe, expect, it } from "vitest";
import { POST } from "@/app/api/auth/login/route";
import { resetLoginRateLimit } from "./login-rate-limit";

const SECRET = "k7Qx-9mP2vL4nR8wT6yH3cF5bN1aZ0eD";
const PASSWORD = "tablet-passphrase-19";

function login(password: string) {
  return POST(
    new Request("http://dashboard.local/api/auth/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-dashboard-socket-ip": "203.0.113.10",
      },
      body: JSON.stringify({ password }),
    })
  );
}

describe("login password", () => {
  afterEach(() => {
    delete process.env.DASHBOARD_PASSWORD;
    delete process.env.APP_SECRET;
    resetLoginRateLimit();
  });

  it("compares the submitted password with the trimmed DASHBOARD_PASSWORD", async () => {
    process.env.APP_SECRET = SECRET;
    process.env.DASHBOARD_PASSWORD = `  ${PASSWORD}  `;

    const accepted = await login(PASSWORD);
    expect(accepted.status).toBe(200);

    const padded = await login(`  ${PASSWORD}  `);
    expect(padded.status).toBe(401);
  });
});

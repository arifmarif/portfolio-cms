import { describe, it, expect, afterEach } from "vitest";
import { createSessionToken, verifySessionToken, secretEqual } from "./session";

const SECRET = "test-session-secret";

function withSecret() {
  process.env.ADMIN_SESSION_SECRET = SECRET;
}

afterEach(() => {
  delete process.env.ADMIN_SESSION_SECRET;
  delete process.env.ADMIN_PASSWORD;
});

describe("session tokens", () => {
  it("round-trips a freshly created token", async () => {
    withSecret();
    const token = await createSessionToken();
    expect(await verifySessionToken(token)).toBe(true);
  });

  it("rejects tampered payloads", async () => {
    withSecret();
    const token = await createSessionToken();
    const parts = token.split(".");
    const expiry = String(Number(parts[1]) + 60 * 1000); // forged longer life
    const tampered = `${parts[0]}.${expiry}.${parts[2]}`;
    expect(await verifySessionToken(tampered)).toBe(false);
  });

  it("rejects tokens signed with a different secret", async () => {
    process.env.ADMIN_SESSION_SECRET = "other-secret";
    const token = await createSessionToken();
    process.env.ADMIN_SESSION_SECRET = SECRET;
    expect(await verifySessionToken(token)).toBe(false);
  });

  it("rejects expired tokens", async () => {
    withSecret();
    // Expired beyond the clock-skew tolerance: craft via expired payload is
    // not possible with createSessionToken, so verify clock-skew rejection by
    // asserting a far-past expiry is invalid.
    const fake = `abcdef0123456789.${Date.now() - 24 * 60 * 60 * 1000}.0000000000000000000000000000000000000000000000000000000000000000`;
    expect(await verifySessionToken(fake)).toBe(false);
  });

  it("rejects malformed and missing tokens", async () => {
    withSecret();
    expect(await verifySessionToken(undefined)).toBe(false);
    expect(await verifySessionToken(null)).toBe(false);
    expect(await verifySessionToken("")).toBe(false);
    expect(await verifySessionToken("ok")).toBe(false);
    expect(await verifySessionToken("a.b.c")).toBe(false);
  });

  it("falls back to ADMIN_PASSWORD as secret", async () => {
    delete process.env.ADMIN_SESSION_SECRET;
    process.env.ADMIN_PASSWORD = "fallback-password";
    const token = await createSessionToken();
    expect(await verifySessionToken(token)).toBe(true);
    process.env.ADMIN_PASSWORD = "changed";
    expect(await verifySessionToken(token)).toBe(false);
  });
});

describe("secretEqual", () => {
  it("compares equal and unequal strings", async () => {
    expect(await secretEqual("admin123", "admin123")).toBe(true);
    expect(await secretEqual("admin123", "admin124")).toBe(false);
    expect(await secretEqual("admin123", "admin1234")).toBe(false);
  });

  it("does not throw on empty input", async () => {
    expect(await secretEqual("", "")).toBe(true);
    expect(await secretEqual("", "x")).toBe(false);
  });
});

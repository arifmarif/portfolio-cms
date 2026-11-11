// Signed admin session tokens: `${nonce}.${expiryMs}.${hmacHex}`.
// The HMAC key is ADMIN_SESSION_SECRET, falling back to ADMIN_PASSWORD so a
// deployment without an explicit session secret is still protected.
// Web Crypto is used so the same code runs in the Node proxy and routes.

const SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours, matches cookie maxAge
const CLOCK_SKEW_MS = 60 * 1000;

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 8;

const encoder = new TextEncoder();

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || "";
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256(input: string | Uint8Array): Promise<Uint8Array> {
  const data = typeof input === "string" ? encoder.encode(input) : input;
  const digest = await crypto.subtle.digest("SHA-256", data as BufferSource);
  return new Uint8Array(digest);
}

async function hmac(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return toHex(new Uint8Array(signature));
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/** Constant-time string equality regardless of input lengths (hashes first). */
export async function secretEqual(a: string, b: string): Promise<boolean> {
  const [ha, hb] = await Promise.all([sha256(a), sha256(b)]);
  return constantTimeEqual(ha.join(","), hb.join(","));
}

export async function createSessionToken(): Promise<string> {
  const secret = getSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET or ADMIN_PASSWORD must be configured");
  const nonce = crypto.randomUUID().replace(/-/g, "");
  const expiry = Date.now() + SESSION_TTL_MS;
  const payload = `${nonce}.${expiry}`;
  const mac = await hmac(payload, secret);
  return `${payload}.${mac}`;
}

export async function verifySessionToken(token: string | null | undefined): Promise<boolean> {
  if (!token) return false;
  const secret = getSecret();
  if (!secret) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [nonce, expiryStr, mac] = parts;
  if (!/^[0-9a-f]{16,}$/i.test(nonce) || !/^\d{1,15}$/.test(expiryStr) || !/^[0-9a-f]{64}$/i.test(mac)) {
    return false;
  }

  const expiry = Number(expiryStr);
  if (!Number.isSafeInteger(expiry) || expiry + CLOCK_SKEW_MS < Date.now()) return false;

  const expected = await hmac(`${nonce}.${expiryStr}`, secret);
  return constantTimeEqual(mac.toLowerCase(), expected);
}

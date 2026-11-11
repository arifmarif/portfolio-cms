import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySync } from "otplib";
import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken, secretEqual } from "@/lib/session";

const attempts = new Map<string, { count: number; reset: number }>();
const WINDOW = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now > rec.reset) {
    attempts.set(ip, { count: 1, reset: now + WINDOW });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_ATTEMPTS;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    console.warn(`[security] login rate-limited ip=${ip}`);
    return NextResponse.json({ ok: false, error: "Terlalu banyak percobaan. Coba lagi nanti." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Permintaan tidak valid." }, { status: 400 });
  }
  const password = typeof (body as { password?: unknown })?.password === "string" ? (body as { password: string }).password : "";
  const code = typeof (body as { code?: unknown })?.code === "string" ? (body as { code: string }).code : "";

  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    console.error("[security] ADMIN_PASSWORD not configured");
    return NextResponse.json({ ok: false, error: "Server misconfigured." }, { status: 500 });
  }

  if (!(await secretEqual(password, expected))) {
    console.warn(`[security] failed login ip=${ip}`);
    return NextResponse.json({ ok: false, error: "Kata sandi salah." }, { status: 401 });
  }

  const secret = process.env.ADMIN_TOTP_SECRET;
  if (secret) {
    const result = verifySync({ token: code, secret });
    if (!result.valid) {
      console.warn(`[security] failed MFA ip=${ip}`);
      return NextResponse.json({ ok: false, error: "Kode MFA tidak valid." }, { status: 401 });
    }
  }

  const jar = await cookies();
  jar.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
    sameSite: "strict",
  });
  attempts.delete(ip);
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
  return NextResponse.json({ ok: true });
}

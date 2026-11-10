import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySync } from "otplib";

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

  const { password, code } = await req.json();
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    console.error("[security] ADMIN_PASSWORD not configured");
    return NextResponse.json({ ok: false, error: "Server misconfigured." }, { status: 500 });
  }

  if (password !== expected) {
    console.warn(`[security] failed login ip=${ip}`);
    return NextResponse.json({ ok: false, error: "Kata sandi salah." }, { status: 401 });
  }

  const secret = process.env.ADMIN_TOTP_SECRET;
  if (secret) {
    const result = verifySync({ token: String(code || ""), secret });
    if (!result.valid) {
      console.warn(`[security] failed MFA ip=${ip}`);
      return NextResponse.json({ ok: false, error: "Kode MFA tidak valid." }, { status: 401 });
    }
  }

  const jar = await cookies();
  jar.set("admin_session", "ok", { httpOnly: true, path: "/", maxAge: 60 * 60 * 8, sameSite: "strict" });
  attempts.delete(ip);
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const jar = await cookies();
  jar.delete("admin_session");
  return NextResponse.json({ ok: true });
}

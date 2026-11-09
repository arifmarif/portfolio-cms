import { NextResponse } from "next/server";
import { readState, writeState } from "@/lib/db";
import type { DownloadSubmission } from "@/lib/types";

const attempts = new Map<string, { count: number; reset: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || now > rec.reset) { attempts.set(ip, { count: 1, reset: now + 15 * 60 * 1000 }); return false; }
  rec.count += 1;
  return rec.count > 20;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "Terlalu banyak percobaan." }, { status: 429 });
  }
  try {
    const body = await req.json();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const pdfName = String(body.pdfName || "Portofolio.pdf").trim();

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const phoneOk = /^\+?[0-9][0-9\s-]{6,}$/.test(phone);
    if (!emailOk) return NextResponse.json({ error: "Email tidak valid." }, { status: 400 });
    if (!phoneOk) return NextResponse.json({ error: "Nomor HP tidak valid." }, { status: 400 });

    const state = await readState();
    // Avoid duplicate entries from repeated attempts in the same process
    const last = state.downloads[state.downloads.length - 1];
    if (last && last.email === email && last.phone === phone && last.pdfName === pdfName) {
      return NextResponse.json({ ok: true, id: last.id, duplicate: true });
    }

    const submission: DownloadSubmission = {
      id: String(Date.now()),
      email,
      phone,
      pdfName,
      createdAt: new Date().toISOString(),
    };
    state.downloads.unshift(submission);
    await writeState(state);
    return NextResponse.json({ ok: true, id: submission.id });
  } catch {
    return NextResponse.json({ error: "Gagal menyimpan data." }, { status: 500 });
  }
}

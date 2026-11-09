import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { cookies } from "next/headers";
import { put } from "@vercel/blob";

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function POST(req: Request) {
  const jar = await cookies();
  if (jar.get("admin_session")?.value !== "ok") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: "Tipe file tidak diizinkan." }, { status: 400 });
  if (file.size > MAX_SIZE) return NextResponse.json({ error: "Ukuran file melebihi 5MB." }, { status: 400 });

  // Prefer Vercel Blob when available (production)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`, file, {
      access: "public",
      contentType: file.type,
    });
    return NextResponse.json({ url: blob.url });
  }

  // Local fallback (dev)
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
  await writeFile(path.join(uploadsDir, safeName), buffer);
  return NextResponse.json({ url: `/uploads/${safeName}` });
}

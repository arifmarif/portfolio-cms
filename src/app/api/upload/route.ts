import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { isAdmin } from "@/lib/auth";

const MAX_SIZE = 5 * 1024 * 1024;
const MAX_CV_SIZE = 10 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf", "text/pdf"];

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (!ALLOWED.includes(file.type)) return NextResponse.json({ error: "Tipe file tidak diizinkan." }, { status: 400 });
  const maxSize = file.type === "application/pdf" || file.type === "text/pdf" ? MAX_CV_SIZE : MAX_SIZE;
  if (file.size > maxSize) return NextResponse.json({ error: file.type === "application/pdf" || file.type === "text/pdf" ? "Ukuran file CV melebihi 10MB." : "Ukuran file melebihi 5MB." }, { status: 400 });

  const ext = path.extname(file.name).toLowerCase().replace(/[^.a-z0-9]/g, "") || "";
  const name = `${crypto.randomUUID()}${ext}`;

  // Prefer Vercel Blob when available (production)
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`uploads/${name}`, file, {
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
  await writeFile(path.join(uploadsDir, name), buffer);
  return NextResponse.json({ url: `/uploads/${name}` });
}

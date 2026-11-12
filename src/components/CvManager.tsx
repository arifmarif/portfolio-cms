"use client";
import { useState } from "react";
import { setCvFile, deleteCvFile } from "@/app/admin/actions";

export interface CvInfo {
  url: string;
  fileName: string;
  uploadedAt: string;
}

export default function CvManager({
  value,
  onChange,
}: {
  value: CvInfo;
  onChange: (v: CvInfo) => void;
}) {
  const [cv, setCv] = useState<CvInfo>(value);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ kind: "error" | "ok"; text: string } | null>(null);

  async function uploadFile(file?: File) {
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Gagal mengunggah file CV.");
      const uploadedAt = new Date().toISOString();
      await setCvFile(data.url, file.name, uploadedAt);
      const next = { url: data.url, fileName: file.name, uploadedAt };
      setCv(next);
      onChange(next);
      setMessage({ kind: "ok", text: "CV berhasil diunggah." });
    } catch (err) {
      setMessage({ kind: "error", text: err instanceof Error ? err.message : "Gagal mengunggah file CV." });
    }
    setUploading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    await uploadFile(file);
    e.target.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem("cv-upload") as HTMLInputElement;
    const file = input?.files?.[0];
    await uploadFile(file);
    if (input) input.value = "";
  }

  async function handleDelete() {
    if (!window.confirm("Hapus CV aktif? Setelah CV dihapus, pengunjung tidak akan dapat mengunduh CV.")) return;
    setMessage(null);
    await deleteCvFile();
    const next = { url: "", fileName: "", uploadedAt: "" };
    setCv(next);
    onChange(next);
    setMessage({ kind: "ok", text: "CV dihapus." });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        {cv.fileName ? (
          <p className="text-sm text-on-surface-variant">
            CV aktif: <span className="text-on-surface">{cv.fileName}</span>
            {cv.uploadedAt ? ` • ${new Date(cv.uploadedAt).toLocaleString("id-ID")}` : ""}
          </p>
        ) : (
          <p className="text-sm text-on-surface-variant">Belum ada file CV aktif.</p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
        <input
          id="cv-upload"
          type="file"
          accept="application/pdf"
          onChange={handleUpload}
          disabled={uploading}
          className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary-container file:px-4 file:py-2 file:text-on-primary-container hover:file:bg-primary"
        />
        <button type="submit" disabled={uploading} className="px-5 py-2 rounded-lg bg-primary-container text-on-primary-container font-medium hover:bg-primary disabled:opacity-50">
          {uploading ? "Mengunggah..." : "Unggah CV"}
        </button>
      </form>
      {message && <p className={`text-sm ${message.kind === "error" ? "text-error" : "text-secondary"}`}>{message.text}</p>}
      {cv.url && (
        <button type="button" onClick={handleDelete} className="px-4 py-2 rounded-lg bg-error-container/30 text-error hover:bg-error-container/50 text-sm font-medium">
          Hapus CV
        </button>
      )}
    </div>
  );
}

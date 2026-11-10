"use client";
import { useState } from "react";

export default function PhotoUpload({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) {
      const data = await res.json();
      onChange(data.url);
    }
    setUploading(false);
    e.target.value = "";
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm text-on-surface-variant">Foto Profil</label>
      <div className="flex items-center gap-3">
        {value && <img src={value} alt="foto" className="w-16 h-16 rounded-full object-cover ring-1 ring-outline-variant" />}
        <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} className="text-sm" />
        {uploading && <span className="text-xs text-outline">Mengunggah...</span>}
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="atau URL foto"
        className="w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-on-surface ring-1 ring-outline-variant focus:ring-primary"
      />
    </div>
  );
}

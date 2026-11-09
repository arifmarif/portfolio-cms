"use client";
import { useState } from "react";
import { deleteDownload } from "../actions";
import type { DownloadSubmission } from "@/lib/types";

export function DownloadsClient({ initial }: { initial: DownloadSubmission[] }) {
  const [items, setItems] = useState(initial);
  const [query, setQuery] = useState("");
  const [filterPdf, setFilterPdf] = useState("all");

  const pdfNames = Array.from(new Set(items.map((i) => i.pdfName)));

  const filtered = items.filter((i) => {
    const q = query.toLowerCase();
    const matchQ = !q || i.email.toLowerCase().includes(q) || i.phone.includes(q) || i.pdfName.toLowerCase().includes(q);
    const matchPdf = filterPdf === "all" || i.pdfName === filterPdf;
    return matchQ && matchPdf;
  });

  async function handleDelete(id: string) {
    if (!confirm("Hapus entri unduhan ini?")) return;
    await deleteDownload(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold">Data Unduhan</h1>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Cari email, nomor HP, nama PDF..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-lg bg-surface-container-lowest px-3 py-2 text-on-surface ring-1 ring-outline-variant focus:ring-primary"
        />
        <select
          value={filterPdf}
          onChange={(e) => setFilterPdf(e.target.value)}
          className="rounded-lg bg-surface-container-lowest px-3 py-2 text-on-surface ring-1 ring-outline-variant focus:ring-primary"
        >
          <option value="all">Semua PDF</option>
          {pdfNames.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl bg-surface-container-low">
        <table className="w-full text-sm">
          <thead className="text-outline">
            <tr className="border-b border-outline-variant/30">
              <th className="text-left p-3">Tanggal &amp; Waktu</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Nomor HP</th>
              <th className="text-left p-3">Nama PDF</th>
              <th className="text-left p-3">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((i) => (
              <tr key={i.id} className="border-b border-outline-variant/20">
                <td className="p-3 whitespace-nowrap">{new Date(i.createdAt).toLocaleString("id-ID")}</td>
                <td className="p-3">{i.email}</td>
                <td className="p-3">{i.phone}</td>
                <td className="p-3">{i.pdfName}</td>
                <td className="p-3">
                  <button onClick={() => handleDelete(i.id)} className="text-error hover:underline">Hapus</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-outline">Tidak ada data.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

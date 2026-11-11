"use client";
import { useState } from "react";
import type { ContactMessageItem } from "@/lib/types";

export function MessagesClient({ initial }: { initial: ContactMessageItem[] }) {
  const [items] = useState(initial);
  const [query, setQuery] = useState("");

  const filtered = items.filter((m) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl font-bold">Pesan Kontak</h1>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="Cari nama, email, atau isi pesan..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 rounded-lg bg-surface-container-lowest px-3 py-2 text-on-surface ring-1 ring-outline-variant focus:ring-primary"
        />
      </div>

      <div className="overflow-x-auto rounded-xl bg-surface-container-low">
        <table className="w-full text-sm">
          <thead className="text-outline">
            <tr className="border-b border-outline-variant/30">
              <th className="text-left p-3">Waktu Terima</th>
              <th className="text-left p-3">Nama</th>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Pesan</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m) => (
              <tr key={m.id} className="border-b border-outline-variant/20 align-top">
                <td className="p-3 whitespace-nowrap">{new Date(m.createdAt).toLocaleString("id-ID")}</td>
                <td className="p-3">{m.name}</td>
                <td className="p-3">{m.email}</td>
                <td className="p-3 whitespace-pre-wrap">{m.message}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-outline">Tidak ada pesan.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

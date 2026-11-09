"use client";
import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });
    if (res.ok) {
      setStatus("Pesan berhasil dikirim.");
      setName(""); setEmail(""); setMessage("");
    } else {
      const data = await res.json();
      setStatus(data.error || "Gagal mengirim.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-xl mx-auto">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama" className="w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-on-surface ring-1 ring-outline-variant focus:ring-primary" />
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-on-surface ring-1 ring-outline-variant focus:ring-primary" />
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Pesan" rows={4} className="w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-on-surface ring-1 ring-outline-variant focus:ring-primary" />
      <button type="submit" className="px-5 py-2 rounded-lg bg-primary-container text-on-primary-container font-medium hover:bg-primary">Kirim Pesan</button>
      {status && <p className="text-sm text-on-surface-variant">{status}</p>}
    </form>
  );
}

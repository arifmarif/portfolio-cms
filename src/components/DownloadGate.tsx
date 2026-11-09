"use client";
import { useState } from "react";

const PDF_NAME = "Portofolio-Arif-Rizki.pdf";

export default function DownloadGate({ label = "Unduh Portofolio (PDF)" }: { label?: string }) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  function proceed() {
    window.open("/print", "_blank");
  }

  function handleClick() {
    const key = `portfolio_download_submitted`;
    if (typeof window !== "undefined" && sessionStorage.getItem(key)) {
      proceed();
      return;
    }
    setOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: { email?: string; phone?: string } = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Format email tidak valid.";
    if (!/^\+?[0-9][0-9\s-]{6,}$/.test(phone)) errs.phone = "Format nomor HP tidak valid.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    setMessage("");
    try {
      const res = await fetch("/api/download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, phone, pdfName: PDF_NAME }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Gagal menyimpan data.");
        setSubmitting(false);
        return;
      }
      if (typeof window !== "undefined") sessionStorage.setItem("portfolio_download_submitted", "1");
      setOpen(false);
      proceed();
    } catch {
      setMessage("Terjadi kesalahan. Coba lagi.");
    }
    setSubmitting(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="px-6 py-3 rounded-lg bg-primary-container text-on-primary-container font-medium hover:bg-primary"
      >
        {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl bg-surface-container-low p-6 space-y-4 shadow-xl">
            <h2 className="font-display text-xl font-bold">Unduh Portofolio PDF</h2>
            <p className="text-sm text-on-surface-variant">
              Isi data berikut sebelum mengunduh. Email dan nomor HP akan disimpan untuk keperluan sesuai kebijakan privasi situs.
            </p>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm text-on-surface-variant mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-on-surface ring-1 ring-outline-variant focus:ring-primary"
                />
                {errors.email && <p className="text-xs text-error mt-1">{errors.email}</p>}
              </div>
              <div>
                <label className="block text-sm text-on-surface-variant mb-1">Nomor HP</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-on-surface ring-1 ring-outline-variant focus:ring-primary"
                />
                {errors.phone && <p className="text-xs text-error mt-1">{errors.phone}</p>}
              </div>
              {message && <p className="text-sm text-error">{message}</p>}
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high">
                  Batal
                </button>
                <button type="submit" disabled={submitting} className="px-4 py-2 rounded-lg bg-primary-container text-on-primary-container font-medium hover:bg-primary">
                  {submitting ? "Memproses..." : "Lanjutkan Unduhan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

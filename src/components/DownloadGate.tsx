"use client";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const PDF_NAME = "Portofolio-Arif-Rizki.pdf";

export default function DownloadGate({
  label = "Undih Portofolio (PDF)",
  cvUrl,
}: {
  label?: string;
  cvUrl?: string;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const previousActiveElement = document.activeElement as HTMLElement | null;
    const focusTimer = window.setTimeout(() => {
      dialogRef.current?.focus();
    }, 0);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousActiveElement?.focus?.();
    };
  }, [open]);

  function proceed(targetUrl?: string) {
    window.open(targetUrl || "/print", "_blank");
  }

  function handleClick() {
    const key = `portfolio_download_submitted`;
    if (typeof window !== "undefined" && sessionStorage.getItem(key)) {
      if (cvUrl) proceed(cvUrl);
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
      if (cvUrl) {
        proceed(cvUrl);
      } else {
        setMessage("CV belum tersedia. Silakan coba lagi nanti.");
      }
    } catch {
      setMessage("Terjadi kesalahan. Coba lagi.");
    }
    setSubmitting(false);
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleClick}
        className="px-6 py-3 rounded-lg bg-primary-container text-on-primary-container font-medium hover:bg-primary"
      >
        {label}
      </button>
      {message && <p className="text-sm text-error">{message}</p>}
      {open &&
        createPortal(
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60">
            <div className="flex min-h-full items-center justify-center p-4">
              <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="download-portfolio-pdf-title"
                tabIndex={-1}
                className="w-full max-w-md rounded-xl bg-surface-container-low p-6 space-y-4 shadow-xl max-h-[calc(100vh-2rem)] overflow-y-auto"
              >
                <h2 id="download-portfolio-pdf-title" className="font-display text-xl font-bold">Unduh Portofolio PDF</h2>
                <p className="text-sm text-on-surface-variant">
                  Isi data berikut sebelum mengunduh. Email dan nomor HP akan disimpan untuk keperluan sesuai kebijakan privasi situs.
                </p>
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div>
                    <label htmlFor="download-portfolio-pdf-email" className="block text-sm text-on-surface-variant mb-1">Email</label>
                    <input
                      id="download-portfolio-pdf-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-on-surface ring-1 ring-outline-variant focus:ring-primary"
                    />
                    {errors.email && <p className="text-xs text-error mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label htmlFor="download-portfolio-pdf-phone" className="block text-sm text-on-surface-variant mb-1">Nomor HP</label>
                    <input
                      id="download-portfolio-pdf-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-on-surface ring-1 ring-outline-variant focus:ring-primary"
                    />
                    {errors.phone && <p className="text-xs text-error mt-1">{errors.phone}</p>}
                  </div>
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
          </div>,
          document.body
        )}
    </>
  );
}

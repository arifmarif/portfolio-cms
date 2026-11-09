"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, code }),
    });
    if (res.ok) {
      router.push("/admin");
      router.refresh();
    } else {
      setError("Kata sandi salah.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-xl bg-surface-container-low p-6 shadow-md">
        <h1 className="font-display text-2xl font-bold text-on-surface">CMS Console</h1>
        <p className="text-sm text-on-surface-variant">Masuk sebagai admin.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Kata sandi"
          className="w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-on-surface ring-1 ring-outline-variant focus:ring-primary"
        />
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Kode MFA (jika diaktifkan)"
          className="w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-on-surface ring-1 ring-outline-variant focus:ring-primary"
        />
        {error && <p className="text-sm text-error">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary-container px-4 py-2 font-semibold text-on-primary-container hover:bg-primary"
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>
        <p className="text-xs text-outline">Default: admin123 (set ADMIN_PASSWORD di .env)</p>
      </form>
    </div>
  );
}

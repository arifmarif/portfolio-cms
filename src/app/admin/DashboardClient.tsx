"use client";
import { useState } from "react";
import Image from "next/image";
import { updateDraftSettings, publishSettings } from "./actions";
import PhotoUpload from "@/components/PhotoUpload";
import type { SiteSettings } from "@/lib/types";

export default function DashboardClient({
  initialDraft,
  published,
  projectCount,
  publishedCount,
  draftCount,
}: {
  initialDraft: SiteSettings;
  published: SiteSettings;
  projectCount: number;
  publishedCount: number;
  draftCount: number;
}) {
  const [draft, setDraft] = useState<SiteSettings>({ ...initialDraft });
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  function update<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setStatus("");
    const fd = new FormData();
    (Object.keys(draft) as (keyof SiteSettings)[]).forEach((k) => {
      const v = draft[k];
      if (typeof v === "boolean") fd.set(k, v ? "on" : "");
      else fd.set(k, String(v ?? ""));
    });
    await updateDraftSettings(fd);
    setStatus("Draf disimpan.");
    setSaving(false);
  }

  async function handlePublish() {
    setSaving(true);
    await publishSettings();
    setStatus("Diterbitkan.");
    setSaving(false);
  }

  function handleReset() {
    setDraft({ ...initialDraft });
    setStatus("Perubahan direset.");
  }

  const heroLen = draft.heroTitle.length;
  const heroMax = 120;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card title="Koleksi Portofolio" value={String(projectCount)} sub="Total karya" />
        <Card title="Karya Diterbitkan" value={String(publishedCount)} sub="Terlihat publik" />
        <Card title="Karya Draf" value={String(draftCount)} sub="Belum diterbitkan" />
        <Card title="Ketersediaan Kerja" value={draft.availability ? "Tersedia" : "Tidak tersedia"} sub="Status saat ini" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
        {/* Editor */}
        <div className="space-y-6">
          <section className="rounded-xl bg-surface-container-low p-6 space-y-4">
            <h2 className="font-display text-lg font-semibold">Editor Modul Beranda</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Nama Tampilan" value={draft.brandName} onChange={(v) => update("brandName", v)} />
              <Field label="Gelar Profesi" value={draft.tagline} onChange={(v) => update("tagline", v)} />
              <Field label="Gelar Profesi (EN)" value={draft.taglineEn || ""} onChange={(v) => update("taglineEn", v)} />
              <div className="md:col-span-2">
                <label className="block text-sm text-on-surface-variant mb-1">Pernyataan Utama ({heroLen}/{heroMax})</label>
                <input
                  value={draft.heroTitle}
                  maxLength={heroMax}
                  onChange={(e) => update("heroTitle", e.target.value)}
                  className="w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-on-surface ring-1 ring-outline-variant focus:ring-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-on-surface-variant mb-1">Pernyataan Utama (EN) ({(draft.heroTitleEn || "").length}/{heroMax})</label>
                <input
                  value={draft.heroTitleEn || ""}
                  maxLength={heroMax}
                  onChange={(e) => update("heroTitleEn", e.target.value)}
                  className="w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-on-surface ring-1 ring-outline-variant focus:ring-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-on-surface-variant mb-1">Bio Singkat</label>
                <textarea
                  value={draft.heroSubtitle}
                  rows={3}
                  onChange={(e) => update("heroSubtitle", e.target.value)}
                  className="w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-on-surface ring-1 ring-outline-variant focus:ring-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-on-surface-variant mb-1">Bio Singkat (EN)</label>
                <textarea
                  value={draft.heroSubtitleEn || ""}
                  rows={3}
                  onChange={(e) => update("heroSubtitleEn", e.target.value)}
                  className="w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-on-surface ring-1 ring-outline-variant focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm text-on-surface-variant mb-1">Bahasa</label>
                <select className="w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-on-surface ring-1 ring-outline-variant">
                  <option>Bahasa Indonesia (aktif)</option>
                  <option>English (didukung — toggle publik via template)</option>
                </select>
                <p className="text-xs text-outline mt-1">Bahasa Inggris diisi melalui field (EN) pada profil, hero, dan proyek, serta toggle publik pada template.</p>
              </div>
              <Field label="Pengalaman (tahun)" type="number" value={String(draft.experienceYears)} onChange={(v) => update("experienceYears", Number(v))} />
              <Field label="Lokasi" value={draft.location} onChange={(v) => update("location", v)} />
              <Field label="Zona Waktu" value={draft.timezone} onChange={(v) => update("timezone", v)} />
            </div>
          </section>

          <section className="rounded-xl bg-surface-container-low p-6 space-y-4">
            <h2 className="font-display text-lg font-semibold">Integrasi Saluran Kontak Publik</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Email" value={draft.email} onChange={(v) => update("email", v)} />
              <Field label="WhatsApp Bisnis" value={draft.whatsapp} onChange={(v) => update("whatsapp", v)} />
              <Field label="LinkedIn" value={draft.linkedin} onChange={(v) => update("linkedin", v)} />
              <Field label="Portofolio" value={draft.portfolioUrl} onChange={(v) => update("portfolioUrl", v)} />
            </div>
          </section>

          <section className="rounded-xl bg-surface-container-low p-6 space-y-4">
            <h2 className="font-display text-lg font-semibold">Foto Profil</h2>
            <PhotoUpload value={draft.photoUrl} onChange={(v) => update("photoUrl", v)} />
          </section>

          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={handleReset} className="px-4 py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high">
              Reset Perubahan
            </button>
            <button type="button" onClick={handleSave} disabled={saving} className="px-5 py-2 rounded-lg bg-primary-container text-on-primary-container font-medium hover:bg-primary">
              {saving ? "Menyimpan..." : "Simpan Draf"}
            </button>
            <button type="button" onClick={handlePublish} disabled={saving} className="px-5 py-2 rounded-lg bg-secondary-container text-on-secondary-container font-medium hover:bg-secondary">
              Terbitkan
            </button>
            {status && <span className="text-sm text-on-surface-variant self-center">{status}</span>}
            {((draft.idUpdatedAt || "") > (draft.enUpdatedAt || "")) && (
              <span className="text-sm text-tertiary self-center">Terjemahan EN perlu diperbarui</span>
            )}
          </div>
          <p className="text-xs text-outline">Terakhir disimpan: {new Date(draft.draftUpdatedAt).toLocaleString("id-ID")}</p>
          <p className="text-xs text-outline">
            Versi publik saat ini:{" "}
            {published.publishedAt ? new Date(published.publishedAt).toLocaleString("id-ID") : "belum pernah diterbitkan"}
          </p>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          <section className="rounded-xl bg-surface-container-low p-4 space-y-3">
            <h2 className="font-display text-lg font-semibold">Palet Warna</h2>
            <label className="block text-sm text-on-surface-variant">Warna Utama</label>
            <input type="color" value={draft.primaryColor} onChange={(e) => update("primaryColor", e.target.value)} className="h-10 w-full rounded cursor-pointer" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={draft.availability} onChange={(e) => update("availability", e.target.checked)} className="accent-primary" />
              Tersedia untuk proyek
            </label>
          </section>

          <section className="rounded-xl bg-surface-container-low p-4 space-y-3">
            <h2 className="font-display text-lg font-semibold">Preview Profil</h2>
            <div className="rounded-xl bg-surface-container-lowest p-4 space-y-2 border border-outline-variant/30">
              {draft.photoUrl && <Image src={draft.photoUrl} alt={draft.brandName} width={64} height={64} unoptimized className="w-16 h-16 rounded-full object-cover" />}
              <p className="font-display font-bold text-lg">{draft.brandName}</p>
              <p className="text-sm text-primary">{draft.tagline}</p>
              <p className="text-sm text-on-surface-variant">{draft.heroTitle}</p>
              <p className="text-xs text-outline">{draft.location} • {draft.timezone}</p>
              <p className="text-xs text-outline">{draft.email}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <div className="p-4 rounded-xl bg-surface-container-low">
      <p className="text-xs text-outline uppercase">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <p className="text-xs text-on-surface-variant mt-1">{sub}</p>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-sm text-on-surface-variant mb-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-on-surface ring-1 ring-outline-variant focus:ring-primary" />
    </div>
  );
}

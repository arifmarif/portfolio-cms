"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import type { Project, SiteSettings } from "@/lib/types";
import ImageGallery from "@/components/ImageGallery";
import DownloadGate from "@/components/DownloadGate";
import ContactForm from "@/components/ContactForm";

function t(settings: SiteSettings, locale: "id" | "en") {
  return {
    tagline: locale === "en" ? settings.taglineEn || settings.tagline : settings.tagline,
    heroTitle: locale === "en" ? settings.heroTitleEn || settings.heroTitle : settings.heroTitle,
    heroSubtitle: locale === "en" ? settings.heroSubtitleEn || settings.heroSubtitle : settings.heroSubtitle,
  };
}

function projectText(p: Project, locale: "id" | "en") {
  return {
    title: locale === "en" ? p.titleEn || p.title : p.title,
    excerpt: locale === "en" ? p.excerptEn || p.excerpt : p.excerpt,
    description: locale === "en" ? p.descriptionEn || p.description : p.description,
    altText: locale === "en" ? p.altTextEn || p.altText : p.altText,
    tags: locale === "en" ? p.tagsEn || p.tags : p.tags,
    gallery: p.gallery.map((g) => ({ url: g.url, alt: locale === "en" ? g.altEn || g.alt : g.alt })),
  };
}

const labels = {
  id: { tentang: "Tentang", karya: "Karya", pendekatan: "Pendekatan", kontak: "Kontak", lihat: "Lihat Karya Terpilih", hubungi: "Hubungi Langsung", prinsip: "Prinsip Kerja", proses: "Alur Kerja", siap: "Siap Mewujudkan Produk Berkualitas Tinggi?", hub: "Hubungi saya melalui email." },
  en: { tentang: "About", karya: "Work", pendekatan: "Approach", kontak: "Contact", lihat: "View Selected Work", hubungi: "Contact Directly", prinsip: "Working Principles", proses: "Workflow", siap: "Ready to Build High-Quality Products?", hub: "Reach me via email." },
};

export function EditorialTemplate({ settings, projects }: { settings: SiteSettings; projects: Project[] }) {
  const [locale, setLocale] = useState<"id" | "en">("id");

  useEffect(() => {
    const saved = localStorage.getItem("locale");
    if (saved === "en" || saved === "id") setLocale(saved);
  }, []);

  function switchLocale(l: "id" | "en") {
    setLocale(l);
    localStorage.setItem("locale", l);
  }

  const tx = t(settings, locale);
  const L = labels[locale];
  const published = projects.filter((p) => p.status === "PUBLISHED");

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="sticky top-0 z-40 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/30">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <span className="font-display text-lg font-bold text-on-surface">{settings.brandName}</span>
            <span className="hidden sm:block text-xs text-outline uppercase tracking-wider">{settings.tagline}</span>
          </a>
          <nav className="hidden md:flex items-center gap-6">
            {[L.tentang, L.karya, L.pendekatan, L.kontak].map((n) => (
              <a key={n} href={`#${n.toLowerCase()}`} className="text-sm text-on-surface-variant hover:text-on-surface">
                {n}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm">
              <button onClick={() => switchLocale("id")} className={`px-2 py-1 rounded ${locale === "id" ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant"}`}>ID</button>
              <span className="text-outline">|</span>
              <button onClick={() => switchLocale("en")} className={`px-2 py-1 rounded ${locale === "en" ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant"}`}>EN</button>
            </div>
            {settings.availability && (
              <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-secondary text-xs">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                {locale === "en" ? "Available" : "Tersedia"}
              </span>
            )}
            <a href="#kontak" className="px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-medium hover:bg-primary-fixed-dim">
              {locale === "en" ? "Contact Me" : "Hubungi Saya"}
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden pb-16">
          <div className="max-w-[1320px] mx-auto px-4 md:px-8 pt-10 lg:pt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="font-mono text-sm text-primary tracking-wide">01 — {tx.tagline.toUpperCase()}</span>
              <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">{tx.heroTitle}</h1>
              <p className="text-lg text-on-surface-variant max-w-2xl">{tx.heroSubtitle}</p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a href="#karya" className="px-6 py-3 rounded-lg bg-primary-container text-on-primary-container font-medium hover:bg-primary">
                  {L.lihat}
                </a>
                <a href="#kontak" className="px-6 py-3 rounded-lg bg-surface-container-high text-on-surface font-medium hover:bg-surface-bright">
                  {L.hubungi}
                </a>
                <DownloadGate label={locale === "en" ? "Download Portfolio (PDF)" : "Unduh Portofolio (PDF)"} />
              </div>
              <div className="pt-4 flex flex-wrap gap-4 text-outline font-mono text-xs">
                <span>{settings.experienceYears}+ {locale === "en" ? "years experience" : "tahun pengalaman"}</span>
                <span>{settings.projectsCount} {locale === "en" ? "projects" : "proyek"}</span>
                <span>{settings.location}</span>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative max-w-[420px] mx-auto">
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-tr from-primary-container/30 via-surface-container-high to-secondary-container/20 blur-sm -rotate-1" />
                <div className="relative rounded-2xl bg-surface-container-low overflow-hidden shadow-xl aspect-square">
                  <Image src={settings.photoUrl} alt={settings.brandName} fill className="object-cover" unoptimized />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest py-16">
          <div className="max-w-[1320px] mx-auto px-4 md:px-8">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-8">{L.prinsip}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { t: locale === "en" ? "Reliable Infrastructure" : "Keandalan Infrastruktur", d: locale === "en" ? "Keep networks and systems stable." : "Menjaga jaringan dan sistem tetap stabil." },
                { t: locale === "en" ? "Fast Problem Solving" : "Pemecahan Masalah Cepat", d: locale === "en" ? "Efficient diagnosis and solutions." : "Diagnosis dan solusi yang efisien." },
                { t: locale === "en" ? "Clean Documentation" : "Dokumentasi Rapi", d: locale === "en" ? "Technical guides for continuity." : "Panduan teknis untuk kelangsungan operasional." },
              ].map((x) => (
                <div key={x.t} className="rounded-xl bg-surface-container-low p-6 border border-outline-variant/20">
                  <h3 className="font-display text-xl font-semibold mb-2">{x.t}</h3>
                  <p className="text-on-surface-variant">{x.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="karya" className="py-16">
          <div className="max-w-[1320px] mx-auto px-4 md:px-8">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-8">{L.karya}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {published.map((p) => {
                const pt = projectText(p, locale);
                return (
                  <article key={p.id} className="group rounded-xl bg-surface-container-low overflow-hidden border border-outline-variant/20 hover:border-primary/40 transition">
                    <ImageGallery images={pt.gallery.length ? pt.gallery : [{ url: p.thumbnailUrl, alt: pt.altText }]} />
                    <div className="p-5 space-y-2">
                      <div className="flex flex-wrap gap-2">
                        {pt.tags.map((t) => (
                          <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-primary-container/20 text-primary">{t}</span>
                        ))}
                      </div>
                      <h3 className="font-display text-xl font-semibold group-hover:text-primary transition">{pt.title}</h3>
                      <p className="text-on-surface-variant text-sm">{pt.excerpt}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest py-16">
          <div className="max-w-[1320px] mx-auto px-4 md:px-8">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-8">{L.proses}</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {(locale === "en"
                ? ["Assessment & Diagnosis", "Configuration & Implementation", "Testing & Validation", "Maintenance & Monitoring"]
                : ["Assessment & Diagnosis", "Konfigurasi & Implementasi", "Pengujian & Validasi", "Pemeliharaan & Monitoring"]
              ).map((s, i) => (
                <div key={s} className="rounded-xl bg-surface-container-low p-5">
                  <div className="text-primary font-mono text-sm mb-2">0{i + 1}</div>
                  <h3 className="font-display font-semibold">{s}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="kontak" className="py-16">
          <div className="max-w-[1320px] mx-auto px-4 md:px-8 text-center space-y-4">
            <h2 className="font-display text-3xl md:text-4xl font-semibold">{L.siap}</h2>
            <p className="text-on-surface-variant">{L.hub}</p>
            <a href={`mailto:${settings.email}`} className="inline-block px-6 py-3 rounded-lg bg-primary-container text-on-primary-container font-medium hover:bg-primary">
              {settings.email}
            </a>
            {settings.phone && <p className="text-on-surface-variant text-sm">{settings.phone}</p>}
            <div className="flex justify-center gap-4 pt-2 text-sm text-on-surface-variant">
              <a href={settings.linkedin} className="hover:text-primary">LinkedIn</a>
              <a href={settings.portfolioUrl} className="hover:text-primary">{locale === "en" ? "Portfolio" : "Portofolio"}</a>
            </div>
            <div className="pt-6">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-surface-container-lowest mt-12">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-outline">
          <p>© 2025 {settings.brandName}. {locale === "en" ? "All rights reserved." : "Hak cipta dilindungi."}</p>
          <span>{settings.location}</span>
        </div>
      </footer>
    </div>
  );
}
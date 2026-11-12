"use client";
import { ArrowUpRight, Mail, MessageCircle, ExternalLink } from "lucide-react";
import type { Project, SiteSettings } from "@/lib/types";
import ImageGallery from "@/components/ImageGallery";
import DownloadGate from "@/components/DownloadGate";
import ContactForm from "@/components/ContactForm";
import Link from "next/link";
import { useLocale, type Locale } from "@/hooks/useLocale";

function t(settings: SiteSettings, locale: Locale) {
  return {
    tagline: locale === "en" ? settings.taglineEn || settings.tagline : settings.tagline,
    heroTitle: locale === "en" ? settings.heroTitleEn || settings.heroTitle : settings.heroTitle,
    heroSubtitle: locale === "en" ? settings.heroSubtitleEn || settings.heroSubtitle : settings.heroSubtitle,
  };
}

function projectText(p: Project, locale: Locale) {
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
  id: { karya: "Karya", kontak: "Kontak", lihat: "Lihat Karya Terpilih", hubungi: "Hubungi Langsung", siap: "Siap Mewujudkan Produk Berkualitas Tinggi?", hub: "Hubungi saya melalui email." },
  en: { karya: "Work", kontak: "Contact", lihat: "View Selected Work", hubungi: "Contact Directly", siap: "Ready to Build High-Quality Products?", hub: "Reach me via email." },
};

export function BoldTemplate({ settings, projects }: { settings: SiteSettings; projects: Project[] }) {
  const [locale, switchLocale] = useLocale();
  const tx = t(settings, locale);
  const L = labels[locale];
  const published = projects.filter((p) => p.status === "PUBLISHED");

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="px-6 py-6 flex items-center justify-between border-b border-outline-variant/30">
        <span className="font-display text-2xl font-bold uppercase tracking-tight">{settings.brandName}</span>
        <div className="flex items-center gap-4">
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
          <a href="#kontak" className="px-4 py-2 bg-primary text-on-primary rounded">{L.kontak}</a>
        </div>
      </header>

      <main>
        <section className="px-6 py-20">
          <div className="max-w-4xl">
            <span className="font-mono text-sm text-primary tracking-wide">01 — {tx.tagline.toUpperCase()}</span>
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-none mt-6 max-w-4xl">{tx.heroTitle}</h1>
            <p className="mt-6 max-w-2xl text-on-surface-variant">{tx.heroSubtitle}</p>
            <div className="flex flex-wrap gap-3 mt-8">
              <a href="#karya" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-on-primary font-medium hover:bg-primary-fixed-dim transition-colors">
                {L.lihat}
                <ArrowUpRight aria-hidden="true" />
              </a>
              <a href="#kontak" className="px-6 py-3 rounded-lg text-on-surface font-medium underline decoration-outline-variant underline-offset-4 hover:text-primary transition-colors">
                {L.hubungi}
              </a>
              <DownloadGate label={locale === "en" ? "Download CV" : "Unduh CV"} cvUrl={settings.cvUrl} />
            </div>
            <div className="pt-6 flex flex-wrap gap-6 text-outline font-mono text-xs">
              <span>{settings.experienceYears}+ {locale === "en" ? "years experience" : "tahun pengalaman"}</span>
              <span>{settings.projectsCount} {locale === "en" ? "projects" : "proyek"}</span>
              <span>{settings.location}</span>
            </div>
          </div>
        </section>

        <section id="karya" className="px-6 pb-16">
          <h2 className="font-display text-4xl font-bold mb-8">{L.karya}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {published.map((p) => {
              const pt = projectText(p, locale);
              return (
                <article key={p.id} className="group relative rounded-xl bg-surface-container-low overflow-hidden border border-outline-variant/20 hover:border-primary/40 transition">
                  <ImageGallery images={pt.gallery.length ? pt.gallery : [{ url: p.thumbnailUrl, alt: pt.altText }]} />
                  <div className="p-5 space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-display text-xl font-semibold group-hover:text-primary transition">{pt.title}</h3>
                      {p.year && <span className="shrink-0 font-mono text-xs text-outline">{p.year}</span>}
                    </div>
                    <p className="text-on-surface-variant text-sm">{pt.excerpt}</p>
                    {p.client || p.category ? (
                      <p className="pt-2 font-mono text-xs uppercase tracking-wider text-outline">
                        {[p.client, p.category].filter(Boolean).join(" · ")}
                      </p>
                    ) : null}
                  </div>
                  <Link
                    href={`/projects/${p.slug}`}
                    aria-label={`${pt.title} — ${locale === "en" ? "View case study" : "Lihat Studi Kasus"}`}
                    className="absolute inset-0 z-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  />
                </article>
              );
            })}
          </div>
        </section>

        <section id="kontak" className="px-6 py-16 text-center">
          <h2 className="font-display text-4xl font-bold mb-4">{L.siap}</h2>
          <p className="text-on-surface-variant">{L.hub}</p>
          <div className="flex flex-wrap justify-center gap-6 pt-6">
            <a href={`mailto:${settings.email}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-container text-on-primary-container font-medium hover:bg-primary">
              <Mail aria-hidden="true" className="size-4" />
              {settings.email}
            </a>
            {settings.whatsapp && (() => {
              const normalized = settings.whatsapp.replace(/\D/g, "");
              if (!normalized) return null;
              return (
                <a
                  href={`https://wa.me/${normalized}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-container text-on-primary-container font-medium hover:bg-primary"
                >
                  <MessageCircle aria-hidden="true" className="size-4" />
                  {settings.whatsapp}
                </a>
              );
            })()}
            <a href={settings.linkedin} className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-container text-on-primary-container font-medium hover:bg-primary">
              <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
            {settings.portfolioUrl && (
              <a href={settings.portfolioUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-container text-on-primary-container font-medium hover:bg-primary">
                <ExternalLink aria-hidden="true" className="size-4" />
                {locale === "en" ? "Portfolio" : "Portofolio"}
              </a>
            )}
          </div>
          <div className="pt-6">
            <ContactForm />
          </div>
        </section>
      </main>
    </div>
  );
}

import type { Project, SiteSettings } from "@/lib/types";
import Image from "next/image";
import ImageGallery from "@/components/ImageGallery";
import DownloadGate from "@/components/DownloadGate";
import ContactForm from "@/components/ContactForm";

export function EditorialTemplate({ settings, projects }: { settings: SiteSettings; projects: Project[] }) {
  const published = projects.filter((p) => p.status === "PUBLISHED");
  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-surface/85 backdrop-blur-xl border-b border-outline-variant/30">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <span className="font-display text-lg font-bold text-on-surface">{settings.brandName}</span>
            <span className="hidden sm:block text-xs text-outline uppercase tracking-wider">{settings.tagline}</span>
          </a>
          <nav className="hidden md:flex items-center gap-6">
            {["Tentang", "Karya", "Pendekatan", "Kontak"].map((n) => (
              <a key={n} href={`#${n.toLowerCase()}`} className="text-sm text-on-surface-variant hover:text-on-surface">
                {n}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            {settings.availability && (
              <span className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-high text-secondary text-xs">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                Tersedia
              </span>
            )}
            <a href="#kontak" className="px-4 py-2 rounded-lg bg-primary text-on-primary text-sm font-medium hover:bg-primary-fixed-dim">
              Hubungi Saya
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden pb-16">
          <div className="max-w-[1320px] mx-auto px-4 md:px-8 pt-10 lg:pt-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <span className="font-mono text-sm text-primary tracking-wide">01 — {settings.tagline.toUpperCase()}</span>
              <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">{settings.heroTitle}</h1>
              <p className="text-lg text-on-surface-variant max-w-2xl">{settings.heroSubtitle}</p>
              <div className="flex flex-wrap gap-3 pt-2">
                <a href="#karya" className="px-6 py-3 rounded-lg bg-primary-container text-on-primary-container font-medium hover:bg-primary">
                  Lihat Karya Terpilih
                </a>
                <a href="#kontak" className="px-6 py-3 rounded-lg bg-surface-container-high text-on-surface font-medium hover:bg-surface-bright">
                  Hubungi Langsung
                </a>
                <DownloadGate />
              </div>
              <div className="pt-4 flex flex-wrap gap-4 text-outline font-mono text-xs">
                <span>{settings.experienceYears}+ tahun pengalaman</span>
                <span>{settings.projectsCount} proyek</span>
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

        {/* Principles */}
        <section className="bg-surface-container-lowest py-16">
          <div className="max-w-[1320px] mx-auto px-4 md:px-8">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-8">Prinsip Kerja</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { t: "Keandalan Infrastruktur", d: "Menjaga jaringan dan sistem tetap stabil." },
                { t: "Pemecahan Masalah Cepat", d: "Diagnosis dan solusi yang efisien." },
                { t: "Dokumentasi Rapi", d: "Panduan teknis untuk kelangsungan operasional." },
              ].map((x) => (
                <div key={x.t} className="rounded-xl bg-surface-container-low p-6 border border-outline-variant/20">
                  <h3 className="font-display text-xl font-semibold mb-2">{x.t}</h3>
                  <p className="text-on-surface-variant">{x.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section id="karya" className="py-16">
          <div className="max-w-[1320px] mx-auto px-4 md:px-8">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-8">Studi Kasus &amp; Proyek Unggulan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {published.map((p) => (
                <article key={p.id} className="group rounded-xl bg-surface-container-low overflow-hidden border border-outline-variant/20 hover:border-primary/40 transition">
                  <ImageGallery images={p.gallery && p.gallery.length ? p.gallery : [{ url: p.thumbnailUrl, alt: p.altText }]} />
                  <div className="p-5 space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-primary-container/20 text-primary">{t}</span>
                      ))}
                    </div>
                    <h3 className="font-display text-xl font-semibold group-hover:text-primary transition">{p.title}</h3>
                    <p className="text-on-surface-variant text-sm">{p.excerpt}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="bg-surface-container-lowest py-16">
          <div className="max-w-[1320px] mx-auto px-4 md:px-8">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-8">Alur Kerja</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {["Assessment & Diagnosis", "Konfigurasi & Implementasi", "Pengujian & Validasi", "Pemeliharaan & Monitoring"].map((s, i) => (
                <div key={s} className="rounded-xl bg-surface-container-low p-5">
                  <div className="text-primary font-mono text-sm mb-2">0{i + 1}</div>
                  <h3 className="font-display font-semibold">{s}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="kontak" className="py-16">
          <div className="max-w-[1320px] mx-auto px-4 md:px-8 text-center space-y-4">
            <h2 className="font-display text-3xl md:text-4xl font-semibold">Siap Mewujudkan Produk Berkualitas Tinggi?</h2>
            <p className="text-on-surface-variant">Hubungi saya melalui email.</p>
            <a href={`mailto:${settings.email}`} className="inline-block px-6 py-3 rounded-lg bg-primary-container text-on-primary-container font-medium hover:bg-primary">
              {settings.email}
            </a>
            {settings.phone && <p className="text-on-surface-variant text-sm">{settings.phone}</p>}
            <div className="pt-6">
              <ContactForm />
            </div>
            <div className="flex justify-center gap-4 pt-2 text-sm text-on-surface-variant">
              <a href={settings.linkedin} className="hover:text-primary">LinkedIn</a>
              <a href={settings.github} className="hover:text-primary">GitHub</a>
              <a href={settings.portfolioUrl} className="hover:text-primary">Portofolio</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-surface-container-lowest mt-12">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-outline">
          <p>© 2025 {settings.brandName}. Hak cipta dilindungi.</p>
          <span>{settings.location}</span>
        </div>
      </footer>
    </div>
  );
}

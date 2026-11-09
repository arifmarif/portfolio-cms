import type { Project, SiteSettings } from "@/lib/types";
import Image from "next/image";

export function BoldTemplate({ settings, projects }: { settings: SiteSettings; projects: Project[] }) {
  const published = projects.filter((p) => p.status === "PUBLISHED");
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="px-6 py-6 flex items-center justify-between border-b border-outline-variant/30">
        <span className="font-display text-2xl font-bold uppercase tracking-tight">{settings.brandName}</span>
        <a href="#kontak" className="px-4 py-2 bg-primary text-on-primary rounded">Kontak</a>
      </header>
      <main>
        <section className="px-6 py-20">
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-none max-w-4xl">{settings.heroTitle}</h1>
          <p className="mt-6 max-w-2xl text-on-surface-variant">{settings.heroSubtitle}</p>
        </section>
        <section className="px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          {published.map((p) => (
            <div key={p.id} className="relative aspect-square overflow-hidden rounded-xl group">
              <Image src={p.thumbnailUrl} alt={p.altText} fill className="object-cover group-hover:scale-110 transition-transform duration-700" unoptimized />
              <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                <h3 className="font-display text-xl font-bold text-white">{p.title}</h3>
              </div>
            </div>
          ))}
        </section>
        <section id="kontak" className="px-6 py-16 text-center">
          <h2 className="font-display text-4xl font-bold mb-4">Kontak</h2>
          <a href={`mailto:${settings.email}`} className="text-primary text-lg">{settings.email}</a>
          {settings.phone && <p className="text-on-surface-variant mt-1">{settings.phone}</p>}
        </section>
      </main>
    </div>
  );
}

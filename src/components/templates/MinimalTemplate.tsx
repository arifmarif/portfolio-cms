import type { Project, SiteSettings } from "@/lib/types";

export function MinimalTemplate({ settings, projects }: { settings: SiteSettings; projects: Project[] }) {
  const published = projects.filter((p) => p.status === "PUBLISHED");
  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface">
      <header className="max-w-3xl mx-auto px-6 py-8 flex items-center justify-between">
        <span className="font-display text-xl font-bold">{settings.brandName}</span>
        <a href="#kontak" className="text-sm text-primary">Kontak</a>
      </header>
      <main className="max-w-3xl mx-auto px-6 space-y-12 pb-16">
        <section>
          <h1 className="font-display text-4xl font-bold leading-tight">{settings.heroTitle}</h1>
          <p className="mt-4 text-on-surface-variant">{settings.heroSubtitle}</p>
        </section>
        <section>
          <h2 className="font-display text-2xl font-semibold mb-4">Karya</h2>
          <div className="space-y-6">
            {published.map((p) => (
              <div key={p.id} className="border-b border-outline-variant/30 pb-4">
                <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                <p className="text-sm text-on-surface-variant">{p.excerpt}</p>
              </div>
            ))}
          </div>
        </section>
        <section id="kontak">
          <h2 className="font-display text-2xl font-semibold mb-2">Kontak</h2>
          <a href={`mailto:${settings.email}`} className="text-primary">{settings.email}</a>
          {settings.phone && <p className="text-sm text-on-surface-variant mt-1">{settings.phone}</p>}
        </section>
      </main>
    </div>
  );
}

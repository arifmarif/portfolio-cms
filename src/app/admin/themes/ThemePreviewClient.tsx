"use client";
import { useState, useTransition } from "react";
import { TemplateRenderer } from "@/components/templates";
import { updateActiveTemplate, publishAll } from "../actions";
import type { SiteSettings, Project, Template } from "@/lib/types";

export function ThemePreviewClient({
  templates,
  projects,
  settings,
  publishedSettings,
}: {
  templates: Template[];
  projects: Project[];
  settings: SiteSettings;
  publishedSettings: SiteSettings;
}) {
  const [selected, setSelected] = useState(settings.activeTemplateId);
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [pending, startTransition] = useTransition();
  const [publishState, setPublishState] = useState<{ pending: boolean; message: string }>({ pending: false, message: "" });

  const previewSettings = { ...settings, activeTemplateId: selected };

  function apply() {
    startTransition(async () => {
      await updateActiveTemplate(selected);
    });
  }
  async function publish() {
    setPublishState({ pending: true, message: "" });
    startTransition(async () => {
      try {
        await publishAll();
        setPublishState({ pending: false, message: "Berhasil diterbitkan: pengaturan draf dan proyek bertahap kini dipublikasi." });
      } catch {
        setPublishState({ pending: false, message: "Terjadi kegagalan saat menerbitkan. Silakan coba lagi." });
      }
    });
  }

  const width = viewport === "desktop" ? "100%" : viewport === "tablet" ? "768px" : "390px";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Pratinjau Draf &amp; Kustomisasi Tampilan</h1>
        <div className="flex gap-2">
          <a href="/print" target="_blank" className="px-4 py-2 rounded-lg bg-surface-container-high text-on-surface font-medium hover:bg-surface-bright">
            Ekspor PDF
          </a>
          <button onClick={publish} disabled={pending} className="px-4 py-2 rounded-lg bg-primary-container text-on-primary-container font-medium hover:bg-primary">
            Terbitkan Versi Ini
          </button>
        </div>
        {publishState.message && <p className="text-sm text-on-surface-variant">{publishState.message}</p>}
      </div>

      <div className="flex gap-2">
        {(["desktop", "tablet", "mobile"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setViewport(v)}
            className={`px-3 py-1.5 rounded-md text-sm ${viewport === v ? "bg-surface-container-high text-primary" : "text-on-surface-variant hover:text-on-surface"}`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-4">
        {/* Left config */}
        <aside className="space-y-4 rounded-xl bg-surface-container-low p-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
          <section>
            <h2 className="font-display font-semibold mb-2">Galeri Template</h2>
            <div className="space-y-3">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelected(t.id)}
                  className={`w-full text-left rounded-lg p-3 border transition ${selected === t.id ? "border-primary bg-primary-container/10" : "border-outline-variant/30 hover:border-primary/40"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{t.name}</span>
                    {publishedSettings.activeTemplateId === t.id && (
                      <span className="text-xs text-secondary">Aktif</span>
                    )}
                  </div>
                  <p className="text-xs text-on-surface-variant mt-1">{t.description}</p>
                </button>
              ))}
            </div>
            <button onClick={apply} disabled={pending} className="mt-3 w-full px-4 py-2 rounded-lg bg-secondary-container text-on-secondary-container font-medium hover:bg-secondary">
              Gunakan Template Ini
            </button>
          </section>
        </aside>

        {/* Preview */}
        <div className="rounded-2xl bg-surface-container-low overflow-hidden" style={{ width }}>
          <div className="max-h-[calc(100vh-12rem)] overflow-auto">
            <TemplateRenderer templateId={selected} settings={previewSettings} projects={projects} />
          </div>
        </div>
      </div>
    </div>
  );
}

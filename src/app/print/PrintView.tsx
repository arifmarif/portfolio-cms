"use client";
import { useEffect } from "react";
import { TemplateRenderer } from "@/components/templates";
import type { SiteSettings, Project } from "@/lib/types";

export function PrintView({ settings, projects }: { settings: SiteSettings; projects: Project[] }) {
  useEffect(() => {
    document.title = `Portofolio-${settings.brandName.replace(/\s+/g, "-")}`;
    const t = setTimeout(() => window.print(), 600);
    return () => clearTimeout(t);
  }, [settings.brandName]);
  return (
    <div className="relative">
      <div className="relative">
        <TemplateRenderer templateId={settings.activeTemplateId} settings={settings} projects={projects} />
        <div className="pointer-events-none select-none fixed inset-0 z-50 flex items-center justify-center opacity-10 print:opacity-10">
          <span className="text-6xl font-bold rotate-[-30deg] text-on-surface whitespace-nowrap">
            {settings.brandName} • Portofolio
          </span>
        </div>
      </div>
      <style>{`
        @media print {
          .no-print { display: none; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
      `}</style>
    </div>
  );
}

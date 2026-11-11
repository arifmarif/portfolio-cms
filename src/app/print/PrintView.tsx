"use client";
import { useEffect } from "react";
import Image from "next/image";
import type { SiteSettings, Project } from "@/lib/types";
import "./print.css";

/** Resolves when every image in the document has loaded (or failed). */
function waitForImages(): Promise<void> {
  return Promise.all(
    Array.from(document.images).map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
          })
    )
  ).then(() => undefined);
}

export function PrintView({ settings, projects }: { settings: SiteSettings; projects: Project[] }) {
  const published = [...projects].sort((a, b) => a.order - b.order);
  const allTags = [...new Set(published.flatMap((p) => p.tags))].slice(0, 14);
  const contactLine = [
    settings.location,
    settings.email,
    settings.phone || settings.whatsapp,
  ]
    .filter(Boolean)
    .join("  ·  ");

  useEffect(() => {
    document.title = `Portofolio-${settings.brandName.replace(/\s+/g, "-")}`;
    document.body.classList.add("print-doc-body");
    let cancelled = false;
    waitForImages().then(() => {
      if (!cancelled) setTimeout(() => window.print(), 400);
    });
    return () => {
      cancelled = true;
      document.body.classList.remove("print-doc-body");
    };
  }, [settings.brandName]);

  return (
    <div className="print-doc">
      <div className="print-watermark" aria-hidden="true">
        {settings.brandName} • Portofolio
      </div>

      <header className="print-header">
        <div>
          <h1>{settings.brandName}</h1>
          <p className="print-tagline">{settings.tagline}</p>
          <p className="print-contact">{contactLine}</p>
        </div>
        {settings.photoUrl ? (
          <Image
            src={settings.photoUrl}
            alt={settings.brandName}
            width={112}
            height={112}
            unoptimized
            loading="eager"
            className="print-photo"
          />
        ) : null}
      </header>

      <section className="print-block">
        <h2>Ringkasan</h2>
        <p className="print-summary">{settings.heroSubtitle}</p>
      </section>

      {allTags.length > 0 && (
        <section className="print-block">
          <h2>Keahlian</h2>
          <p className="print-tags">
            {allTags.map((tag) => (
              <span key={tag} className="print-tag">
                {tag}
              </span>
            ))}
          </p>
        </section>
      )}

      <section className="print-block">
        <h2>Proyek Terpilih</h2>
        {published.map((p, i) => (
          <article key={p.id} className="print-project">
            {p.thumbnailUrl ? (
              <Image
                src={p.thumbnailUrl}
                alt={p.altText}
                width={180}
                height={135}
                unoptimized
                loading="eager"
                className="print-project-img"
              />
            ) : null}
            <div className="print-project-body">
              <h3 className="print-project-title">
                <span>
                  {i + 1}. {p.title}
                </span>
                {p.featured ? <span className="print-project-featured">Unggulan</span> : null}
              </h3>
              <p className="print-project-meta">
                {[p.client, p.category, p.year].filter(Boolean).join("  ·  ")}
              </p>
              <p className="print-project-desc">{p.description}</p>
              {p.tags.length > 0 && <p className="print-project-tags">{p.tags.join("  ·  ")}</p>}
            </div>
          </article>
        ))}
      </section>

      <footer className="print-footer">
        <span>
          {settings.experienceYears}+ {settings.projectsCount > 0 ? settings.projectsCount : published.length}{" "}
          proyek · {settings.timezone}
        </span>
        <span>
          {[settings.linkedin, settings.portfolioUrl].filter(Boolean).join("  ·  ")}
        </span>
      </footer>
    </div>
  );
}

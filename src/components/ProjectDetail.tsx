"use client";
import Link from "next/link";
import ImageGallery from "@/components/ImageGallery";
import { useLocale, type Locale } from "@/hooks/useLocale";
import type { Project } from "@/lib/types";

const caseStudyLabels: Record<Locale, { background: string; challenge: string; role: string; implementation: string; tech: string; results: string }> = {
  id: {
    background: "Latar Belakang",
    challenge: "Tantangan & Kebutuhan Klien",
    role: "Peran & Tanggung Jawab",
    implementation: "Pekerjaan / Langkah Implementasi",
    tech: "Teknologi & Alat",
    results: "Hasil & Dampak",
  },
  en: {
    background: "Background",
    challenge: "Challenge & Client Needs",
    role: "Role & Responsibilities",
    implementation: "Delivery / Implementation Steps",
    tech: "Tech & Tools",
    results: "Results & Impact",
  },
};

export default function ProjectDetail({ project }: { project: Project }) {
  const [locale] = useLocale();
  const L = caseStudyLabels[locale];

  const title = locale === "en" ? (project.titleEn || project.title) : project.title;
  const description = locale === "en" ? (project.descriptionEn || project.description) : (project.description || project.descriptionEn);
  const caseBackground = locale === "en" ? (project.caseBackgroundEn || project.caseBackground) : (project.caseBackground || project.caseBackgroundEn);
  const caseChallenge = locale === "en" ? (project.caseChallengeEn || project.caseChallenge) : (project.caseChallenge || project.caseChallengeEn);
  const caseRole = locale === "en" ? (project.caseRoleEn || project.caseRole) : (project.caseRole || project.caseRoleEn);
  const caseImplementation = locale === "en" ? (project.caseImplementationEn?.length ? project.caseImplementationEn : project.caseImplementation) : (project.caseImplementation?.length ? project.caseImplementation : project.caseImplementationEn);
  const caseTech = locale === "en" ? (project.caseTechEn || project.caseTech) : (project.caseTech || project.caseTechEn);
  const caseResults = locale === "en" ? (project.caseResultsEn || project.caseResults) : (project.caseResults || project.caseResultsEn);

  const gallery = project.gallery && project.gallery.length ? project.gallery : [{ url: project.thumbnailUrl, alt: project.altText }];

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="max-w-4xl mx-auto px-6 py-6">
        <Link href="/#karya" className="text-primary hover:underline">{locale === "en" ? "← Back to Work" : "← Kembali ke Karya"}</Link>
      </header>
      <main className="max-w-4xl mx-auto px-6 pb-16 space-y-6">
        <ImageGallery images={gallery} />
        <div className="flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-primary-container/20 text-primary">{t}</span>
          ))}
        </div>
        <h1 className="font-display text-4xl font-bold">{title}</h1>
        <p className="text-on-surface-variant">
          {project.client} {project.year && `• ${project.year}`}
        </p>
        {description && <p className="text-lg leading-relaxed text-on-surface-variant">{description}</p>}

        {caseBackground ? (
          <section className="space-y-2 rounded-xl bg-surface-container-low p-6 border border-outline-variant/20">
            <h2 className="font-display text-2xl font-semibold">{L.background}</h2>
            <p className="leading-relaxed text-on-surface-variant">{caseBackground}</p>
          </section>
        ) : null}

        {caseChallenge ? (
          <section className="space-y-2 rounded-xl bg-surface-container-low p-6 border border-outline-variant/20">
            <h2 className="font-display text-2xl font-semibold">{L.challenge}</h2>
            <p className="leading-relaxed text-on-surface-variant">{caseChallenge}</p>
          </section>
        ) : null}

        {caseRole ? (
          <section className="space-y-2 rounded-xl bg-surface-container-low p-6 border border-outline-variant/20">
            <h2 className="font-display text-2xl font-semibold">{L.role}</h2>
            <p className="leading-relaxed text-on-surface-variant">{caseRole}</p>
          </section>
        ) : null}

        {caseImplementation && caseImplementation.length > 0 ? (
          <section className="space-y-2 rounded-xl bg-surface-container-low p-6 border border-outline-variant/20">
            <h2 className="font-display text-2xl font-semibold">{L.implementation}</h2>
            <ol className="list-decimal pl-6 space-y-2 text-on-surface-variant">
              {caseImplementation.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </section>
        ) : null}

        {caseTech ? (
          <section className="space-y-2 rounded-xl bg-surface-container-low p-6 border border-outline-variant/20">
            <h2 className="font-display text-2xl font-semibold">{L.tech}</h2>
            <div className="flex flex-wrap gap-2">
              {caseTech
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
                .map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-primary-container/20 text-primary">
                    {t}
                  </span>
                ))}
            </div>
          </section>
        ) : null}

        {caseResults ? (
          <section className="space-y-2 rounded-xl bg-surface-container-low p-6 border border-outline-variant/20">
            <h2 className="font-display text-2xl font-semibold">{L.results}</h2>
            <p className="leading-relaxed text-on-surface-variant">{caseResults}</p>
          </section>
        ) : null}
      </main>
    </div>
  );
}

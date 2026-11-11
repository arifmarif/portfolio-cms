import type { Metadata } from "next";
import { cache } from "react";
import { readState } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import ImageGallery from "@/components/ImageGallery";

export const dynamic = "force-dynamic";

const getPublishedProject = cache(async (slug: string) => {
  const state = await readState();
  return state.projects.find((p) => p.slug === slug && p.status === "PUBLISHED") ?? null;
});

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.excerpt,
    openGraph: {
      title: project.title,
      description: project.excerpt,
      images: [{ url: project.thumbnailUrl }],
    },
  };
}

export default async function ProjectDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  if (!project) notFound();
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="max-w-4xl mx-auto px-6 py-6">
        <Link href="/" className="text-primary hover:underline">← Kembali</Link>
      </header>
      <main className="max-w-4xl mx-auto px-6 pb-16 space-y-6">
        <ImageGallery images={project.gallery && project.gallery.length ? project.gallery : [{ url: project.thumbnailUrl, alt: project.altText }]} />
        <div className="flex flex-wrap gap-2">
          {project.tags.map((t) => <span key={t} className="text-xs px-2 py-0.5 rounded-full bg-primary-container/20 text-primary">{t}</span>)}
        </div>
        <h1 className="font-display text-4xl font-bold">{project.title}</h1>
        <p className="text-on-surface-variant">{project.client} {project.year && `• ${project.year}`}</p>
        <p className="text-lg leading-relaxed">{project.description}</p>
      </main>
    </div>
  );
}

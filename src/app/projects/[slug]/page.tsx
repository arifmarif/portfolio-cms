import type { Metadata } from "next";
import { cache } from "react";
import { readState } from "@/lib/db";
import { notFound } from "next/navigation";
import ProjectDetail from "@/components/ProjectDetail";

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

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getPublishedProject(slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}

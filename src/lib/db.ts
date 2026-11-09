import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import type { ContentState, SiteSettings, Project, DownloadSubmission } from "./types";
import { seedSettings, seedProjects, seedTemplates } from "./seed";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function toSettings(json: any): SiteSettings {
  return json as SiteSettings;
}

export async function readState(): Promise<ContentState> {
  let config = await prisma.siteConfig.findUnique({ where: { id: "singleton" } });
  if (!config) {
    config = await prisma.siteConfig.create({
      data: {
        id: "singleton",
        published: { ...seedSettings },
        draft: { ...seedSettings },
      },
    });
    await prisma.project.createMany({
      data: seedProjects.map((p) => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        category: p.category,
        excerpt: p.excerpt,
        description: p.description,
        thumbnailUrl: p.thumbnailUrl,
        altText: p.altText,
        tags: p.tags,
        client: p.client || null,
        year: p.year || null,
        status: p.status,
        order: p.order,
        featured: !!p.featured,
        gallery: p.gallery || [],
      })),
      skipDuplicates: true,
    });
  }

  const projects = await prisma.project.findMany({ orderBy: { order: "asc" } });
  const downloads = await prisma.downloadSubmission.findMany({ orderBy: { createdAt: "desc" } });

  const state: ContentState = {
    settings: toSettings(config.published),
    draftSettings: toSettings(config.draft),
    projects: projects.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      category: p.category,
      excerpt: p.excerpt,
      description: p.description,
      thumbnailUrl: p.thumbnailUrl,
      altText: p.altText,
      tags: p.tags,
      client: p.client || undefined,
      year: p.year || undefined,
      status: p.status as any,
      order: p.order,
      featured: p.featured,
      gallery: (p.gallery as any) || [],
    })),
    templates: seedTemplates,
    downloads: downloads.map((d) => ({
      id: d.id,
      email: d.email,
      phone: d.phone,
      pdfName: d.pdfName,
      createdAt: d.createdAt.toISOString(),
    })),
  };
  return state;
}

export async function writeState(state: ContentState): Promise<void> {
  await prisma.siteConfig.upsert({
    where: { id: "singleton" },
    update: { published: state.settings as any, draft: state.draftSettings as any },
    create: { id: "singleton", published: state.settings as any, draft: state.draftSettings as any },
  });

  // Sync projects: delete missing, upsert all
  const existing = await prisma.project.findMany({ select: { id: true } });
  const existingIds = new Set(existing.map((p) => p.id));
  const newIds = new Set(state.projects.map((p) => p.id));
  const toDelete = [...existingIds].filter((id) => !newIds.has(id));
  if (toDelete.length) {
    await prisma.project.deleteMany({ where: { id: { in: toDelete } } });
  }
  for (const p of state.projects) {
    await prisma.project.upsert({
      where: { id: p.id },
      update: {
        slug: p.slug,
        title: p.title,
        category: p.category,
        excerpt: p.excerpt,
        description: p.description,
        thumbnailUrl: p.thumbnailUrl,
        altText: p.altText,
        tags: p.tags,
        client: p.client || null,
        year: p.year || null,
        status: p.status,
        order: p.order,
        featured: !!p.featured,
        gallery: p.gallery || [],
      },
      create: {
        id: p.id,
        slug: p.slug,
        title: p.title,
        category: p.category,
        excerpt: p.excerpt,
        description: p.description,
        thumbnailUrl: p.thumbnailUrl,
        altText: p.altText,
        tags: p.tags,
        client: p.client || null,
        year: p.year || null,
        status: p.status,
        order: p.order,
        featured: !!p.featured,
        gallery: p.gallery || [],
      },
    });
  }

  // Sync downloads: insert new ones only (avoid duplicates by id)
  const existingDl = await prisma.downloadSubmission.findMany({ select: { id: true } });
  const existingDlIds = new Set(existingDl.map((d) => d.id));
  const newDls = state.downloads.filter((d) => !existingDlIds.has(d.id));
  if (newDls.length) {
    await prisma.downloadSubmission.createMany({
      data: newDls.map((d) => ({
        id: d.id,
        email: d.email,
        phone: d.phone,
        pdfName: d.pdfName,
        createdAt: new Date(d.createdAt),
      })),
      skipDuplicates: true,
    });
  }
  // Remove deleted
  const stateDlIds = new Set(state.downloads.map((d) => d.id));
  const toDeleteDl = [...existingDlIds].filter((id) => !stateDlIds.has(id));
  if (toDeleteDl.length) {
    await prisma.downloadSubmission.deleteMany({ where: { id: { in: toDeleteDl } } });
  }
}

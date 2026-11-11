import { PrismaClient, type Prisma } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { cache } from "react";
import type { ContentState, SiteSettings, Project, ProjectStatus } from "./types";
import { seedSettings, seedProjects, seedTemplates } from "./seed";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function toSettings(json: Prisma.JsonValue): SiteSettings {
  // Stored value was written by toJson() from a SiteSettings object; shape is trusted.
  return json as unknown as SiteSettings;
}

function toGallery(json: Prisma.JsonValue): Project["gallery"] {
  return Array.isArray(json) ? (json as Project["gallery"]) : [];
}

function toJson(value: SiteSettings): Prisma.InputJsonValue {
  // Round-trip guarantees plain JSON (no Dates/classes) for Prisma Json columns.
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

// Deduped per request: generateMetadata and page render share one read.
export const readState = cache(async (): Promise<ContentState> => {
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
        titleEn: p.titleEn || null,
        category: p.category,
        categoryEn: p.categoryEn || null,
        excerpt: p.excerpt,
        excerptEn: p.excerptEn || null,
        description: p.description,
        descriptionEn: p.descriptionEn || null,
        thumbnailUrl: p.thumbnailUrl,
        altText: p.altText,
        altTextEn: p.altTextEn || null,
        tags: p.tags,
        tagsEn: p.tagsEn || [],
        client: p.client || null,
        year: p.year || null,
        status: p.status,
        order: p.order,
        featured: !!p.featured,
        gallery: p.gallery || [],
        idUpdatedAt: p.idUpdatedAt ? new Date(p.idUpdatedAt) : null,
        enUpdatedAt: p.enUpdatedAt ? new Date(p.enUpdatedAt) : null,
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
      titleEn: p.titleEn || undefined,
      category: p.category,
      categoryEn: p.categoryEn || undefined,
      excerpt: p.excerpt,
      excerptEn: p.excerptEn || undefined,
      description: p.description,
      descriptionEn: p.descriptionEn || undefined,
      thumbnailUrl: p.thumbnailUrl,
      altText: p.altText,
      altTextEn: p.altTextEn || undefined,
      gallery: toGallery(p.gallery),
      idUpdatedAt: p.idUpdatedAt?.toISOString(),
      enUpdatedAt: p.enUpdatedAt?.toISOString(),
      tags: p.tags,
      tagsEn: p.tagsEn.length ? p.tagsEn : undefined,
      client: p.client || undefined,
      year: p.year || undefined,
      status: p.status as ProjectStatus,
      order: p.order,
      featured: p.featured,
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
});

function projectData(p: Project) {
  return {
    slug: p.slug,
    title: p.title,
    titleEn: p.titleEn || null,
    category: p.category,
    categoryEn: p.categoryEn || null,
    excerpt: p.excerpt,
    excerptEn: p.excerptEn || null,
    description: p.description,
    descriptionEn: p.descriptionEn || null,
    thumbnailUrl: p.thumbnailUrl,
    altText: p.altText,
    altTextEn: p.altTextEn || null,
    tags: p.tags,
    tagsEn: p.tagsEn || [],
    client: p.client || null,
    year: p.year || null,
    status: p.status,
    order: p.order,
    featured: !!p.featured,
    gallery: p.gallery || [],
    idUpdatedAt: p.idUpdatedAt ? new Date(p.idUpdatedAt) : null,
    enUpdatedAt: p.enUpdatedAt ? new Date(p.enUpdatedAt) : null,
  };
}

export async function writeState(state: ContentState): Promise<void> {
  await prisma.siteConfig.upsert({
    where: { id: "singleton" },
    update: { published: toJson(state.settings), draft: toJson(state.draftSettings) },
    create: { id: "singleton", published: toJson(state.settings), draft: toJson(state.draftSettings) },
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
      update: projectData(p),
      create: { id: p.id, ...projectData(p) },
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

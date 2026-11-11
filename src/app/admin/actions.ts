"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { readState, writeState } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import type { SiteSettings } from "@/lib/types";

export async function logout() {
  await requireAdmin();
  const jar = await cookies();
  jar.delete("admin_session");
  redirect("/admin/login");
}

export async function updateDraftSettings(formData: FormData) {
  await requireAdmin();
  const state = await readState();
  const draft: SiteSettings = { ...state.draftSettings };
  const newBrand = String(formData.get("brandName") || draft.brandName);
  const newTagline = String(formData.get("tagline") || draft.tagline);
  const newHeroTitle = String(formData.get("heroTitle") || draft.heroTitle);
  const newHeroSubtitle = String(formData.get("heroSubtitle") || draft.heroSubtitle);
  const idChanged = newBrand !== draft.brandName || newTagline !== draft.tagline || newHeroTitle !== draft.heroTitle || newHeroSubtitle !== draft.heroSubtitle;
  draft.brandName = newBrand;
  draft.tagline = newTagline;
  draft.heroTitle = newHeroTitle;
  draft.heroSubtitle = newHeroSubtitle;
  draft.location = String(formData.get("location") || draft.location);
  draft.experienceYears = Number(formData.get("experienceYears") || draft.experienceYears);
  draft.projectsCount = Number(formData.get("projectsCount") || draft.projectsCount);
  draft.email = String(formData.get("email") || draft.email);
  draft.phone = String(formData.get("phone") || draft.phone);
  draft.whatsapp = String(formData.get("whatsapp") || draft.whatsapp);
  draft.photoUrl = String(formData.get("photoUrl") || draft.photoUrl);
  draft.timezone = String(formData.get("timezone") || draft.timezone);
  draft.linkedin = String(formData.get("linkedin") || draft.linkedin);
  draft.github = String(formData.get("github") || draft.github);
  draft.portfolioUrl = String(formData.get("portfolioUrl") || draft.portfolioUrl);
  draft.availability = formData.get("availability") === "on";
  draft.primaryColor = String(formData.get("primaryColor") || draft.primaryColor);
  const newTaglineEn = String(formData.get("taglineEn") || draft.taglineEn || "");
  const newHeroTitleEn = String(formData.get("heroTitleEn") || draft.heroTitleEn || "");
  const newHeroSubtitleEn = String(formData.get("heroSubtitleEn") || draft.heroSubtitleEn || "");
  const enChanged = newTaglineEn !== (draft.taglineEn || "") || newHeroTitleEn !== (draft.heroTitleEn || "") || newHeroSubtitleEn !== (draft.heroSubtitleEn || "");
  draft.taglineEn = newTaglineEn;
  draft.heroTitleEn = newHeroTitleEn;
  draft.heroSubtitleEn = newHeroSubtitleEn;
  if (idChanged) draft.idUpdatedAt = new Date().toISOString();
  if (enChanged) draft.enUpdatedAt = new Date().toISOString();
  if (!draft.idUpdatedAt) draft.idUpdatedAt = draft.draftUpdatedAt;
  if (!draft.enUpdatedAt) draft.enUpdatedAt = draft.idUpdatedAt;
  draft.draftUpdatedAt = new Date().toISOString();
  state.draftSettings = draft;
  await writeState(state);
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function publishSettings() {
  await requireAdmin();
  const state = await readState();
  state.settings = { ...state.draftSettings, publishedAt: new Date().toISOString() };
  state.draftSettings = { ...state.settings };
  await writeState(state);
  await logAudit("settings.publish");
  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateActiveTemplate(templateId: string) {
  await requireAdmin();
  const state = await readState();
  state.draftSettings.activeTemplateId = templateId;
  state.draftSettings.draftUpdatedAt = new Date().toISOString();
  await writeState(state);
  revalidatePath("/admin/themes");
}

export async function createProject(formData: FormData) {
  await requireAdmin();
  const state = await readState();
  const id = crypto.randomUUID();
  const title = String(formData.get("title") || "Proyek Baru");
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const project = {
    id,
    slug,
    title,
    titleEn: String(formData.get("titleEn") || ""),
    category: String(formData.get("category") || "Umum"),
    categoryEn: String(formData.get("categoryEn") || ""),
    excerpt: String(formData.get("excerpt") || ""),
    excerptEn: String(formData.get("excerptEn") || ""),
    description: String(formData.get("description") || ""),
    descriptionEn: String(formData.get("descriptionEn") || ""),
    thumbnailUrl: String(formData.get("thumbnailUrl") || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800"),
    altText: String(formData.get("altText") || title),
    altTextEn: String(formData.get("altTextEn") || ""),
    tags: String(formData.get("tags") || "").split(",").map((t) => t.trim()).filter(Boolean),
    tagsEn: String(formData.get("tagsEn") || "").split(",").map((t) => t.trim()).filter(Boolean),
    client: String(formData.get("client") || ""),
    year: String(formData.get("year") || ""),
    status: (formData.get("status") as "DRAFT" | "PUBLISHED" | "ARCHIVED") || "DRAFT",
    order: state.projects.length + 1,
    featured: formData.get("featured") === "on",
    gallery: parseGallery(formData.get("gallery")),
    idUpdatedAt: new Date().toISOString(),
    enUpdatedAt: formData.get("titleEn") ? new Date().toISOString() : undefined,
  };
  if (!project.thumbnailUrl && project.gallery.length) project.thumbnailUrl = project.gallery[0].url;
  if (!project.altText && project.gallery.length) project.altText = project.gallery[0].alt;
  state.projects.push(project);
  await writeState(state);
  revalidatePath("/admin/projects");
  revalidatePath("/");
}

export async function updateProject(id: string, formData: FormData) {
  await requireAdmin();
  const state = await readState();
  const idx = state.projects.findIndex((p) => p.id === id);
  if (idx === -1) return;
  const p = state.projects[idx];
  const newTitle = String(formData.get("title") || p.title);
  const newTitleEn = String(formData.get("titleEn") || p.titleEn || "");
  const idChanged = newTitle !== p.title;
  const enChanged = newTitleEn !== (p.titleEn || "");
  p.title = newTitle;
  p.titleEn = newTitleEn;
  p.slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  p.category = String(formData.get("category") || p.category);
  p.categoryEn = String(formData.get("categoryEn") || p.categoryEn || "");
  p.excerpt = String(formData.get("excerpt") || p.excerpt);
  p.excerptEn = String(formData.get("excerptEn") || p.excerptEn || "");
  p.description = String(formData.get("description") || p.description);
  p.descriptionEn = String(formData.get("descriptionEn") || p.descriptionEn || "");
  p.thumbnailUrl = String(formData.get("thumbnailUrl") || p.thumbnailUrl);
  p.altText = String(formData.get("altText") || p.altText);
  p.altTextEn = String(formData.get("altTextEn") || p.altTextEn || "");
  p.tags = String(formData.get("tags") || "").split(",").map((t) => t.trim()).filter(Boolean);
  p.tagsEn = String(formData.get("tagsEn") || "").split(",").map((t) => t.trim()).filter(Boolean);
  p.client = String(formData.get("client") || p.client);
  p.year = String(formData.get("year") || p.year);
  p.status = (formData.get("status") as "DRAFT" | "PUBLISHED" | "ARCHIVED") || p.status;
  p.featured = formData.get("featured") === "on";
  const g = parseGallery(formData.get("gallery"));
  p.gallery = g;
  if (idChanged) p.idUpdatedAt = new Date().toISOString();
  if (enChanged) p.enUpdatedAt = new Date().toISOString();
  if (!p.idUpdatedAt) p.idUpdatedAt = new Date().toISOString();
  if (!p.enUpdatedAt) p.enUpdatedAt = p.idUpdatedAt;
  if (!p.thumbnailUrl && p.gallery.length) p.thumbnailUrl = p.gallery[0].url;
  await writeState(state);
  revalidatePath("/admin/projects");
  revalidatePath("/");
}

export async function deleteProject(id: string) {
  await requireAdmin();
  const state = await readState();
  state.projects = state.projects.filter((p) => p.id !== id);
  await writeState(state);
  await logAudit("project.delete", id);
  revalidatePath("/admin/projects");
  revalidatePath("/");
}

function parseGallery(raw: FormDataEntryValue | null): { url: string; alt: string; altEn?: string }[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(String(raw));
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((x) => x && typeof x.url === "string")
      .map((x) => ({
        url: String(x.url),
        alt: String(x.alt || ""),
        altEn: x.altEn ? String(x.altEn) : undefined,
      }));
  } catch {
    return [];
  }
}

export async function deleteDownload(id: string) {
  await requireAdmin();
  const state = await readState();
  state.downloads = state.downloads.filter((d) => d.id !== id);
  await writeState(state);
  console.info(`[security] download entry deleted id=${id}`);
  await logAudit("download.delete", id);
  revalidatePath("/admin/downloads");
}

export async function publishAll() {
  await requireAdmin();
  const state = await readState();
  state.settings = { ...state.draftSettings, publishedAt: new Date().toISOString() };
  state.draftSettings = { ...state.settings };
  state.projects = state.projects.map((p) => (p.status === "DRAFT" ? { ...p, status: "PUBLISHED" } : p));
  await writeState(state);
  revalidatePath("/");
  revalidatePath("/admin");
}


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
  draft.brandName = String(formData.get("brandName") || draft.brandName);
  draft.tagline = String(formData.get("tagline") || draft.tagline);
  draft.heroTitle = String(formData.get("heroTitle") || draft.heroTitle);
  draft.heroSubtitle = String(formData.get("heroSubtitle") || draft.heroSubtitle);
  draft.location = String(formData.get("location") || draft.location);
  draft.experienceYears = Number(formData.get("experienceYears") || draft.experienceYears);
  draft.projectsCount = Number(formData.get("projectsCount") || draft.projectsCount);
  draft.email = String(formData.get("email") || draft.email);
  draft.phone = String(formData.get("phone") || draft.phone);
  draft.photoUrl = String(formData.get("photoUrl") || draft.photoUrl);
  draft.linkedin = String(formData.get("linkedin") || draft.linkedin);
  draft.github = String(formData.get("github") || draft.github);
  draft.portfolioUrl = String(formData.get("portfolioUrl") || draft.portfolioUrl);
  draft.availability = formData.get("availability") === "on";
  draft.primaryColor = String(formData.get("primaryColor") || draft.primaryColor);
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
  const id = String(Date.now());
  const title = String(formData.get("title") || "Proyek Baru");
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const project = {
    id,
    slug,
    title,
    category: String(formData.get("category") || "Umum"),
    excerpt: String(formData.get("excerpt") || ""),
    description: String(formData.get("description") || ""),
    thumbnailUrl: String(formData.get("thumbnailUrl") || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800"),
    altText: String(formData.get("altText") || title),
    tags: String(formData.get("tags") || "").split(",").map((t) => t.trim()).filter(Boolean),
    client: String(formData.get("client") || ""),
    year: String(formData.get("year") || ""),
    status: (formData.get("status") as "DRAFT" | "PUBLISHED" | "ARCHIVED") || "DRAFT",
    order: state.projects.length + 1,
    featured: formData.get("featured") === "on",
    gallery: parseGallery(formData.get("gallery")),
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
  p.title = String(formData.get("title") || p.title);
  p.slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  p.category = String(formData.get("category") || p.category);
  p.excerpt = String(formData.get("excerpt") || p.excerpt);
  p.description = String(formData.get("description") || p.description);
  p.thumbnailUrl = String(formData.get("thumbnailUrl") || p.thumbnailUrl);
  p.altText = String(formData.get("altText") || p.altText);
  p.tags = String(formData.get("tags") || "").split(",").map((t) => t.trim()).filter(Boolean);
  p.client = String(formData.get("client") || p.client);
  p.year = String(formData.get("year") || p.year);
  p.status = (formData.get("status") as "DRAFT" | "PUBLISHED" | "ARCHIVED") || p.status;
  p.featured = formData.get("featured") === "on";
  const g = parseGallery(formData.get("gallery"));
  p.gallery = g;
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

function parseGallery(raw: FormDataEntryValue | null): { url: string; alt: string }[] {
  if (!raw) return [];
  try {
    const arr = JSON.parse(String(raw));
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((x) => x && typeof x.url === "string")
      .map((x) => ({ url: String(x.url), alt: String(x.alt || "") }));
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


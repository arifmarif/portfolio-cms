export type ProjectStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Project {
  id: string;
  slug: string;
  title: string;
  titleEn?: string;
  category: string;
  categoryEn?: string;
  excerpt: string;
  excerptEn?: string;
  description: string;
  descriptionEn?: string;
  thumbnailUrl: string;
  altText: string;
  altTextEn?: string;
  gallery: { url: string; alt: string; altEn?: string }[];
  idUpdatedAt?: string;
  enUpdatedAt?: string;
  tags: string[];
  tagsEn?: string[];
  client?: string;
  year?: string;
  status: ProjectStatus;
  order: number;
  featured?: boolean;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  taglineEn?: string;
  heroTitle: string;
  heroTitleEn?: string;
  heroSubtitle: string;
  heroSubtitleEn?: string;
  location: string;
  experienceYears: number;
  projectsCount: number;
  email: string;
  phone: string;
  whatsapp: string;
  photoUrl: string;
  timezone: string;
  linkedin: string;
  github: string;
  portfolioUrl: string;
  availability: boolean;
  primaryColor: string;
  activeTemplateId: string;
  draftUpdatedAt: string;
  idUpdatedAt?: string;
  enUpdatedAt?: string;
  publishedAt?: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  previewImageUrl: string;
}

export interface DownloadSubmission {
  id: string;
  email: string;
  phone: string;
  pdfName: string;
  createdAt: string;
}

export interface ContentState {
  settings: SiteSettings;
  draftSettings: SiteSettings;
  projects: Project[];
  templates: Template[];
  downloads: DownloadSubmission[];
}

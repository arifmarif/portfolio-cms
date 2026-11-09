export type ProjectStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  description: string;
  thumbnailUrl: string;
  altText: string;
  gallery: { url: string; alt: string }[];
  tags: string[];
  client?: string;
  year?: string;
  status: ProjectStatus;
  order: number;
  featured?: boolean;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  heroTitle: string;
  heroSubtitle: string;
  location: string;
  experienceYears: number;
  projectsCount: number;
  email: string;
  phone: string;
  photoUrl: string;
  linkedin: string;
  github: string;
  portfolioUrl: string;
  availability: boolean;
  primaryColor: string;
  activeTemplateId: string;
  draftUpdatedAt: string;
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

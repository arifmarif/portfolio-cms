import type { Project, SiteSettings } from "@/lib/types";
import { EditorialTemplate } from "./EditorialTemplate";
import { MinimalTemplate } from "./MinimalTemplate";
import { BoldTemplate } from "./BoldTemplate";

export const templateRegistry: Record<string, React.ComponentType<{ settings: SiteSettings; projects: Project[] }>> = {
  editorial: EditorialTemplate,
  minimal: MinimalTemplate,
  bold: BoldTemplate,
};

export function TemplateRenderer({ templateId, settings, projects }: { templateId: string; settings: SiteSettings; projects: Project[] }) {
  const Comp = templateRegistry[templateId] ?? EditorialTemplate;
  return <Comp settings={settings} projects={projects} />;
}

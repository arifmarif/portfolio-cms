import { readState } from "@/lib/db";
import { TemplateRenderer } from "@/components/templates";

export const dynamic = "force-dynamic";

export default async function Home() {
  const state = await readState();
  const settings = state.settings;
  const projects = state.projects;
  return <TemplateRenderer templateId={settings.activeTemplateId} settings={settings} projects={projects} />;
}

import { readState } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/AdminShell";
import { ThemePreviewClient } from "./ThemePreviewClient";

export const dynamic = "force-dynamic";

export default async function ThemesPage() {
  await requireAdmin();
  const state = await readState();
  return (
    <AdminShell active="themes">
      <ThemePreviewClient
        templates={state.templates}
        projects={state.projects}
        settings={state.draftSettings}
        publishedSettings={state.settings}
      />
    </AdminShell>
  );
}

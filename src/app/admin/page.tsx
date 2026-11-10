import { readState } from "@/lib/db";
import { AdminShell } from "@/components/AdminShell";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const state = await readState();
  return (
    <AdminShell active="dashboard">
      <DashboardClient
        initialDraft={state.draftSettings}
        published={state.settings}
        projectCount={state.projects.length}
        publishedCount={state.projects.filter((p) => p.status === "PUBLISHED").length}
        draftCount={state.projects.filter((p) => p.status === "DRAFT").length}
      />
    </AdminShell>
  );
}

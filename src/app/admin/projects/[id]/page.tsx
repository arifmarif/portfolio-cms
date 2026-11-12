import { readState } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/AdminShell";
import { updateProject } from "@/app/admin/actions";
import ProjectForm from "@/components/ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const state = await readState();
  const p = state.projects.find((x) => x.id === id);
  if (!p) return <AdminShell active="projects"><p>Proyek tidak ditemukan.</p></AdminShell>;

  return (
    <AdminShell active="projects">
      <div className="max-w-3xl space-y-4">
        <h1 className="font-display text-2xl font-bold">Edit Proyek</h1>
        <ProjectForm mode="edit" action={updateProject.bind(null, id)} project={p} submitLabel="Simpan Perubahan" />
      </div>
    </AdminShell>
  );
}

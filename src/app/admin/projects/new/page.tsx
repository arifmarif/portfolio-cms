import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/AdminShell";
import { createProject } from "../../actions";
import ProjectForm from "@/components/ProjectForm";

export default async function NewProjectPage() {
  await requireAdmin();
  return (
    <AdminShell active="projects">
      <div className="max-w-3xl space-y-4">
        <h1 className="font-display text-2xl font-bold">Tambah Proyek Baru</h1>
        <ProjectForm mode="create" action={createProject} submitLabel="Simpan Proyek" />
      </div>
    </AdminShell>
  );
}

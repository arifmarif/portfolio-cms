import { readState } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/AdminShell";
import { deleteProject } from "../actions";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  await requireAdmin();
  const state = await readState();
  return (
    <AdminShell active="projects">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">Manajemen Proyek</h1>
          <Link href="/admin/projects/new" className="px-4 py-2 rounded-lg bg-primary-container text-on-primary-container font-medium hover:bg-primary">
            + Tambah Proyek
          </Link>
        </div>
        <div className="overflow-x-auto rounded-xl bg-surface-container-low">
          <table className="w-full text-sm">
            <thead className="text-outline">
              <tr className="border-b border-outline-variant/30">
                <th className="text-left p-3">#</th>
                <th className="text-left p-3">Judul</th>
                <th className="text-left p-3">Kategori</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {state.projects.map((p) => (
                <tr key={p.id} className="border-b border-outline-variant/20">
                  <td className="p-3 font-mono">{p.order}</td>
                  <td className="p-3">{p.title}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      p.status === "PUBLISHED" ? "bg-secondary-container/20 text-secondary" :
                      p.status === "DRAFT" ? "bg-tertiary-container/20 text-tertiary" :
                      "bg-surface-container-high text-outline"
                    }`}>{p.status}</span>
                  </td>
                  <td className="p-3 flex gap-2">
                    <Link href={`/admin/projects/${p.id}`} className="text-primary hover:underline">Edit</Link>
                    <form action={deleteProject.bind(null, p.id)}>
                      <button className="text-error hover:underline">Hapus</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

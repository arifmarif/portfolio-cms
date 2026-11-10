import { AdminShell } from "@/components/AdminShell";
import { createProject } from "../../actions";
import GalleryEditor from "@/components/GalleryEditor";

export default function NewProjectPage() {
  return (
    <AdminShell active="projects">
      <div className="max-w-2xl space-y-4">
        <h1 className="font-display text-2xl font-bold">Tambah Proyek Baru</h1>
        <ProjectForm action={createProject} submitLabel="Simpan Proyek" />
      </div>
    </AdminShell>
  );
}

function ProjectForm({ action, submitLabel }: { action: (fd: FormData) => Promise<void>; submitLabel: string }) {
  return (
    <form action={action} className="space-y-4 rounded-xl bg-surface-container-low p-6">
      <Field label="Judul" name="title" required />
      <Field label="Judul (EN)" name="titleEn" />
      <Field label="Kategori" name="category" />
      <Field label="Kategori (EN)" name="categoryEn" />
      <Field label="Ringkasan" name="excerpt" />
      <Field label="Ringkasan (EN)" name="excerptEn" />
      <Field label="Deskripsi" name="description" textarea />
      <Field label="Deskripsi (EN)" name="descriptionEn" textarea />
      <Field label="URL Thumbnail (cover)" name="thumbnailUrl" />
      <Field label="Alt Text (cover)" name="altText" />
      <Field label="Alt Text (EN)" name="altTextEn" />
      <GalleryEditor defaultValue={[]} />
      <Field label="Tag (pisah koma)" name="tags" />
      <Field label="Tag (EN, pisah koma)" name="tagsEn" />
      <Field label="Klien" name="client" />
      <Field label="Tahun" name="year" />
      <div>
        <label className="block text-sm text-on-surface-variant mb-1">Status</label>
        <select name="status" className="w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-on-surface ring-1 ring-outline-variant focus:ring-primary">
          <option value="DRAFT">DRAFT</option>
          <option value="PUBLISHED">PUBLISHED</option>
          <option value="ARCHIVED">ARCHIVED</option>
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="featured" className="accent-primary" /> Unggulan
      </label>
      <button type="submit" className="px-5 py-2 rounded-lg bg-primary-container text-on-primary-container font-medium hover:bg-primary">
        {submitLabel}
      </button>
    </form>
  );
}

function Field({ label, name, required, textarea }: { label: string; name: string; required?: boolean; textarea?: boolean }) {
  return (
    <div>
      <label className="block text-sm text-on-surface-variant mb-1">{label}</label>
      {textarea ? (
        <textarea name={name} rows={3} className="w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-on-surface ring-1 ring-outline-variant focus:ring-primary" />
      ) : (
        <input name={name} required={required} className="w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-on-surface ring-1 ring-outline-variant focus:ring-primary" />
      )}
    </div>
  );
}

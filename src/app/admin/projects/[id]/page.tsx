import { readState } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/AdminShell";
import GalleryEditor from "@/components/GalleryEditor";
import StepsEditor from "@/components/StepsEditor";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const state = await readState();
  const p = state.projects.find((x) => x.id === id);
  if (!p) return <AdminShell active="projects"><p>Proyek tidak ditemukan.</p></AdminShell>;

  const action = async (fd: FormData) => {
    "use server";
    const { updateProject } = await import("../../actions");
    await updateProject(id, fd);
  };

  return (
    <AdminShell active="projects">
      <div className="max-w-2xl space-y-4">
        <h1 className="font-display text-2xl font-bold">Edit Proyek</h1>
        <form action={action} className="space-y-4 rounded-xl bg-surface-container-low p-6">
          <Field label="Judul" name="title" defaultValue={p.title} required />
          <Field label="Judul (EN)" name="titleEn" defaultValue={p.titleEn || ""} />
          <Field label="Kategori" name="category" defaultValue={p.category} />
          <Field label="Kategori (EN)" name="categoryEn" defaultValue={p.categoryEn || ""} />
          <Field label="Ringkasan" name="excerpt" defaultValue={p.excerpt} />
          <Field label="Ringkasan (EN)" name="excerptEn" defaultValue={p.excerptEn || ""} />
          <Field label="Deskripsi" name="description" defaultValue={p.description} textarea />
          <Field label="Deskripsi (EN)" name="descriptionEn" defaultValue={p.descriptionEn || ""} textarea />
          <Field label="URL Thumbnail (cover)" name="thumbnailUrl" defaultValue={p.thumbnailUrl} />
          <Field label="Alt Text (cover)" name="altText" defaultValue={p.altText} />
          <Field label="Alt Text (EN)" name="altTextEn" defaultValue={p.altTextEn || ""} />
          <GalleryEditor defaultValue={p.gallery || []} />
          <div className="pt-6 border-t border-outline-variant/30 space-y-4">
            <h2 className="font-display text-xl font-semibold">Detail Studi Kasus</h2>
            <p className="text-sm text-on-surface-variant">Rincian studi kasus dari CMS. Bagian yang tidak diisi otomatis tidak ditampilkan di halaman publik.</p>
            <Field label="Latar Belakang" name="caseBackground" defaultValue={p.caseBackground || ""} textarea />
            <Field label="Latar Belakang (EN)" name="caseBackgroundEn" defaultValue={p.caseBackgroundEn || ""} textarea />
            <Field label="Tantangan / Kebutuhan Klien" name="caseChallenge" defaultValue={p.caseChallenge || ""} textarea />
            <Field label="Tantangan / Kebutuhan Klien (EN)" name="caseChallengeEn" defaultValue={p.caseChallengeEn || ""} textarea />
            <Field label="Peran & Tanggung Jawab" name="caseRole" defaultValue={p.caseRole || ""} textarea />
            <Field label="Peran & Tanggung Jawab (EN)" name="caseRoleEn" defaultValue={p.caseRoleEn || ""} textarea />
            <StepsEditor name="caseImplementation" label="Langkah Implementasi (ID)" defaultValue={p.caseImplementation || []} />
            <StepsEditor name="caseImplementationEn" label="Implementation Steps (EN)" defaultValue={p.caseImplementationEn || []} />
            <Field label="Teknologi / Perangkat / Tools (pisah koma)" name="caseTech" defaultValue={p.caseTech || ""} />
            <Field label="Teknologi / Perangkat / Tools (EN, pisah koma)" name="caseTechEn" defaultValue={p.caseTechEn || ""} />
            <Field label="Hasil / Dampak" name="caseResults" defaultValue={p.caseResults || ""} textarea />
            <Field label="Hasil / Dampak (EN)" name="caseResultsEn" defaultValue={p.caseResultsEn || ""} textarea />
          </div>
          <Field label="Tag (pisah koma)" name="tags" defaultValue={p.tags.join(", ")} />
          <Field label="Tag (EN, pisah koma)" name="tagsEn" defaultValue={(p.tagsEn || []).join(", ")} />
          <Field label="Klien" name="client" defaultValue={p.client || ""} />
          <Field label="Tahun" name="year" defaultValue={p.year || ""} />
          <div>
            <label className="block text-sm text-on-surface-variant mb-1">Status</label>
            <select name="status" defaultValue={p.status} className="w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-on-surface ring-1 ring-outline-variant focus:ring-primary">
              <option value="DRAFT">DRAFT</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" defaultChecked={p.featured} className="accent-primary" /> Unggulan
          </label>
          <button type="submit" className="px-5 py-2 rounded-lg bg-primary-container text-on-primary-container font-medium hover:bg-primary">
            Simpan Perubahan
          </button>
        </form>
      </div>
    </AdminShell>
  );
}

function Field({ label, name, defaultValue, required, textarea }: { label: string; name: string; defaultValue: string; required?: boolean; textarea?: boolean }) {
  return (
    <div>
      <label className="block text-sm text-on-surface-variant mb-1">{label}</label>
      {textarea ? (
        <textarea name={name} defaultValue={defaultValue} rows={3} className="w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-on-surface ring-1 ring-outline-variant focus:ring-primary" />
      ) : (
        <input name={name} defaultValue={defaultValue} required={required} className="w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-on-surface ring-1 ring-outline-variant focus:ring-primary" />
      )}
    </div>
  );
}

import { readState } from "@/lib/db";
import { AdminShell } from "@/components/AdminShell";
import { updateDraftSettings, publishSettings } from "./actions";
import PhotoUpload from "@/components/PhotoUpload";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const state = await readState();
  const d = state.draftSettings;
  return (
    <AdminShell active="dashboard">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">Dashboard &amp; Profil</h1>
          <div className="flex gap-2">
            <form action={publishSettings}>
              <button className="px-4 py-2 rounded-lg bg-primary-container text-on-primary-container font-medium hover:bg-primary">
                Terbitkan Perubahan
              </button>
            </form>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-surface-container-low">
            <p className="text-xs text-outline uppercase">Koleksi Portofolio</p>
            <p className="text-3xl font-bold mt-1">{state.projects.length}</p>
            <p className="text-xs text-secondary mt-1">Karya terdaftar</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-container-low">
            <p className="text-xs text-outline uppercase">Terbit</p>
            <p className="text-3xl font-bold mt-1">{state.projects.filter((p) => p.status === "PUBLISHED").length}</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-container-low">
            <p className="text-xs text-outline uppercase">Draf</p>
            <p className="text-3xl font-bold mt-1">{state.projects.filter((p) => p.status === "DRAFT").length}</p>
          </div>
          <div className="p-4 rounded-xl bg-surface-container-low">
            <p className="text-xs text-outline uppercase">Template Aktif</p>
            <p className="text-lg font-bold mt-1">{state.settings.activeTemplateId}</p>
          </div>
        </div>

        <form action={updateDraftSettings} className="space-y-4 rounded-xl bg-surface-container-low p-6">
          <h2 className="font-display text-lg font-semibold">Profil &amp; Hero Banner</h2>
          <PhotoUpload defaultValue={d.photoUrl} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Nama Brand" name="brandName" defaultValue={d.brandName} />
            <Field label="Tagline" name="tagline" defaultValue={d.tagline} />
            <Field label="Judul Hero" name="heroTitle" defaultValue={d.heroTitle} className="md:col-span-2" />
            <Field label="Subjudul Hero" name="heroSubtitle" defaultValue={d.heroSubtitle} textarea className="md:col-span-2" />
            <Field label="Lokasi" name="location" defaultValue={d.location} />
            <Field label="Pengalaman (tahun)" name="experienceYears" type="number" defaultValue={String(d.experienceYears)} />
            <Field label="Jumlah Proyek" name="projectsCount" type="number" defaultValue={String(d.projectsCount)} />
            <Field label="Email" name="email" defaultValue={d.email} />
            <Field label="Telepon" name="phone" defaultValue={d.phone} />
            <Field label="LinkedIn" name="linkedin" defaultValue={d.linkedin} />
            <Field label="GitHub" name="github" defaultValue={d.github} />
            <Field label="Portofolio" name="portfolioUrl" defaultValue={d.portfolioUrl} />
            <Field label="Warna Utama" name="primaryColor" type="color" defaultValue={d.primaryColor} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="availability" defaultChecked={d.availability} className="accent-primary" />
            Tersedia untuk proyek
          </label>
          <button type="submit" className="px-5 py-2 rounded-lg bg-primary-container text-on-primary-container font-medium hover:bg-primary">
            Simpan Draf
          </button>
        </form>
      </div>
    </AdminShell>
  );
}

function Field({
  label, name, defaultValue, type = "text", textarea, className = "",
}: { label: string; name: string; defaultValue: string; type?: string; textarea?: boolean; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-sm text-on-surface-variant mb-1">{label}</label>
      {textarea ? (
        <textarea name={name} defaultValue={defaultValue} rows={3} className="w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-on-surface ring-1 ring-outline-variant focus:ring-primary" />
      ) : (
        <input type={type} name={name} defaultValue={defaultValue} className="w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-on-surface ring-1 ring-outline-variant focus:ring-primary" />
      )}
    </div>
  );
}

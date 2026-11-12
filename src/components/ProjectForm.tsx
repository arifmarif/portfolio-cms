"use client";
import { useState, type ReactNode } from "react";
import GalleryEditor from "@/components/GalleryEditor";
import StepsEditor from "@/components/StepsEditor";
import type { Project } from "@/lib/types";

type Action = (fd: FormData) => Promise<void>;

type Props = {
  mode: "create" | "edit";
  action: Action;
  project?: Project;
  submitLabel: string;
};

const inputCls = "w-full rounded-lg bg-surface-container-lowest px-3 py-2 text-on-surface ring-1 ring-outline-variant focus:ring-primary";

export default function ProjectForm({ mode, action, project, submitLabel }: Props) {
  const p = mode === "edit" ? project : undefined;

  return (
    <form action={action} className="space-y-6 rounded-xl bg-surface-container-low p-6">
      <Section title="Informasi Proyek" description="Client, tahun kerja, status publikasi, dan penanda proyek unggulan." defaultOpen>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Klien" name="client" defaultValue={p?.client || ""} />
          <TextField label="Tahun" name="year" defaultValue={p?.year || ""} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-on-surface-variant mb-1" htmlFor="pf-status">Status</label>
            <select id="pf-status" name="status" defaultValue={p?.status ?? "DRAFT"} className={inputCls}>
              <option value="DRAFT">DRAFT</option>
              <option value="PUBLISHED">PUBLISHED</option>
              <option value="ARCHIVED">ARCHIVED</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm pb-3">
            <input type="checkbox" name="featured" defaultChecked={p?.featured ?? false} className="accent-primary" /> Unggulan
          </label>
        </div>
      </Section>

      <Section title="Konten Proyek" description="Judul, kategori, ringkasan, deskripsi, dan alt text proyek." defaultOpen>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BilingualField idName="title" enName="titleEn" idLabel="Judul" enLabel="Judul (EN)" valueId={p?.title} valueEn={p?.titleEn} required />
          <BilingualField idName="category" enName="categoryEn" idLabel="Kategori" enLabel="Kategori (EN)" valueId={p?.category} valueEn={p?.categoryEn} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BilingualField idName="excerpt" enName="excerptEn" idLabel="Ringkasan" enLabel="Ringkasan (EN)" valueId={p?.excerpt} valueEn={p?.excerptEn} />
          <BilingualField idName="description" enName="descriptionEn" idLabel="Deskripsi" enLabel="Deskripsi (EN)" valueId={p?.description} valueEn={p?.descriptionEn} textarea />
        </div>
        <BilingualField idName="altText" enName="altTextEn" idLabel="Alt Text (cover)" enLabel="Alt Text (EN)" valueId={p?.altText} valueEn={p?.altTextEn} />
      </Section>

      <Section title="Thumbnail & Galeri" description="URL thumbnail cover dan galeri gambar proyek." defaultOpen>
        <TextField label="URL Thumbnail (cover)" name="thumbnailUrl" defaultValue={p?.thumbnailUrl} />
        <GalleryEditor defaultValue={p?.gallery || []} />
      </Section>

      <Section title="Detail Studi Kasus" description="Rincian studi kasus dari CMS. Bagian yang tidak diisi otomatis tidak ditampilkan di halaman publik." defaultOpen>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BilingualField idName="caseBackground" enName="caseBackgroundEn" idLabel="Latar Belakang" enLabel="Latar Belakang (EN)" valueId={p?.caseBackground} valueEn={p?.caseBackgroundEn} textarea />
          <BilingualField idName="caseChallenge" enName="caseChallengeEn" idLabel="Tantangan / Kebutuhan Klien" enLabel="Tantangan / Kebutuhan Klien (EN)" valueId={p?.caseChallenge} valueEn={p?.caseChallengeEn} textarea />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BilingualField idName="caseRole" enName="caseRoleEn" idLabel="Peran & Tanggung Jawab" enLabel="Peran & Tanggung Jawab (EN)" valueId={p?.caseRole} valueEn={p?.caseRoleEn} textarea />
          <BilingualField idName="caseTech" enName="caseTechEn" idLabel="Teknologi / Perangkat / Tools (pisah koma)" enLabel="Teknologi / Perangkat / Tools (EN, pisah koma)" valueId={p?.caseTech} valueEn={p?.caseTechEn} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StepsEditor name="caseImplementation" label="Langkah Implementasi (ID)" defaultValue={p?.caseImplementation || []} />
          <StepsEditor name="caseImplementationEn" label="Implementation Steps (EN)" defaultValue={p?.caseImplementationEn || []} />
        </div>
        <BilingualField idName="caseResults" enName="caseResultsEn" idLabel="Hasil / Dampak" enLabel="Hasil / Dampak (EN)" valueId={p?.caseResults} valueEn={p?.caseResultsEn} textarea />
      </Section>

      <Section title="Tag" description="Tag proyek. Pisahkan beberapa tag dengan koma." defaultOpen>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextField label="Tag (pisah koma)" name="tags" defaultValue={p?.tags.join(", ") || ""} />
          <TextField label="Tag (EN, pisah koma)" name="tagsEn" defaultValue={(p?.tagsEn || []).join(", ")} />
        </div>
      </Section>

      <div className="sticky bottom-0 z-30 rounded-xl bg-surface-container-low px-6 py-4 ring-1 ring-outline-variant/40">
        <button type="submit" className="w-full md:w-auto px-5 py-2 rounded-lg bg-primary-container text-on-primary-container font-medium hover:bg-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function Section({ title, description, defaultOpen = true, children }: { title: string; description?: string; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section>
      <button type="button" onClick={() => setOpen((v) => !v)} aria-expanded={open} className="w-full flex items-center justify-between gap-4 rounded-lg px-4 py-3 text-left hover:bg-surface-container-high transition-colors">
        <span className="min-w-0">
          <span className="block font-display font-semibold text-on-surface">{title}</span>
          {description ? <span className="block text-sm text-on-surface-variant mt-1">{description}</span> : null}
        </span>
        <span className="text-primary text-xl shrink-0" aria-hidden="true">{open ? "▾" : "▸"}</span>
      </button>
      <div className={open ? "px-4 pb-2 space-y-4" : "hidden px-4 pb-2 space-y-4"}>{children}</div>
    </section>
  );
}

function TextField({ label, name, defaultValue, textarea, required }: { label: string; name: string; defaultValue?: string; textarea?: boolean; required?: boolean }) {
  const id = `pf-${name}`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm text-on-surface-variant mb-1">{label}</label>
      {textarea ? (
        <textarea id={id} name={name} defaultValue={defaultValue || ""} rows={4} required={required} className={inputCls} />
      ) : (
        <input id={id} name={name} defaultValue={defaultValue || ""} required={required} className={inputCls} />
      )}
    </div>
  );
}

function BilingualField({ idName, enName, idLabel, enLabel, valueId, valueEn, textarea, required }: { idName: string; enName: string; idLabel: string; enLabel: string; valueId?: string; valueEn?: string; textarea?: boolean; required?: boolean }) {
  const [lang, setLang] = useState<"id" | "en">("id");

  const field = (name: string, value: string | undefined, label: string, isId: boolean) => {
    const id = `pf-${name}`;
    const common = { id, name, defaultValue: value || "", className: inputCls };
    if (textarea) {
      return (
        <textarea
          {...common}
          rows={4}
          required={isId ? required : false}
          aria-label={label}
        />
      );
    }
    return <input {...common} required={isId ? required : false} aria-label={label} />;
  };

  return (
    <div className="space-y-2">
      <div className="inline-flex rounded-lg bg-surface-container-lowest p-1 ring-1 ring-outline-variant w-fit" role="group" aria-label="Bahasa">
        <button type="button" onClick={() => setLang("id")} aria-pressed={lang === "id"} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${lang === "id" ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:text-on-surface"}`}>
          ID
        </button>
        <button type="button" onClick={() => setLang("en")} aria-pressed={lang === "en"} className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${lang === "en" ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:text-on-surface"}`}>
          EN
        </button>
      </div>
      <div className={lang === "id" ? "space-y-2" : "hidden space-y-2"}>
        <label htmlFor={`pf-${idName}`} className="block text-sm text-on-surface-variant mb-1">{idLabel}</label>
        {field(idName, valueId, idLabel, true)}
      </div>
      <div className={lang === "en" ? "space-y-2" : "hidden space-y-2"}>
        <label htmlFor={`pf-${enName}`} className="block text-sm text-on-surface-variant mb-1">{enLabel}</label>
        {field(enName, valueEn, enLabel, false)}
      </div>
    </div>
  );
}

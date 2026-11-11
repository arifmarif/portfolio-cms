"use client";
import { useState } from "react";
import Image from "next/image";

type Img = { url: string; alt: string };

export default function GalleryEditor({ defaultValue }: { defaultValue: Img[] }) {
  const [images, setImages] = useState<Img[]>(defaultValue || []);

  function sync(next: Img[]) {
    setImages(next);
  }

  async function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const next = [...images];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        next.push({ url: data.url, alt: file.name.replace(/\.[^.]+$/, "") });
        sync([...next]);
      }
    }
    e.target.value = "";
  }

  function remove(idx: number) {
    sync(images.filter((_, i) => i !== idx));
  }

  function move(idx: number, dir: -1 | 1) {
    const target = idx + dir;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[idx], next[target]] = [next[target], next[idx]];
    sync(next);
  }

  function updateAlt(idx: number, alt: string) {
    const next = images.map((img, i) => (i === idx ? { ...img, alt } : img));
    sync(next);
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm text-on-surface-variant">Galeri Gambar</label>
      <input type="file" accept="image/*" multiple onChange={handleFiles} className="text-sm" />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((img, idx) => (
          <div key={idx} className="rounded-lg bg-surface-container-lowest p-2 space-y-2 border border-outline-variant/30">
            <div className="relative aspect-square">
              <Image src={img.url} alt={img.alt} fill unoptimized className="object-cover rounded" />
              <span className="absolute top-1 left-1 text-xs bg-black/60 text-white px-1.5 rounded">{idx + 1}</span>
            </div>
            <input
              type="text"
              value={img.alt}
              onChange={(e) => updateAlt(idx, e.target.value)}
              placeholder="Teks alternatif"
              className="w-full rounded bg-surface-container-low px-2 py-1 text-xs text-on-surface ring-1 ring-outline-variant focus:ring-primary"
            />
            <div className="flex gap-1">
              <button type="button" onClick={() => move(idx, -1)} className="px-2 py-0.5 text-xs rounded bg-surface-container-high hover:bg-surface-bright">↑</button>
              <button type="button" onClick={() => move(idx, 1)} className="px-2 py-0.5 text-xs rounded bg-surface-container-high hover:bg-surface-bright">↓</button>
              <button type="button" onClick={() => remove(idx)} className="px-2 py-0.5 text-xs rounded bg-error-container/30 text-error hover:bg-error-container/50 ml-auto">Hapus</button>
            </div>
          </div>
        ))}
      </div>

      <input type="hidden" name="gallery" value={JSON.stringify(images)} readOnly />
    </div>
  );
}

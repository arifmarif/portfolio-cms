"use client";
import { useState, useRef } from "react";
import Image from "next/image";

type Img = { url: string; alt: string };

export default function ImageGallery({ images }: { images: Img[] }) {
  const imgs = images && images.length ? images : [];
  const [idx, setIdx] = useState(0);
  const touchStart = useRef<number | null>(null);
  const safeIdx = imgs.length ? Math.min(idx, imgs.length - 1) : 0;

  if (imgs.length === 0) return null;

  function prev() { setIdx((i) => (i - 1 + imgs.length) % imgs.length); }
  function next() { setIdx((i) => (i + 1) % imgs.length); }

  function onTouchStart(e: React.TouchEvent) { touchStart.current = e.touches[0].clientX; }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchStart.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) prev(); else next();
    }
    touchStart.current = null;
  }

  return (
    <div
      className="relative aspect-[16/10] overflow-hidden bg-surface-container-highest touch-pan-y"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <Image
        src={imgs[safeIdx].url}
        alt={imgs[safeIdx].alt}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        draggable={false}
        className="object-cover transition-opacity duration-300 select-none"
        unoptimized
      />
      {imgs.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Sebelumnya"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Berikutnya"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70"
          >
            ›
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
            {imgs.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIdx(i)}
                aria-label={`Gambar ${i + 1}`}
                className={`w-2.5 h-2.5 rounded-full ${i === safeIdx ? "bg-white" : "bg-white/50"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

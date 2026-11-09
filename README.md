# Portfolio CMS (Next.js + TypeScript)

Website portofolio profesional dengan admin kustom, mengacu pada PRD dan design system "Editorial Slate & Terracotta".

## Menjalankan

```bash
npm install
npm run dev
```

Buka http://localhost:3000. Admin: http://localhost:3000/admin/login (password default `admin123`, ubah via `ADMIN_PASSWORD`).

## Fitur

- Beranda publik dengan template aktif (Editorial / Minimal / Bold)
- Admin: profil & hero, manajemen proyek (CRUD, status, tag), galeri template + pratinjau live (viewport desktop/tablet/mobile), publish, ekspor PDF (via print)
- Data disimpan di `data/content.json` (server-side). Untuk produksi gunakan PostgreSQL (Neon) + storage R2/S3 (lihat `prisma` schema rencana).

## Skrip

- `npm run dev` — development
- `npm run build` — production build
- `npm run start` — production server
- `npm run lint` — lint

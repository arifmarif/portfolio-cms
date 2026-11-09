import { AdminShell } from "@/components/AdminShell";
export default function SettingsPage() {
  return (
    <AdminShell active="settings">
      <div className="space-y-4">
        <h1 className="font-display text-2xl font-bold">Pengaturan</h1>
        <div className="rounded-xl bg-surface-container-low p-6 space-y-2 text-sm text-on-surface-variant">
          <p>• Kata sandi admin diatur via env <code>ADMIN_PASSWORD</code>.</p>
          <p>• Ekspor PDF tersedia di halaman pratinjau tema.</p>
          <p>• Data disimpan di <code>data/content.json</code> (server). Untuk produksi gunakan PostgreSQL (Neon) + storage R2.</p>
          <p>• Perlindungan konten (watermark, pembatasan klik kanan) bersifat pencegahan sederhana dan tidak dapat sepenuhnya mencegah tangkapan layar.</p>
        </div>
      </div>
    </AdminShell>
  );
}

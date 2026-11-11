import Link from "next/link";
import { LayoutDashboard, Folder, Palette, Download, Mail, SlidersHorizontal } from "lucide-react";
import type { ComponentType } from "react";
import { logout } from "@/app/admin/actions";

type AdminNavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  key: string;
};

export function AdminShell({ children, active }: { children: React.ReactNode; active: string }) {
  const nav: AdminNavItem[] = [
    { href: "/admin", label: "Dashboard & Profil", icon: LayoutDashboard, key: "dashboard" },
    { href: "/admin/projects", label: "Manajemen Proyek", icon: Folder, key: "projects" },
    { href: "/admin/themes", label: "Palet & Tema", icon: Palette, key: "themes" },
    { href: "/admin/downloads", label: "Data Unduhan", icon: Download, key: "downloads" },
    { href: "/admin/messages", label: "Pesan Kontak", icon: Mail, key: "messages" },
    { href: "/admin/settings", label: "Pengaturan", icon: SlidersHorizontal, key: "settings" },
  ];
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low z-50 flex flex-col justify-between shadow-md">
        <div className="flex flex-col">
          <div className="h-16 px-4 flex items-center justify-between bg-surface-container-lowest/60">
            <span className="font-display font-semibold">MAR Studio</span>
            <span className="w-2 h-2 rounded-full bg-secondary" />
          </div>
          <nav className="flex flex-col gap-1 px-2 pt-4">
            {nav.map((n) => {
              const Icon = n.icon;
              return (
                <Link
                  key={n.key}
                  href={n.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    active === n.key
                      ? "bg-surface-container-high text-primary font-semibold border-l-2 border-primary-container"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                  }`}
                >
                  <Icon className="size-5 shrink-0" aria-hidden="true" />
                  <span className="text-sm">{n.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="p-3 space-y-2 bg-surface-container-lowest/80">
          <Link href="/" className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high text-sm">
            Lihat Web Publik
          </Link>
          <form action={logout}>
            <button className="w-full py-2 rounded-lg bg-error-container/30 text-error text-sm">Keluar</button>
          </form>
        </div>
      </aside>
      <div className="pl-64">
        <header className="fixed top-0 left-64 right-0 h-16 bg-surface/85 backdrop-blur-xl z-40 flex items-center justify-between px-6 border-b border-outline-variant/30">
          <span className="font-display font-semibold">CMS Console</span>
          <span className="text-sm text-on-surface-variant">Arif Rizki</span>
        </header>
        <main className="pt-16 p-6 min-h-screen">{children}</main>
      </div>
    </div>
  );
}

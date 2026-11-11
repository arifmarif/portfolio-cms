import { readState } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/AdminShell";
import { DownloadsClient } from "./DownloadsClient";

export const dynamic = "force-dynamic";

export default async function DownloadsPage() {
  await requireAdmin();
  const state = await readState();
  return (
    <AdminShell active="downloads">
      <DownloadsClient initial={state.downloads} />
    </AdminShell>
  );
}

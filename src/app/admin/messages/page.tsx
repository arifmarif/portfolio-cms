import { readContactMessages } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { AdminShell } from "@/components/AdminShell";
import { MessagesClient } from "./MessagesClient";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  await requireAdmin();
  const messages = await readContactMessages();
  return (
    <AdminShell active="messages">
      <MessagesClient initial={messages} />
    </AdminShell>
  );
}

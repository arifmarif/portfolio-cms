import { readState } from "@/lib/db";
import { PrintView } from "./PrintView";

export const dynamic = "force-dynamic";

export default async function PrintPage() {
  const state = await readState();
  return <PrintView settings={state.settings} projects={state.projects.filter((p) => p.status === "PUBLISHED")} />;
}

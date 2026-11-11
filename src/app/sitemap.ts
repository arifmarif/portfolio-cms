import { readState } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";

// Generated per request: the project list comes from the database.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes: MetadataRoute.Sitemap = [{ url: SITE_URL, lastModified: new Date() }];
  try {
    const state = await readState();
    for (const p of state.projects) {
      if (p.status === "PUBLISHED") {
        routes.push({ url: `${SITE_URL}/projects/${p.slug}`, lastModified: new Date() });
      }
    }
  } catch {
    // Database unreachable (e.g. preview builds): ship the static route only.
  }
  return routes;
}

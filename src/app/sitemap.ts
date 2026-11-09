import { readState } from "@/lib/db";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const state = await readState();
  const base = "https://portfolio.example.com";
  const routes: MetadataRoute.Sitemap = [{ url: base, lastModified: new Date() }];
  for (const p of state.projects) {
    if (p.status === "PUBLISHED") {
      routes.push({ url: `${base}/projects/${p.slug}`, lastModified: new Date() });
    }
  }
  return routes;
}

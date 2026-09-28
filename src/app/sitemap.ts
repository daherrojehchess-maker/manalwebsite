import type { MetadataRoute } from "next";
import { brands, categories, guides, loadActiveProducts, professions, projects } from "@/lib/catalog";
import { policies } from "@/lib/policies";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await loadActiveProducts();
  const u = (path: string, priority = 0.6): MetadataRoute.Sitemap[number] => ({ url: `${site.url}${path}`, priority });
  return [
    u("/", 1),
    u("/products", 0.8),
    u("/sale", 0.8),
    u("/new", 0.6),
    u("/brands", 0.6),
    u("/pros", 0.8),
    u("/projects", 0.7),
    u("/guides", 0.7),
    u("/about", 0.4),
    u("/store", 0.6),
    u("/quote/request", 0.5),
    u("/accessibility", 0.2),
    ...categories.flatMap((c) => [u(`/c/${c.slug}`, 0.9), ...c.subs.map((s) => u(`/c/${c.slug}/${s.slug}`, 0.8))]),
    ...products.map((p) => u(`/p/${p.slug}`, 0.7)),
    ...brands.map((b) => u(`/brands/${b.slug}`, 0.5)),
    ...professions.map((p) => u(`/pros/${p.slug}`, 0.6)),
    ...projects.map((p) => u(`/projects/${p.slug}`, 0.6)),
    ...guides.map((g) => u(`/guides/${g.slug}`, 0.6)),
    ...policies.map((p) => u(`/policies/${p.slug}`, 0.2)),
  ];
}

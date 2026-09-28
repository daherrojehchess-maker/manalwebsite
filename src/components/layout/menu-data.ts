import { categories, navCategorySlugs, professions, projects, type Art } from "@/lib/catalog";

export type MenuCategory = { slug: string; name: string; shortName?: string; art: Art; subs: { slug: string; name: string }[] };

/** Slim menu payload for client components (keeps SEO copy out of the client bundle). */
export function getMenuData() {
  const all: MenuCategory[] = categories.map((c) => ({
    slug: c.slug,
    name: c.name,
    shortName: c.shortName,
    art: c.art,
    subs: c.subs.map((s) => ({ slug: s.slug, name: s.name })),
  }));
  return {
    all,
    nav: navCategorySlugs.map((s) => all.find((c) => c.slug === s)!).filter(Boolean),
    professions: professions.map((p) => ({ slug: p.slug, name: p.name })),
    projects: projects.map((p) => ({ slug: p.slug, name: p.name })),
  };
}

export type MenuData = ReturnType<typeof getMenuData>;

export type ArtKind =
  | "bucket"
  | "tube"
  | "bag"
  | "drill"
  | "board"
  | "faucet"
  | "pipe"
  | "socket"
  | "screws"
  | "roller"
  | "brush"
  | "tile"
  | "plank"
  | "hose"
  | "gloves"
  | "helmet"
  | "spray"
  | "cable"
  | "trowel"
  | "level"
  | "hammer"
  | "foam"
  | "tape"
  | "shower"
  | "bottle"
  | "grinder"
  | "bulb"
  | "profile"
  | "block"
  | "lock";

export type Art = { kind: ArtKind; color?: string; label?: string };

export type SubCategory = { slug: string; name: string; art: Art };

export type Category = {
  slug: string;
  name: string;
  shortName?: string;
  art: Art;
  intro: string;
  seoTitle: string;
  seoDescription: string;
  seoBody: { heading: string; text: string }[];
  faq: { q: string; a: string }[];
  subs: SubCategory[];
  /** Attribute keys shown as filters on this category page. */
  filters: string[];
};

export type OptionValue = { label: string; priceDelta?: number; swatch?: string; art?: Art };
export type ProductOption = { name: string; values: OptionValue[] };

export type StockStatus = "in" | "low" | "out";
export type ProductTag = "bestseller" | "new" | "featured";

export type Product = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  sub: string;
  art: Art;
  price: number;
  compareAt?: number;
  unit: string;
  variantHint?: string;
  options?: ProductOption[];
  stock: StockStatus;
  tags: ProductTag[];
  popularity: number;
  addedOrder: number;
  short: string;
  description: string;
  benefits: string[];
  uses: string[];
  specs: [string, string][];
  howTo: string[];
  faq: { q: string; a: string }[];
  attrs: Record<string, string>;
  keywords?: string[];
  complements?: string[];
};

export type Brand = {
  slug: string;
  name: string;
  nameHe: string;
  aliases: string[];
  about: string;
};

export type Profession = {
  slug: string;
  name: string;
  title: string;
  icon: string;
  intro: string;
  categories: { category: string; sub?: string }[];
  productIds: string[];
  projects: string[];
};

export type Project = {
  slug: string;
  name: string;
  art: Art;
  intro: string;
  steps: string[];
  required: string[];
  recommended: string[];
  tools: string[];
  complementary: string[];
  guides: string[];
  categories: { category: string; sub?: string }[];
};

export type Guide = {
  slug: string;
  title: string;
  excerpt: string;
  art: Art;
  readMinutes: number;
  category: string;
  sections: { heading: string; body: string }[];
  productIds: string[];
  projects: string[];
};

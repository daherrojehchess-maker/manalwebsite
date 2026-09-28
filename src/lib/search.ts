import { brands, categories, getBrand, getCategory, getSub, categoryHref } from "./catalog";
import type { Art, Product } from "./catalog";

const FINALS: Record<string, string> = { "ך": "כ", "ם": "מ", "ן": "נ", "ף": "פ", "ץ": "צ" };

/** QWERTY key → Hebrew letter on the standard Israeli layout. */
const EN_TO_HE: Record<string, string> = {
  q: "/", w: "'", e: "ק", r: "ר", t: "א", y: "ט", u: "ו", i: "ן", o: "ם", p: "פ",
  a: "ש", s: "ד", d: "ג", f: "כ", g: "ע", h: "י", j: "ח", k: "ל", l: "ך", ";": "ף",
  z: "ז", x: "ס", c: "ב", v: "ה", b: "נ", n: "מ", m: "צ", ",": "ת", ".": "ץ",
};

export function normalize(input: string) {
  return input
    .toLowerCase()
    .replace(/[\u0591-\u05C7]/g, "")
    .replace(/[ךםןףץ]/g, (ch) => FINALS[ch] ?? ch)
    .replace(/["'`׳״\-–—_/\\()[\],.:;!?+]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Drops the optional vowel letters ו/י so "סליקון" and "סיליקון" compare equal. */
function skeleton(token: string) {
  return /[\u05D0-\u05EA]/.test(token) && token.length > 3 ? token.replace(/[וי]/g, "") : token;
}

function layoutSwap(input: string) {
  const lower = input.toLowerCase();
  if (!/^[a-z;,.\s]+$/.test(lower)) return null;
  return lower.split("").map((ch) => EN_TO_HE[ch] ?? ch).join("");
}

function levenshtein(a: string, b: string, max: number) {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      rowMin = Math.min(rowMin, cur[j]);
    }
    if (rowMin > max) return max + 1;
    prev = cur;
  }
  return prev[b.length];
}

type Doc = { text: string; compact: string; tokens: string[]; skeletons: string[] };

function makeDoc(parts: (string | undefined)[]): Doc {
  const text = normalize(parts.filter(Boolean).join(" "));
  const tokens = Array.from(new Set(text.split(" ").filter(Boolean)));
  return { text, compact: text.replace(/ /g, ""), tokens, skeletons: tokens.map(skeleton) };
}

function buildProductDocs(products: Product[]) {
  return products.map((p) => {
    const brand = getBrand(p.brand);
    const cat = getCategory(p.category);
    const sub = getSub(p.category, p.sub);
    return {
      product: p,
      doc: makeDoc([p.name, p.sku, brand?.name, brand?.nameHe, ...(brand?.aliases ?? []), cat?.name, sub?.name, ...(p.keywords ?? []), ...Object.values(p.attrs)]),
      nameDoc: makeDoc([p.name, brand?.name, brand?.nameHe]),
    };
  });
}

function tokenScore(token: string, doc: Doc) {
  if (doc.tokens.includes(token)) return 10;
  if (doc.tokens.some((t) => t.startsWith(token))) return token.length >= 2 ? 8 : 3;
  if (token.length >= 3 && doc.text.includes(token)) return 6;
  const sk = skeleton(token);
  if (sk.length >= 3 && doc.skeletons.some((t) => t === sk || t.startsWith(sk))) return 7;
  if (token.length >= 4) {
    const max = token.length >= 7 ? 2 : 1;
    if (doc.tokens.some((t) => levenshtein(token, t.slice(0, token.length + 1), max) <= max)) return 5;
  }
  return 0;
}

function scoreDoc(query: string, doc: Doc) {
  const tokens = query.split(" ").filter(Boolean);
  if (!tokens.length) return 0;
  let total = 0;
  let matched = 0;
  for (const t of tokens) {
    const s = tokenScore(t, doc);
    if (s > 0) matched++;
    total += s;
  }
  const compactQuery = query.replace(/ /g, "");
  if (compactQuery.length >= 3 && doc.compact.includes(compactQuery)) {
    total += 12;
    matched = tokens.length;
  }
  if (matched < tokens.length) return 0;
  return total;
}

function bestScore(queries: string[], doc: Doc) {
  return Math.max(0, ...queries.map((q) => scoreDoc(q, doc)));
}

function queryVariants(raw: string) {
  const out = [normalize(raw)];
  const swapped = layoutSwap(raw);
  if (swapped) out.push(normalize(swapped));
  return out.filter(Boolean);
}

export function searchProducts(raw: string, products: Product[]): Product[] {
  const queries = queryVariants(raw);
  if (!queries.length) return [];
  return buildProductDocs(products)
    .map(({ product, doc, nameDoc }) => ({ product, score: bestScore(queries, doc) + bestScore(queries, nameDoc) * 0.5 + product.popularity / 100 }))
    .filter((r) => r.score > 1)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.product);
}

export type Suggestion = {
  products: { id: string; name: string; href: string; brand: string; category: string; price: number; compareAt?: number; art: Art }[];
  categories: { name: string; parent?: string; href: string }[];
  brands: { name: string; nameHe: string; href: string }[];
};

const categoryDocs = categories.flatMap((c) => [
  { name: c.name, parent: undefined as string | undefined, href: categoryHref(c.slug), doc: makeDoc([c.name, c.shortName]) },
  ...c.subs.map((s) => ({ name: s.name, parent: c.name, href: categoryHref(c.slug, s.slug), doc: makeDoc([s.name]) })),
]);

const brandDocs = brands.map((b) => ({ brand: b, doc: makeDoc([b.name, b.nameHe, ...b.aliases]) }));

export function suggest(raw: string, products: Product[]): Suggestion {
  const queries = queryVariants(raw);
  if (!queries.length || queries[0].length < 2) return { products: [], categories: [], brands: [] };
  const found = searchProducts(raw, products).slice(0, 6);
  return {
    products: found.map((p) => ({
      id: p.id,
      name: p.name,
      href: `/p/${p.slug}`,
      brand: getBrand(p.brand)?.name ?? "",
      category: getSub(p.category, p.sub)?.name ?? "",
      price: p.price,
      compareAt: p.compareAt,
      art: p.art,
    })),
    categories: categoryDocs
      .map((c) => ({ c, s: bestScore(queries, c.doc) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 3)
      .map(({ c }) => ({ name: c.name, parent: c.parent, href: c.href })),
    brands: brandDocs
      .map((b) => ({ b, s: bestScore(queries, b.doc) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 3)
      .map(({ b }) => ({ name: b.brand.name, nameHe: b.brand.nameHe, href: `/brands/${b.brand.slug}` })),
  };
}

export const popularSearches = ["סיליקון", "צבע טמבור", "Sikaflex", "דבק קרמיקה", "רולר", "מברגה", "לוח גבס", "איטום גג"];

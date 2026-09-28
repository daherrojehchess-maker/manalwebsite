import type { Brand } from "./types";

export const brands: Brand[] = [
  { slug: "tambour", name: "Tambour", nameHe: "טמבור", aliases: ["טמבור", "tambur", "tambour", "טאמבור"], about: "צבעים, שפכטלים ומוצרי איטום לבית ולמקצוענים." },
  { slug: "nirlat", name: "Nirlat", nameHe: "נירלט", aliases: ["נירלט", "nirlat", "נרלט"], about: "צבעי פנים וחוץ, יסודות וטיח." },
  { slug: "sika", name: "Sika", nameHe: "סיקה", aliases: ["סיקה", "sika", "סיקא"], about: "איטום, הדבקה ותוספים לבנייה." },
  { slug: "mapei", name: "Mapei", nameHe: "מאפיי", aliases: ["מאפיי", "mapei", "מפאי", "מאפי"], about: "דבקים, רובה ואיטום לריצוף ולבנייה." },
  { slug: "bosch", name: "Bosch", nameHe: "בוש", aliases: ["בוש", "bosch", "בוש פרופשיונל"], about: "כלי עבודה חשמליים ונטענים." },
  { slug: "makita", name: "Makita", nameHe: "מקיטה", aliases: ["מקיטה", "makita", "מאקיטה"], about: "כלים נטענים וחשמליים למקצוענים." },
  { slug: "dewalt", name: "DeWalt", nameHe: "דיוולט", aliases: ["דיוולט", "dewalt", "דה וולט", "דוולט", "de walt"], about: "כלי עבודה לאתרי בנייה." },
  { slug: "milwaukee", name: "Milwaukee", nameHe: "מילווקי", aliases: ["מילווקי", "milwaukee", "מילווקאי", "מילוקי"], about: "כלים נטענים וכלי יד מקצועיים." },
  { slug: "hamat", name: "Hamat", nameHe: "חמת", aliases: ["חמת", "hamat", "hammat"], about: "ברזים, סוללות ואביזרי אמבטיה." },
  { slug: "knauf", name: "Knauf", nameHe: "קנאוף", aliases: ["קנאוף", "knauf", "כנאוף"], about: "מערכות גבס ובידוד." },
  { slug: "stanley", name: "Stanley", nameHe: "סטנלי", aliases: ["סטנלי", "stanley"], about: "כלי יד ומדידה." },
  { slug: "legrand", name: "Legrand", nameHe: "לגרנד", aliases: ["לגרנד", "legrand"], about: "שקעים, מפסקים ואביזרי חשמל." },
  { slug: "plasson", name: "Plasson", nameHe: "פלסאון", aliases: ["פלסאון", "plasson", "פלסון"], about: "מחברים ומערכות צנרת." },
  { slug: "gardena", name: "Gardena", nameHe: "גרדנה", aliases: ["גרדנה", "gardena"], about: "השקיה וכלי גינה." },
  { slug: "3m", name: "3M", nameHe: "תרי אם", aliases: ["3m", "תרי אם", "3 אם"], about: "ציוד מגן, סרטים ומוצרי הדבקה." },
];

export function getBrand(slug: string) {
  return brands.find((b) => b.slug === slug);
}

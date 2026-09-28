import type { Art, Product, ProductOption, ProductTag, StockStatus } from "./types";

/**
 * Seed source for `scripts/generate-product-seed.ts` only.
 * Live catalog reads go through `query.ts` / Supabase. Do not import this from app pages.
 */

type Seed = {
  slug: string;
  name: string;
  brand?: string;
  cat: string;
  sub: string;
  price: number;
  compareAt?: number;
  unit?: string;
  art: Art;
  hint?: string;
  options?: ProductOption[];
  stock?: StockStatus;
  tags?: ProductTag[];
  pop?: number;
  short: string;
  benefits?: string[];
  uses?: string[];
  specs?: [string, string][];
  howTo?: string[];
  faq?: { q: string; a: string }[];
  attrs?: Record<string, string>;
  keywords?: string[];
  complements?: string[];
};

const colorsWhite = (extra: { label: string; swatch: string }[] = []) => [
  { label: "לבן", swatch: "#FFFFFF" },
  ...extra,
];

const seeds: Seed[] = [
  // ── צבע ──────────────────────────────────────────────
  {
    slug: "interior-acrylic-paint", name: "סופרקריל — צבע אקרילי לקירות פנים", brand: "tambour", cat: "paint", sub: "interior-paint",
    price: 59, compareAt: 69, art: { kind: "bucket", color: "#FFFFFF", label: "INT" }, hint: "3 נפחים · 4 גוונים", tags: ["bestseller", "featured"], pop: 98,
    options: [
      { name: "נפח", values: [{ label: "1 ל׳" }, { label: "5 ל׳", priceDelta: 80 }, { label: "18 ל׳", priceDelta: 290 }] },
      { name: "גוון", values: colorsWhite([{ label: "שמנת", swatch: "#F3EBDD" }, { label: "אפור בהיר", swatch: "#D8D8D4" }, { label: "בז׳", swatch: "#E3D3BA" }]) },
    ],
    short: "צבע אקרילי מט על בסיס מים לקירות ותקרות פנים. כיסוי גבוה, ריח נמוך וייבוש מהיר.",
    benefits: ["כיסוי מצוין בשתי שכבות", "ריח נמוך — מתאים לחדרי שינה", "רחיץ לאחר ייבוש מלא", "ייבוש מהיר בין שכבות"],
    uses: ["קירות ותקרות בחדרי מגורים", "חדרי ילדים ומשרדים", "צביעה חוזרת על צבע אקרילי קיים"],
    specs: [["גימור", "מט"], ["בסיס", "מים"], ["כושר כיסוי", "לפי הוראות היצרן"], ["ייבוש למגע", "לפי הוראות היצרן"]],
    attrs: { "גימור": "מט", "נפח": "1–18 ל׳", "גוון": "לבן" }, keywords: ["צבע טמבור", "סופרקריל", "צבע לקיר"],
  },
  {
    slug: "exterior-acrylic-paint", name: "צבע אקרילי לחוץ עמיד UV", brand: "nirlat", cat: "paint", sub: "exterior-paint",
    price: 169, compareAt: 199, art: { kind: "bucket", color: "#D9D4C7", label: "EXT" }, hint: "2 נפחים · 3 גוונים", tags: ["featured"], pop: 80,
    options: [
      { name: "נפח", values: [{ label: "5 ל׳" }, { label: "18 ל׳", priceDelta: 320 }] },
      { name: "גוון", values: colorsWhite([{ label: "חול", swatch: "#D9C9A8" }, { label: "אפור", swatch: "#A9AAA5" }]) },
    ],
    short: "צבע חוץ אקרילי עמיד לשמש, לגשם ולשינויי טמפרטורה. מתאים לטיח, בטון וחזיתות.",
    attrs: { "גימור": "מט", "נפח": "5–18 ל׳", "גוון": "לבן" }, keywords: ["צבע חוץ", "נירלט"],
  },
  { slug: "acrylic-primer", name: "יסוד אקרילי מבוסס מים", brand: "tambour", cat: "paint", sub: "primers", price: 79, art: { kind: "bucket", color: "#EDEBE6", label: "PRIMER" }, pop: 60, short: "שכבת יסוד לשיפור הדבקות הצבע ואחידות הגוון על טיח, גבס ובטון.", attrs: { "נפח": "4 ל׳" } },
  { slug: "ready-acrylic-putty", name: "שפכטל אקרילי מוכן לשימוש", brand: "tambour", cat: "paint", sub: "putty", price: 49, art: { kind: "bucket", color: "#F4F1EA", label: "PUTTY" }, pop: 62, short: "שפכטל מוכן למילוי סדקים וחורים קטנים ויישור קירות לפני צביעה.", attrs: { "משקל": "5 ק״ג" } },
  { slug: "oil-enamel-paint", name: "צבע שמן לעץ ולמתכת — מבריק", brand: "nirlat", cat: "paint", sub: "wood-metal-paint", price: 89, art: { kind: "bucket", color: "#6B4F3A", label: "ENAMEL" }, hint: "4 גוונים", pop: 40, short: "צבע עמיד ומבריק לדלתות, מעקות, סורגים ורהיטי עץ.", options: [{ name: "גוון", values: [{ label: "לבן", swatch: "#FFFFFF" }, { label: "שחור", swatch: "#1C1F23" }, { label: "חום", swatch: "#6B4F3A" }, { label: "ירוק", swatch: "#2F5D45" }] }], attrs: { "גימור": "מבריק", "נפח": "0.75 ל׳" } },
  { slug: "acrylic-spray-paint", name: "ספריי צבע אקרילי 400 מ״ל", brand: "tambour", cat: "paint", sub: "spray-paint", price: 29, compareAt: 35, art: { kind: "spray", color: "#1A56A8" }, hint: "6 גוונים", tags: ["bestseller"], pop: 88, short: "ספריי צבע לייבוש מהיר למתכת, עץ ופלסטיק.", options: [{ name: "גוון", values: [{ label: "כחול", swatch: "#1A56A8" }, { label: "שחור מט", swatch: "#1C1F23" }, { label: "לבן", swatch: "#FFFFFF" }, { label: "אדום", swatch: "#B42318" }, { label: "כסף", swatch: "#C0C6CC" }, { label: "זהב", swatch: "#C9A227" }] }], attrs: { "נפח": "400 מ״ל" } },
  { slug: "microfiber-roller-25", name: "רולר צבע מיקרופייבר 25 ס״מ", cat: "paint", sub: "rollers", price: 32, art: { kind: "roller", color: "#1A56A8" }, tags: ["bestseller"], pop: 90, short: "רולר מיקרופייבר לצבעים על בסיס מים. פיזור אחיד וללא נשירת סיבים.", attrs: { "גודל": "25 ס״מ" }, keywords: ["רולר"] },
  { slug: "brush-set-3", name: "סט מברשות צביעה — 3 יח׳", cat: "paint", sub: "brushes", price: 39, art: { kind: "brush", color: "#C08A4B" }, pop: 70, short: "מברשות בגדלים 1.5, 2.5 ו-4 אינץ׳ לפינות, מסגרות ומשטחים קטנים.", attrs: { "גודל": "סט" } },
  { slug: "paint-tray-grid", name: "מגש צבע עם רשת", cat: "paint", sub: "painting-accessories", price: 19, art: { kind: "block", color: "#1A56A8" }, pop: 66, short: "מגש צבע יציב עם רשת לסחיטת עודפים מהרולר.", attrs: { "גודל": "25 ס״מ" } },
  { slug: "masking-tape-48", name: "מסקינג טייפ 48 מ״מ", brand: "3m", cat: "paint", sub: "painting-accessories", price: 14, art: { kind: "tape", color: "#E9D9A6" }, pop: 72, short: "סרט הדבקה לקווי צבע נקיים. מוסר בקלות ללא שאריות.", attrs: { "גודל": "48 מ״מ" }, keywords: ["מסקינגטייפ", "נייר דבק"] },
  { slug: "cover-nylon-4x5", name: "ניילון כיסוי 4×5 מ׳", cat: "paint", sub: "painting-accessories", price: 12, art: { kind: "board", color: "#E6EEF7" }, pop: 64, short: "ניילון להגנה על רצפה ורהיטים בזמן צביעה ושיפוץ.", attrs: { "גודל": "4×5 מ׳" } },

  // ── איטום והדבקה ─────────────────────────────────────
  {
    slug: "sikaflex-11fc", name: "סיקהפלקס 11FC — דבק ואוטם פוליאוריתני 300 מ״ל", brand: "sika", cat: "sealing-adhesives", sub: "adhesives",
    price: 49, compareAt: 58, art: { kind: "tube", color: "#EDEBE6", label: "SIKA" }, hint: "3 גוונים", tags: ["bestseller", "featured"], pop: 97,
    options: [{ name: "גוון", values: [{ label: "לבן", swatch: "#FFFFFF" }, { label: "אפור", swatch: "#9CA3AA" }, { label: "שחור", swatch: "#1C1F23" }] }],
    short: "דבק ואוטם פוליאוריתני חד-רכיבי להדבקה ולאיטום מפרקים בבנייה. גמיש, חזק ועמיד למים.",
    benefits: ["הדבקה חזקה על רוב חומרי הבנייה", "נשאר גמיש לאחר התייבשות", "ניתן לצביעה", "מתאים לפנים ולחוץ"],
    uses: ["איטום מפרקים בבטון ובטיח", "הדבקת אדני חלון ופרופילים", "איטום סביב צנרת ופתחים"],
    specs: [["נפח", "300 מ״ל"], ["בסיס", "פוליאוריתן"], ["צביעה", "ניתן לצביעה"], ["זמן התייבשות", "לפי הוראות היצרן"]],
    howTo: ["נקו ויבשו את המשטח מאבק ושומן.", "חתכו את הפייה בזווית לפי רוחב המפרק.", "הזריקו באמצעות אקדח סיליקון בתנועה רציפה.", "החליקו בעזרת מרית רטובה לפני יצירת קרום."],
    attrs: { "נפח": "300 מ״ל", "גוון": "לבן", "שימוש": "פנים וחוץ" }, keywords: ["sikaflex", "סיקהפלקס", "סיקה פלקס", "11fc", "פוליאוריתן"],
    complements: ["pro-silicone-gun", "masking-tape-48", "nitrile-gloves-12"],
  },
  {
    slug: "sanitary-silicone", name: "סיליקון סניטרי נגד עובש 280 מ״ל", brand: "sika", cat: "sealing-adhesives", sub: "silicones",
    price: 32, art: { kind: "tube", color: "#FFFFFF", label: "SIL" }, hint: "שקוף · לבן", tags: ["bestseller"], pop: 95,
    options: [{ name: "גוון", values: [{ label: "לבן", swatch: "#FFFFFF" }, { label: "שקוף", swatch: "#E6EEF7" }] }],
    short: "סיליקון לאיטום סביב אמבטיות, מקלחונים, כיורים ומשטחי עבודה. מכיל תוסף נגד עובש.",
    attrs: { "נפח": "280 מ״ל", "גוון": "לבן", "שימוש": "חדרים רטובים" }, keywords: ["סיליקון לבן", "סיליקון שקוף", "סילר"],
    complements: ["pro-silicone-gun", "masking-tape-48"],
  },
  {
    slug: "acrylic-roof-sealant", name: "חומר איטום אקרילי לגגות — לבן", brand: "tambour", cat: "sealing-adhesives", sub: "roof-sealing",
    price: 149, compareAt: 179, art: { kind: "bucket", color: "#F4F1EA", label: "ROOF" }, hint: "2 גדלים", tags: ["featured"], pop: 86,
    options: [{ name: "גודל", values: [{ label: "5 ק״ג" }, { label: "18 ק״ג", priceDelta: 250 }] }],
    short: "ציפוי אקרילי אלסטי לאיטום גגות בטון. מחזיר קרינה ומפחית חום.",
    benefits: ["גמיש וסוגר סדקים שערה", "גוון לבן מחזיר קרינת שמש", "יישום ברולר או מברשת"],
    uses: ["גגות בטון שטוחים", "חידוש איטום קיים", "מרפסות לא מרוצפות"],
    howTo: ["נקו את הגג היטב ותקנו סדקים.", "יישמו פריימר מתאים.", "מרחו שתי שכבות לפחות, בניצב זו לזו.", "הקפידו על יום יבש ללא תחזית גשם."],
    attrs: { "משקל": "5–18 ק״ג", "גוון": "לבן", "שימוש": "גגות" }, keywords: ["איטום גג", "גג"],
    complements: ["bitumen-primer", "microfiber-roller-25", "brush-set-3", "nitrile-gloves-12"],
  },
  { slug: "bitumen-primer", name: "פריימר ביטומני לאיטום", brand: "sika", cat: "sealing-adhesives", sub: "primers-sealing", price: 129, art: { kind: "bucket", color: "#2B2F34", label: "PRIMER" }, pop: 58, short: "שכבת יסוד לשיפור הדבקות של חומרי איטום ויריעות ביטומניות.", attrs: { "נפח": "4 ל׳", "שימוש": "גגות" } },
  { slug: "pu-foam-750", name: "קצף פוליאוריתן 750 מ״ל", brand: "sika", cat: "sealing-adhesives", sub: "pu-foam", price: 36, art: { kind: "foam", color: "#E4B343" }, tags: ["bestseller"], pop: 84, short: "קצף מתנפח למילוי חללים, בידוד ואיטום סביב משקופים וצנרת.", attrs: { "נפח": "750 מ״ל" }, keywords: ["פוליאוריתן", "קצף"] },
  { slug: "flexible-cement-waterproofing", name: "איטום צמנטי גמיש לחדרים רטובים — ערכה", brand: "mapei", cat: "sealing-adhesives", sub: "wet-rooms", price: 289, compareAt: 329, art: { kind: "bucket", color: "#8FB3DA", label: "WET" }, pop: 74, short: "מערכת איטום דו-רכיבית גמישה לאיטום מקלחות ומרפסות לפני ריצוף.", attrs: { "משקל": "32 ק״ג", "שימוש": "חדרים רטובים" }, complements: ["tile-adhesive-c2te", "notched-trowel-8"] },
  { slug: "acrylic-crack-filler", name: "חומר מילוי אקרילי לסדקים", brand: "tambour", cat: "sealing-adhesives", sub: "fillers", price: 24, art: { kind: "tube", color: "#D9D4C7", label: "FILL" }, pop: 56, short: "מילוי סדקים ומפרקים לפני צביעה. ניתן לצביעה לאחר ייבוש.", attrs: { "נפח": "310 מ״ל" } },

  // ── כלי עבודה ────────────────────────────────────────
  { slug: "pro-silicone-gun", name: "אקדח סיליקון מקצועי", brand: "stanley", cat: "tools", sub: "hand-tools", price: 45, art: { kind: "hammer", color: "#E4B343" }, pop: 68, short: "אקדח יציב עם מנגנון עצירה לטפטוף, לשפופרות 280–310 מ״ל." },
  {
    slug: "cordless-hammer-drill-18v", name: "מברגה רוטטת נטענת 18V", brand: "makita", cat: "tools", sub: "cordless",
    price: 899, compareAt: 1049, art: { kind: "drill", color: "#1A8A8A" }, hint: "גוף בלבד / ערכה", tags: ["bestseller", "featured"], pop: 93,
    options: [{ name: "תצורה", values: [{ label: "גוף בלבד" }, { label: "ערכה + 2 סוללות ומטען", priceDelta: 600 }] }],
    short: "מברגה רוטטת עוצמתית לקידוח בבטון, עץ ומתכת ולהברגה. מנוע ללא פחמים.",
    benefits: ["מנוע ללא פחמים — יותר זמן עבודה לסוללה", "מצב רטט לקידוח בבטון", "תאורת LED", "גוף קומפקטי ומאוזן"],
    uses: ["קידוח לדיבלים בקירות", "הרכבת רהיטים והברגה", "עבודות גבס ונגרות"],
    specs: [["מתח", "18V"], ["מנוע", "ללא פחמים"], ["ראש", "13 מ״מ"], ["אחריות", "אחריות יבואן רשמי"]],
    attrs: { "מתח": "18V", "כולל סוללה": "לפי תצורה" }, keywords: ["מברגה", "מקדחה"],
    complements: ["battery-18v-5ah", "sds-bits-set", "wall-anchors-8mm"],
  },
  { slug: "angle-grinder-125", name: "משחזת זווית 125 מ״מ 900W", brand: "bosch", cat: "tools", sub: "power-tools", price: 399, compareAt: 449, art: { kind: "grinder", color: "#1A56A8" }, tags: ["featured"], pop: 78, short: "משחזת זווית לחיתוך וליטוש מתכת, אבן ואריחים.", attrs: { "מתח": "230V", "כולל סוללה": "לא" }, complements: ["safety-glasses", "nitrile-gloves-12"] },
  { slug: "battery-18v-5ah", name: "סוללה 18V 5.0Ah", brand: "dewalt", cat: "tools", sub: "batteries", price: 389, art: { kind: "block", color: "#E4B343" }, pop: 60, short: "סוללת ליתיום-יון בקיבולת גבוהה לכלים נטענים 18V.", attrs: { "מתח": "18V" } },
  { slug: "impact-driver-18v", name: "מברגת אימפקט נטענת 18V", brand: "milwaukee", cat: "tools", sub: "cordless", price: 1190, art: { kind: "drill", color: "#B42318" }, stock: "low", tags: ["new"], pop: 76, short: "מברגת אימפקט עוצמתית להברגת ברגים ארוכים בעץ ובמתכת.", attrs: { "מתח": "18V", "כולל סוללה": "לא" } },
  { slug: "aluminum-level-60", name: "פלס אלומיניום 60 ס״מ", brand: "stanley", cat: "tools", sub: "measuring", price: 69, art: { kind: "level", color: "#E4B343" }, pop: 64, short: "פלס מדויק עם 3 בועות לעבודות בנייה, ריצוף והתקנה." },
  { slug: "tape-measure-8m", name: "מטר מתגלגל 8 מ׳", brand: "stanley", cat: "tools", sub: "measuring", price: 49, art: { kind: "block", color: "#E4B343" }, tags: ["bestseller"], pop: 82, short: "מטר מקצועי עם סרט רחב ונעילה." },
  { slug: "sds-bits-set", name: "סט מקדחים לבטון SDS — 5 יח׳", brand: "bosch", cat: "tools", sub: "bits-discs", price: 79, art: { kind: "screws", color: "#8A8F96" }, pop: 58, short: "מקדחי SDS-plus בקטרים 6–12 מ״מ לבטון ובלוקים." },
  { slug: "claw-hammer-450", name: "פטיש נגרים 450 גרם", brand: "stanley", cat: "tools", sub: "hand-tools", price: 59, art: { kind: "hammer", color: "#2B2F34" }, pop: 50, short: "פטיש עם ידית סיבי זכוכית ובולם זעזועים." },

  // ── גבס ──────────────────────────────────────────────
  {
    slug: "drywall-board-12-5", name: "לוח גבס 12.5 מ״מ — 120×260", brand: "knauf", cat: "drywall", sub: "boards",
    price: 38, unit: "לוח", art: { kind: "board", color: "#EDEBE6" }, hint: "לבן · ירוק · אש", tags: ["bestseller"], pop: 85,
    options: [{ name: "סוג לוח", values: [{ label: "לבן — רגיל" }, { label: "ירוק — עמיד לחות", priceDelta: 14 }, { label: "אדום — עמיד אש", priceDelta: 22 }] }],
    short: "לוח גבס סטנדרטי לקירות ותקרות. גם בגרסה עמידה ללחות ועמידה לאש.",
    attrs: { "עובי": "12.5 מ״מ", "סוג לוח": "לבן" }, keywords: ["גבס", "לוח גבס"], complements: ["drywall-stud-70", "drywall-screws-1000", "joint-compound-20", "joint-mesh-tape"],
  },
  { slug: "drywall-stud-70", name: "ניצב גבס 70 מ״מ — 3 מ׳", brand: "knauf", cat: "drywall", sub: "profiles", price: 21, unit: "יח׳", art: { kind: "profile", color: "#A9AFB5" }, pop: 66, short: "ניצב פלדה מגולוונת לבניית שלד קירות גבס.", attrs: { "עובי": "70 מ״מ" } },
  { slug: "drywall-screws-1000", name: "ברגי גבס 3.5×25 — 1000 יח׳", cat: "drywall", sub: "drywall-screws", price: 49, art: { kind: "screws", color: "#2B2F34" }, pop: 60, short: "ברגים שחורים עם ראש פעמון לחיבור לוחות גבס לפרופילים." },
  { slug: "joint-compound-20", name: "שפכטל לגבס 20 ק״ג", brand: "knauf", cat: "drywall", sub: "joint", price: 79, art: { kind: "bag", color: "#F4F1EA", label: "JOINT" }, pop: 58, short: "חומר מילוי לחיבורים ולגמר חלק בקירות ותקרות גבס." },
  { slug: "joint-mesh-tape", name: "סרט רשת לגבס 90 מ׳", brand: "3m", cat: "drywall", sub: "joint", price: 19, art: { kind: "tape", color: "#F4F1EA" }, pop: 54, short: "סרט רשת דביק לחיזוק חיבורים בין לוחות." },

  // ── חומרי בניין ──────────────────────────────────────
  { slug: "portland-cement-50", name: "מלט פורטלנד 50 ק״ג", cat: "building-materials", sub: "cement-concrete", price: 34, unit: "שק", art: { kind: "bag", color: "#8A8F96", label: "CEMENT" }, tags: ["bestseller"], pop: 89, short: "מלט אפור לתערובות בטון, טיט ויציקות.", attrs: { "משקל": "50 ק״ג", "שימוש": "יציקה ובנייה" }, keywords: ["מלט", "צמנט"] },
  { slug: "ready-plaster-40", name: "טיח מוכן 40 ק״ג", cat: "building-materials", sub: "ready-mixes", price: 42, unit: "שק", art: { kind: "bag", color: "#C9B48E", label: "PLASTER" }, pop: 62, short: "תערובת טיח מוכנה — מוסיפים מים ומתחילים לעבוד.", attrs: { "משקל": "40 ק״ג", "שימוש": "טיח" } },
  { slug: "concrete-waterproof-additive", name: "תוסף אטימות לבטון 1 ל׳", brand: "sika", cat: "building-materials", sub: "concrete-additives", price: 59, art: { kind: "bottle", color: "#3E6FB0", label: "ADD" }, pop: 48, short: "תוסף להפחתת חדירות מים בבטון ובטיח.", attrs: { "שימוש": "תוסף" } },

  // ── אינסטלציה ────────────────────────────────────────
  { slug: "pe-quick-coupling", name: "מחבר מהיר לצינור PE", brand: "plasson", cat: "plumbing", sub: "pipes-fittings", price: 18, art: { kind: "pipe", color: "#1C1F23" }, hint: "4 קטרים", pop: 58, short: "מחבר ישר לצינורות פוליאתילן, התקנה מהירה ללא כלים.", options: [{ name: "קוטר", values: [{ label: "20 מ״מ" }, { label: "25 מ״מ", priceDelta: 4 }, { label: "32 מ״מ", priceDelta: 9 }, { label: "40 מ״מ", priceDelta: 16 }] }], attrs: { "קוטר": "20–40 מ״מ", "חומר": "פלסטיק" } },
  { slug: "pvc-drain-pipe-110", name: "צינור ניקוז PVC 110 מ״מ — 2 מ׳", cat: "plumbing", sub: "drainage", price: 69, art: { kind: "pipe", color: "#8A8F96" }, pop: 50, short: "צינור ניקוז לביוב ולמערכות מים אפורים.", attrs: { "קוטר": "110 מ״מ", "חומר": "PVC" } },
  { slug: "ball-valve-half", name: "ברז כדורי 1/2 אינץ׳", cat: "plumbing", sub: "valves", price: 39, art: { kind: "faucet", color: "#C9A227" }, pop: 56, short: "ברז כדורי מפליז לסגירת מים ראשית או נקודתית.", attrs: { "קוטר": "1/2 אינץ׳", "חומר": "פליז" } },
  { slug: "double-kitchen-siphon", name: "סיפון לכיור מטבח כפול", cat: "plumbing", sub: "siphons", price: 59, art: { kind: "pipe", color: "#FFFFFF" }, pop: 52, short: "סיפון לכיור כפול עם חיבור למדיח.", attrs: { "חומר": "פלסטיק" } },

  // ── חשמל ─────────────────────────────────────────────
  { slug: "double-socket-white", name: "שקע כפול — סדרה מודולרית", brand: "legrand", cat: "electrical", sub: "sockets-switches", price: 29, art: { kind: "socket", color: "#FFFFFF" }, hint: "לבן · שחור", pop: 70, short: "מנגנון שקע כפול תקני לקופסה מודולרית.", options: [{ name: "גוון", values: [{ label: "לבן", swatch: "#FFFFFF" }, { label: "שחור", swatch: "#1C1F23", priceDelta: 6 }] }], attrs: { "גוון": "לבן", "סדרה": "מודולרית" }, keywords: ["שקעים", "שקע"] },
  { slug: "power-cable-3x2-5", name: "כבל חשמל 3×2.5 — גליל 100 מ׳", cat: "electrical", sub: "cables", price: 549, art: { kind: "cable", color: "#1C1F23" }, pop: 46, short: "כבל תקני להתקנות חשמל ביתיות ומסחריות." },
  { slug: "led-bulb-12w", name: "נורת LED 12W E27", cat: "electrical", sub: "lighting", price: 12, art: { kind: "bulb", color: "#F2C94C" }, hint: "אור חם / קר", pop: 74, short: "נורת LED חסכונית להחלפה ישירה.", options: [{ name: "גוון אור", values: [{ label: "חם 3000K" }, { label: "טבעי 4000K" }, { label: "קר 6500K" }] }] },
  { slug: "extension-4-sockets", name: "מאריך 4 שקעים עם מפסק — 3 מ׳", cat: "electrical", sub: "extensions", price: 49, art: { kind: "cable", color: "#F4F1EA" }, pop: 62, short: "מאריך תקני עם מפסק מואר והגנת ילדים." },

  // ── ברזים ואמבטיה ────────────────────────────────────
  {
    slug: "pull-out-kitchen-faucet", name: "ברז מטבח נשלף", brand: "hamat", cat: "bath-faucets", sub: "kitchen-faucets",
    price: 690, compareAt: 790, art: { kind: "faucet", color: "#C0C6CC" }, hint: "3 גימורים", tags: ["featured"], pop: 79,
    options: [{ name: "גימור", values: [{ label: "כרום", swatch: "#C0C6CC" }, { label: "שחור מט", swatch: "#1C1F23", priceDelta: 90 }, { label: "נירוסטה מוברשת", swatch: "#A9AFB5", priceDelta: 60 }] }],
    short: "ברז מטבח עם ראש נשלף ושני מצבי זרימה. מנגנון קרמי שקט.",
    attrs: { "גימור": "כרום" }, complements: ["double-kitchen-siphon", "ball-valve-half", "sanitary-silicone"],
  },
  { slug: "shower-mixer-set", name: "סוללה למקלחת עם ראש מקלחת", brand: "hamat", cat: "bath-faucets", sub: "shower-mixers", price: 890, art: { kind: "shower", color: "#C0C6CC" }, tags: ["new"], pop: 64, short: "סט מקלחת עם מוט, ראש מקלחת גדול ומזלף יד.", attrs: { "גימור": "כרום" } },
  { slug: "basin-faucet", name: "ברז כיור פרח", brand: "hamat", cat: "bath-faucets", sub: "basin-faucets", price: 390, art: { kind: "faucet", color: "#2B2F34" }, pop: 58, short: "ברז כיור בעיצוב נקי עם חוסך מים.", attrs: { "גימור": "שחור מט" } },

  // ── ריצוף וקרמיקה ────────────────────────────────────
  {
    slug: "tile-adhesive-c2te", name: "דבק קרמיקה משופר C2TE — 25 ק״ג", brand: "mapei", cat: "tiling", sub: "tile-adhesive",
    price: 69, compareAt: 79, unit: "שק", art: { kind: "bag", color: "#EDEBE6", label: "C2TE" }, tags: ["bestseller"], pop: 91,
    short: "דבק צמנטי משופר וגמיש לאריחי קרמיקה ופורצלן, לפנים ולחוץ.",
    benefits: ["מתאים לאריחים גדולים ופורצלן", "גמיש — עמיד לתזוזות קלות", "זמן פתוח ארוך"],
    uses: ["ריצוף וחיפוי קירות", "מרפסות ומקלחות", "הדבקת אריח על אריח (לפי הנחיות)"],
    attrs: { "משקל": "25 ק״ג", "גוון": "אפור" }, keywords: ["דבק לקרמיקה", "דבק אריחים"],
    complements: ["flexible-grout-5", "tile-spacers-2mm", "notched-trowel-8", "bitumen-primer"],
  },
  { slug: "flexible-grout-5", name: "רובה צמנטית גמישה — 5 ק״ג", brand: "mapei", cat: "tiling", sub: "grout", price: 59, art: { kind: "bucket", color: "#8A8F96", label: "GROUT" }, hint: "5 גוונים", pop: 76, short: "רובה למילוי מישקים 1–6 מ״מ, עמידה למים ולכתמים.", options: [{ name: "גוון", values: [{ label: "לבן", swatch: "#FFFFFF" }, { label: "אפור בהיר", swatch: "#D0D4D8" }, { label: "אפור", swatch: "#8A8F96" }, { label: "אנתרציט", swatch: "#3A3F45" }, { label: "בז׳", swatch: "#D9C9A8" }] }], attrs: { "משקל": "5 ק״ג", "גוון": "אפור" } },
  { slug: "tile-spacers-2mm", name: "ספייסרים 2 מ״מ — 250 יח׳", cat: "tiling", sub: "spacers", price: 15, art: { kind: "screws", color: "#1A56A8" }, pop: 60, short: "ספייסרים לשמירה על מישק אחיד בין אריחים." },
  { slug: "notched-trowel-8", name: "מאלג׳ משונן 8 מ״מ", cat: "tiling", sub: "tiling-tools", price: 35, art: { kind: "trowel", color: "#2B2F34" }, pop: 56, short: "מאלג׳ נירוסטה לפריסת דבק אחידה." },
  { slug: "cement-residue-remover", name: "מסיר מלט ושאריות רובה — 1 ל׳", cat: "tiling", sub: "tile-care", price: 39, art: { kind: "bottle", color: "#1F7A4D", label: "CLEAN" }, tags: ["new"], pop: 52, short: "חומר לניקוי שאריות מלט ורובה אחרי ריצוף." },

  // ── ברגים ופרזול ─────────────────────────────────────
  { slug: "wood-screws-4x40", name: "ברגי עץ 4×40 — 200 יח׳", cat: "fasteners", sub: "screws", price: 29, art: { kind: "screws", color: "#C9A227" }, pop: 62, short: "ברגים מצופים לעבודות נגרות והרכבה.", attrs: { "אורך": "40 מ״מ", "חומר": "פלדה מצופה" } },
  { slug: "wall-anchors-8mm", name: "דיבלים 8 מ״מ + ברגים — 100 יח׳", cat: "fasteners", sub: "anchors", price: 25, art: { kind: "screws", color: "#E4B343" }, tags: ["bestseller"], pop: 80, short: "ערכת דיבלים וברגים לתלייה על קירות בטון ובלוקים.", attrs: { "אורך": "40 מ״מ", "חומר": "ניילון" } },

  // ── עץ ───────────────────────────────────────────────
  { slug: "deck-oil-teak", name: "שמן לדק — גוון טיק", brand: "tambour", cat: "wood", sub: "wood-finish", price: 159, art: { kind: "bucket", color: "#8C5E3C", label: "OIL" }, tags: ["new"], pop: 58, short: "שמן חודר להגנה על דקים ורהיטי גן מפני שמש ורטיבות.", attrs: { "סוג עץ": "כל סוגי העץ" } },
  { slug: "hardwood-deck-board", name: "לוח דק עץ מוקשה — 2.4 מ׳", cat: "wood", sub: "decking", price: 89, unit: "לוח", art: { kind: "plank", color: "#8C5E3C" }, pop: 50, short: "לוח דק לחוץ, מחורץ נגד החלקה.", attrs: { "אורך": "2.4 מ׳", "סוג עץ": "מוקשה" } },

  // ── גינה ─────────────────────────────────────────────
  { slug: "garden-hose-20m", name: "צינור גינה 1/2 אינץ׳ — 20 מ׳", brand: "gardena", cat: "garden", sub: "irrigation", price: 149, art: { kind: "hose", color: "#2F7D4F" }, pop: 60, short: "צינור גמיש מחוזק עם הגנת UV.", attrs: { "אורך": "20 מ׳", "קוטר": "1/2 אינץ׳" } },
  { slug: "tap-irrigation-timer", name: "מחשב השקיה לברז", brand: "gardena", cat: "garden", sub: "irrigation", price: 229, art: { kind: "block", color: "#2F7D4F" }, tags: ["new"], pop: 55, short: "מחשב השקיה פשוט לתכנות, מתחבר ישירות לברז." },

  // ── בטיחות ───────────────────────────────────────────
  { slug: "nitrile-gloves-12", name: "כפפות עבודה מצופות ניטריל — 12 זוגות", brand: "3m", cat: "safety", sub: "gloves", price: 59, art: { kind: "gloves", color: "#E4B343" }, pop: 70, short: "כפפות עם אחיזה טובה ועמידות לשחיקה.", options: [{ name: "מידה", values: [{ label: "M" }, { label: "L" }, { label: "XL" }] }], attrs: { "מידה": "M–XL" } },
  { slug: "safety-glasses", name: "משקפי מגן שקופים", brand: "3m", cat: "safety", sub: "eye-protection", price: 19, art: { kind: "helmet", color: "#8FB3DA" }, pop: 54, short: "משקפי מגן קלים עם הגנה צידית." },
  { slug: "ffp2-mask-10", name: "מסכת נשימה FFP2 — 10 יח׳", brand: "3m", cat: "safety", sub: "masks", price: 49, art: { kind: "helmet", color: "#EDEBE6" }, pop: 50, short: "הגנה מאבק בנייה, גבס וליטוש." },

  // ── ניקיון ───────────────────────────────────────────
  { slug: "wet-dry-vacuum-30", name: "שואב אבק תעשייתי רטוב/יבש 30 ל׳", brand: "bosch", cat: "cleaning", sub: "vacuums", price: 699, compareAt: 799, art: { kind: "grinder", color: "#1A56A8" }, tags: ["new"], pop: 66, short: "שואב לאבק בנייה ולנוזלים עם שקע לכלי עבודה.", attrs: { "נפח": "30 ל׳" } },
  { slug: "construction-waste-bags", name: "שקי פסולת בנייה — 10 יח׳", cat: "cleaning", sub: "waste-bags", price: 29, art: { kind: "bag", color: "#2B2F34", label: "BAG" }, pop: 58, short: "שקים עבים ועמידים לפסולת שיפוץ." },
  { slug: "multi-purpose-lubricant", name: "תרסיס שמן רב-שימושי 400 מ״ל", cat: "cleaning", sub: "lubricants", price: 25, art: { kind: "spray", color: "#1F7A4D" }, pop: 60, short: "משחרר, משמן ומגן מפני חלודה.", attrs: { "נפח": "400 מ״ל" } },
];

const defaultHowTo = [
  "קראו את הוראות היצרן המצורפות למוצר לפני השימוש.",
  "הכינו משטח עבודה נקי ויבש.",
  "השתמשו בציוד מגן מתאים.",
];

const defaultFaq = [
  { q: "אפשר לאסוף את המוצר מהחנות?", a: "כן. בחרו \"איסוף עצמי\" בקופה ונעדכן כשההזמנה מוכנה." },
  { q: "יש מחיר מיוחד לכמויות?", a: "לקבלנים ולהזמנות גדולות — הוסיפו לרשימת הצעת מחיר או פנו אלינו ב-WhatsApp." },
];

export const products: Product[] = seeds.map((s, i) => ({
  id: s.slug,
  slug: s.slug,
  sku: `DM-${String(1001 + i)}`,
  name: s.name,
  brand: s.brand ?? "",
  category: s.cat,
  sub: s.sub,
  art: s.art,
  price: s.price,
  compareAt: s.compareAt,
  unit: s.unit ?? "יח׳",
  variantHint: s.hint,
  options: s.options,
  stock: s.stock ?? "in",
  tags: s.tags ?? [],
  popularity: s.pop ?? 50,
  addedOrder: i,
  short: s.short,
  description: `${s.short} המוצר מגיע באריזה מקורית. לפרטים נוספים ולהתאמה לעבודה שלכם — צוות הייעוץ שלנו זמין בטלפון וב-WhatsApp.`,
  benefits: s.benefits ?? ["איכות מקצועית", "זמין במלאי למשלוח או לאיסוף", "ייעוץ מקצועי לפני הקנייה"],
  uses: s.uses ?? ["עבודות שיפוץ ותחזוקה בבית", "עבודה מקצועית באתר"],
  specs: s.specs ?? Object.entries(s.attrs ?? {}).concat([["יחידת מכירה", s.unit ?? "יח׳"]]),
  howTo: s.howTo ?? defaultHowTo,
  faq: s.faq ?? defaultFaq,
  attrs: s.attrs ?? {},
  keywords: s.keywords,
  complements: s.complements,
}));

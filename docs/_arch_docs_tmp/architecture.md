# [שם העסק] — Pre-Build Architecture

Status: draft for owner review. All business facts are placeholders (`[טלפון]`, `[כתובת]` …). Nothing here is final legal wording.

Reference studied: homreybinyan.co.il — used only for UX/IA lessons (category depth, brand browsing, promo rails, phone-first trust). No design, copy, imagery or identity is reused.

**What we keep from the reference:** deep category tree, brand browsing, visible phone, promo product rails, pickup + delivery messaging.
**What we fix:** visual clutter, weak search, no profession/project discovery, no RFQ flow for pros, dense product cards, weak mobile hierarchy, thin SEO copy on category pages.

---

## 1. Sitemap

```
/                                   בית
/c/{category}                       קטגוריה ראשית          (e.g. /c/itum-vehadbaka)
/c/{category}/{sub}                 תת-קטגוריה             (e.g. /c/itum-vehadbaka/itum-gagot)
/p/{product-slug}                   דף מוצר
/brands                             כל המותגים
/brands/{brand}                     דף מותג
/pros                               לקבלנים ואנשי מקצוע
/pros/{profession}                  דף מקצוע (צבעים, אינסטלטורים, חשמלאים, רצפים, גבס, שיפוצניקים, קבלנים, DIY)
/projects                           כל הפרויקטים
/projects/{project}                 דף פרויקט (איטום גג, צביעת הבית…)
/sale                               מבצעים
/new                                חדשים באתר
/search?q=                          תוצאות חיפוש
/guides                             מדריכים וטיפים
/guides/{article}                   מאמר
/cart                               עגלה
/checkout                           קופה (פרטים → משלוח/איסוף → תשלום)
/checkout/success                   אישור הזמנה
/quote                              רשימת הצעת מחיר (RFQ list)
/quote/request                      טופס הצעת מחיר
/account                            אזור אישי (הזמנות, כתובות, הצעות מחיר, מועדפים)
/wishlist                           מועדפים
/about                              אודות
/contact                            צור קשר + מפה + Waze
/store                              החנות: שעות, איסוף עצמי, אזורי משלוח
/policies/shipping                  מדיניות משלוחים        ⚠ legal review
/policies/returns                   החזרות                ⚠ legal review
/policies/cancellation              ביטול עסקה             ⚠ legal review
/policies/privacy                   מדיניות פרטיות         ⚠ legal review
/policies/terms                     תקנון                 ⚠ legal review
/accessibility                      הצהרת נגישות           ⚠ legal review
/admin/*                            ניהול (לא מאונדקס)
```

URL slugs: short transliterated Latin (stable, shareable, no `%D7%...` encoding). Hebrew stays in H1/title/breadcrumbs.

---

## 2–3. Category & Subcategory Hierarchy

Max depth: 2 levels + product = 3 clicks.

| קטגוריה | תתי-קטגוריות |
|---|---|
| חומרי בניין | מלט ובטון · טיט וחול · בלוקים · מוטות ברזל ורשתות · תערובות מוכנות · תוספים לבטון · פרופילים ופינות · יריעות ובידוד |
| צבע | צבע פנים · צבע חוץ · צבע לעץ ולמתכת · יסוד ופריימר · שפכטל ומרק · ספריי צבע · רולרים · מברשות · מגשים ואביזרי צביעה · מדללים וממיסים |
| איטום והדבקה | איטום גגות · סיליקונים · דבקים · חומרי איטום · פוליאוריתן (קצף) · פריימרים · חומרי מילוי · איטום חדרים רטובים |
| גבס | לוחות גבס · פרופילים ומסלולים · ברגים לגבס · שפכטל וסרטי גבס · בידוד אקוסטי · פינות מגן · כלים לגבס |
| אינסטלציה | צנרת ומחברים · ניקוז וביוב · מים חמים ודודים · משאבות · ברזי ניל וכדוריים · סיפונים · כלים לאינסטלציה |
| חשמל | כבלים וחוטים · שקעים ומפסקים · תאורה · לוחות חשמל ומאמ"תים · צנרת ותעלות · מאריכים · כלי בדיקה |
| כלי עבודה | כלים חשמליים · כלים נטענים · סוללות ומטענים · כלי יד · מדידה ופילוס · דיסקים ומקדחים · אחסון וארגזי כלים · סולמות |
| ברזים ואמבטיה | ברזי מטבח · ברזי כיור · סוללות מקלחת · ראשי מקלחת · אסלות ומיכלים · ארונות אמבטיה · אביזרי אמבטיה |
| ריצוף וקרמיקה | דבקי קרמיקה · רובה · ספייסרים ופילוס · פרופילי גמר · מאלג'ים וכלי ריצוף · ניקוי ותחזוקת ריצוף |
| ברגים ופרזול | ברגים · דיבלים ועוגנים · מסמרים · צירים וידיות · מנעולים · מתלים וזוויות · שרשראות וכבלים |
| עץ | לוחות סנדוויץ' ו-MDF · קורות ופרופילי עץ · דק · לכות ושמנים לעץ · דבק לעץ |
| גינה וחוץ | השקיה · כלי גינה · דשא וזרעים · ריהוט חוץ · גידור · פתרונות הצללה |
| בטיחות וביגוד עבודה | כפפות · נעלי עבודה · משקפי מגן · מסכות והגנת נשימה · אוזניות · ביגוד עבודה · רתמות וגובה |
| ניקיון ותחזוקה | חומרי ניקוי מקצועיים · שואבים · מסירי שומנים ואבנית · שקיות ופסולת בנייה · שמנים ומשחות |
| מבצעים | (dynamic: by discount, by brand, clearance) |
| מותגים | (dynamic grid) |
| לקבלנים | (link to /pros) |

Category data model: `{ id, slug, name_he, parent_id, image, seo_title, seo_description, intro_html, bottom_seo_html, sort, filters[] }` — each category defines which attribute filters it exposes (e.g. צבע → גוון, גימור, נפח; ברגים → קוטר, אורך, חומר).

---

## 4. Homepage Wireframe (RTL — right is start)

```
┌───────────────────────────────────────────────────────────────┐
│ 1  🚚 משלוחים מהירים לכל הארץ · משלוח חינם מעל [סכום]   📞 [טלפון] │ 36px, charcoal
├───────────────────────────────────────────────────────────────┤
│ 2  [לוגו]   [ 🔍 חפשו מוצר, מותג או קטגוריה…        ]  📞 ♡ 👤 🛒3 │ 76px
├───────────────────────────────────────────────────────────────┤
│ 3  ☰ כל הקטגוריות │ צבע │ איטום │ כלי עבודה │ אינסטלציה │ … │ מבצעים │ לקבלנים │
├───────────────────────────────────────────────────────────────┤
│ 4  HERO (≈420px desktop / 360px mobile)                        │
│    כל מה שצריך לבנייה ולשיפוץ — במקום אחד       [ warehouse /  │
│    subline                                         product      │
│    [לכל המוצרים]  [ייעוץ מקצועי]                    image ]     │
│    ✓ איסוף עצמי  ✓ מחירי קבלן  ✓ משלוח תוך [X] ימים           │
├───────────────────────────────────────────────────────────────┤
│ 5  מה אתם מחפשים?   [12 large image cards, 6/row → 2/row mobile]│
│ 6  Quick chips: ◯רולרים ◯ברזים ◯ספריי ◯שקעים ◯איטום ◯גבס… (scroll)│
│ 7  הכי נמכרים      [product rail, 5/row, arrows]                │
│ 8  Promo banner (single, calm, one CTA)                        │
│ 9  מה אתם רוצים לעשות?  [8 project cards]                       │
│ 10 מה המקצוע שלכם?     [8 profession tiles]                     │
│ 11 המבצעים שלנו    [product rail]                               │
│ 12 קונים בראש שקט   [6 icons row]                               │
│ 13 המותגים שלנו    [logo grid, grayscale → color on hover]      │
│ 14 Contractor CTA band (dark) — מחירים לפרויקטים [קבלת הצעת מחיר]│
│ 15 מדריכים וטיפים  [3 article cards]                            │
│ 16 בעלי מקצוע ולקוחות ממליצים [placeholders, clearly marked]    │
│ 17 Store info: address, hours, pickup, delivery areas | map+Waze│
│ 18 Footer                                                      │
└───────────────────────────────────────────────────────────────┘
```

---

## 5–7. Design System, Typography, Color

### Color (one accent: industrial blue — owner's choice)
Industrial blue reads as engineered, reliable and premium, and separates the brand from the orange-heavy hardware-store norm. It is used sparingly against a charcoal/stone base.

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#1C1F23` | text, header nav, dark bands |
| `--ink-2` | `#3A3F45` | secondary text |
| `--muted` | `#6B7178` | meta text (≥4.5:1 on bg) |
| `--line` | `#E4E2DD` | borders, dividers |
| `--bg` | `#FAF9F7` | page background (warm off-white) |
| `--surface` | `#FFFFFF` | cards |
| `--stone` | `#F1EFEA` | section alternation, image wells |
| `--accent` | `#1A56A8` | primary CTA, add to cart, active nav, sale |
| `--accent-hover` | `#14468A` | hover/pressed |
| `--accent-soft` | `#E9F0FA` | sale badge bg, highlights |
| `--success` | `#1F7A4D` | in stock |
| `--warning` | `#B7791F` | low stock |
| `--danger` | `#B42318` | errors, out of stock |
| `--whatsapp` | `#25D366` | WhatsApp button only |

Rule: accent ≤ ~8% of any screen. White text on `--accent` passes AA for ≥16px bold (buttons are 16px/600).

### Typography
- **IBM Plex Sans Hebrew** (400/500/600/700) — engineered, industrial, excellent Hebrew + Latin brand names in one family, self-hosted, `font-display: swap`, subset hebrew+latin.
- Numbers/prices: `font-variant-numeric: tabular-nums`, prices always LTR-isolated (`<bdi>`) so `₪1,249.90` never breaks in RTL.

| Role | Desktop | Mobile | Weight |
|---|---|---|---|
| Display (hero H1) | 44/52 | 30/38 | 700 |
| H2 section | 30/38 | 24/32 | 700 |
| H3 card title | 20/28 | 18/26 | 600 |
| Body | 17/28 | 16/26 | 400 |
| Small/meta | 14/20 | 14/20 | 500 |
| Price | 22/28 | 20/26 | 700 |

Minimum text size anywhere: 14px.

### Spacing, radius, elevation
- 4px base scale: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96
- Container: 1360px max, 24px gutters (16px mobile)
- Radius: 6px inputs/buttons, 10px cards, 999px chips
- Shadow: only on hover/dropdowns (`0 8px 24px rgba(28,31,35,.08)`); cards rest on 1px `--line` border
- Motion: 150–200ms ease-out, transform/opacity only, `prefers-reduced-motion` respected

### Icons
Lucide (stroke 1.75). Directional icons (arrows, chevrons, "back") are mirrored for RTL; non-directional ones (cart, phone, search) are not.

### Buttons
Primary (accent, filled) · Secondary (ink outline) · Ghost (text) · WhatsApp (green outline). Heights: 48px default, 56px on product page, 44px min touch target everywhere.

---

## 8. Desktop Navigation

- Row 1: announcement (1–2 messages max).
- Row 2: logo (right) · search (flex, ~640px, 52px tall, accent search button) · phone · wishlist · account · RFQ list (clipboard icon + count, visible only when non-empty or for pro users) · cart with count (left).
- Row 3: "☰ כל הקטגוריות" opens full mega menu; then 8 top categories inline; then **מבצעים** (accent text) and **לקבלנים** (outlined pill) at the far left.
- Mega menu: right column = main categories list (hover switches panel); panel = subcategory columns + 1 featured tile (project or promo) + "לכל ה[קטגוריה] ←". Opens on hover with 120ms intent delay, fully keyboard-navigable (arrow keys, Esc).
- Sticky: header collapses to row 2 only on scroll-down.

## 9. Mobile Navigation

- Top: logo · phone · cart. Below it, full-width search field always visible (not an icon).
- Hamburger drawer (slides from right): tabs **קטגוריות / מקצועות / פרויקטים**, accordion categories with images, then מותגים, מבצעים, לקבלנים, מדריכים, account, phone + WhatsApp.
- Sticky bottom bar (5 items): בית · קטגוריות · חיפוש · עגלה · חשבון. Hidden on checkout.
- Floating WhatsApp sits above the bottom bar (bottom-left, 52px), hidden on checkout and when the product sticky bar is shown (WhatsApp moves into that bar).

---

## 10. Product Card

```
┌─────────────────────┐
│ -15%        ♡       │  badge top-right (start), wishlist top-left
│                     │
│    [ image 1:1 ]    │  white well, object-contain, lazy
│                     │
├─────────────────────┤
│ SIKA                │  brand, 13px caps, muted
│ סיקהפלקס 11FC לבן   │  name, 2 lines max
│ 300 מ"ל · 3 גוונים   │  variant hint
│ ● במלאי             │  green/amber/red dot
│ ₪49.90  ₪58.90      │  current (bold) + struck previous
│ [ הוספה לעגלה  🛒 ]  │  or [בחר אפשרויות] if variants
└─────────────────────┘
```
- Whole card is the link; CTA is a separate button (no nested links).
- Quick view on desktop hover (eye icon), not on mobile.
- Pro users see a "הוסף להצעת מחיר" secondary text link under the CTA.
- Out of stock: CTA becomes "עדכנו אותי כשחוזר".

## 11. Product Page Structure

Desktop 2-column (RTL: gallery on the right, buy box on the left — gallery is what the eye hits first):

```
Breadcrumbs: בית › איטום והדבקה › סיליקונים › [מוצר]
┌──────────────────────────┬───────────────────────────────┐
│ Gallery (thumbs + zoom,  │ Brand · SKU                   │
│ video support)           │ H1 product name               │
│                          │ ★ rating (only if real)       │
│                          │ ₪49.90  ₪58.90  חיסכון 15%     │
│                          │ כולל מע"מ · עד [X] תשלומים       │
│                          │ Variants: גוון (swatches)       │
│                          │           נפח (pills)           │
│                          │ ● במלאי – נשלח תוך [X] ימי עסקים │
│                          │ [– 1 +] [ הוספה לעגלה ]         │
│                          │ [ ייעוץ ב-WhatsApp ]            │
│                          │ + הוסף לרשימת הצעת מחיר          │
│                          │ ┌ 🚚 משלוח: [מחיר], חינם מעל [סכום]│
│                          │ │ 🏬 איסוף עצמי: [כתובת] — מוכן תוך [X]│
│                          │ │ 🔒 תשלום מאובטח · Apple/Google Pay · Bit│
│                          │ └ ↩ החזרות לפי [מדיניות]          │
└──────────────────────────┴───────────────────────────────┘
לקוחות שקנו מוצר זה צריכים בדרך כלל גם:  [bundle w/ checkboxes + "הוסיפו הכל ₪X"]
Tabs/anchors: תיאור · יתרונות · שימושים · מפרט טכני · הוראות שימוש · שאלות נפוצות
מוצרים משלימים (rail) · מוצרים דומים (rail) · מדריכים קשורים · נצפו לאחרונה
```
Mobile: gallery swipe → buy box → accordions; sticky bottom bar = price + "הוספה לעגלה" + WhatsApp icon.

WhatsApp prefill: `היי, אשמח לייעוץ לגבי: {name} (מק"ט {sku}) {url}`.

## 12. Category Page Structure

```
Breadcrumbs
H1 חומרי איטום והדבקה      ·  248 מוצרים
Intro (2–3 lines, "קרא עוד" expands)
Subcategory chips (image chips, horizontal)
┌── Filters (right, 280px) ──┬── Toolbar: sort ▾ · active filter pills · grid/list ──┐
│ מותג (search + checkboxes)  │ Product grid 4/row (3 at ≤1280, 2 mobile)            │
│ מחיר (range)                │ …                                                    │
│ סוג מוצר / שימוש / נפח /    │ In-grid tile every ~12 items: related guide or pro CTA│
│ גוון / גודל                 │ "טען עוד" + page numbers (crawlable ?page=N)          │
│ זמינות · במבצע              │                                                      │
└────────────────────────────┴──────────────────────────────────────────────────────┘
SEO block (bottom): H2s, buying guide text, internal links to subcats, projects, brands
FAQ (with FAQ schema)
```
Sort: פופולריות (default) · הנמכרים ביותר · מחיר נמוך לגבוה · מחיר גבוה לנמוך · חדש באתר.
Mobile: sticky "סינון · מיון" bar → full-height drawer with "הצג 48 מוצרים" live count button.
Filter URLs: `?brand=sika&volume=300ml` — indexed only for curated combos (brand × category), others `noindex,follow` + canonical to base.

---

## 13. Contractor RFQ Flow

Two parallel "baskets" with distinct icons and colors:
- 🛒 **עגלה** — buy now, pay now.
- 📋 **רשימת הצעת מחיר** — build a list, get pricing.

```
1. Any product card / product page → "הוסף להצעת מחיר" (qty input allows large numbers, unit shown: שק / לוח / דלי / מטר)
2. /quote — editable list: qty, unit, per-line note, "הוסף פריט שלא מצאתי" (free text row)
3. "המשך לבקשת הצעת מחיר" → /quote/request form:
     שם · טלפון · שם העסק · סוג לקוח (קבלן/שיפוצניק/חברת בנייה/מוסד/פרטי) · אזור עבודה
     רשימת חומרים (prefilled from list, editable) · כמות משוערת · מועד אספקה רצוי
     העלאת קבצים (PDF/XLSX/JPG, BOQ / כתב כמויות, up to [10MB])
     [שליחת בקשה להצעת מחיר]
4. Success page: request #, expected response time [X שעות עבודה], WhatsApp shortcut
5. Admin: quote inbox (status: חדש → בטיפול → נשלחה הצעה → אושר → נסגר), can convert quote to a payable order link
```
/pros page can also start the form directly without a list (upload-first path for contractors who already have a BOQ).

## 14. Checkout Flow

Guest checkout default; account optional after purchase.

```
Cart (/cart)
  lines · qty · cross-sell strip · free-shipping progress bar ("עוד ₪X למשלוח חינם")
  coupon field (collapsed) · summary incl. VAT
  [למעבר לתשלום]  + Apple Pay / Google Pay express buttons
Checkout (single page, 3 sections, progressive):
  1. פרטים: טלפון, שם, אימייל, (חשבונית על שם עסק? → ח.פ./ע.מ.)
  2. קבלת ההזמנה: ◉ משלוח עד הבית [מחיר/חינם] (עיר, רחוב, מס', קומה, מעלית?, הערה לשליח)
                   ○ איסוף עצמי מ[כתובת] — חינם, מוכן תוך [X]
                   heavy-goods note for cement/boards (crane/pallet delivery = quoted)
  3. תשלום: כרטיס אשראי (hosted fields via Israeli gateway) · תשלומים · Apple Pay · Google Pay · Bit
  Order summary sticky (desktop left column / collapsible top on mobile)
  ☐ אישור תקנון ומדיניות ביטול (links)
  [ביצוע הזמנה ₪X]
Success: order #, invoice/receipt emailed (issued by invoicing provider), pickup/delivery ETA, WhatsApp
```
Israeli commerce: prices shown incl. 18% VAT (rate configurable), VAT line on cart/receipt; gateway candidates: Cardcom / Tranzila / PayPlus / Grow (Meshulam) — decided by business owner; invoices via gateway's built-in invoicing or iCount/Green Invoice.

## 15. Search Experience

- Always-visible field. On focus (empty): recent searches, popular searches, top categories.
- Typing (≥2 chars, 150ms debounce): dropdown with 3 groups
  - **קטגוריות** (up to 3) · **מותגים** (up to 3) · **מוצרים** (up to 6 with image, name, category, brand, price)
  - "לכל התוצאות עבור 'X' ←"
- Tolerance:
  - Synonym/transliteration dictionary per brand: `סיקה ↔ sika`, `סיקהפלקס ↔ sikaflex ↔ סיקה פלקס`, `טמבור ↔ tambour`, `נירלט ↔ nirlat`, `מקיטה ↔ makita`, `בוש ↔ bosch`, `דיוולט ↔ dewalt`, `מילווקי ↔ milwaukee`, `חמת ↔ hamat`, `מאפיי ↔ mapei`.
  - Hebrew normalization: strip niqqud, final letters (ך→כ, ם→מ, ן→נ, ף→פ, ץ→צ), ignore geresh/gershayim, optional ו/י spelling (סיליקון/סליקון).
  - Space-insensitive (`סיקה פלקס` = `סיקהפלקס`), prefix matching, trigram fuzzy (1–2 typos).
  - Wrong keyboard layout recovery (`xhe` → `סיק` style QWERTY↔Hebrew mapping).
- Results page: same filters as category page + "לא מצאתם? שלחו לנו ב-WhatsApp" zero-results fallback with popular categories.
- Implementation: Postgres `pg_trgm` + `unaccent`-style normalization + synonyms table (swap to Algolia/Typesense if catalog > ~20k SKUs).

## 16. Mobile UX Structure

- Search field visible on every page top; bottom bar with 5 destinations.
- Category cards 2/row, quick chips horizontal scroll, product rails swipe with peek.
- Filters in full-screen drawer; sort as bottom sheet.
- Product page: sticky add-to-cart bar after buy box scrolls out.
- Touch targets ≥44px, inputs 16px (no iOS zoom), `inputmode="tel"` for phone, `autocomplete` on all checkout fields.
- Click-to-call and WhatsApp in drawer, product page, contact, success pages.

## 17. SEO Structure

- Per page: one H1, unique `<title>` (≤60 chars) and meta description (≤155), canonical, `lang="he" dir="rtl"`, OG tags.
- Title patterns:
  - Category: `{קטגוריה} – מחירים ומבחר גדול | [שם העסק]`
  - Product: `{שם מוצר} {מותג} {נפח} – ₪{מחיר} | [שם העסק]`
  - Brand: `מוצרי {מותג} – קטלוג מלא ומחירים | [שם העסק]`
  - Project: `{פרויקט}: כל החומרים והכלים שצריך | [שם העסק]`
- Structured data (JSON-LD): `Organization` + `HardwareStore` (LocalBusiness subtype) site-wide; `BreadcrumbList` everywhere; `Product` + `Offer` (price, ILS, availability) on product pages; `AggregateRating`/`Review` only when real reviews exist; `FAQPage` on category/product FAQs; `Article` on guides; `ItemList` on category pages.
- Internal linking mesh: category ↔ projects ↔ guides ↔ brands ↔ professions. Each guide links 3+ products and 1+ category; each category bottom links related projects and guides.
- Technical: SSR/SSG pages, `sitemap.xml` split (categories/products/brands/guides), `robots.txt`, faceted-URL control, image `alt` in Hebrew, 301 map from any old URLs.
- Local: Google Business Profile consistency (NAP matches footer), `/store` page with map, hours, service areas.

---

## Discovery methods (the 5 pillars)

| Method | Entry points |
|---|---|
| By product | Search (header), product rails |
| By category | Mega menu, "מה אתם מחפשים?", quick chips |
| By brand | /brands, brand strip, search brand group, brand filter |
| By profession | "מה המקצוע שלכם?", /pros/{profession}, drawer tab |
| By project | "מה אתם רוצים לעשות?", /projects/{project}, drawer tab |

## Performance budget

- LCP < 2.0s (4G mobile), CLS < 0.05, INP < 200ms.
- Hero image: AVIF/WebP, `priority`, sized srcset; everything else lazy.
- JS on product page < 120KB gz; mega menu and search dropdown hydrate on interaction.
- One self-hosted font family, 4 weights, subset.
- Third parties (analytics, WhatsApp, maps) loaded after interaction/idle; map is a static image until clicked.

## Admin (owner-facing)

Products (bulk CSV import/export, variants, images drag-drop) · Prices & stock (inline edit table) · Categories (drag to reorder, SEO fields) · Brands · Promotions & coupons · Orders · Customers (flag as "קבלן" → pro pricing tier) · Quote requests inbox · Contractor inquiries · Homepage blocks (which rails/banners show) · Text pages.

## Placeholders to be supplied by the owner

[שם העסק] · [לוגו] · [טלפון] · [WhatsApp] · [כתובת] · [שעות פעילות] · [אזורי משלוח] · [מחיר משלוח] · [סכום למשלוח חינם] · [אימייל] · [שנות ניסיון] · [זמן אספקה] · [מספר תשלומים] · real store/team photos · real reviews · legal texts.

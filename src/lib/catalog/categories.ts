import type { Category } from "./types";

const seo = (name: string) => ({
  seoTitle: `${name} – מבחר גדול ומחירים משתלמים`,
  seoDescription: `${name} מהמותגים המובילים, עם ייעוץ מקצועי, משלוחים לכל הארץ ואיסוף עצמי. מחירים מיוחדים לקבלנים ואנשי מקצוע.`,
});

export const categories: Category[] = [
  {
    slug: "building-materials",
    name: "חומרי בניין",
    art: { kind: "bag", color: "#8A8F96", label: "CEMENT" },
    intro:
      "מלט, טיט, בלוקים, ברזל ותערובות מוכנות לעבודות בנייה ושיפוץ. זמינים במלאי, עם אפשרות למשלוח משטחים לאתר.",
    ...seo("חומרי בניין"),
    seoBody: [
      { heading: "איך בוחרים חומרי בניין לפרויקט?", text: "ההתאמה מתחילה בסוג העבודה: יציקה, בנייה בבלוקים, טיח או תיקון. לכל שימוש יש תערובת מתאימה ויחס מים שונה. אם אתם לא בטוחים — שלחו לנו את פרטי העבודה ונעזור להרכיב רשימה." },
      { heading: "הזמנות בכמויות גדולות", text: "לפרויקטים ולקבלנים אנחנו מציעים תמחור לפי כמות ואספקה ישירה לאתר. אפשר לשלוח כתב כמויות דרך טופס הצעת המחיר." },
    ],
    faq: [
      { q: "אפשר להזמין משטח שלם?", a: "כן. להזמנת משטחים ולמשלוחי מנוף מומלץ לבקש הצעת מחיר כדי שנתאם אספקה מסודרת." },
      { q: "כמה שקי מלט צריך ליציקה?", a: "זה תלוי בנפח וביחס התערובת. שלחו לנו מידות ונחשב עבורכם." },
    ],
    subs: [
      { slug: "cement-concrete", name: "מלט ובטון", art: { kind: "bag", color: "#8A8F96", label: "CEMENT" } },
      { slug: "mortar-sand", name: "טיט וחול", art: { kind: "bag", color: "#B59E7A", label: "MORTAR" } },
      { slug: "blocks", name: "בלוקים", art: { kind: "block", color: "#9CA3AA" } },
      { slug: "rebar", name: "מוטות ברזל ורשתות", art: { kind: "profile", color: "#5B6168" } },
      { slug: "ready-mixes", name: "תערובות מוכנות", art: { kind: "bag", color: "#C9B48E", label: "MIX" } },
      { slug: "concrete-additives", name: "תוספים לבטון", art: { kind: "bottle", color: "#3E6FB0", label: "ADD" } },
      { slug: "insulation", name: "יריעות ובידוד", art: { kind: "board", color: "#E7D9B8" } },
    ],
    filters: ["משקל", "שימוש"],
  },
  {
    slug: "paint",
    name: "צבע",
    art: { kind: "bucket", color: "#FFFFFF", label: "PAINT" },
    intro:
      "צבעי פנים וחוץ, יסודות, שפכטלים ואביזרי צביעה מהמותגים המובילים. אפשר לבחור גוון ונפח ולהזמין הכול לצביעה אחת.",
    ...seo("צבע"),
    seoBody: [
      { heading: "צבע פנים או צבע חוץ?", text: "צבעי חוץ עמידים יותר לשמש, לגשם ולשינויי טמפרטורה. לקירות פנים בחדרים רטובים כדאי לבחור צבע רחיץ ועמיד לעובש." },
      { heading: "כמה צבע צריך?", text: "ככלל, ליטר צבע מכסה כ-8–12 מ\"ר בשכבה אחת, בהתאם למוצר ולמשטח. תמיד כדאי לתכנן שתי שכבות." },
    ],
    faq: [
      { q: "אפשר להזמין גוון מיוחד?", a: "כן. כתבו לנו את קוד הגוון בהערות או ב-WhatsApp ונבדוק זמינות." },
      { q: "מה צריך מלבד הצבע?", a: "בדרך כלל רולר, מברשת, מגש, ניילון כיסוי ומסקינג טייפ. תמצאו אותם בדף כל מוצר תחת \"מוצרים משלימים\"." },
    ],
    subs: [
      { slug: "interior-paint", name: "צבע פנים", art: { kind: "bucket", color: "#FFFFFF", label: "INT" } },
      { slug: "exterior-paint", name: "צבע חוץ", art: { kind: "bucket", color: "#D9D4C7", label: "EXT" } },
      { slug: "wood-metal-paint", name: "צבע לעץ ולמתכת", art: { kind: "bucket", color: "#6B4F3A", label: "ENAMEL" } },
      { slug: "primers", name: "יסוד ופריימר", art: { kind: "bucket", color: "#EDEBE6", label: "PRIMER" } },
      { slug: "putty", name: "שפכטל ומרק", art: { kind: "bucket", color: "#F4F1EA", label: "PUTTY" } },
      { slug: "spray-paint", name: "ספריי צבע", art: { kind: "spray", color: "#1A56A8" } },
      { slug: "rollers", name: "רולרים", art: { kind: "roller", color: "#1A56A8" } },
      { slug: "brushes", name: "מברשות", art: { kind: "brush", color: "#C08A4B" } },
      { slug: "painting-accessories", name: "מגשים ואביזרי צביעה", art: { kind: "tape", color: "#E9D9A6" } },
      { slug: "thinners", name: "מדללים וממיסים", art: { kind: "bottle", color: "#8A8F96", label: "THIN" } },
    ],
    filters: ["נפח", "גימור", "גוון"],
  },
  {
    slug: "sealing-adhesives",
    name: "איטום והדבקה",
    shortName: "איטום",
    art: { kind: "tube", color: "#EDEBE6", label: "SEAL" },
    intro:
      "חומרי איטום לגגות ולחדרים רטובים, סיליקונים, דבקים, קצף פוליאוריתן ופריימרים — לכל עבודת איטום, מתיקון קטן ועד גג שלם.",
    ...seo("חומרי איטום והדבקה"),
    seoBody: [
      { heading: "איך בוחרים חומר איטום?", text: "בחירה נכונה תלויה במשטח (בטון, פח, אריחים), בחשיפה לשמש ולמים ובתנועה של המבנה. לגגות משתמשים לרוב ביריעות או בחומרים ביטומניים ואקריליים, ולחדרים רטובים בחומרים צמנטיים גמישים." },
      { heading: "סיליקון או דבק פוליאוריתני?", text: "סיליקון מתאים לאיטום מפגשים סביב כיורים, אמבטיות וחלונות. דבק פוליאוריתני חזק יותר ומתאים להדבקה ולאיטום מפרקים בבנייה." },
    ],
    faq: [
      { q: "מתי הזמן הנכון לאטום גג?", a: "מומלץ לאטום בעונה יבשה, לפני החורף, כשהמשטח נקי ויבש לחלוטין." },
      { q: "האם צריך פריימר לפני איטום?", a: "ברוב המערכות כן. הפריימר משפר הדבקות ומאריך את חיי האיטום. פרטים בהוראות כל מוצר." },
    ],
    subs: [
      { slug: "roof-sealing", name: "איטום גגות", art: { kind: "bucket", color: "#F4F1EA", label: "ROOF" } },
      { slug: "silicones", name: "סיליקונים", art: { kind: "tube", color: "#FFFFFF", label: "SIL" } },
      { slug: "adhesives", name: "דבקים", art: { kind: "tube", color: "#E4B343", label: "GLUE" } },
      { slug: "sealants", name: "חומרי איטום", art: { kind: "bucket", color: "#5B6168", label: "SEAL" } },
      { slug: "pu-foam", name: "פוליאוריתן (קצף)", art: { kind: "foam", color: "#E4B343" } },
      { slug: "primers-sealing", name: "פריימרים", art: { kind: "bucket", color: "#2B2F34", label: "PRIMER" } },
      { slug: "fillers", name: "חומרי מילוי", art: { kind: "tube", color: "#D9D4C7", label: "FILL" } },
      { slug: "wet-rooms", name: "איטום חדרים רטובים", art: { kind: "bucket", color: "#8FB3DA", label: "WET" } },
    ],
    filters: ["נפח", "גוון", "שימוש"],
  },
  {
    slug: "drywall",
    name: "גבס",
    art: { kind: "board", color: "#EDEBE6" },
    intro: "לוחות גבס, פרופילים, ברגים, שפכטל וסרטים — כל מה שצריך לבניית קירות, תקרות ונישות.",
    ...seo("גבס ומערכות גבס"),
    seoBody: [
      { heading: "איזה לוח גבס מתאים?", text: "לוח לבן לשימוש רגיל, ירוק לחדרים רטובים ולוח אדום/ורוד לעמידות אש. לתקרות משתמשים לרוב בלוחות דקים יותר." },
      { heading: "מערכת שלמה בהזמנה אחת", text: "לקיר גבס צריך מסלולים, ניצבים, לוחות, ברגים, סרט ושפכטל. בדף \"בניית קיר גבס\" ריכזנו הכול." },
    ],
    faq: [
      { q: "כמה לוחות צריך לקיר?", a: "לוח סטנדרטי מכסה כ-3 מ\"ר. לקיר דו-צדדי מכפילים. שלחו מידות ונחשב." },
      { q: "אפשר לקבל משלוח לוחות?", a: "כן, באזורי המשלוח שלנו. להזמנות גדולות מומלץ לבקש הצעת מחיר." },
    ],
    subs: [
      { slug: "boards", name: "לוחות גבס", art: { kind: "board", color: "#EDEBE6" } },
      { slug: "profiles", name: "פרופילים ומסלולים", art: { kind: "profile", color: "#A9AFB5" } },
      { slug: "drywall-screws", name: "ברגים לגבס", art: { kind: "screws", color: "#2B2F34" } },
      { slug: "joint", name: "שפכטל וסרטי גבס", art: { kind: "tape", color: "#F4F1EA" } },
      { slug: "acoustic", name: "בידוד אקוסטי", art: { kind: "board", color: "#E4D29A" } },
      { slug: "corner-beads", name: "פינות מגן", art: { kind: "profile", color: "#D0D4D8" } },
      { slug: "drywall-tools", name: "כלים לגבס", art: { kind: "trowel", color: "#5B6168" } },
    ],
    filters: ["עובי", "סוג לוח"],
  },
  {
    slug: "plumbing",
    name: "אינסטלציה",
    art: { kind: "pipe", color: "#C97B4A" },
    intro: "צנרת ומחברים, ניקוז, סיפונים, ברזי ניל ומשאבות — לאינסטלטורים ולתיקונים בבית.",
    ...seo("אינסטלציה"),
    seoBody: [
      { heading: "מערכות צנרת נפוצות", text: "בבתים בישראל נפוצים צנרת PEX ומערכות רב-שכבתיות למים, ו-PVC לניקוז. חשוב להתאים מחברים לאותה מערכת." },
      { heading: "תיקון מהיר או החלפה?", text: "לתיקונים נקודתיים יש מחברי תיקון ומופות. לדליפה חוזרת כדאי להתייעץ לפני קנייה." },
    ],
    faq: [
      { q: "יש מחברים לכל הקטרים?", a: "יש מבחר רחב של קטרים נפוצים. אם חסר לכם מידה, כתבו לנו ונבדוק." },
      { q: "אפשר להתייעץ עם אינסטלטור?", a: "הצוות שלנו ישמח לעזור בבחירת מוצרים. לא מבצעים התקנות." },
    ],
    subs: [
      { slug: "pipes-fittings", name: "צנרת ומחברים", art: { kind: "pipe", color: "#C97B4A" } },
      { slug: "drainage", name: "ניקוז וביוב", art: { kind: "pipe", color: "#8A8F96" } },
      { slug: "water-heaters", name: "מים חמים ודודים", art: { kind: "bottle", color: "#EDEBE6", label: "HOT" } },
      { slug: "pumps", name: "משאבות", art: { kind: "grinder", color: "#1A56A8" } },
      { slug: "valves", name: "ברזי ניל וכדוריים", art: { kind: "faucet", color: "#C9A227" } },
      { slug: "siphons", name: "סיפונים", art: { kind: "pipe", color: "#FFFFFF" } },
      { slug: "plumbing-tools", name: "כלים לאינסטלציה", art: { kind: "hammer", color: "#B42318" } },
    ],
    filters: ["קוטר", "חומר"],
  },
  {
    slug: "electrical",
    name: "חשמל",
    art: { kind: "socket", color: "#FFFFFF" },
    intro: "כבלים, שקעים ומפסקים, תאורה, לוחות חשמל ואביזרים — מוצרים תקניים לחשמלאים ולבית.",
    ...seo("מוצרי חשמל ותאורה"),
    seoBody: [
      { heading: "מוצרים תקניים בלבד", text: "עבודות חשמל חייבות להתבצע בידי חשמלאי מוסמך. אנחנו מספקים מוצרים ואביזרים לפי התקן הישראלי." },
      { heading: "סדרות שקעים ומפסקים", text: "כדאי לבחור סדרה אחת לכל הבית כדי לשמור על מראה אחיד. בדף כל סדרה תמצאו מסגרות ומנגנונים תואמים." },
    ],
    faq: [
      { q: "יש כבלים בחיתוך לפי מטר?", a: "חלק מהכבלים נמכרים בגליל וחלק לפי מטר — מפורט בכל מוצר." },
      { q: "מה ההבדל בין מאמ\"ת לפחת?", a: "מאמ\"ת מגן מפני עומס וקצר; ממסר פחת מגן מפני התחשמלות. חשמלאי יקבע מה נדרש." },
    ],
    subs: [
      { slug: "cables", name: "כבלים וחוטים", art: { kind: "cable", color: "#1C1F23" } },
      { slug: "sockets-switches", name: "שקעים ומפסקים", art: { kind: "socket", color: "#FFFFFF" } },
      { slug: "lighting", name: "תאורה", art: { kind: "bulb", color: "#F2C94C" } },
      { slug: "panels", name: "לוחות חשמל ומאמ\"תים", art: { kind: "socket", color: "#E8E6E1" } },
      { slug: "conduits", name: "צנרת ותעלות", art: { kind: "pipe", color: "#D0D4D8" } },
      { slug: "extensions", name: "מאריכים", art: { kind: "cable", color: "#F4F1EA" } },
      { slug: "testers", name: "כלי בדיקה", art: { kind: "level", color: "#E4B343" } },
    ],
    filters: ["גוון", "סדרה"],
  },
  {
    slug: "tools",
    name: "כלי עבודה",
    art: { kind: "drill", color: "#1A56A8" },
    intro: "כלים חשמליים ונטענים, כלי יד, מדידה, דיסקים ומקדחים ממותגי המקצוענים.",
    ...seo("כלי עבודה"),
    seoBody: [
      { heading: "נטען או חשמלי?", text: "כלים נטענים נותנים חופש תנועה ונוחות באתר. כלים חשמליים מתאימים לעבודה רציפה ועומס גבוה. כדאי להישאר בפלטפורמת סוללות אחת." },
      { heading: "גוף בלבד או ערכה?", text: "אם כבר יש לכם סוללות מאותה פלטפורמה, \"גוף בלבד\" חוסך כסף. לרכישה ראשונה עדיף ערכה עם סוללות ומטען." },
    ],
    faq: [
      { q: "יש אחריות על הכלים?", a: "הכלים מגיעים עם אחריות יבואן רשמי. פרטי האחריות מופיעים בכל מוצר." },
      { q: "אפשר להתייעץ לפני קנייה?", a: "בטח. כתבו לנו ב-WhatsApp איזה עבודות אתם מבצעים ונמליץ." },
    ],
    subs: [
      { slug: "power-tools", name: "כלים חשמליים", art: { kind: "grinder", color: "#1A56A8" } },
      { slug: "cordless", name: "כלים נטענים", art: { kind: "drill", color: "#1A56A8" } },
      { slug: "batteries", name: "סוללות ומטענים", art: { kind: "block", color: "#2B2F34" } },
      { slug: "hand-tools", name: "כלי יד", art: { kind: "hammer", color: "#2B2F34" } },
      { slug: "measuring", name: "מדידה ופילוס", art: { kind: "level", color: "#E4B343" } },
      { slug: "bits-discs", name: "דיסקים ומקדחים", art: { kind: "screws", color: "#8A8F96" } },
      { slug: "storage", name: "אחסון וארגזי כלים", art: { kind: "block", color: "#1A56A8" } },
      { slug: "ladders", name: "סולמות", art: { kind: "profile", color: "#A9AFB5" } },
    ],
    filters: ["מתח", "כולל סוללה"],
  },
  {
    slug: "bath-faucets",
    name: "ברזים ואמבטיה",
    shortName: "ברזים",
    art: { kind: "faucet", color: "#C0C6CC" },
    intro: "ברזי מטבח ואמבטיה, סוללות מקלחת, ראשי מקלחת ואביזרים — בעיצוב מודרני ובאיכות לאורך שנים.",
    ...seo("ברזים ואמבטיה"),
    seoBody: [
      { heading: "איך בוחרים ברז למטבח?", text: "שימו לב לגובה הברז ביחס לכיור, לסוג הידית ולאפשרות לשלוף ראש. ברז נשלף נוח במיוחד לכיורים גדולים." },
      { heading: "גימורים", text: "כרום נשאר הבחירה הקלאסית, ושחור מט ונירוסטה מוברשת מתאימים לעיצוב מודרני." },
    ],
    faq: [
      { q: "הברזים מגיעים עם צינורות חיבור?", a: "ברוב הדגמים כן. פירוט מלא בכל מוצר." },
      { q: "יש חלקי חילוף?", a: "לרוב הדגמים יש חלקי חילוף דרך היבואן. פנו אלינו ונבדוק." },
    ],
    subs: [
      { slug: "kitchen-faucets", name: "ברזי מטבח", art: { kind: "faucet", color: "#C0C6CC" } },
      { slug: "basin-faucets", name: "ברזי כיור", art: { kind: "faucet", color: "#2B2F34" } },
      { slug: "shower-mixers", name: "סוללות מקלחת", art: { kind: "shower", color: "#C0C6CC" } },
      { slug: "shower-heads", name: "ראשי מקלחת", art: { kind: "shower", color: "#2B2F34" } },
      { slug: "toilets", name: "אסלות ומיכלים", art: { kind: "bottle", color: "#FFFFFF", label: "WC" } },
      { slug: "bath-cabinets", name: "ארונות אמבטיה", art: { kind: "block", color: "#D9CBB5" } },
      { slug: "bath-accessories", name: "אביזרי אמבטיה", art: { kind: "profile", color: "#C0C6CC" } },
    ],
    filters: ["גימור"],
  },
  {
    slug: "tiling",
    name: "ריצוף וקרמיקה",
    shortName: "ריצוף",
    art: { kind: "tile", color: "#D9D4C7" },
    intro: "דבקי קרמיקה, רובה, ספייסרים, פרופילי גמר וכלי ריצוף — להדבקה נכונה ולגמר נקי.",
    ...seo("חומרים וכלים לריצוף וקרמיקה"),
    seoBody: [
      { heading: "איזה דבק קרמיקה לבחור?", text: "לאריחים גדולים ולפורצלן צריך דבק משופר וגמיש. לחוץ ולמרפסות בחרו דבק עמיד למים ולשינויי טמפרטורה." },
      { heading: "רובה אפוקסית או צמנטית?", text: "רובה אפוקסית עמידה במיוחד לכתמים ולמים ומתאימה למטבחים ולמקלחות. רובה צמנטית קלה יותר לעבודה." },
    ],
    faq: [
      { q: "כמה דבק צריך למ\"ר?", a: "בדרך כלל 4–6 ק\"ג למ\"ר, תלוי בגודל האריח ובמסרק." },
      { q: "יש רובה בכל הגוונים?", a: "יש מבחר גוונים נפוץ. גוון מיוחד — כתבו לנו." },
    ],
    subs: [
      { slug: "tile-adhesive", name: "דבקי קרמיקה", art: { kind: "bag", color: "#EDEBE6", label: "C2TE" } },
      { slug: "grout", name: "רובה", art: { kind: "bucket", color: "#8A8F96", label: "GROUT" } },
      { slug: "spacers", name: "ספייסרים ופילוס", art: { kind: "screws", color: "#1A56A8" } },
      { slug: "trims", name: "פרופילי גמר", art: { kind: "profile", color: "#C0C6CC" } },
      { slug: "tiling-tools", name: "מאלג'ים וכלי ריצוף", art: { kind: "trowel", color: "#2B2F34" } },
      { slug: "tile-care", name: "ניקוי ותחזוקת ריצוף", art: { kind: "bottle", color: "#1F7A4D", label: "CLEAN" } },
    ],
    filters: ["משקל", "גוון"],
  },
  {
    slug: "fasteners",
    name: "ברגים ופרזול",
    shortName: "פרזול",
    art: { kind: "screws", color: "#8A8F96" },
    intro: "ברגים, דיבלים, עוגנים, צירים, ידיות ומנעולים — במגוון מידות, באריזות לבית ולמקצוענים.",
    ...seo("ברגים ופרזול"),
    seoBody: [
      { heading: "איך בוחרים בורג?", text: "סוג החומר (עץ, בטון, גבס, מתכת) קובע את סוג הבורג והדיבל. אורך הבורג צריך להיות לפחות פי 2.5 מעובי החלק שמחברים." },
      { heading: "אריזות מקצועיות", text: "לאנשי מקצוע יש אריזות גדולות במחיר משתלם יותר ליחידה." },
    ],
    faq: [
      { q: "יש ברגים בודדים?", a: "רוב הברגים נמכרים באריזות. אם צריך כמות קטנה — כתבו לנו." },
      { q: "איזה דיבל לקיר בלוקים?", a: "לבלוק חלול מומלץ דיבל ארוך עם כנפיים. להתייעצות — WhatsApp." },
    ],
    subs: [
      { slug: "screws", name: "ברגים", art: { kind: "screws", color: "#8A8F96" } },
      { slug: "anchors", name: "דיבלים ועוגנים", art: { kind: "screws", color: "#E4B343" } },
      { slug: "nails", name: "מסמרים", art: { kind: "screws", color: "#5B6168" } },
      { slug: "hinges-handles", name: "צירים וידיות", art: { kind: "lock", color: "#C0C6CC" } },
      { slug: "locks", name: "מנעולים", art: { kind: "lock", color: "#C9A227" } },
      { slug: "brackets", name: "מתלים וזוויות", art: { kind: "profile", color: "#8A8F96" } },
      { slug: "chains", name: "שרשראות וכבלים", art: { kind: "cable", color: "#8A8F96" } },
    ],
    filters: ["אורך", "חומר"],
  },
  {
    slug: "wood",
    name: "עץ",
    art: { kind: "plank", color: "#C8A27A" },
    intro: "לוחות, קורות, דק, לכות ושמנים לעץ — לעבודות נגרות, גינה ושיפוץ.",
    ...seo("עץ ומוצרי עץ"),
    seoBody: [
      { heading: "איזה עץ לדק?", text: "לדק חוץ בוחרים עץ מוקשה או עץ טרופי, או דק סינתטי שדורש פחות תחזוקה." },
      { heading: "שמירה על העץ", text: "שמן או לכה מתאימים מאריכים את חיי העץ. בחוץ מומלץ לחדש פעם בשנה." },
    ],
    faq: [
      { q: "חותכים לפי מידה?", a: "[יש לעדכן — האם קיים שירות חיתוך]" },
      { q: "יש משלוח לקורות ארוכות?", a: "כן באזורי המשלוח. לאורכים חריגים נתאם מראש." },
    ],
    subs: [
      { slug: "boards-mdf", name: "לוחות סנדוויץ' ו-MDF", art: { kind: "board", color: "#D9BF9A" } },
      { slug: "beams", name: "קורות ופרופילי עץ", art: { kind: "plank", color: "#B98D5F" } },
      { slug: "decking", name: "דק", art: { kind: "plank", color: "#8C5E3C" } },
      { slug: "wood-finish", name: "לכות ושמנים לעץ", art: { kind: "bucket", color: "#8C5E3C", label: "OIL" } },
      { slug: "wood-glue", name: "דבק לעץ", art: { kind: "bottle", color: "#E4B343", label: "WOOD" } },
    ],
    filters: ["אורך", "סוג עץ"],
  },
  {
    slug: "garden",
    name: "גינה וחוץ",
    shortName: "גינה",
    art: { kind: "hose", color: "#2F7D4F" },
    intro: "השקיה, כלי גינה, גידור והצללה — לגינה, למרפסת ולחצר.",
    ...seo("גינה וחוץ"),
    seoBody: [
      { heading: "מערכת השקיה בסיסית", text: "מחשב השקיה, צינור ראשי, טפטפות ומחברים — ומקבלים גינה שמשקה את עצמה." },
      { heading: "כלים לגינון", text: "מזמרה, מגרפה ואת חפירה איכותיים הם הבסיס לכל גינה." },
    ],
    faq: [
      { q: "יש ייעוץ לתכנון השקיה?", a: "כן. שלחו תמונה של הגינה ומידות ונעזור." },
      { q: "הצינורות עמידים לשמש?", a: "רוב הצינורות מיוצבים ל-UV. פרטים בכל מוצר." },
    ],
    subs: [
      { slug: "irrigation", name: "השקיה", art: { kind: "hose", color: "#2F7D4F" } },
      { slug: "garden-tools", name: "כלי גינה", art: { kind: "trowel", color: "#2F7D4F" } },
      { slug: "lawn", name: "דשא וזרעים", art: { kind: "bag", color: "#5E9E5A", label: "SEED" } },
      { slug: "outdoor-furniture", name: "ריהוט חוץ", art: { kind: "plank", color: "#6B4F3A" } },
      { slug: "fencing", name: "גידור", art: { kind: "profile", color: "#2F7D4F" } },
      { slug: "shading", name: "פתרונות הצללה", art: { kind: "board", color: "#D9D4C7" } },
    ],
    filters: ["אורך", "קוטר"],
  },
  {
    slug: "safety",
    name: "בטיחות וביגוד עבודה",
    shortName: "בטיחות",
    art: { kind: "helmet", color: "#F2C94C" },
    intro: "כפפות, נעלי עבודה, משקפי מגן, מסכות וביגוד — ציוד מגן תקני לעבודה בטוחה.",
    ...seo("ציוד בטיחות וביגוד עבודה"),
    seoBody: [
      { heading: "ציוד מגן לפי סוג העבודה", text: "בעבודות חיתוך וליטוש — משקפיים, אוזניות ומסכה. בעבודה בגובה — רתמה תקנית ונקודת עיגון." },
      { heading: "הזמנות לצוותים", text: "לחברות ולקבלנים יש תמחור לכמויות. בקשו הצעת מחיר." },
    ],
    faq: [
      { q: "יש מידות לכל הצוות?", a: "יש מידות נפוצות. לכמויות גדולות נבדוק זמינות." },
      { q: "הציוד תקני?", a: "המוצרים עומדים בתקנים הרלוונטיים — מפורט בכל מוצר." },
    ],
    subs: [
      { slug: "gloves", name: "כפפות", art: { kind: "gloves", color: "#E4B343" } },
      { slug: "work-shoes", name: "נעלי עבודה", art: { kind: "block", color: "#3A2F28" } },
      { slug: "eye-protection", name: "משקפי מגן", art: { kind: "helmet", color: "#8FB3DA" } },
      { slug: "masks", name: "מסכות והגנת נשימה", art: { kind: "helmet", color: "#EDEBE6" } },
      { slug: "ear-protection", name: "אוזניות", art: { kind: "helmet", color: "#B42318" } },
      { slug: "workwear", name: "ביגוד עבודה", art: { kind: "gloves", color: "#2B2F34" } },
      { slug: "fall-protection", name: "רתמות וגובה", art: { kind: "cable", color: "#E4B343" } },
    ],
    filters: ["מידה"],
  },
  {
    slug: "cleaning",
    name: "ניקיון ותחזוקה",
    shortName: "ניקיון",
    art: { kind: "bottle", color: "#1F7A4D", label: "CLEAN" },
    intro: "חומרי ניקוי מקצועיים, שואבים, מסירי אבנית ושקיות פסולת בנייה — לסיום עבודה נקי.",
    ...seo("ניקיון ותחזוקה"),
    seoBody: [
      { heading: "ניקיון אחרי שיפוץ", text: "אבק בנייה ושאריות מלט דורשים חומרים ייעודיים. מסיר מלט ושואב אבק תעשייתי חוסכים שעות עבודה." },
      { heading: "תחזוקה שוטפת", text: "שמנים, משחות וחומרי תחזוקה שומרים על הכלים ועל המשטחים לאורך זמן." },
    ],
    faq: [
      { q: "יש שקיות לפסולת בנייה?", a: "כן, שקי בנייה חזקים בכמה גדלים." },
      { q: "איזה שואב מתאים לאבק גבס?", a: "שואב תעשייתי עם פילטר מתאים לאבק עדין. נשמח להמליץ." },
    ],
    subs: [
      { slug: "pro-cleaners", name: "חומרי ניקוי מקצועיים", art: { kind: "bottle", color: "#1F7A4D", label: "PRO" } },
      { slug: "vacuums", name: "שואבים", art: { kind: "grinder", color: "#B42318" } },
      { slug: "descalers", name: "מסירי שומנים ואבנית", art: { kind: "bottle", color: "#1A56A8", label: "CALC" } },
      { slug: "waste-bags", name: "שקיות ופסולת בנייה", art: { kind: "bag", color: "#2B2F34", label: "BAG" } },
      { slug: "lubricants", name: "שמנים ומשחות", art: { kind: "spray", color: "#1F7A4D" } },
    ],
    filters: ["נפח"],
  },
];

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getSub(categorySlug: string, subSlug: string) {
  return getCategory(categorySlug)?.subs.find((s) => s.slug === subSlug);
}

/** Primary categories shown inline in the desktop nav bar (the rest live in the mega menu). */
export const navCategorySlugs = [
  "building-materials",
  "paint",
  "sealing-adhesives",
  "drywall",
  "plumbing",
  "electrical",
  "tools",
  "bath-faucets",
];

/** Mosaic tiles for "מה אתם מחפשים?" — top row 2, bottom row 3. */
export const homeCategoryMosaic: {
  title: string;
  href: string;
  art: import("./types").Art;
  /** Text on light vs dark photo. */
  ink: "light" | "dark";
  /** Atmospheric scene tones until real photos replace them. */
  scene: { from: string; via: string; to: string };
  /** Optional real photo under /public. */
  image?: string;
}[] = [
  { title: "ברזים", href: "/c/bath-faucets", art: { kind: "faucet", color: "#C0C6CC" }, ink: "light", scene: { from: "#2a2e33", via: "#5a6169", to: "#9aa3ab" }, image: "/categories/faucets-v2.png" },
  { title: "צבעים לעץ", href: "/c/paint/wood-metal-paint", art: { kind: "brush", color: "#8C5E3C" }, ink: "dark", scene: { from: "#c4a574", via: "#e8d4b0", to: "#f3ead8" }, image: "/categories/wood-paint.png" },
  { title: "דבקים לקרמיקה", href: "/c/tiling", art: { kind: "tile", color: "#D9D4C7" }, ink: "dark", scene: { from: "#d8d4cc", via: "#f0eeea", to: "#ffffff" }, image: "/categories/eladbrami-01932.png" },
  { title: "לוחות גבס", href: "/c/drywall/boards", art: { kind: "board", color: "#7BA05B" }, ink: "light", scene: { from: "#3d5c38", via: "#6a9a5e", to: "#a8c99a" }, image: "/categories/images.png" },
  { title: "חומרי איטום והדבקה", href: "/c/sealing-adhesives", art: { kind: "bucket", color: "#2B2F34" }, ink: "light", scene: { from: "#1a1c1e", via: "#3a3f45", to: "#6b7280" }, image: "/categories/image.png" },
];

/** Compact category chips (search empty state, 404, etc.). */
export const homeCategoryCards: { title: string; href: string; art: import("./types").Art }[] = [
  { title: "צבע", href: "/c/paint", art: { kind: "bucket", color: "#FFFFFF", label: "PAINT" } },
  { title: "חומרי איטום", href: "/c/sealing-adhesives", art: { kind: "bucket", color: "#8FB3DA", label: "SEAL" } },
  { title: "כלי עבודה", href: "/c/tools", art: { kind: "drill", color: "#1A56A8" } },
  { title: "אינסטלציה", href: "/c/plumbing", art: { kind: "pipe", color: "#C97B4A" } },
  { title: "חשמל", href: "/c/electrical", art: { kind: "socket", color: "#FFFFFF" } },
  { title: "גבס", href: "/c/drywall", art: { kind: "board", color: "#EDEBE6" } },
  { title: "ברזים", href: "/c/bath-faucets", art: { kind: "faucet", color: "#C0C6CC" } },
  { title: "דבקים", href: "/c/sealing-adhesives/adhesives", art: { kind: "tube", color: "#E4B343", label: "GLUE" } },
  { title: "עץ", href: "/c/wood", art: { kind: "plank", color: "#C8A27A" } },
  { title: "גינה", href: "/c/garden", art: { kind: "hose", color: "#2F7D4F" } },
  { title: "פרזול", href: "/c/fasteners", art: { kind: "screws", color: "#8A8F96" } },
  { title: "חומרי בניין", href: "/c/building-materials", art: { kind: "bag", color: "#8A8F96", label: "CEMENT" } },
];

/** Quick shortcut chips. */
export const quickShortcuts: { title: string; href: string; art: import("./types").Art }[] = [
  { title: "רולרים", href: "/c/paint/rollers", art: { kind: "roller", color: "#1A56A8" } },
  { title: "ברזים", href: "/c/bath-faucets/kitchen-faucets", art: { kind: "faucet", color: "#C0C6CC" } },
  { title: "ספריי צבע", href: "/c/paint/spray-paint", art: { kind: "spray", color: "#B42318" } },
  { title: "שקעים", href: "/c/electrical/sockets-switches", art: { kind: "socket", color: "#FFFFFF" } },
  { title: "איטום", href: "/c/sealing-adhesives/sealants", art: { kind: "bucket", color: "#5B6168", label: "SEAL" } },
  { title: "צבעים", href: "/c/paint/interior-paint", art: { kind: "bucket", color: "#FFFFFF", label: "INT" } },
  { title: "גבס", href: "/c/drywall/boards", art: { kind: "board", color: "#EDEBE6" } },
  { title: "סילרים", href: "/c/sealing-adhesives/silicones", art: { kind: "tube", color: "#FFFFFF", label: "SIL" } },
  { title: "ברגים", href: "/c/fasteners/screws", art: { kind: "screws", color: "#8A8F96" } },
  { title: "כפפות", href: "/c/safety/gloves", art: { kind: "gloves", color: "#E4B343" } },
];

import type { Guide, Profession, Project } from "./types";

export const professions: Profession[] = [
  {
    slug: "contractors", name: "לקבלנים", title: "קבלנים וחברות בנייה", icon: "building",
    intro: "חומרי בניין בכמויות, אספקה לאתר ותמחור לפרויקטים. שלחו כתב כמויות ונחזור עם הצעת מחיר.",
    categories: [{ category: "building-materials" }, { category: "drywall" }, { category: "sealing-adhesives" }, { category: "safety" }],
    productIds: ["portland-cement-50", "ready-plaster-40", "drywall-board-12-5", "tile-adhesive-c2te", "construction-waste-bags", "nitrile-gloves-12", "cordless-hammer-drill-18v", "concrete-waterproof-additive"],
    projects: ["drywall-wall", "roof-sealing", "tiling"],
  },
  {
    slug: "painters", name: "לצבעים", title: "צבעים", icon: "paint",
    intro: "צבעים, יסודות, שפכטלים וכל אביזרי הצביעה — גם באריזות גדולות לעבודה מקצועית.",
    categories: [{ category: "paint" }, { category: "paint", sub: "rollers" }, { category: "paint", sub: "putty" }, { category: "sealing-adhesives", sub: "fillers" }],
    productIds: ["interior-acrylic-paint", "exterior-acrylic-paint", "acrylic-primer", "ready-acrylic-putty", "microfiber-roller-25", "brush-set-3", "masking-tape-48", "cover-nylon-4x5"],
    projects: ["house-painting", "damp-repair"],
  },
  {
    slug: "plumbers", name: "לאינסטלטורים", title: "אינסטלטורים", icon: "droplets",
    intro: "צנרת, מחברים, ברזים, סיפונים וכלים — במלאי, לאיסוף מהיר בבוקר.",
    categories: [{ category: "plumbing" }, { category: "bath-faucets" }, { category: "sealing-adhesives", sub: "silicones" }],
    productIds: ["pe-quick-coupling", "pvc-drain-pipe-110", "ball-valve-half", "double-kitchen-siphon", "pull-out-kitchen-faucet", "sanitary-silicone", "pu-foam-750", "pro-silicone-gun"],
    projects: ["bathroom-renovation", "kitchen-renovation"],
  },
  {
    slug: "electricians", name: "לחשמלאים", title: "חשמלאים", icon: "zap",
    intro: "כבלים, שקעים, מפסקים, תאורה ואביזרים תקניים — לעבודה שוטפת ולפרויקטים.",
    categories: [{ category: "electrical" }, { category: "tools", sub: "measuring" }],
    productIds: ["power-cable-3x2-5", "double-socket-white", "led-bulb-12w", "extension-4-sockets", "cordless-hammer-drill-18v", "sds-bits-set", "wall-anchors-8mm", "tape-measure-8m"],
    projects: ["kitchen-renovation"],
  },
  {
    slug: "renovators", name: "לשיפוצניקים", title: "שיפוצניקים", icon: "hammer",
    intro: "כל מה שצריך לשיפוץ — מאיטום וגבס ועד צבע וכלי עבודה, בהזמנה אחת.",
    categories: [{ category: "sealing-adhesives" }, { category: "drywall" }, { category: "paint" }, { category: "tools" }],
    productIds: ["sikaflex-11fc", "drywall-board-12-5", "interior-acrylic-paint", "cordless-hammer-drill-18v", "tile-adhesive-c2te", "pu-foam-750", "wet-dry-vacuum-30", "construction-waste-bags"],
    projects: ["bathroom-renovation", "kitchen-renovation", "drywall-wall", "damp-repair"],
  },
  {
    slug: "tilers", name: "לרצפים", title: "רצפים", icon: "grid",
    intro: "דבקים, רובה, ספייסרים, פרופילים וכלי ריצוף — לעבודה מדויקת ונקייה.",
    categories: [{ category: "tiling" }, { category: "sealing-adhesives", sub: "wet-rooms" }],
    productIds: ["tile-adhesive-c2te", "flexible-grout-5", "tile-spacers-2mm", "notched-trowel-8", "cement-residue-remover", "flexible-cement-waterproofing", "aluminum-level-60", "angle-grinder-125"],
    projects: ["tiling", "bathroom-renovation"],
  },
  {
    slug: "drywall-installers", name: "לאנשי גבס", title: "אנשי גבס", icon: "layers",
    intro: "לוחות, פרופילים, ברגים, שפכטל וסרטים — מערכת גבס שלמה במקום אחד.",
    categories: [{ category: "drywall" }, { category: "fasteners" }],
    productIds: ["drywall-board-12-5", "drywall-stud-70", "drywall-screws-1000", "joint-compound-20", "joint-mesh-tape", "impact-driver-18v", "aluminum-level-60", "ffp2-mask-10"],
    projects: ["drywall-wall"],
  },
  {
    slug: "diy", name: "לחובבי DIY", title: "חובבי DIY", icon: "wrench",
    intro: "מוצרים פשוטים לשימוש, מדריכים ברורים וייעוץ לפני הקנייה — לתיקונים ולשדרוגים בבית.",
    categories: [{ category: "paint" }, { category: "tools", sub: "hand-tools" }, { category: "fasteners" }, { category: "garden" }],
    productIds: ["sanitary-silicone", "acrylic-spray-paint", "wall-anchors-8mm", "claw-hammer-450", "tape-measure-8m", "led-bulb-12w", "garden-hose-20m", "multi-purpose-lubricant"],
    projects: ["house-painting", "deck-building"],
  },
];

export const projects: Project[] = [
  {
    slug: "roof-sealing", name: "איטום גג", art: { kind: "bucket", color: "#F4F1EA", label: "ROOF" },
    intro: "איטום נכון לפני החורף חוסך נזקי רטיבות יקרים. כך מתכננים את העבודה ומה צריך לקנות.",
    steps: ["ניקוי הגג והסרת איטום רופף", "תיקון סדקים ומילוי מפרקים", "יישום פריימר", "שתי שכבות חומר איטום לפחות", "בדיקה ויזואלית אחרי ייבוש"],
    required: ["acrylic-roof-sealant", "bitumen-primer"], recommended: ["sikaflex-11fc", "acrylic-crack-filler"],
    tools: ["microfiber-roller-25", "brush-set-3"], complementary: ["nitrile-gloves-12", "construction-waste-bags"],
    guides: ["choose-roof-sealant", "treat-dampness"], categories: [{ category: "sealing-adhesives", sub: "roof-sealing" }, { category: "sealing-adhesives", sub: "primers-sealing" }],
  },
  {
    slug: "house-painting", name: "צביעת הבית", art: { kind: "roller", color: "#1A56A8" },
    intro: "מהכנת הקירות ועד השכבה האחרונה — רשימת קנייה מסודרת לצביעת דירה.",
    steps: ["פינוי וכיסוי רהיטים", "מילוי סדקים ושפכטל", "שכבת יסוד", "שתי שכבות צבע", "הסרת מסקינג טייפ לפני ייבוש מלא"],
    required: ["interior-acrylic-paint", "acrylic-primer"], recommended: ["ready-acrylic-putty", "acrylic-crack-filler"],
    tools: ["microfiber-roller-25", "brush-set-3", "paint-tray-grid"], complementary: ["masking-tape-48", "cover-nylon-4x5"],
    guides: ["choose-roller", "exterior-wall-paint"], categories: [{ category: "paint", sub: "interior-paint" }, { category: "paint", sub: "rollers" }],
  },
  {
    slug: "bathroom-renovation", name: "שיפוץ חדר אמבטיה", art: { kind: "shower", color: "#C0C6CC" },
    intro: "איטום, ריצוף, ברזים וגמר — השלבים והחומרים לשיפוץ חדר רחצה.",
    steps: ["פירוק וניקוי", "איטום רצפה וקירות", "ריצוף וחיפוי", "רובה ואיטום סיליקון", "התקנת ברזים ואביזרים"],
    required: ["flexible-cement-waterproofing", "tile-adhesive-c2te", "flexible-grout-5"], recommended: ["shower-mixer-set", "basin-faucet", "sanitary-silicone"],
    tools: ["notched-trowel-8", "aluminum-level-60", "pro-silicone-gun"], complementary: ["tile-spacers-2mm", "cement-residue-remover"],
    guides: ["choose-tile-adhesive", "treat-dampness"], categories: [{ category: "sealing-adhesives", sub: "wet-rooms" }, { category: "tiling" }, { category: "bath-faucets" }],
  },
  {
    slug: "drywall-wall", name: "בניית קיר גבס", art: { kind: "board", color: "#EDEBE6" },
    intro: "קיר גבס מחלק חדר תוך יום עבודה. זה מה שצריך למערכת שלמה.",
    steps: ["סימון וקיבוע מסלולים", "העמדת ניצבים", "הברגת לוחות", "סרט ושפכטל בחיבורים", "ליטוש וצביעה"],
    required: ["drywall-board-12-5", "drywall-stud-70", "drywall-screws-1000"], recommended: ["joint-compound-20", "joint-mesh-tape"],
    tools: ["impact-driver-18v", "aluminum-level-60", "tape-measure-8m"], complementary: ["ffp2-mask-10", "acrylic-primer"],
    guides: ["drywall-types"], categories: [{ category: "drywall" }],
  },
  {
    slug: "damp-repair", name: "תיקון רטיבות", art: { kind: "bucket", color: "#8FB3DA", label: "WET" },
    intro: "רטיבות בקיר? קודם מאתרים את המקור, ואז מטפלים בחומרים הנכונים.",
    steps: ["איתור מקור הרטיבות", "הסרת טיח וצבע פגומים", "ייבוש", "איטום צמנטי", "שפכטל, יסוד וצבע"],
    required: ["flexible-cement-waterproofing"], recommended: ["concrete-waterproof-additive", "acrylic-primer"],
    tools: ["notched-trowel-8", "brush-set-3"], complementary: ["interior-acrylic-paint", "nitrile-gloves-12"],
    guides: ["treat-dampness"], categories: [{ category: "sealing-adhesives", sub: "wet-rooms" }, { category: "sealing-adhesives", sub: "sealants" }],
  },
  {
    slug: "tiling", name: "ריצוף", art: { kind: "tile", color: "#D9D4C7" },
    intro: "דבק מתאים, מישק אחיד וגמר נקי — כל מה שצריך לריצוף או חיפוי.",
    steps: ["הכנת תשתית ישרה", "פריסת דבק במאלג׳ משונן", "הנחת אריחים עם ספייסרים", "מילוי רובה", "ניקוי שאריות"],
    required: ["tile-adhesive-c2te", "flexible-grout-5"], recommended: ["tile-spacers-2mm", "cement-residue-remover"],
    tools: ["notched-trowel-8", "aluminum-level-60", "angle-grinder-125"], complementary: ["bitumen-primer", "nitrile-gloves-12"],
    guides: ["choose-tile-adhesive"], categories: [{ category: "tiling" }],
  },
  {
    slug: "deck-building", name: "בניית דק", art: { kind: "plank", color: "#8C5E3C" },
    intro: "דק עץ לחצר או למרפסת — חומרים, ברגים ושמן להגנה.",
    steps: ["תכנון ומידות", "הכנת שלד", "הברגת לוחות", "שמן להגנה", "תחזוקה שנתית"],
    required: ["hardwood-deck-board", "wood-screws-4x40"], recommended: ["deck-oil-teak"],
    tools: ["cordless-hammer-drill-18v", "aluminum-level-60", "tape-measure-8m"], complementary: ["brush-set-3", "nitrile-gloves-12"],
    guides: [], categories: [{ category: "wood", sub: "decking" }, { category: "wood", sub: "wood-finish" }],
  },
  {
    slug: "kitchen-renovation", name: "שיפוץ מטבח", art: { kind: "faucet", color: "#C0C6CC" },
    intro: "ברז, סיפון, חשמל וחיפוי — הרשימה לשיפוץ מטבח.",
    steps: ["תכנון נקודות מים וחשמל", "חיפוי קיר", "התקנת כיור וסיפון", "התקנת ברז", "איטום סיליקון"],
    required: ["pull-out-kitchen-faucet", "double-kitchen-siphon"], recommended: ["double-socket-white", "tile-adhesive-c2te", "flexible-grout-5"],
    tools: ["pro-silicone-gun", "cordless-hammer-drill-18v"], complementary: ["sanitary-silicone", "ball-valve-half"],
    guides: ["choose-tile-adhesive"], categories: [{ category: "bath-faucets", sub: "kitchen-faucets" }, { category: "plumbing", sub: "siphons" }],
  },
];

export const guides: Guide[] = [
  {
    slug: "choose-roof-sealant", title: "איך לבחור חומר איטום לגג?", category: "איטום", readMinutes: 5,
    excerpt: "אקרילי, ביטומני או יריעות? ההבדלים, היתרונות ומתי מתאים כל פתרון.",
    art: { kind: "bucket", color: "#F4F1EA", label: "ROOF" },
    sections: [
      { heading: "מה בודקים לפני שבוחרים", body: "סוג הגג (בטון, פח, רעפים), מצב האיטום הקיים, שיפוע הגג ומידת החשיפה לשמש. גג עם איטום ישן במצב טוב יכול לקבל חידוש; גג עם שכבות מתקלפות דורש הסרה והכנה." },
      { heading: "חומרים אקריליים", body: "קלים ליישום ברולר, בגוון לבן שמחזיר קרינה. מתאימים לרוב גגות הבטון בבתים פרטיים ולחידוש תקופתי." },
      { heading: "חומרים ביטומניים ויריעות", body: "מתאימים למצבים עם עומס מים גבוה או לגגות גדולים. היישום מקצועי יותר ובדרך כלל מבוצע על ידי איש מקצוע." },
      { heading: "טיפ מקצועי", body: "תמיד יישמו פריימר מתאים ושתי שכבות לפחות. שכבה אחת עבה לא מחליפה שתי שכבות נכונות." },
    ],
    productIds: ["acrylic-roof-sealant", "bitumen-primer", "sikaflex-11fc"], projects: ["roof-sealing"],
  },
  {
    slug: "how-to-mix-concrete", title: "איך להכין בטון?", category: "חומרי בניין", readMinutes: 4,
    excerpt: "יחסי ערבוב, כמות מים וטעויות נפוצות — מדריך קצר ליציקות קטנות.",
    art: { kind: "bag", color: "#8A8F96", label: "CEMENT" },
    sections: [
      { heading: "יחס בסיסי", body: "ליציקות קטנות נהוג יחס של מלט, חול וחצץ לפי ייעוד העבודה. היחס המדויק משתנה — כדאי להיוועץ לפני יציקה נושאת." },
      { heading: "מים", body: "יותר מדי מים מחליש את הבטון. מוסיפים בהדרגה עד לקבלת תערובת אחידה ולא נוזלית." },
      { heading: "אשפרה", body: "הרטיבו את הבטון בימים הראשונים כדי למנוע סדיקה." },
    ],
    productIds: ["portland-cement-50", "concrete-waterproof-additive"], projects: [],
  },
  {
    slug: "exterior-wall-paint", title: "איזה צבע מתאים לקיר חיצוני?", category: "צבע", readMinutes: 4,
    excerpt: "עמידות לשמש ולגשם, הכנת משטח ובחירת גוון — מה חשוב לדעת.",
    art: { kind: "bucket", color: "#D9D4C7", label: "EXT" },
    sections: [
      { heading: "צבע חוץ ייעודי", body: "צבעי חוץ מכילים רכיבים לעמידות ב-UV ובמים. צבע פנים על קיר חיצוני יתקלף מהר." },
      { heading: "הכנת הקיר", body: "שטיפה, הסרת צבע רופף ותיקון סדקים. על טיח חדש מחכים לייבוש מלא." },
      { heading: "גוון", body: "גוונים בהירים מחממים פחות את המבנה ודוהים פחות." },
    ],
    productIds: ["exterior-acrylic-paint", "acrylic-primer", "acrylic-crack-filler"], projects: ["house-painting"],
  },
  {
    slug: "choose-tile-adhesive", title: "איך לבחור דבק לקרמיקה?", category: "ריצוף", readMinutes: 5,
    excerpt: "מה אומרים הסימונים C1, C2, T ו-E, ואיזה דבק מתאים לאריחים גדולים.",
    art: { kind: "bag", color: "#EDEBE6", label: "C2TE" },
    sections: [
      { heading: "הסימונים על השק", body: "C1 — דבק צמנטי רגיל; C2 — משופר. T — מונע החלקה של אריחים בקיר. E — זמן פתוח מוארך. S1/S2 — גמישות." },
      { heading: "אריחים גדולים ופורצלן", body: "צריכים דבק C2 לפחות, ולרוב גמיש. מומלץ למרוח גם על גב האריח." },
      { heading: "חוץ ומרפסות", body: "בחרו דבק גמיש ועמיד למים ולשינויי טמפרטורה." },
    ],
    productIds: ["tile-adhesive-c2te", "flexible-grout-5", "notched-trowel-8"], projects: ["tiling", "bathroom-renovation"],
  },
  {
    slug: "treat-dampness", title: "איך לטפל ברטיבות?", category: "איטום", readMinutes: 6,
    excerpt: "איתור מקור הרטיבות, טיפול נכון ומה לא לעשות — לפני שצובעים שוב.",
    art: { kind: "bucket", color: "#8FB3DA", label: "WET" },
    sections: [
      { heading: "קודם מאתרים", body: "רטיבות יכולה להגיע מצנרת, מגג, מחלון או מעיבוי. צביעה בלי לטפל במקור רק תסתיר את הבעיה." },
      { heading: "הטיפול", body: "מסירים טיח וצבע פגועים, מייבשים, ומיישמים איטום צמנטי גמיש לפני טיח וצבע חדשים." },
      { heading: "מתי לקרוא לאיש מקצוע", body: "רטיבות חוזרת, כתמים גדולים או ריח עובש חזק — כדאי לבדוק עם איש מקצוע." },
    ],
    productIds: ["flexible-cement-waterproofing", "concrete-waterproof-additive", "acrylic-primer"], projects: ["damp-repair"],
  },
  {
    slug: "choose-roller", title: "איך לבחור רולר?", category: "צבע", readMinutes: 3,
    excerpt: "אורך סיב, רוחב וסוג צבע — הרולר הנכון חוסך צבע וזמן.",
    art: { kind: "roller", color: "#1A56A8" },
    sections: [
      { heading: "אורך הסיב", body: "סיב קצר למשטחים חלקים וגימור עדין; סיב ארוך לקירות מחוספסים ולטיח." },
      { heading: "רוחב", body: "25 ס״מ לקירות רגילים; רולר קטן לפינות ולמשקופים." },
      { heading: "סוג הצבע", body: "מיקרופייבר מצוין לצבעים על בסיס מים. לצבעי שמן — רולר ייעודי." },
    ],
    productIds: ["microfiber-roller-25", "paint-tray-grid", "brush-set-3"], projects: ["house-painting"],
  },
  {
    slug: "drywall-types", title: "מה ההבדל בין סוגי גבס?", category: "גבס", readMinutes: 4,
    excerpt: "לבן, ירוק, אדום — מתי משתמשים בכל לוח ולמה זה חשוב.",
    art: { kind: "board", color: "#EDEBE6" },
    sections: [
      { heading: "לוח לבן", body: "הלוח הבסיסי לקירות ותקרות בחדרים יבשים." },
      { heading: "לוח ירוק", body: "עמיד ללחות — לחדרי רחצה, מטבחים ומרפסות סגורות. לא מחליף איטום." },
      { heading: "לוח אדום/ורוד", body: "עמיד אש — לפירים, לחדרי מכונות ולפי דרישות בטיחות." },
    ],
    productIds: ["drywall-board-12-5", "drywall-stud-70", "joint-compound-20"], projects: ["drywall-wall"],
  },
];

export const getProfession = (slug: string) => professions.find((p) => p.slug === slug);
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const getGuide = (slug: string) => guides.find((g) => g.slug === slug);

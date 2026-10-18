/* Fictional content for the NUVOLA concept site (see SPEC.md). */

export type BranchSlug = "tel-aviv" | "haifa" | "jerusalem";

/** Opening hours per weekday (0 = Sunday … 6 = Saturday), minutes from midnight; a close past 24:00 means after midnight. null = closed. */
type Day = [open: number, close: number] | null;
const h = (hh: number, mm = 0) => hh * 60 + mm;

export const BRANCHES: {
  slug: BranchSlug;
  city: string;
  area: string;
  address: string;
  phone: string;
  hours: string;
  open: boolean;
  week: Day[];
  map: { x: number; y: number };
}[] = [
  {
    slug: "tel-aviv",
    city: "תל אביב",
    area: "פלורנטין",
    address: "רחוב וולפסון 14, פלורנטין",
    phone: "03-5550101",
    hours: "12:00–00:00",
    open: true,
    week: [[h(12), h(24)], [h(12), h(24)], [h(12), h(24)], [h(12), h(24)], [h(12), h(25)], [h(11), h(25)], [h(11), h(24)]],
    map: { x: 58, y: 196 },
  },
  {
    slug: "haifa",
    city: "חיפה",
    area: "המושבה הגרמנית",
    address: "שדרות בן גוריון 21, המושבה הגרמנית",
    phone: "04-5550202",
    hours: "12:00–23:00",
    open: true,
    week: [[h(12), h(23)], [h(12), h(23)], [h(12), h(23)], [h(12), h(23)], [h(12), h(24)], [h(11), h(24)], [h(11), h(23)]],
    map: { x: 72, y: 92 },
  },
  {
    slug: "jerusalem",
    city: "ירושלים",
    area: "נחלאות",
    address: "רחוב התבור 6, נחלאות",
    phone: "02-5550303",
    hours: "12:00–23:00 · מוצ״ש עד 01:00",
    open: false,
    week: [[h(12), h(23)], [h(12), h(23)], [h(12), h(23)], [h(12), h(23)], [h(12), h(23)], [h(10), h(14, 30)], [h(19), h(25)]],
    map: { x: 112, y: 222 },
  },
];

export const DAY_NAMES = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
export const fmtTime = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

/** Is the branch open at a given Israel-time moment? Handles closing hours after midnight. */
export function openNow(week: Day[], date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jerusalem", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date);
  const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.find((p) => p.type === "weekday")!.value);
  const mins = Number(parts.find((p) => p.type === "hour")!.value) * 60 + Number(parts.find((p) => p.type === "minute")!.value);
  const today = week[wd];
  const yesterday = week[(wd + 6) % 7];
  if (today && mins >= today[0] && mins < today[1]) return { open: true, until: today[1] };
  if (yesterday && yesterday[1] > 1440 && mins < yesterday[1] - 1440) return { open: true, until: yesterday[1] };
  const next = today && mins < today[0] ? today[0] : null;
  return { open: false, next };
}

export const NAV = [
  { label: "טעמים", href: "/flavors" },
  { label: "הדרופ החודשי", href: "/drop" },
  { label: "משחק", href: "/game" },
  { label: "אירועים", href: "/events" },
  { label: "הסיפור", href: "/story" },
  { label: "סניפים", href: "/branches" },
  { label: "מועדון", href: "/club" },
];

const mix = (a: string, b: string, p: number) => `color-mix(in oklab, var(--color-${a}) ${p}%, var(--color-${b}))`;

export type Flavor = {
  slug: string;
  name: string;
  note: string;
  description: string;
  color: string;
  vegan: boolean;
  glutenFree: boolean;
  allergens: string[];
  ingredients: string[];
  /** ingredient photos (public/images/ingredient-*) that float around the scoop */
  floaters: string[];
  branches: BranchSlug[];
};

export const FLAVORS: Flavor[] = [
  {
    slug: "pistachio",
    name: "פיסטוק סיציליאני",
    note: "פיסטוק קלוי ושמן זית",
    description: "פיסטוק מברונטה שאנחנו קולים וטוחנים במעבדה, עם טיפה שמן זית ומלח ים. בלי תמציות ובלי צבע, רק ירוק של פיסטוק אמיתי.",
    color: "var(--color-pistachio)",
    vegan: false,
    glutenFree: true,
    allergens: ["חלב", "אגוזים (פיסטוק)"],
    ingredients: ["חלב מקומי", "שמנת", "פיסטוק קלוי", "סוכר קנים", "שמן זית", "מלח ים"],
    floaters: ["pistachio", "pistachio"],
    branches: ["tel-aviv", "haifa", "jerusalem"],
  },
  {
    slug: "raspberry",
    name: "פטל ושמנת",
    note: "פטל טרי ושמנת חמוצה",
    description: "פטל טרי שמתבשל בקצרה עם מעט סוכר ומקופל לתוך בסיס שמנת חמוצה. חמצמץ, ורוד ונקי.",
    color: "var(--color-cherry)",
    vegan: false,
    glutenFree: true,
    allergens: ["חלב"],
    ingredients: ["פטל טרי", "שמנת חמוצה", "חלב", "סוכר", "מיץ לימון"],
    floaters: [],
    branches: ["tel-aviv", "haifa"],
  },
  {
    slug: "mango",
    name: "מנגו וליים",
    note: "סורבה מנגו אטאולפו",
    description: "סורבה ממנגו אטאולפו בשל במיוחד וגרידת ליים. בלי חלב ובלי ביצים, ועדיין קרמי בזכות הפרי עצמו.",
    color: "var(--color-mango)",
    vegan: true,
    glutenFree: true,
    allergens: [],
    ingredients: ["מנגו אטאולפו", "מים", "סוכר קנים", "ליים", "סיבי הדרים"],
    floaters: ["mango", "mango"],
    branches: ["tel-aviv", "haifa", "jerusalem"],
  },
  {
    slug: "chocolate",
    name: "שוקולד מריר 70%",
    note: "שוקולד חד־זני מאקוודור",
    description: "שוקולד חד־זני מאקוודור, מומס לבסיס מים ולא חלב, כדי שהקקאו יישאר במרכז. עמוק, מריר ומפתיע בעדינות שלו.",
    color: "var(--color-chocolate)",
    vegan: true,
    glutenFree: false,
    allergens: ["סויה", "עלול להכיל גלוטן"],
    ingredients: ["שוקולד 70%", "מים", "קקאו", "סוכר קנים", "לציטין סויה"],
    floaters: ["chocolate", "chocolate"],
    branches: ["tel-aviv", "jerusalem"],
  },
  {
    slug: "vanilla",
    name: "וניל מדגסקר",
    note: "תרמילי וניל שלמים",
    description: "תרמילי וניל שלמים ממדגסקר שמושרים בחלב לילה שלם. הבסיס שכל טעם אחר נמדד מולו.",
    color: mix("mango", "cream", 22),
    vegan: false,
    glutenFree: true,
    allergens: ["חלב", "ביצים"],
    ingredients: ["חלב מקומי", "שמנת", "חלמונים", "סוכר", "וניל מדגסקר"],
    floaters: [],
    branches: ["tel-aviv", "haifa", "jerusalem"],
  },
  {
    slug: "hazelnut",
    name: "אגוזי לוז",
    note: "פרלינה ביתית",
    description: "אגוזי לוז מפיימונטה, קלויים עד שהם מתחילים לשחום, וטחונים לפרלינה ביתית עם קרמל.",
    color: mix("chocolate", "mango", 55),
    vegan: false,
    glutenFree: false,
    allergens: ["חלב", "אגוזים (לוז)", "עלול להכיל גלוטן"],
    ingredients: ["חלב", "שמנת", "אגוזי לוז", "סוכר", "קרמל"],
    floaters: ["chocolate"],
    branches: ["haifa"],
  },
  {
    slug: "lemon",
    name: "לימון ובזיליקום",
    note: "סורבה רענן",
    description: "סורבה לימון חמוץ־מתוק עם בזיליקום טרי מהגינה של המעבדה. הטעם שמנקה את הפה בין שני כדורים.",
    color: mix("mango", "cream", 60),
    vegan: true,
    glutenFree: true,
    allergens: [],
    ingredients: ["מיץ לימון", "גרידת לימון", "מים", "סוכר", "בזיליקום"],
    floaters: ["mint"],
    branches: ["tel-aviv", "jerusalem"],
  },
  {
    slug: "mint",
    name: "נענע ושבבים",
    note: "נענע טרייה מהשוק",
    description: "נענע טרייה מהשוק שמושרית בחלב, בלי צבע ירוק מלאכותי, עם שבבי שוקולד מריר שאנחנו שוברים ביד.",
    color: mix("pistachio", "cloud", 45),
    vegan: false,
    glutenFree: true,
    allergens: ["חלב", "סויה"],
    ingredients: ["חלב", "שמנת", "נענע טרייה", "סוכר", "שוקולד מריר"],
    floaters: ["mint", "chocolate"],
    branches: ["tel-aviv", "haifa", "jerusalem"],
  },
];

export const branchName = (slug: BranchSlug) => BRANCHES.find((b) => b.slug === slug)!.city;

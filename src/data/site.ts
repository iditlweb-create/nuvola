/* Fictional content for the NUVOLA concept site (see SPEC.md). */

export type BranchSlug = "tel-aviv" | "haifa" | "jerusalem";

export const BRANCHES: { slug: BranchSlug; city: string; area: string; hours: string; open: boolean }[] = [
  { slug: "tel-aviv", city: "תל אביב", area: "פלורנטין", hours: "12:00–00:00", open: true },
  { slug: "haifa", city: "חיפה", area: "המושבה הגרמנית", hours: "12:00–23:00", open: true },
  { slug: "jerusalem", city: "ירושלים", area: "נחלאות", hours: "12:00–23:00 · מוצ״ש עד 01:00", open: false },
];

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

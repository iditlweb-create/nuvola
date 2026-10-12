/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";

export const metadata: Metadata = {
  title: "נובולה — מערכת העיצוב",
  description: "לוגו, צבעים, טיפוגרפיה, כפתורים וכל התמונות של נובולה במקום אחד.",
};

const COLORS = [
  { token: "cream", name: "קרם וניל", hex: "#FFF6EA", use: "רקע ראשי", bg: "bg-cream", fg: "text-chocolate", ratio: "15.6:1 עם שוקולד" },
  { token: "chocolate", name: "שוקולד מריר", hex: "#2B1A14", use: "טקסט וכותרות", bg: "bg-chocolate", fg: "text-cream", ratio: "15.6:1 עם קרם" },
  { token: "pistachio", name: "פיסטוק", hex: "#A8C66C", use: "צבע מותג ראשי ומשטחים גדולים", bg: "bg-pistachio", fg: "text-chocolate", ratio: "8.7:1 עם שוקולד" },
  { token: "cherry", name: "פטל", hex: "#B8234A", use: "כפתורים", bg: "bg-cherry", fg: "text-white", ratio: "6.2:1 עם לבן" },
  { token: "mango", name: "מנגו", hex: "#FFB547", use: "הדגשות ותגיות", bg: "bg-mango", fg: "text-chocolate", ratio: "9.5:1 עם שוקולד" },
  { token: "cloud", name: "ענן", hex: "#E9F1F7", use: "רקע המשחק ושמיים", bg: "bg-cloud", fg: "text-chocolate", ratio: "14.6:1 עם שוקולד" },
];

type Img = { file: string; alt: string; label: string; avif?: boolean; contain?: boolean };
const FLAVOR_NAMES: Record<string, string> = {
  pistachio: "פיסטוק סיציליאני",
  raspberry: "פטל ושמנת",
  mango: "מנגו וליים",
  chocolate: "שוקולד מריר 70%",
  vanilla: "וניל מדגסקר",
  hazelnut: "אגוזי לוז",
  lemon: "לימון ובזיליקום",
  mint: "נענע ושבבים",
};
const INGREDIENTS: Record<string, string> = { pistachio: "פיסטוקים", mint: "נענע", mango: "מנגו", chocolate: "שוקולד מריר" };
const LAB: Record<string, string> = { milk: "חלב", pistachio: "פיסטוק", whip: "הקצפה", vitrine: "ויטרינה" };
const BRANCHES: Record<string, string> = { "tel-aviv": "תל אביב, פלורנטין", haifa: "חיפה, המושבה הגרמנית", jerusalem: "ירושלים, נחלאות" };
const GAME: Record<string, string> = {
  "ball-pistachio": "כדור פיסטוק",
  "ball-raspberry": "כדור פטל",
  "ball-mango": "כדור מנגו",
  "ball-chocolate": "כדור שוקולד",
  "ball-vanilla": "כדור וניל",
  "ball-mint": "כדור נענע",
  "ball-gold": "כדור זהב (5 נקודות)",
  cone: "גביע",
  cloud: "ענן",
};

const SECTIONS: { title: string; note: string; cols: string; aspect: string; items: Img[] }[] = [
  {
    title: "הירו",
    note: "התמונה המקורית, ושלוש השכבות שבונות את ההירו החי: הכדור (נפתח בגלילה), העננים (זזים בלופ) ותמונת השיתוף.",
    cols: "md:grid-cols-2",
    aspect: "aspect-video",
    items: [
      { file: "hero-cloud-scoop", label: "hero-cloud-scoop", alt: "כדור ג׳לטו פיסטוק נמס לתוך ענן", avif: true },
      { file: "hero-subject", label: "hero-subject · שכבת הכדור (שקופה)", alt: "כדור הפיסטוק על הענן, על רקע שקוף", contain: true },
      { file: "og-image", label: "og-image · שיתוף ברשתות", alt: "תמונת השיתוף של נובולה" },
    ],
  },
  {
    title: "עננים לשכבת הלופ",
    note: "חמישה עננים שנחתכו מגיליון אחד. בהירו הם נעים מימין לשמאל בלי קשר לגלילה.",
    cols: "grid-cols-2 md:grid-cols-5",
    aspect: "aspect-[4/3]",
    items: ["1", "2", "3", "4", "5"].map((n) => ({ file: `hero-cloud-${n}`, label: `hero-cloud-${n}`, alt: "ענן לבן רך", contain: true })),
  },
  {
    title: "טעמים",
    note: "8 טעמים באותה זווית ותאורה, רקע שקוף. 1200×1500.",
    cols: "grid-cols-2 md:grid-cols-4",
    aspect: "aspect-[4/5]",
    items: Object.entries(FLAVOR_NAMES).map(([k, v]) => ({ file: `flavor-${k}`, label: v, alt: `כדור ג׳לטו ${v}`, avif: true, contain: true })),
  },
  {
    title: "רכיבים",
    note: "לעמוד הטעם, מרחפים סביב הכדור. 800×800, רקע שקוף.",
    cols: "grid-cols-2 md:grid-cols-4",
    aspect: "aspect-square",
    items: Object.entries(INGREDIENTS).map(([k, v]) => ({ file: `ingredient-${k}`, label: v, alt: v, avif: true, contain: true })),
  },
  {
    title: "דרופ ואירועים",
    note: "קופסת הדרופ (גרסה A) ועגלת האירועים (גרסה A).",
    cols: "md:grid-cols-2",
    aspect: "aspect-[4/3]",
    items: [
      { file: "drop-box", label: "drop-box", alt: "קופסת גלידה פתוחה עם ארבעה טעמים", avif: true },
      { file: "events-cart", label: "events-cart", alt: "עגלת גלידה בחתונה בגן בשקיעה", avif: true },
    ],
  },
  {
    title: "המעבדה",
    note: "ארבעת שלבי הייצור ל״איך נולד טעם״. ידיים בלבד, בלי פנים.",
    cols: "grid-cols-2 md:grid-cols-4",
    aspect: "aspect-[3/2]",
    items: Object.entries(LAB).map(([k, v]) => ({ file: `lab-${k}`, label: v, alt: `מעבדת הג׳לטו: ${v}`, avif: true })),
  },
  {
    title: "סניפים",
    note: "שלוש חזיתות עם שלט ריק. השם נכתב בקוד, לא בתמונה.",
    cols: "md:grid-cols-3",
    aspect: "aspect-[3/2]",
    items: Object.entries(BRANCHES).map(([k, v]) => ({ file: `branch-${k}`, label: v, alt: `חזית סניף נובולה ב${v}`, avif: true })),
  },
  {
    title: "חלקי המשחק",
    note: "איור שטוח אחיד, 512×512, רקע שקוף.",
    cols: "grid-cols-3 md:grid-cols-9",
    aspect: "aspect-square",
    items: Object.entries(GAME).map(([k, v]) => ({ file: `game-${k}`, label: v, alt: v, contain: true })),
  },
];

function Picture({ img, className }: { img: Img; className: string }) {
  return (
    <picture>
      {img.avif && <source srcSet={`/images/${img.file}.avif`} type="image/avif" />}
      <img src={`/images/${img.file}.webp`} alt={img.alt} loading="lazy" className={className} />
    </picture>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="border-t border-chocolate/10 py-16">
      <h2 id={id} className="mb-8 text-[clamp(2rem,4vw,3rem)]">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-cream">
      <header className="sticky top-0 z-40 border-b border-chocolate/10 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
          <Link href="/" aria-label="נובולה — דף הבית">
            <Logo />
          </Link>
          <nav aria-label="ניווט בעמוד הדמו" className="hidden gap-5 text-sm md:flex">
            <a href="#logo">לוגו</a>
            <a href="#colors">צבעים</a>
            <a href="#type">טיפוגרפיה</a>
            <a href="#buttons">כפתורים</a>
            <a href="#images">תמונות</a>
          </nav>
          <div className="flex gap-2">
            <Link href="/" className="rounded-full border-2 border-chocolate px-4 py-1.5 text-sm font-extrabold">
              סקיצת הבית
            </Link>
            <Link href="/game" className="rounded-full bg-cherry px-4 py-1.5 text-sm font-extrabold text-white">
              המשחק
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="py-16">
          <p className="mb-3 inline-block rounded-full bg-mango px-4 py-1 font-extrabold">עמוד דמו · פרויקט קונספט</p>
          <h1 className="mb-4">מערכת העיצוב של נובולה</h1>
          <p className="max-w-2xl text-lg">
            כל מה שהאתר, המשחק ומערכת הניהול בנויים ממנו: לוגו, שישה צבעים, שני פונטים, כפתורים ו־40 תמונות. כל הטקסט כאן כתוב בקוד, אף מילה לא
            נמצאת בתוך תמונה.
          </p>
        </div>

        {/* Logo */}
        <Section id="logo" title="לוגו">
          <div className="grid gap-6 md:grid-cols-3">
            <figure className="rounded-[2rem] bg-white/70 p-8 md:col-span-2">
              <img src="/brand/logo-horizontal.svg" alt="הלוגו האופקי של נובולה" className="mx-auto h-28 w-auto" />
              <figcaption className="mt-6 text-sm">לוגו אופקי: הסמל, ולידו ״נובולה״ ו־<bdi>NUVOLA</bdi> בלאון</figcaption>
            </figure>
            <figure className="flex flex-col items-center justify-between rounded-[2rem] bg-white/70 p-8">
              <img src="/brand/logo-symbol.svg" alt="סמל הלוגו: כדור גלידה בצורת ענן על גביע" className="h-32 w-auto" />
              <figcaption className="mt-6 text-sm">סמל בלבד</figcaption>
            </figure>
            <figure className="rounded-[2rem] bg-chocolate p-8 text-cream">
              <img src="/brand/logo-horizontal-cream.svg" alt="הלוגו בגרסה בהירה" className="mx-auto h-16 w-auto" />
              <figcaption className="mt-6 text-sm">על רקע כהה</figcaption>
            </figure>
            <figure className="rounded-[2rem] bg-mango p-8">
              <img src="/brand/logo-horizontal-mono.svg" alt="הלוגו בצבע אחד" className="mx-auto h-16 w-auto" />
              <figcaption className="mt-6 text-sm">צבע אחד</figcaption>
            </figure>
            <figure className="flex items-center justify-between gap-6 rounded-[2rem] bg-white/70 p-8">
              <div className="flex items-end gap-4">
                <img src="/icon.svg" alt="" className="size-16" />
                <img src="/icon.svg" alt="" className="size-8" />
                <img src="/icon.svg" alt="" className="size-4" />
              </div>
              <figcaption className="text-sm">פביקון בשלושה גדלים: <bdi>64 · 32 · 16</bdi> פיקסלים</figcaption>
            </figure>
          </div>
          <div className="mt-6 inline-flex items-center gap-6 rounded-[2rem] bg-white/70 p-6">
            <Logo />
            <p className="text-sm">הלוגו באתר עצמו: הסמל כ־SVG והשם כטקסט חי בלאון.</p>
          </div>
        </Section>

        {/* Colors */}
        <Section id="colors" title="צבעים">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COLORS.map((c) => (
              <li key={c.token} className="overflow-hidden rounded-[2rem] border border-chocolate/10 bg-white/70">
                <div className={`flex h-32 items-end p-5 ${c.bg} ${c.fg}`}>
                  <span className="font-display text-3xl font-black">אבג Aa</span>
                </div>
                <div className="p-5">
                  <p className="font-extrabold">
                    {c.name} · <code dir="ltr">{c.token}</code>
                  </p>
                  <p dir="ltr" className="text-end text-sm">
                    {c.hex}
                  </p>
                  <p className="text-sm">{c.use}</p>
                  <p className="mt-2 inline-block rounded-full bg-pistachio/30 px-3 py-0.5 text-xs font-extrabold">ניגודיות {c.ratio}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>

        {/* Typography */}
        <Section id="type" title="טיפוגרפיה">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[2rem] bg-white/70 p-8">
              <p className="mb-6 text-sm">לאון (Leon) · הפונטיה · כותרות ולוגו בלבד</p>
              <p className="font-display text-7xl font-black leading-none">ג׳לטו</p>
              <p className="mt-2 text-sm">משקל <bdi>Heavy 900</bdi> · לכותרת ראשית וללוגו</p>
              <p className="mt-6 font-display text-5xl font-bold leading-tight">שנולד בענן</p>
              <p className="mt-2 text-sm">משקל <bdi>Bold 700</bdi> · לכותרות משנה</p>
              <p dir="ltr" className="mt-6 text-end font-display text-3xl font-black tracking-[0.2em]">
                NUVOLA 0123
              </p>
            </div>
            <div className="rounded-[2rem] bg-white/70 p-8">
              <p className="mb-6 text-sm">פולין (Polin) · כל שאר הטקסט</p>
              <p className="text-lg">
                32 טעמים בתחלופה, מחומרי גלם שאנחנו רציניים לגביהם. כל חודש ארבעה טעמים חדשים, רק לזמן מוגבל. טקסט רץ ב־18 במחשב, 16 בנייד, גובה
                שורה 1.6.
              </p>
              <p className="mt-2 text-sm">משקל <bdi>Regular 400</bdi> · לטקסט רץ</p>
              <p className="mt-6 text-2xl font-extrabold">תזכירו לי כשהדרופ נפתח</p>
              <p className="mt-2 text-sm">משקל <bdi>Extrabold 800</bdi> · לכפתורים והדגשות</p>
              <p className="mt-6 text-sm">טקסט קטן · 14 פיקסלים · הצהרת נגישות, תקנון, הערות</p>
            </div>
          </div>
          <div className="mt-6 space-y-4 rounded-[2rem] bg-white/70 p-8">
            <p className="text-sm">סולם הכותרות (רספונסיבי)</p>
            <h1>כותרת ראשית <bdi>48–128</bdi></h1>
            <h2>כותרת משנה <bdi>40–64</bdi></h2>
            <h3>כותרת קטנה <bdi>24–32</bdi></h3>
          </div>
        </Section>

        {/* Buttons */}
        <Section id="buttons" title="כפתורים ותגיות">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="flex flex-wrap items-center gap-4 rounded-[2rem] bg-white/70 p-8">
              <a href="#buttons" className="inline-flex rounded-full bg-cherry px-7 py-3 font-extrabold text-white transition-transform duration-500 hover:-translate-y-0.5">
                לכל הטעמים
              </a>
              <a
                href="#buttons"
                className="inline-flex rounded-full border-2 border-chocolate px-7 py-3 font-extrabold transition-transform duration-500 hover:-translate-y-0.5 hover:bg-chocolate hover:text-cream"
              >
                עגלה לאירוע
              </a>
              <button type="button" disabled className="rounded-full bg-cherry px-7 py-3 font-extrabold text-white opacity-40">
                לא זמין
              </button>
              <p className="w-full text-sm">ראשי בפטל, משני במסגרת שוקולד. במעבר עכבר הכפתור עולה קצת (transform בלבד). לחצי Tab כדי לראות את מסגרת הפוקוס.</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 rounded-[2rem] bg-chocolate p-8 text-cream">
              <a href="#buttons" className="inline-flex rounded-full bg-mango px-7 py-3 font-extrabold text-chocolate">
                בנו עגלה
              </a>
              <a href="#buttons" className="inline-flex rounded-full border-2 border-cream px-7 py-3 font-extrabold">
                לסיפור שלנו
              </a>
              <p className="w-full text-sm">על רקע כהה: מנגו עם טקסט שוקולד.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 rounded-[2rem] bg-white/70 p-8 lg:col-span-2">
              <span className="rounded-full bg-mango px-4 py-1 font-extrabold">חדש</span>
              <span className="rounded-full bg-pistachio/40 px-3 py-0.5 text-sm font-extrabold">טבעוני</span>
              <span className="rounded-full bg-pistachio/40 px-3 py-0.5 text-sm font-extrabold">ללא גלוטן</span>
              <span className="rounded-full bg-pistachio/50 px-3 py-0.5 text-sm font-extrabold">פתוח עכשיו</span>
              <span className="rounded-full bg-chocolate/10 px-3 py-0.5 text-sm font-extrabold">נפתח ב־12:00</span>
              <label className="ms-auto flex flex-col gap-1 text-sm">
                <span className="font-extrabold">שדה טופס</span>
                <input type="tel" placeholder="05X-XXXXXXX" dir="ltr" className="rounded-full border-2 border-chocolate bg-cream px-5 py-2 text-end" />
              </label>
            </div>
          </div>
        </Section>

        {/* Images */}
        <Section id="images" title="תמונות">
          <p className="mb-10 max-w-2xl">
            כל התמונות נוצרו ב־ChatGPT בסגנון אחד קבוע, וההירו החי ב־Magnific. הן בפורמטים WebP ו־AVIF בתיקייה <code dir="ltr">public/images</code>, וכל
            הפרומפטים שמורים ב־<code dir="ltr">docs/image-prompts.md</code>.
          </p>
          <div className="space-y-14">
            {SECTIONS.map((s) => (
              <div key={s.title}>
                <h3 className="mb-1">{s.title}</h3>
                <p className="mb-5 text-sm">{s.note}</p>
                <ul className={`grid gap-4 ${s.cols}`}>
                  {s.items.map((img) => (
                    <li key={img.file}>
                      <figure>
                        <div className={`overflow-hidden rounded-[1.5rem] ${img.contain ? "bg-cloud" : "bg-white/70"} ${s.aspect}`}>
                          <Picture img={img} className={`h-full w-full ${img.contain ? "object-contain p-3" : "object-cover"}`} />
                        </div>
                        <figcaption className="mt-2 text-sm">{img.label}</figcaption>
                      </figure>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      </main>

      <footer className="bg-pistachio">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-10 md:px-8">
          <Logo />
          <p className="text-sm">פרויקט קונספט לתיק עבודות. נובולה היא מותג פיקטיבי, והתמונות נוצרו בבינה מלאכותית.</p>
        </div>
      </footer>
    </div>
  );
}

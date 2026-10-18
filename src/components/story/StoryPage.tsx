"use client";
 

import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import LabSteps from "@/components/site/LabSteps";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Spec: "הסיפור" — trust and closeness. Lead animation: the pinned horizontal scroll of the lab steps (LabSteps). */

const FOUNDERS = [
  {
    initial: "ש",
    name: "שירה",
    role: "שפית קונדיטורית",
    color: "var(--color-pistachio)",
    text: "למדה ג׳לטו בבולוניה, חזרה עם מחברת מלאה במתכונים ועם החלטה: אין טעם בוויטרינה שהיא לא הייתה אוכלת בעצמה.",
  },
  {
    initial: "ע",
    name: "עומר",
    role: "תפעול ועסקים",
    color: "var(--color-mango)",
    text: "אחראי שהגלידה תגיע בזמן לשלושה סניפים ולעשרות אירועים בשבוע, ושהעגלה תמיד תהיה מבריקה.",
  },
];

const TIMELINE = [
  { year: "2019", text: "ויטרינה אחת בפלורנטין, 12 טעמים ותור שלא נגמר בקיץ הראשון." },
  { year: "2021", text: "העגלה הראשונה לאירועים. החתונה הראשונה הייתה של בת דודה של שירה." },
  { year: "2022", text: "סניף חיפה נפתח במושבה הגרמנית, במבנה טמפלרי עם תריסים אדומים." },
  { year: "2023", text: "מעבדת ייצור משותפת לכל הסניפים, ו־32 טעמים בתחלופה." },
  { year: "2024", text: "סניף ירושלים בנחלאות, והדרופ החודשי הראשון: ארבעה טעמים בחודש אחד." },
  { year: "2026", text: "מגדל נובולה, המשחק, ואתר חדש שמביא את כל זה למקום אחד." },
];

const VALUES = [
  { title: "רציני לגבי חומרי הגלם", text: "פיסטוק מברונטה, וניל שלם ממדגסקר, חלב מרפת בגליל. בלי תמציות ובלי צבעי מאכל." },
  { title: "לא רציני לגבי עצמנו", text: "אם הטעם לא מצחיק אותנו קצת, הוא כנראה לא מספיק טוב לוויטרינה." },
  { title: "נדיבים", text: "טעימה לכל מי שמתלבט, וכדור במתנה למי שחגג יום הולדת השבוע." },
];

export default function StoryPage() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".story-fade", { y: 30, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out" });
        // Timeline: the line draws down and each year drops in like a scoop
        gsap.from(".tl-line", {
          scaleY: 0,
          transformOrigin: "50% 0%",
          ease: "none",
          scrollTrigger: { trigger: ".timeline", start: "top 70%", end: "bottom 60%", scrub: true },
        });
        gsap.utils.toArray<HTMLElement>(".tl-item").forEach((el) => {
          gsap.from(el, { y: 40, opacity: 0, duration: 0.7, ease: "back.out(1.6)", scrollTrigger: { trigger: el, start: "top 82%" } });
        });
        gsap.utils.toArray<HTMLElement>(".story-reveal").forEach((el) => {
          gsap.from(el, { y: 40, opacity: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 85%" } });
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root}>
      {/* Hero */}
      <section className="bg-cloud">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-[1.1fr_1fr] md:px-8 md:py-20">
          <div>
            <p className="story-fade mb-3 inline-block rounded-full bg-mango px-4 py-1 font-extrabold">מאז 2019, תל אביב</p>
            <h1 className="story-fade mb-4">ג׳לטו שנולד בענן</h1>
            <p className="story-fade max-w-lg text-lg">
              נובולה זה ״ענן״ באיטלקית. זה השם ששירה נתנה לג׳לטו הראשון שיצא לה אוורירי מדי, ושהתברר כטעים מכל מה שתכננה. מאז אנחנו מקציפים לאט.
            </p>
          </div>
          <picture className="story-fade">
            <source srcSet="/images/lab-whip.avif" type="image/avif" />
            <img
              src="/images/lab-whip.webp"
              alt="בסיס ג׳לטו פיסטוק מוקצף לאט לעננים רכים במעבדה"
              width={1600}
              height={1067}
              fetchPriority="high"
              className="w-full rounded-[2.5rem]"
            />
          </picture>
        </div>
      </section>

      {/* Founders */}
      <section aria-labelledby="founders-title" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <h2 id="founders-title" className="story-reveal mb-8">
          שניים ומעבדה אחת
        </h2>
        <ul className="grid gap-6 md:grid-cols-2">
          {FOUNDERS.map((f) => (
            <li key={f.name} className="story-reveal flex gap-5 rounded-[2rem] bg-white/80 p-6 md:p-8">
              <span
                aria-hidden
                className="flex size-20 shrink-0 items-center justify-center rounded-full font-display text-4xl font-black"
                style={{ background: f.color }}
              >
                {f.initial}
              </span>
              <div>
                <h3>{f.name}</h3>
                <p className="mb-2 font-extrabold">{f.role}</p>
                <p>{f.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Lab steps — the lead animation */}
      <LabSteps title="מה קורה במעבדה" />

      {/* Timeline */}
      <section aria-labelledby="tl-title" className="bg-cloud">
        <div className="timeline mx-auto max-w-3xl px-4 py-16 md:px-8">
          <h2 id="tl-title" className="mb-10">
            ציר הזמן
          </h2>
          <ol className="relative space-y-8 ps-10">
            <span aria-hidden className="tl-line absolute start-3 top-2 bottom-2 w-1 rounded-full bg-chocolate/20" />
            {TIMELINE.map((t) => (
              <li key={t.year} className="tl-item relative">
                <span aria-hidden className="absolute -start-10 top-1 size-7 rounded-full border-4 border-cloud bg-cherry" />
                <p className="font-display text-3xl font-black">{t.year}</p>
                <p className="max-w-lg">{t.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Values */}
      <section aria-labelledby="values-title" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <h2 id="values-title" className="story-reveal mb-8">
          במה אנחנו מאמינים
        </h2>
        <ul className="grid gap-6 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <li
              key={v.title}
              className="story-reveal rounded-[2rem] p-6 md:p-8"
              style={{ background: ["var(--color-pistachio)", "var(--color-mango)", "var(--color-cloud)"][i] }}
            >
              <h3 className="mb-2">{v.title}</h3>
              <p>{v.text}</p>
            </li>
          ))}
        </ul>
        <div className="story-reveal mt-12 flex flex-wrap gap-3">
          <Link href="/flavors" className="inline-flex rounded-full bg-cherry px-7 py-3 font-extrabold text-white">
            לטעמים
          </Link>
          <Link href="/branches" className="inline-flex rounded-full border-2 border-chocolate px-7 py-3 font-extrabold">
            לסניפים
          </Link>
        </div>
      </section>
    </div>
  );
}

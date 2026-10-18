"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BRANCHES, DAY_NAMES, FLAVORS, fmtTime, openNow, type BranchSlug } from "@/data/site";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/* Spec: "סניפים" — get to the right branch, now. Lead animation: map markers fall like scoops. */

const MARKER_BALL: Record<BranchSlug, string> = { "tel-aviv": "pistachio", haifa: "raspberry", jerusalem: "mango" };
// A schematic outline of Israel (not to scale), viewBox 0 0 200 500
const OUTLINE =
  "M62 18 L118 12 L128 40 L122 72 L128 120 L124 168 L132 214 L138 262 L126 318 L112 380 L102 488 L88 420 L70 360 L52 318 L40 276 L48 238 L54 200 L60 160 L66 120 L70 86 L64 52 Z";

export default function BranchesPage() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<BranchSlug>("tel-aviv");
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".map-marker", {
          y: -260,
          opacity: 0,
          duration: 0.9,
          ease: "bounce.out",
          stagger: 0.2,
          scrollTrigger: { trigger: ".branch-map", start: "top 75%" },
        });
        gsap.from(".map-outline", { opacity: 0, scale: 0.94, duration: 0.8, ease: "power3.out" });
      });
    },
    { scope: root },
  );

  const select = (slug: BranchSlug) => {
    setActive(slug);
    document.getElementById(`branch-${slug}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div ref={root}>
      <section className="bg-cloud">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:px-8 md:py-20">
          <div>
            <p className="mb-3 inline-block rounded-full bg-mango px-4 py-1 font-extrabold">שלושה סניפים, ויטרינה אחת</p>
            <h1 className="mb-4">הסניפים</h1>
            <p className="mb-8 max-w-md text-lg">תל אביב, חיפה וירושלים. בכל סניף ויטרינה קצת אחרת, וכולם מקבלים טעמים טריים מהמעבדה כל בוקר.</p>
            <ul className="grid gap-3">
              {BRANCHES.map((b) => {
                const st = now ? openNow(b.week, now) : null;
                return (
                  <li key={b.slug}>
                    <button
                      type="button"
                      onClick={() => select(b.slug)}
                      aria-pressed={active === b.slug}
                      className={`flex w-full items-center justify-between gap-3 rounded-full px-5 py-3 text-start font-extrabold transition-transform duration-300 hover:-translate-y-0.5 ${
                        active === b.slug ? "bg-chocolate text-cream" : "bg-white/80"
                      }`}
                    >
                      <span>
                        {b.city} · {b.area}
                      </span>
                      {st && (
                        <span className={`rounded-full px-3 py-0.5 text-xs ${st.open ? "bg-pistachio text-chocolate" : "bg-chocolate/15"}`}>
                          {st.open ? "פתוח עכשיו" : st.next ? `נפתח ב־${fmtTime(st.next)}` : "סגור כרגע"}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Schematic map */}
          <div className="branch-map relative mx-auto w-full max-w-[18rem]">
            <svg viewBox="0 0 200 500" className="map-outline w-full" role="img" aria-label="מפה סכמטית של ישראל עם שלושת הסניפים">
              <path d={OUTLINE} fill="var(--color-cream)" stroke="var(--color-chocolate)" strokeOpacity="0.25" strokeWidth="3" strokeLinejoin="round" />
              <path d="M30 60 Q20 200 30 330" fill="none" stroke="var(--color-chocolate)" strokeOpacity="0.12" strokeWidth="2" strokeDasharray="4 6" />
            </svg>
            {BRANCHES.map((b) => (
              <button
                key={b.slug}
                type="button"
                onClick={() => select(b.slug)}
                aria-label={`${b.city} — ${b.area}`}
                // geographic position on the map, so physical left/top on purpose
                className="map-marker absolute w-[22%] -translate-x-1/2 -translate-y-full"
                style={{ left: `${(b.map.x / 200) * 100}%`, top: `${(b.map.y / 500) * 100}%` }}
              >
                <img src={`/images/game-ball-${MARKER_BALL[b.slug]}.webp`} alt="" className={`w-full transition-transform duration-500 ${active === b.slug ? "scale-125" : "hover:scale-110"}`} />
                <span className="mt-[-12%] block whitespace-nowrap text-center text-xs font-extrabold sm:text-sm">{b.city}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Branch details */}
      <section aria-label="פרטי הסניפים" className="mx-auto max-w-7xl space-y-10 px-4 py-16 md:px-8">
        {BRANCHES.map((b) => {
          const st = now ? openNow(b.week, now) : null;
          const today = now ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Jerusalem", weekday: "short" }).format(now)) : -1;
          const vitrine = FLAVORS.filter((f) => f.branches.includes(b.slug));
          return (
            <article key={b.slug} id={`branch-${b.slug}`} className="scroll-mt-24 overflow-hidden rounded-[2.5rem] bg-white/80 md:grid md:grid-cols-2">
              <picture className="block aspect-[3/2] md:aspect-auto">
                <source srcSet={`/images/branch-${b.slug}.avif`} type="image/avif" />
                <img src={`/images/branch-${b.slug}.webp`} alt={`חזית סניף נובולה ב${b.city}, ${b.area}`} width={1600} height={1067} loading="lazy" className="h-full w-full object-cover" />
              </picture>
              <div className="p-6 md:p-10">
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  <h2 className="text-[clamp(2rem,4vw,3rem)]">{b.city}</h2>
                  {st && (
                    <span className={`rounded-full px-3 py-1 text-sm font-extrabold ${st.open ? "bg-pistachio/60" : "bg-chocolate/10"}`} aria-live="polite">
                      {st.open ? `פתוח עכשיו · עד ${fmtTime(st.until!)}` : st.next ? `נפתח היום ב־${fmtTime(st.next)}` : "סגור כרגע"}
                    </span>
                  )}
                </div>
                <p className="font-extrabold">{b.address}</p>
                <p className="mb-6">
                  <a href={`tel:${b.phone.replace(/-/g, "")}`} dir="ltr" className="inline-block py-2 underline">
                    {b.phone}
                  </a>
                </p>

                <h3 className="mb-2 text-xl">שעות פתיחה</h3>
                <table className="mb-6 w-full max-w-sm text-sm">
                  <tbody>
                    {b.week.map((d, i) => (
                      <tr key={i} className={i === today ? "font-extrabold" : ""}>
                        <th scope="row" className="py-0.5 text-start font-normal">
                          {DAY_NAMES[i]}
                          {i === today && " (היום)"}
                        </th>
                        <td className="py-0.5 text-end tabular-nums">
                          <bdi>{d ? `${fmtTime(d[0])}–${fmtTime(d[1])}` : "סגור"}</bdi>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h3 className="mb-2 text-xl">מה בוויטרינה היום</h3>
                <ul className="mb-8 flex flex-wrap gap-2">
                  {vitrine.map((f) => (
                    <li key={f.slug}>
                      <Link href={`/flavors/${f.slug}`} className="inline-block rounded-full bg-cloud px-3 py-2 text-sm font-extrabold hover:bg-chocolate hover:text-cream">
                        {f.name}
                      </Link>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${b.area} ${b.city}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-full bg-cherry px-6 py-3 font-extrabold text-white"
                  >
                    ניווט לסניף
                  </a>
                  <a href={`tel:${b.phone.replace(/-/g, "")}`} className="inline-flex rounded-full border-2 border-chocolate px-6 py-3 font-extrabold">
                    התקשרו
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

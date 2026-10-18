"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import TowerGame from "./game/TowerGame";
import HeroSequence from "./HeroSequence";
import Link from "next/link";
import SiteHeader from "./site/SiteHeader";
import SiteFooter from "./site/SiteFooter";
import { BRANCHES, FLAVORS } from "@/data/site";
import FlavorTags from "./site/FlavorTags";
import LabSteps from "./site/LabSteps";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);



const DROP_DATE = new Date("2026-11-01T10:00:00+02:00");

function useCountdown(target: Date) {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, target.getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  if (left === null) return null;
  const s = Math.floor(left / 1000);
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

function Btn({ children, variant = "primary", href = "#" }: { children: React.ReactNode; variant?: "primary" | "ghost"; href?: string }) {
  const base =
    "inline-flex items-center justify-center rounded-full px-7 py-3 font-extrabold transition-transform duration-500 ease-[var(--ease-melt)] hover:-translate-y-0.5 active:translate-y-0";
  const styles =
    variant === "primary"
      ? "bg-cherry text-white"
      : "border-2 border-chocolate text-chocolate hover:bg-chocolate hover:text-cream";
  return (
    <Link href={href} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}

export default function HomeSketch() {
  const root = useRef<HTMLDivElement>(null);
  // Home-page game: the falling tower first, one try on the spot, then the full game page
  const [gameStage, setGameStage] = useState<"tower" | "playing" | "done">("tower");
  const cd = useCountdown(DROP_DATE);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Hero headline: words rise and settle with a soft "melt" ease
        const split = SplitText.create(".hero-title", { type: "words", mask: "words" });
        gsap.from(split.words, { yPercent: 110, duration: 0.9, ease: "back.out(1.4)", stagger: 0.08 });
        gsap.from(".hero-fade", { opacity: 0, y: 24, duration: 0.8, delay: 0.4, stagger: 0.1, ease: "power3.out" });

        // Section reveals
        gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 40,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
          });
        });

        // Game teaser: scoops drop onto the cone one by one as the section scrolls in
        gsap.from(".tower-scoop", {
          y: -260,
          opacity: 0,
          duration: 0.7,
          ease: "bounce.out",
          stagger: 0.25,
          scrollTrigger: { trigger: ".game", start: "top 65%" },
        });

        return () => split.revert();
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="overflow-x-clip">
      <SiteHeader />

      <main id="main">
        {/* Hero */}
        <section className="hero relative isolate overflow-hidden bg-cloud">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-16 md:px-8 lg:min-h-[calc(100svh-6rem)] lg:grid-cols-2">
            <div>
              <p className="hero-fade mb-4 inline-block rounded-full bg-mango px-4 py-1 font-extrabold">מעבדת ג׳לטו · תל אביב, חיפה, ירושלים</p>
              <h1 className="hero-title mb-6">ג׳לטו שנולד בענן</h1>
              <p className="hero-fade mb-8 max-w-md text-lg">
                32 טעמים בתחלופה, מחומרי גלם שאנחנו רציניים לגביהם. כל חודש ארבעה טעמים חדשים, רק לזמן מוגבל.
              </p>
              <div className="hero-fade flex flex-wrap gap-3">
                <Btn href="/flavors">לכל הטעמים</Btn>
                <Btn variant="ghost" href="/events">עגלה לאירוע</Btn>
              </div>
            </div>
            <HeroSequence />
          </div>
        </section>

        {/* Drop banner */}
        <section className="bg-mango">
          <div className="reveal mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 py-10 md:flex-row md:items-center md:px-8">
            <div>
              <p className="font-extrabold">הדרופ של נובמבר</p>
              <h2 className="text-[clamp(2rem,4vw,3rem)]">ארבעה טעמים. חודש אחד.</h2>
            </div>
            <dl className="flex gap-4 text-center" aria-live="off">
              {[
                ["ימים", cd?.d],
                ["שעות", cd?.h],
                ["דקות", cd?.m],
                ["שניות", cd?.s],
              ].map(([label, v]) => (
                <div key={label as string} className="min-w-16 rounded-2xl bg-cream px-3 py-2">
                  <dd className="font-display text-3xl font-black tabular-nums">{v ?? "–"}</dd>
                  <dt className="text-sm">{label}</dt>
                </div>
              ))}
            </dl>
            <Btn href="/drop">תזכירו לי</Btn>
          </div>
        </section>

        <LabSteps />

        {/* Flavors carousel */}
        <section className="py-24" aria-labelledby="flavors-title">
          <div className="reveal mx-auto mb-10 flex max-w-7xl items-end justify-between gap-4 px-4 md:px-8">
            <div>
              <h2 id="flavors-title">בוויטרינה עכשיו</h2>
              <p className="mt-2">שמונה מתוך 32. מחר אולי אחרים.</p>
            </div>
            <Link href="/flavors" className="font-extrabold underline underline-offset-4">לכל הטעמים ←</Link>
          </div>
          <ul className="flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 md:px-8" aria-label="טעמים">
            {FLAVORS.map((f) => (
              <li key={f.name} className="reveal w-64 shrink-0 snap-start">
                <Link href={`/flavors/${f.slug}`} className="group block rounded-[2rem] bg-white/70 p-5 transition-transform duration-500 hover:-translate-y-1">
                  <div className="relative mb-4 flex aspect-[4/5] items-center justify-center rounded-[1.5rem] bg-cloud">
                    <picture>
                      <source srcSet={`/images/flavor-${f.slug}.avif`} type="image/avif" />
                      <img
                        src={`/images/flavor-${f.slug}.webp`}
                        alt={`כדור ג׳לטו ${f.name}`}
                        width={1200}
                        height={1500}
                        loading="lazy"
                        className="h-full w-full object-contain transition-transform duration-700 ease-[var(--ease-melt)] group-hover:-translate-y-2 group-hover:scale-105"
                      />
                    </picture>
                  </div>
                  <h3 className="text-2xl">{f.name}</h3>
                  <p className="text-sm">{f.note}</p>
                  <FlavorTags flavor={f} className="mt-3" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Game teaser */}
        <section className="game bg-cloud py-24" aria-labelledby="game-title">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2 md:px-8">
            <div className="reveal">
              <p className="mb-3 inline-block rounded-full bg-mango px-4 py-1 font-extrabold">משחק · 60 שניות</p>
              <h2 id="game-title" className="mb-4">מגדל נובולה</h2>
              <p className="mb-4 max-w-md">
                בונים מגדל כדורים על גביע, כמה שיותר גבוה. 10 נקודות זה תוספת חינם, 20 זה כדור שני במתנה. בלי הרשמה כדי לשחק.
              </p>
              <p className="mb-8 max-w-md text-sm">
                {gameStage === "done" ? "זה היה הסיבוב שלך כאן. לעוד סיבובים, לקופון ולטבלת המובילים:" : "אפשר לנסות סיבוב אחד כאן, בלי לעזוב את העמוד."}
              </p>
              <div className="flex flex-wrap gap-3">
                {gameStage === "tower" && (
                  <button
                    type="button"
                    onClick={() => setGameStage("playing")}
                    className="inline-flex items-center justify-center rounded-full bg-cherry px-7 py-3 font-extrabold text-white transition-transform duration-500 ease-[var(--ease-melt)] hover:-translate-y-0.5"
                  >
                    כמה גבוה תגיעו? נסו עכשיו
                  </button>
                )}
                <Btn href="/game" variant={gameStage === "done" ? "primary" : "ghost"}>
                  למשחק המלא
                </Btn>
              </div>
            </div>
            {gameStage === "tower" ? (
              <div className="relative mx-auto flex h-[26rem] w-64 flex-col-reverse items-center" aria-hidden>
                <img src="/images/game-cone.webp" alt="" width={512} height={512} className="w-40 shrink-0" />
                {["pistachio", "raspberry", "mango", "gold"].map((f, i) => (
                  <img
                    key={f}
                    src={`/images/game-ball-${f}.webp`}
                    alt=""
                    width={512}
                    height={512}
                    className={`tower-scoop w-36 shrink-0 ${i === 0 ? "-mb-24" : "-mb-20"}`}
                  />
                ))}
                <img src="/images/game-cloud.webp" alt="" width={512} height={512} className="absolute -end-16 top-4 w-28 opacity-90" />
              </div>
            ) : (
              <div>
                <TowerGame mode="teaser" autoStart onEnd={() => setGameStage("done")} />
              </div>
            )}
          </div>
        </section>

        {/* Events */}
        <section className="bg-chocolate py-24 text-cream" aria-labelledby="events-title">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 md:grid-cols-2 md:px-8">
            <div className="reveal relative aspect-[3/2] overflow-hidden rounded-[2.5rem] bg-pistachio">
              <picture>
                <source srcSet="/images/events-cart.avif" type="image/avif" />
                <img
                  src="/images/events-cart.webp"
                  alt="עגלת גלידה בצבע פיסטוק עם סוכך פסים, בחתונה בגן בשקיעה"
                  width={2000}
                  height={1333}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </picture>
            </div>
            <div className="reveal">
              <h2 id="events-title" className="mb-4">עגלה לאירוע</h2>
              <p className="mb-8 max-w-md">
                חתונות, ימי גיבוש והפקות. בונים עגלה בשלושה צעדים, מקבלים הצעת מחיר תוך 4 שעות עבודה.
              </p>
              <ul className="mb-10 grid grid-cols-3 gap-4">
                {[
                  ["+300", "אירועים בשנה"],
                  ["4", "שעות עד מענה"],
                  ["12", "טעמים בעגלה"],
                ].map(([n, l]) => (
                  <li key={l}>
                    <span dir="ltr" className="block text-end font-display text-4xl font-black text-mango">{n}</span>
                    <span className="text-sm">{l}</span>
                  </li>
                ))}
              </ul>
              <Link href="/events" className="inline-flex rounded-full bg-mango px-7 py-3 font-extrabold text-chocolate">
                בנו עגלה
              </Link>
            </div>
          </div>
        </section>

        {/* Branches */}
        <section className="py-24" aria-labelledby="branches-title">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <h2 id="branches-title" className="reveal mb-10">שלושה סניפים, ויטרינה אחת</h2>
            <ul className="grid gap-6 md:grid-cols-3">
              {BRANCHES.map((b) => (
                <li key={b.city} className="reveal overflow-hidden rounded-[2rem] bg-white/70">
                  <div className="relative aspect-[3/2] overflow-hidden bg-cloud">
                    <picture>
                      <source srcSet={`/images/branch-${b.slug}.avif`} type="image/avif" />
                      <img
                        src={`/images/branch-${b.slug}.webp`}
                        alt={`חזית סניף נובולה ב${b.city}, ${b.area}`}
                        width={1600}
                        height={1067}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </picture>
                  </div>
                  <div className="p-6">
                    <h3>{b.city}</h3>
                    <p>{b.area}</p>
                    <p className="mt-3 text-sm">{b.hours}</p>
                    <p className={`mt-3 inline-block rounded-full px-3 py-0.5 text-sm font-extrabold ${b.open ? "bg-pistachio/50" : "bg-chocolate/10"}`}>
                      {b.open ? "פתוח עכשיו" : "נפתח ב-12:00"}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

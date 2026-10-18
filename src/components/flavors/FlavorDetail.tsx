"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import FlavorTags from "@/components/site/FlavorTags";
import { BRANCHES, FLAVORS, type Flavor } from "@/data/site";

gsap.registerPlugin(useGSAP);

// Where floating ingredients sit around the scoop (percent of the stage), and how strongly each follows the mouse.
const SPOTS = [
  { top: 8, start: 4, size: 30, depth: 40, rot: -18 },
  { top: 60, start: 70, size: 26, depth: 28, rot: 22 },
  { top: 12, start: 72, size: 20, depth: 55, rot: 35 },
];

/**
 * Single flavor (spec: "עמוד טעם"). Lead animation: ingredients float around the scoop and
 * react to the mouse (transform only). Reduced motion: everything stays put.
 */
export default function FlavorDetail({ flavor }: { flavor: Flavor }) {
  const stage = useRef<HTMLDivElement>(null);
  const [voted, setVoted] = useState(false);
  const others = FLAVORS.filter((f) => f.slug !== flavor.slug).slice(0, 3);
  const available = BRANCHES.filter((b) => flavor.branches.includes(b.slug));

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".detail-scoop", { y: 60, opacity: 0, duration: 0.9, ease: "back.out(1.4)" });
        gsap.from(".floater", { scale: 0, opacity: 0, duration: 0.8, delay: 0.3, stagger: 0.12, ease: "back.out(1.6)" });
        // gentle idle float
        gsap.utils.toArray<HTMLElement>(".floater-inner").forEach((el, i) => {
          gsap.to(el, { y: i % 2 ? 14 : -14, rotation: i % 2 ? 6 : -6, duration: 2.4 + i * 0.4, ease: "sine.inOut", yoyo: true, repeat: -1 });
        });
        // mouse parallax
        const movers = gsap.utils.toArray<HTMLElement>(".floater").map((el) => ({
          depth: Number(el.dataset.depth),
          x: gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" }),
          y: gsap.quickTo(el, "y", { duration: 0.8, ease: "power3.out" }),
        }));
        const scoopX = gsap.quickTo(".detail-scoop", "x", { duration: 1, ease: "power3.out" });
        const scoopY = gsap.quickTo(".detail-scoop", "y", { duration: 1, ease: "power3.out" });
        const onMove = (e: PointerEvent) => {
          const r = stage.current!.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          movers.forEach((m) => {
            m.x(nx * m.depth);
            m.y(ny * m.depth);
          });
          scoopX(nx * -10);
          scoopY(ny * -10);
        };
        const el = stage.current!;
        el.addEventListener("pointermove", onMove);
        return () => el.removeEventListener("pointermove", onMove);
      });
    },
    { scope: stage },
  );

  return (
    <>
      <nav aria-label="פירורי לחם" className="py-6 text-sm">
        <Link href="/flavors" className="inline-block py-2 font-extrabold underline underline-offset-4">
          → כל הטעמים
        </Link>
      </nav>

      <div className="grid items-center gap-10 pb-16 md:grid-cols-2">
        {/* Stage */}
        <div ref={stage} className="relative mx-auto aspect-square w-full max-w-xl">
          <div className="absolute inset-[10%] rounded-full opacity-40" style={{ background: flavor.color }} />
          <picture className="absolute inset-0">
            <source srcSet={`/images/flavor-${flavor.slug}.avif`} type="image/avif" />
            <img
              src={`/images/flavor-${flavor.slug}.webp`}
              alt={`כדור ג׳לטו ${flavor.name}`}
              width={1200}
              height={1500}
              fetchPriority="high"
              className="detail-scoop h-full w-full object-contain"
            />
          </picture>
          {flavor.floaters.map((name, i) => {
            const s = SPOTS[i % SPOTS.length];
            return (
              <div
                key={i}
                aria-hidden
                data-depth={s.depth}
                className="floater absolute"
                style={{ top: `${s.top}%`, insetInlineStart: `${s.start}%`, width: `${s.size}%` }}
              >
                <picture className="floater-inner block" style={{ rotate: `${s.rot}deg` }}>
                  <source srcSet={`/images/ingredient-${name}.avif`} type="image/avif" />
                  <img src={`/images/ingredient-${name}.webp`} alt="" width={800} height={800} className="w-full" />
                </picture>
              </div>
            );
          })}
        </div>

        {/* Info */}
        <div>
          <h1 className="mb-4 text-[clamp(2.75rem,6vw,5.5rem)]">{flavor.name}</h1>
          <p className="mb-4 font-extrabold">{flavor.note}</p>
          <p className="mb-6 max-w-lg text-lg">{flavor.description}</p>
          <FlavorTags flavor={flavor} className="mb-8" />

          <dl className="mb-8 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="mb-2 font-display text-xl font-bold">רכיבים</dt>
              <dd>
                <ul className="list-inside list-disc space-y-1">
                  {flavor.ingredients.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt className="mb-2 font-display text-xl font-bold">אלרגנים</dt>
              <dd>{flavor.allergens.length ? flavor.allergens.join(" · ") : "ללא אלרגנים עיקריים"}</dd>
            </div>
          </dl>

          <h2 className="mb-3 text-2xl">איפה אפשר לטעום היום</h2>
          <ul className="mb-8 flex flex-wrap gap-2">
            {BRANCHES.map((b) => {
              const here = flavor.branches.includes(b.slug);
              return (
                <li
                  key={b.slug}
                  className={`rounded-full px-4 py-1.5 text-sm font-extrabold ${here ? "bg-pistachio/50" : "bg-chocolate/10 line-through decoration-2"}`}
                >
                  {b.city}
                  <span className="sr-only">{here ? " — זמין" : " — לא זמין היום"}</span>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/branches" className="inline-flex rounded-full bg-cherry px-7 py-3 font-extrabold text-white">
              {available.length ? "לסניף הקרוב" : "לכל הסניפים"}
            </Link>
            <button
              type="button"
              aria-pressed={voted}
              onClick={() => setVoted(true)}
              disabled={voted}
              className="inline-flex rounded-full border-2 border-chocolate px-7 py-3 font-extrabold disabled:opacity-60"
            >
              {voted ? "הצבעתם! נעדכן כשהוא חוזר" : "תחזירו את הטעם"}
            </button>
          </div>
          <p className="mt-3 text-sm" aria-live="polite">
            {voted ? "בדמו הזה ההצבעה לא נשמרת." : "נגמר בסניף שלכם? הצביעו, והטעם עם הכי הרבה קולות חוזר לוויטרינה."}
          </p>
        </div>
      </div>

      <section aria-labelledby="more-title" className="border-t border-chocolate/10 py-16">
        <h2 id="more-title" className="mb-8">
          עוד מהוויטרינה
        </h2>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {others.map((f) => (
            <li key={f.slug}>
              <Link href={`/flavors/${f.slug}`} className="group block rounded-[2rem] bg-white/70 p-5 transition-transform duration-500 hover:-translate-y-1">
                <img
                  src={`/images/flavor-${f.slug}.webp`}
                  alt=""
                  width={1200}
                  height={1500}
                  loading="lazy"
                  className="mx-auto mb-3 aspect-[4/5] w-full object-contain transition-transform duration-700 group-hover:scale-105"
                />
                <h3 className="text-xl">{f.name}</h3>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

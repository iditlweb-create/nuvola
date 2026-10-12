"use client";
 

import Link from "next/link";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import FlavorTags from "@/components/site/FlavorTags";
import { BRANCHES, FLAVORS, type BranchSlug } from "@/data/site";

gsap.registerPlugin(Flip);

/**
 * Flavors grid (spec: "טעמים"). Filters: vegan, gluten-free, branch.
 * Lead animation: the page background takes on the color of the flavor under the pointer —
 * done by cross-fading stacked color layers (opacity only, never animating background-color).
 */
export default function FlavorsGrid() {
  const [vegan, setVegan] = useState(false);
  const [glutenFree, setGlutenFree] = useState(false);
  const [branch, setBranch] = useState<BranchSlug | "all">("all");
  const [hovered, setHovered] = useState<string | null>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const visible = useMemo(
    () =>
      FLAVORS.filter(
        (f) => (!vegan || f.vegan) && (!glutenFree || f.glutenFree) && (branch === "all" || f.branches.includes(branch)),
      ),
    [vegan, glutenFree, branch],
  );

  // Capture positions before a filter changes, then animate cards into their new places (Flip).
  const change = (fn: () => void) => {
    if (gridRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      flipState.current = Flip.getState(gridRef.current.querySelectorAll("[data-flip]"));
    }
    fn();
  };
  useLayoutEffect(() => {
    if (!flipState.current) return;
    Flip.from(flipState.current, {
      duration: 0.6,
      ease: "power3.out",
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.5 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.85, duration: 0.35 }),
    });
    flipState.current = null;
  }, [visible]);

  const chip = (on: boolean) =>
    `rounded-full border-2 px-5 py-2 font-extrabold transition-transform duration-300 hover:-translate-y-0.5 ${
      on ? "border-chocolate bg-chocolate text-cream" : "border-chocolate/30 bg-white/70"
    }`;

  return (
    <div className="relative isolate">
      {/* Color layers behind the page, one per flavor */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        {FLAVORS.map((f) => (
          <div
            key={f.slug}
            className="absolute inset-0 transition-opacity duration-700 ease-[var(--ease-soft)]"
            style={{ background: `color-mix(in oklab, ${f.color} 28%, var(--color-cream))`, opacity: hovered === f.slug ? 1 : 0 }}
          />
        ))}
      </div>

      <div className="mb-10 flex flex-wrap items-center gap-3" role="group" aria-label="סינון טעמים">
        <button type="button" aria-pressed={vegan} onClick={() => change(() => setVegan((v) => !v))} className={chip(vegan)}>
          טבעוני
        </button>
        <button type="button" aria-pressed={glutenFree} onClick={() => change(() => setGlutenFree((v) => !v))} className={chip(glutenFree)}>
          ללא גלוטן
        </button>
        <label className="flex items-center gap-2 font-extrabold">
          <span>סניף</span>
          <select
            value={branch}
            onChange={(e) => change(() => setBranch(e.target.value as BranchSlug | "all"))}
            className="rounded-full border-2 border-chocolate/30 bg-white/70 px-4 py-2 font-extrabold"
          >
            <option value="all">כל הסניפים</option>
            {BRANCHES.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.city}
              </option>
            ))}
          </select>
        </label>
        <p className="ms-auto text-sm" aria-live="polite">
          {visible.length} טעמים בוויטרינה
        </p>
      </div>

      {visible.length === 0 ? (
        <p className="py-20 text-center text-lg">אין כרגע טעם שעונה על כל הסינונים. נסו להסיר אחד מהם.</p>
      ) : (
        <ul ref={gridRef} className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {visible.map((f) => (
            <li key={f.slug} data-flip data-flip-id={f.slug}>
              <Link
                href={`/flavors/${f.slug}`}
                onPointerEnter={() => setHovered(f.slug)}
                onPointerLeave={() => setHovered(null)}
                onFocus={() => setHovered(f.slug)}
                onBlur={() => setHovered(null)}
                className="group block rounded-[2rem] bg-white/70 p-4 transition-transform duration-500 ease-[var(--ease-melt)] hover:-translate-y-1 md:p-5"
              >
                <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                  <div className="absolute inset-0 opacity-30" style={{ background: f.color }} />
                  <picture>
                    <source srcSet={`/images/flavor-${f.slug}.avif`} type="image/avif" />
                    <img
                      src={`/images/flavor-${f.slug}.webp`}
                      alt={`כדור ג׳לטו ${f.name}`}
                      width={1200}
                      height={1500}
                      loading="lazy"
                      className="relative h-full w-full object-contain transition-transform duration-700 ease-[var(--ease-melt)] group-hover:-translate-y-2 group-hover:scale-105"
                    />
                  </picture>
                </div>
                <h2 className="text-xl md:text-2xl">{f.name}</h2>
                <p className="text-sm">{f.note}</p>
                <FlavorTags flavor={f} className="mt-3" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

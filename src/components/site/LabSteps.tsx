"use client";
 

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const STEPS = [
  { n: "01", title: "חלב", text: "חלב מקומי מגיע כל בוקר מרפת בגליל, ומתבשל לאט עם סוכר וחלמונים.", color: "var(--color-cloud)", img: "lab-milk", alt: "חלב נשפך מבקבוק זכוכית לסיר נירוסטה" },
  { n: "02", title: "פיסטוק", text: "קולים, טוחנים ומשמנים את הפיסטוק במעבדה. בלי תמציות ובלי צבע.", color: "var(--color-pistachio)", img: "lab-pistachio", alt: "ידיים טוחנות פיסטוק קלוי במכתש אבן" },
  { n: "03", title: "הקצפה", text: "הבסיס מתקרר ומוקצף לאט, כדי להכניס בדיוק מספיק אוויר. מכאן הענן.", color: "var(--color-mango)", img: "lab-whip", alt: "בסיס ג׳לטו פיסטוק מוקצף לאט לעננים רכים" },
  { n: "04", title: "ויטרינה", text: "כל טעם מגיע לוויטרינה באותו בוקר. מה שלא נמכר, לא חוזר מחר.", color: "var(--color-cherry)", img: "lab-vitrine", alt: "ידיים מחליקות מגש ג׳לטו פיסטוק בוויטרינה" },
];

/**
 * "How a flavor is born": a pinned, horizontal scroll through the four lab steps, moving in Hebrew
 * reading order (right → left). Reduced motion / small screens: a plain vertical list.
 */
export default function LabSteps({ title = "איך נולד טעם" }: { title?: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px)", () => {
        const track = root.current!.querySelector<HTMLElement>(".steps-track")!;
        const distance = () => track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: () => distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden bg-cream md:h-svh" aria-labelledby="steps-title">
      <div className="mx-auto max-w-7xl px-4 pt-10 md:absolute md:inset-x-0 md:top-0 md:z-10 md:px-8">
        <h2 id="steps-title">{title}</h2>
      </div>
      <div className="steps-track grid gap-5 px-4 py-8 md:flex md:h-full md:w-max md:items-center md:gap-6 md:pe-[10vw] md:ps-8 md:pt-24 md:pb-0">
        {STEPS.map((s) => (
          <article
            key={s.n}
            className="relative flex min-h-[26rem] w-full shrink-0 flex-col justify-end overflow-hidden rounded-[2.5rem] p-6 md:h-[60svh] md:min-h-0 md:w-[42vw] md:max-w-xl md:p-8"
            style={{ background: s.color }}
          >
            <picture className="absolute inset-x-0 top-0 h-[58%]">
              <source srcSet={`/images/${s.img}.avif`} type="image/avif" />
              <img src={`/images/${s.img}.webp`} alt={s.alt} width={1600} height={1067} loading="lazy" className="h-full w-full object-cover" />
            </picture>
            <div className={s.color.includes("cherry") ? "text-white" : ""}>
              <span className="font-display text-xl font-black opacity-60">{s.n}</span>
              <h3 className="mb-2 text-4xl">{s.title}</h3>
              <p className="max-w-sm">{s.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

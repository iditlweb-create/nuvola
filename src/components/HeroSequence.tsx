"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero in three layers:
 * 1. Sky — a CSS gradient (cloud → cream).
 * 2. Clouds — drift right → left in an endless loop, independent of scroll (CSS, transform only).
 * 3. Scoop — the Magnific video with its background removed, played frame-by-frame on a canvas
 *    and scrubbed by scroll: pistachios, cherry and peach drift outward as you scroll.
 * Reduced motion: clouds stand still and the scoop stays on its first frame (no frames are loaded).
 */
const FRAMES = { d: 96, m: 64 };
const frameUrl = (set: "d" | "m", i: number) => `/hero-seq/${set}/f-${String(i).padStart(3, "0")}.webp`;

// Far clouds are smaller, fainter and slower (parallax). x0 = resting position for reduced motion.
const CLOUDS = [
  { src: 5, top: 38, w: 9, dur: 70, at: 0.15, op: 0.6, x0: 18 },
  { src: 4, top: 8, w: 14, dur: 62, at: 0.62, op: 0.7, x0: 62 },
  { src: 2, top: 22, w: 21, dur: 52, at: 0.3, op: 0.85, x0: 38 },
  { src: 4, top: 52, w: 12, dur: 66, at: 0.9, op: 0.65, x0: 80 },
  { src: 1, top: 3, w: 32, dur: 44, at: 0.78, op: 0.95, x0: 70 },
  { src: 3, top: 60, w: 26, dur: 48, at: 0.05, op: 0.9, x0: 8 },
  { src: 1, top: 74, w: 36, dur: 40, at: 0.5, op: 1, x0: 52 },
];

export default function HeroSequence() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const set: "d" | "m" = window.innerWidth < 768 ? "m" : "d";
    const count = FRAMES[set];
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const frames: HTMLImageElement[] = [];
    let current = 0;
    let alive = true;

    // object-fit: cover, focused 20% from the left like the still image
    const draw = (i: number) => {
      let img: HTMLImageElement | undefined;
      for (let k = i; k >= 0 && !img; k--) if (frames[k]?.complete && frames[k].naturalWidth) img = frames[k];
      if (!img) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const w = img.naturalWidth * s;
      const h = img.naturalHeight * s;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - w) * 0.2, (ch - h) / 2, w, h);
    };

    const size = () => {
      const r = wrapRef.current!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      draw(current);
    };

    const load = (i: number) =>
      new Promise<void>((res) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = img.onerror = () => res();
        img.src = frameUrl(set, i);
        frames[i] = img;
      });

    load(0).then(async () => {
      if (!alive) return;
      size();
      canvas.style.opacity = "1";
      wrapRef.current?.querySelector<HTMLElement>(".hero-still")?.style.setProperty("opacity", "0");
      for (let i = 1; i < count && alive; i += 8) {
        await Promise.all(Array.from({ length: Math.min(8, count - i) }, (_, k) => load(i + k)));
      }
    });

    const ro = new ResizeObserver(size);
    ro.observe(wrapRef.current!);

    const onUpdate = (self: ScrollTrigger) => {
      const i = Math.round(self.progress * (count - 1));
      if (i !== current) {
        current = i;
        draw(i);
      }
    };
    // Desktop: pin the hero while the scene opens up. Mobile: scrub as the hero scrolls past.
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      ScrollTrigger.create({ trigger: ".hero", start: "top top", end: "+=110%", pin: true, scrub: 0.6, refreshPriority: 1, onUpdate });
    });
    mm.add("(max-width: 1023px)", () => {
      ScrollTrigger.create({ trigger: ".hero-media", start: "top 70%", end: "bottom top", scrub: 0.6, onUpdate });
    });
    ScrollTrigger.refresh();

    return () => {
      alive = false;
      ro.disconnect();
      mm.revert();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="hero-media relative -mx-4 aspect-video overflow-hidden bg-gradient-to-b from-cloud to-cream [container-type:inline-size] md:-mx-8 lg:absolute lg:inset-0 lg:-z-10 lg:mx-0 lg:aspect-auto"
    >
      {/* Layer 2: looping clouds */}
      <div aria-hidden className="absolute inset-0">
        {CLOUDS.map((c, i) => (
          <img
            key={i}
            src={`/images/hero-cloud-${c.src}.webp`}
            alt=""
            className="cloud-drift absolute end-0 h-auto max-w-none"
            style={
              {
                top: `${c.top}%`,
                width: `${c.w}cqw`,
                opacity: c.op,
                animationDuration: `${c.dur}s`,
                animationDelay: `${-c.dur * c.at}s`,
                "--x0": `${c.x0}cqw`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Layer 3: the scoop (still first frame until the sequence is ready) */}
      <img
        src="/images/hero-subject.webp"
        alt="כדור ג׳לטו פיסטוק נמס על ענן, עם דובדבן, פרוסת אפרסק ופיסטוקים שמרחפים סביבו"
        width={1600}
        height={900}
        fetchPriority="high"
        className="hero-still absolute inset-0 h-full w-full object-cover object-[20%_center] transition-opacity duration-300"
      />
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full opacity-0" />
    </div>
  );
}

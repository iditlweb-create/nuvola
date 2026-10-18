"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

/** Wraps a piece of an illustration and pops it in (scale + opacity) when it first appears. */
export default function Pop({ children, className = "", style }: { children?: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // fromTo (not from): safe when React runs the effect twice in development
    const t = gsap.fromTo(ref.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(2)" });
    return () => {
      t.kill();
    };
  }, []);
  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Logo from "@/components/Logo";
import { NAV } from "@/data/site";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const isActive = (href: string) => path === href || path.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-chocolate/10 bg-cream/90 backdrop-blur">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded focus:bg-cream focus:p-2"
      >
        דילוג לתוכן
      </a>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-3 md:px-8">
        <Link href="/" aria-label="נובולה — דף הבית">
          <Logo />
        </Link>
        <nav aria-label="ניווט ראשי" className="hidden lg:block">
          <ul className="flex gap-6 text-base">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`hover:text-cherry ${isActive(item.href) ? "font-extrabold text-cherry" : ""}`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/game" className="hidden rounded-full bg-cherry px-5 py-2 font-extrabold text-white sm:inline-flex">
            לשחק ולזכות
          </Link>
          <button
            type="button"
            className="rounded-full border-2 border-chocolate px-4 py-1.5 font-extrabold lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "סגירה" : "תפריט"}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="ניווט ראשי" className="border-t border-chocolate/10 px-4 pb-4 lg:hidden">
          <ul className="grid gap-1 pt-2 text-lg">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="block py-2" onClick={() => setOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

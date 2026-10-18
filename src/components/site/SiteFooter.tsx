"use client";

import Link from "next/link";
import Logo from "@/components/Logo";

export default function SiteFooter() {
  return (
    <footer className="bg-pistachio">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 md:grid-cols-2 md:px-8">
        <div>
          <h2 className="mb-3 text-[clamp(2rem,4vw,3rem)]">מועדון נובולה</h2>
          <p className="mb-6 max-w-md">הטעמים של הדרופ לפני כולם, וכדור במתנה ביום ההולדת.</p>
          <form className="flex max-w-md flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
            <label className="flex flex-col gap-1">
              <span className="font-extrabold">טלפון נייד</span>
              <input type="tel" inputMode="tel" autoComplete="tel" dir="ltr" className="rounded-full border-2 border-chocolate bg-cream px-5 py-3 text-end" />
            </label>
            <label className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="mt-1 size-4 accent-cherry" />
              <span>אני מסכימה לקבל עדכונים ודיוור שיווקי מנובולה</span>
            </label>
            <button type="submit" className="self-start rounded-full bg-cherry px-7 py-3 font-extrabold text-white">
              להצטרף
            </button>
          </form>
        </div>
        <div className="flex flex-col justify-between gap-8">
          <Logo />
          <ul className="flex flex-wrap gap-x-6 text-sm [&_a]:inline-block [&_a]:py-2.5">
            <li>
              <Link href="/accessibility">הצהרת נגישות</Link>
            </li>
            <li>
              <Link href="/privacy">מדיניות פרטיות</Link>
            </li>
            <li>
              <Link href="/game-terms">תקנון המשחק</Link>
            </li>
            <li>
              <Link href="/demo" className="font-extrabold underline">
                מערכת העיצוב (עמוד דמו)
              </Link>
            </li>
          </ul>
          <p className="text-sm">פרויקט קונספט לתיק עבודות. נובולה היא מותג פיקטיבי, והתמונות נוצרו בבינה מלאכותית.</p>
        </div>
      </div>
    </footer>
  );
}

"use client";
/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useMemo, useState } from "react";
import Pop from "@/components/site/Pop";
import { FLAVORS } from "@/data/site";

/* Spec: "אירועים" — quality inquiries with every detail. Lead animation: the cart builds itself with each choice. */

const TYPES = [
  { id: "wedding", label: "חתונה", text: "עמדת ג׳לטו בגן, עם טעימה מוקדמת לזוג.", canopy: "var(--color-cherry)" },
  { id: "corporate", label: "יום גיבוש וחברה", text: "פינוק לעובדים, הפקה מהירה וחשבונית מסודרת.", canopy: "var(--color-pistachio)" },
  { id: "birthday", label: "יום הולדת ובר מצווה", text: "בר תוספות צבעוני ושלט עם השם, בלי בלגן.", canopy: "var(--color-mango)" },
  { id: "brand", label: "הפקה ואירוע מותג", text: "עגלה ממותגת וטעם בהתאמה אישית להשקה.", canopy: "var(--color-chocolate)" },
] as const;
type TypeId = (typeof TYPES)[number]["id"];

const EXTRAS = [
  { id: "cones", label: "גביעי וופל טריים", price: (g: number) => g * 4 },
  { id: "toppings", label: "בר תוספות", price: () => 500 },
  { id: "vegan", label: "סורבה טבעוני נוסף", price: () => 250 },
  { id: "canopy", label: "סוכך ממותג", price: () => 350 },
] as const;
type ExtraId = (typeof EXTRAS)[number]["id"];

const HOURS = { 2: 1800, 3: 2400, 4: 3000 } as const;
const FLAVOR_COUNTS = { 4: 0, 6: 300, 8: 600, 12: 1100 } as const;
const BALLS = ["pistachio", "raspberry", "mango", "chocolate", "vanilla", "mint"];
const ils = (n: number) => `₪${(Math.round(n / 10) * 10).toLocaleString("he-IL")}`;

export default function EventsPage() {
  const [type, setType] = useState<TypeId>("wedding");
  const [guests, setGuests] = useState(120);
  const [hours, setHours] = useState<keyof typeof HOURS>(3);
  const [flavors, setFlavors] = useState<keyof typeof FLAVOR_COUNTS>(6);
  const [extras, setExtras] = useState<ExtraId[]>(["cones"]);
  const [step, setStep] = useState(1);
  const [sent, setSent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const price = useMemo(() => {
    const base = HOURS[hours] + guests * 12 + FLAVOR_COUNTS[flavors];
    const add = EXTRAS.filter((e) => extras.includes(e.id)).reduce((sum, e) => sum + e.price(guests), 0);
    return base + add;
  }, [guests, hours, flavors, extras]);

  const toggleExtra = (id: ExtraId) => setExtras((xs) => (xs.includes(id) ? xs.filter((x) => x !== id) : [...xs, id]));
  const canopyColor = TYPES.find((t) => t.id === type)!.canopy;
  const visibleTubs = Math.min(flavors, 6);

  const next = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (step === 1 && !fd.get("date")) return setError("באיזה תאריך האירוע?");
    if (step === 3) {
      const name = String(fd.get("name") ?? "").trim();
      const phone = String(fd.get("phone") ?? "").replace(/[\s-]/g, "");
      if (!name) return setError("איך קוראים לך?");
      if (!/^05\d{8}$/.test(phone)) return setError("מספר נייד בפורמט 05X-XXXXXXX");
      setSent(name);
      console.info("[nuvola:event]", "event_inquiry", { type, guests, hours, flavors, extras });
    }
    setError(null);
    setStep((s) => Math.min(3, s + 1));
  };

  const chip = (on: boolean) =>
    `rounded-full border-2 px-4 py-2 text-sm font-extrabold transition-transform duration-300 hover:-translate-y-0.5 sm:text-base ${
      on ? "border-chocolate bg-chocolate text-cream" : "border-chocolate/25 bg-white/80"
    }`;

  return (
    <>
      {/* Hero */}
      <section className="bg-chocolate text-cream">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:px-8 md:py-20">
          <div>
            <p className="mb-3 inline-block rounded-full bg-mango px-4 py-1 font-extrabold text-chocolate">יותר מ־300 אירועים בשנה</p>
            <h1 className="mb-4">עגלה לאירוע</h1>
            <p className="mb-8 max-w-md text-lg">חתונות, ימי גיבוש והפקות. בונים עגלה כאן למטה, מקבלים הערכת מחיר מיד והצעה מסודרת תוך 4 שעות עבודה.</p>
            <a href="#builder" className="inline-flex rounded-full bg-mango px-7 py-3 font-extrabold text-chocolate">
              בנו עגלה
            </a>
          </div>
          <picture>
            <source srcSet="/images/events-cart.avif" type="image/avif" />
            <img
              src="/images/events-cart.webp"
              alt="עגלת גלידה בצבע פיסטוק עם סוכך פסים, בחתונה בגן בשקיעה"
              width={2000}
              height={1333}
              fetchPriority="high"
              className="w-full rounded-[2.5rem]"
            />
          </picture>
        </div>
      </section>

      {/* Event types */}
      <section aria-labelledby="types-title" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <h2 id="types-title" className="mb-8">
          לאיזה אירוע?
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TYPES.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                aria-pressed={type === t.id}
                onClick={() => setType(t.id)}
                className={`h-full w-full rounded-[2rem] p-6 text-start transition-transform duration-500 hover:-translate-y-1 ${
                  type === t.id ? "bg-chocolate text-cream" : "bg-white/80"
                }`}
              >
                <span className="mb-4 block h-2 w-14 rounded-full" style={{ background: t.canopy }} />
                <span className="block font-display text-2xl font-bold">{t.label}</span>
                <span className="mt-2 block text-sm">{t.text}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Builder */}
      <section id="builder" aria-labelledby="builder-title" className="scroll-mt-20 bg-cloud">
        <div className="mx-auto max-w-7xl px-4 pt-16 md:px-8">
          <h2 id="builder-title" className="mb-2">
            בנו עגלה
          </h2>
          <p className="max-w-md">כל בחירה מוסיפה משהו לעגלה, והמחיר מתעדכן בזמן אמת.</p>
        </div>
        <div className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 pt-6 md:px-8 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-10 lg:pt-8">
          <div>

            <div className="space-y-7">
              <div>
                <label htmlFor="guests" className="mb-2 flex justify-between font-extrabold">
                  <span>כמה אורחים?</span>
                  <span className="tabular-nums">{guests}</span>
                </label>
                <input
                  id="guests"
                  type="range"
                  min={30}
                  max={500}
                  step={10}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full accent-cherry"
                />
              </div>
              <fieldset>
                <legend className="mb-2 font-extrabold">כמה שעות?</legend>
                <div className="flex flex-wrap gap-2">
                  {([2, 3, 4] as const).map((h) => (
                    <button key={h} type="button" aria-pressed={hours === h} onClick={() => setHours(h)} className={chip(hours === h)}>
                      {h} שעות
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="mb-2 font-extrabold">כמה טעמים בעגלה?</legend>
                <div className="flex flex-wrap gap-2">
                  {([4, 6, 8, 12] as const).map((n) => (
                    <button key={n} type="button" aria-pressed={flavors === n} onClick={() => setFlavors(n)} className={chip(flavors === n)}>
                      {n} טעמים
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="mb-2 font-extrabold">תוספות</legend>
                <div className="flex flex-wrap gap-2">
                  {EXTRAS.map((x) => (
                    <button key={x.id} type="button" aria-pressed={extras.includes(x.id)} onClick={() => toggleExtra(x.id)} className={chip(extras.includes(x.id))}>
                      {x.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>

          {/* The cart, built from the choices */}
          <div className="sticky top-[4.25rem] z-10 order-first -mx-4 bg-cloud/95 px-4 pb-3 pt-2 backdrop-blur lg:top-24 lg:order-none lg:mx-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
            <div className="relative mx-auto aspect-[5/4] w-full max-w-[15rem] overflow-hidden rounded-[1.75rem] bg-cream sm:max-w-sm lg:max-w-xl lg:rounded-[2.5rem]" aria-hidden>
              {/* canopy */}
              {extras.includes("canopy") && (
                <Pop key={`canopy-${type}`} className="absolute inset-x-[14%] top-[8%] h-[16%] origin-bottom">
                  <div
                    className="h-full w-full rounded-t-[50%]"
                    style={{ background: `repeating-linear-gradient(90deg, ${canopyColor} 0 12%, var(--color-cream) 12% 24%)` }}
                  />
                </Pop>
              )}
              {extras.includes("canopy") && (
                <>
                  <div className="absolute start-[18%] top-[22%] h-[30%] w-[1.5%] rounded-full bg-chocolate/70" />
                  <div className="absolute end-[18%] top-[22%] h-[30%] w-[1.5%] rounded-full bg-chocolate/70" />
                </>
              )}
              {/* glass display with tubs */}
              <div className="absolute inset-x-[16%] top-[42%] flex h-[16%] items-end justify-center gap-[2%] rounded-t-2xl border-4 border-white/90 bg-white/40 px-[3%]">
                {Array.from({ length: visibleTubs }).map((_, i) => (
                  <Pop key={`tub-${i}`} className="w-[15%]">
                    <img src={`/images/game-ball-${BALLS[i % BALLS.length]}.webp`} alt="" className="w-full" />
                  </Pop>
                ))}
                {extras.includes("vegan") && (
                  <Pop key="vegan" className="w-[15%]">
                    <img src="/images/game-ball-mango.webp" alt="" className="w-full" />
                  </Pop>
                )}
              </div>
              {/* cart body */}
              <div className="absolute inset-x-[12%] top-[58%] h-[22%] rounded-2xl" style={{ background: canopyColor === "var(--color-chocolate)" ? "var(--color-mango)" : "var(--color-pistachio)" }} />
              {/* wheels */}
              <div className="absolute start-[20%] top-[74%] size-[13%] rounded-full border-[6px] border-chocolate bg-cream" />
              <div className="absolute end-[20%] top-[74%] size-[13%] rounded-full border-[6px] border-chocolate bg-cream" />
              {/* cones */}
              {extras.includes("cones") && (
                <Pop key="cones" className="absolute end-[3%] top-[44%] w-[12%]">
                  <img src="/images/game-cone.webp" alt="" className="w-full" />
                  <img src="/images/game-cone.webp" alt="" className="-mt-[85%] w-full" />
                </Pop>
              )}
              {/* toppings */}
              {extras.includes("toppings") && (
                <Pop key="toppings" className="absolute start-[3%] top-[48%] flex w-[10%] flex-col gap-[6%]">
                  {["var(--color-cherry)", "var(--color-mango)", "var(--color-chocolate)"].map((c) => (
                    <span key={c} className="block aspect-square w-full rounded-lg border-2 border-white" style={{ background: c }} />
                  ))}
                </Pop>
              )}
              {/* guests badge */}
              <div className="absolute start-[5%] top-[5%] rounded-full bg-chocolate px-3 py-1 text-xs font-extrabold text-cream sm:text-sm">
                {guests} אורחים · {hours} שעות
              </div>
            </div>

            <p className="mt-2 text-center font-extrabold lg:hidden" aria-hidden>
              הערכה: <bdi>{ils(price * 0.92)}</bdi> – <bdi>{ils(price * 1.08)}</bdi>
            </p>
            <div className="mx-auto mt-6 hidden max-w-xl rounded-[2rem] bg-chocolate p-6 text-cream lg:block" aria-live="polite">
              <p className="text-sm">הערכת מחיר (כולל מע״מ)</p>
              <p className="font-display text-4xl font-black">
                <bdi>{ils(price * 0.92)}</bdi> – <bdi>{ils(price * 1.08)}</bdi>
              </p>
              <p className="mt-2 text-sm">
                {flavors} טעמים מתוך 32 בתחלופה · ההצעה הסופית תלויה במיקום ובתאריך.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3-step inquiry */}
      <section aria-labelledby="inquiry-title" className="mx-auto max-w-3xl px-4 py-16 md:px-8">
        <h2 id="inquiry-title" className="mb-2">
          שולחים פנייה
        </h2>
        <p className="mb-8">שלושה צעדים קצרים, ותשובה תוך 4 שעות עבודה.</p>

        {sent ? (
          <div className="rounded-[2rem] bg-pistachio/50 p-8" role="status">
            <p className="font-display text-3xl font-black">תודה, {sent}!</p>
            <p className="mt-2">
              קיבלנו פנייה ל{TYPES.find((t) => t.id === type)!.label} עם {guests} אורחים. דנה ממחלקת האירועים תחזור אלייך תוך 4 שעות עבודה. בדמו הזה הפנייה לא נשלחת.
            </p>
          </div>
        ) : (
          <>
            <ol className="mb-6 flex gap-2" aria-label="שלבי הטופס">
              {["פרטי האירוע", "טעמים והעדפות", "פרטים ליצירת קשר"].map((label, i) => (
                <li
                  key={label}
                  aria-current={step === i + 1 ? "step" : undefined}
                  className={`flex-1 rounded-full px-3 py-2 text-center text-xs font-extrabold sm:text-sm ${step >= i + 1 ? "bg-chocolate text-cream" : "bg-chocolate/10"}`}
                >
                  {i + 1}. {label}
                </li>
              ))}
            </ol>
            <form onSubmit={next} noValidate className="grid gap-4 rounded-[2rem] bg-white/80 p-6 md:p-8">
              {step === 1 && (
                <>
                  <label className="grid gap-1">
                    <span className="font-extrabold">סוג האירוע</span>
                    <select value={type} onChange={(e) => setType(e.target.value as TypeId)} className="rounded-full border-2 border-chocolate/30 bg-cream px-4 py-3">
                      {TYPES.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-1">
                      <span className="font-extrabold">תאריך</span>
                      <input name="date" type="date" className="rounded-full border-2 border-chocolate/30 bg-cream px-4 py-3" />
                    </label>
                    <label className="grid gap-1">
                      <span className="font-extrabold">מספר אורחים</span>
                      <input type="number" min={30} value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="rounded-full border-2 border-chocolate/30 bg-cream px-4 py-3" />
                    </label>
                  </div>
                  <label className="grid gap-1">
                    <span className="font-extrabold">עיר / מקום האירוע</span>
                    <input name="place" autoComplete="address-level2" className="rounded-full border-2 border-chocolate/30 bg-cream px-4 py-3" />
                  </label>
                </>
              )}
              {step === 2 && (
                <>
                  <fieldset>
                    <legend className="mb-2 font-extrabold">טעמים שאתם כבר יודעים שתרצו (לא חובה)</legend>
                    <div className="flex flex-wrap gap-2">
                      {FLAVORS.map((f) => (
                        <label key={f.slug} className="flex items-center gap-2 rounded-full bg-cream px-3 py-1.5 text-sm">
                          <input type="checkbox" name="flavors" value={f.slug} className="size-4 accent-cherry" />
                          {f.name}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <fieldset>
                    <legend className="mb-2 font-extrabold">דרישות מיוחדות</legend>
                    <div className="flex flex-wrap gap-2">
                      {["טבעוני", "ללא גלוטן", "כשרות מהדרין", "ללא אגוזים"].map((d) => (
                        <label key={d} className="flex items-center gap-2 rounded-full bg-cream px-3 py-1.5 text-sm">
                          <input type="checkbox" name="diet" value={d} className="size-4 accent-cherry" />
                          {d}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </>
              )}
              {step === 3 && (
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-1">
                      <span className="font-extrabold">שם</span>
                      <input name="name" autoComplete="name" className="rounded-full border-2 border-chocolate/30 bg-cream px-4 py-3" />
                    </label>
                    <label className="grid gap-1">
                      <span className="font-extrabold">טלפון נייד</span>
                      <input name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" className="rounded-full border-2 border-chocolate/30 bg-cream px-4 py-3 text-end" />
                    </label>
                  </div>
                  <label className="grid gap-1">
                    <span className="font-extrabold">אימייל (לא חובה)</span>
                    <input name="email" type="email" autoComplete="email" dir="ltr" className="rounded-full border-2 border-chocolate/30 bg-cream px-4 py-3 text-end" />
                  </label>
                  <label className="grid gap-1">
                    <span className="font-extrabold">משהו שחשוב שנדע?</span>
                    <textarea name="notes" rows={3} className="rounded-3xl border-2 border-chocolate/30 bg-cream px-4 py-3" />
                  </label>
                  <label className="flex items-start gap-2 text-sm">
                    <input type="checkbox" name="marketing" className="mt-1 size-4 accent-cherry" />
                    <span>אשמח לקבל עדכונים ודיוור שיווקי מנובולה (לא חובה)</span>
                  </label>
                  <p className="text-xs">
                    הפרטים משמשים רק לטיפול בפנייה. ראו <Link href="/privacy" className="underline">מדיניות פרטיות</Link>.
                  </p>
                </>
              )}
              {error && (
                <p role="alert" className="font-extrabold text-cherry">
                  {error}
                </p>
              )}
              <div className="flex flex-wrap justify-between gap-3">
                {step > 1 ? (
                  <button type="button" onClick={() => setStep((s) => s - 1)} className="rounded-full border-2 border-chocolate px-6 py-3 font-extrabold">
                    → חזרה
                  </button>
                ) : (
                  <span />
                )}
                <button type="submit" className="rounded-full bg-cherry px-7 py-3 font-extrabold text-white">
                  {step < 3 ? "המשך ←" : "שליחת הפנייה"}
                </button>
              </div>
            </form>
          </>
        )}
      </section>
    </>
  );
}

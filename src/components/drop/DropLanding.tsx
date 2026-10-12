"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

/**
 * Monthly drop landing page (spec: "דרופ חודשי"). Goal: sign up for a reminder before launch.
 * Lead animation: each flavor sits in a tub whose lid opens on its own reveal date.
 * "הציצו קדימה" advances a simulated date so the portfolio viewer can watch the lids open.
 */
const DAY = 24 * 3600 * 1000;
const DROP = [
  { name: "פיסטוק ופרחי תפוז", note: "פיסטוק מברונטה עם מי זהר", ball: "pistachio", lid: "var(--color-pistachio)", at: "2026-11-01T10:00:00+02:00" },
  { name: "תות שדה וחלב עיזים", note: "חמצמץ, עדין, קצת מלוח", ball: "raspberry", lid: "var(--color-cherry)", at: "2026-11-08T10:00:00+02:00" },
  { name: "פסיפלורה ומנגו", note: "סורבה טבעוני עם גרעינים פריכים", ball: "mango", lid: "var(--color-mango)", at: "2026-11-15T10:00:00+02:00" },
  { name: "שוקולד וחלבה", note: "טחינה גולמית ושבבי חלבה", ball: "chocolate", lid: "var(--color-chocolate)", at: "2026-11-22T10:00:00+02:00" },
].map((d) => ({ ...d, time: new Date(d.at).getTime() }));

const fmtDate = (t: number) => new Intl.DateTimeFormat("he-IL", { day: "numeric", month: "numeric" }).format(t);

function split(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
}

export default function DropLanding() {
  const root = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState<number | null>(null);
  const [weeksAhead, setWeeksAhead] = useState(0);
  const [signed, setSigned] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Simulated "now": real time, or the morning after the Nth reveal when peeking ahead
  const simNow = now === null ? null : weeksAhead === 0 ? now : DROP[weeksAhead - 1].time + 60 * 1000;
  const openCount = simNow === null ? 0 : DROP.filter((d) => simNow >= d.time).length;
  const next = simNow === null ? null : DROP.find((d) => simNow < d.time) ?? null;
  const cd = next && simNow !== null ? split(next.time - simNow) : null;

  // Animate each lid as it becomes open (transform only)
  const opened = useRef<boolean[]>(DROP.map(() => false));
  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      DROP.forEach((_, i) => {
        const isOpen = i < openCount;
        if (isOpen === opened.current[i]) return;
        opened.current[i] = isOpen;
        const lid = `.tub-${i} .tub-lid`;
        const scoop = `.tub-${i} .tub-scoop`;
        const d = reduce ? 0 : 1;
        if (isOpen) {
          gsap
            .timeline()
            .to(lid, { rotation: -118, x: "-18%", y: "-30%", duration: 0.9 * d, ease: "back.out(1.6)" })
            .to(scoop, { yPercent: -55, duration: 0.8 * d, ease: "back.out(1.8)" }, "-=0.55")
            .fromTo(`.tub-${i} .tub-spark`, { scale: 0, opacity: 1 }, { scale: 1.6, opacity: 0, duration: 0.7 * d, stagger: 0.05 }, "-=0.4");
        } else {
          gsap.to(lid, { rotation: 0, x: 0, y: 0, duration: 0.5 * d, ease: "power2.inOut" });
          gsap.to(scoop, { yPercent: 0, duration: 0.4 * d });
        }
      });
    },
    { scope: root, dependencies: [openCount] },
  );

  // Entrance: tubs rise in one after another
  useGSAP(
    () => {
      gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".tub", { y: 80, opacity: 0, duration: 0.8, ease: "back.out(1.4)", stagger: 0.12, delay: 0.2 });
        gsap.from(".drop-fade", { y: 24, opacity: 0, duration: 0.7, stagger: 0.08, ease: "power3.out" });
      });
    },
    { scope: root },
  );

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").replace(/[\s-]/g, "");
    if (!name) return setError("איך לקרוא לך בתזכורת?");
    if (!/^05\d{8}$/.test(phone)) return setError("מספר נייד בפורמט 05X-XXXXXXX");
    setError(null);
    setSigned(name);
    console.info("[nuvola:event]", "drop_reminder", { marketing: Boolean(fd.get("marketing")) });
  };

  const ics = () => {
    const pad = (t: number) => new Date(t).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const events = DROP.map(
      (d, i) =>
        `BEGIN:VEVENT\nUID:nuvola-drop-${i}@nuvola.example\nDTSTAMP:${pad(Date.now())}\nDTSTART:${pad(d.time)}\nDTEND:${pad(d.time + 3600000)}\nSUMMARY:נובולה · נפתח טעם הדרופ: ${d.name}\nEND:VEVENT`,
    ).join("\n");
    return `data:text/calendar;charset=utf-8,${encodeURIComponent(`BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//NUVOLA//Drop//HE\n${events}\nEND:VCALENDAR`)}`;
  };

  const shareText = "הדרופ של נובולה לנובמבר: ארבעה טעמים, אחד בכל שבוע. מי בא איתי?";
  const copy = async () => {
    await navigator.clipboard?.writeText(`${shareText} ${location.href}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div ref={root}>
      {/* Hero */}
      <section className="relative overflow-hidden bg-mango">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 md:grid-cols-2 md:px-8 md:py-20">
          <div>
            <p className="drop-fade mb-3 inline-block rounded-full bg-cream px-4 py-1 font-extrabold">הדרופ של נובמבר · מהדורה מוגבלת</p>
            <h1 className="drop-fade mb-4">ארבעה טעמים. חודש אחד.</h1>
            <p className="drop-fade mb-8 max-w-md text-lg">
              כל שבוע נפתח טעם חדש, רק עד שהוא נגמר. השאירו פרטים ונזכיר לכם יום לפני כל פתיחה, כדי שתגיעו לפני התור.
            </p>

            <div className="drop-fade" aria-live="off">
              <p className="mb-2 font-extrabold">{next ? `הטעם הבא נפתח ב־${fmtDate(next.time)}, בעוד` : "כל ארבעת הטעמים בחוץ!"}</p>
              {cd && (
                <dl className="flex gap-3 text-center">
                  {(
                    [
                      ["ימים", cd.d],
                      ["שעות", cd.h],
                      ["דקות", cd.m],
                      ["שניות", cd.s],
                    ] as const
                  ).map(([label, v]) => (
                    <div key={label} className="min-w-16 rounded-2xl bg-cream px-3 py-2">
                      <dd className="font-display text-3xl font-black tabular-nums">{v}</dd>
                      <dt className="text-sm">{label}</dt>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>
          <div className="drop-fade relative mx-auto w-full max-w-md">
            <picture>
              <source srcSet="/images/drop-box.avif" type="image/avif" />
              <img
                src="/images/drop-box.webp"
                alt="קופסת גלידה פתוחה עם ארבעה כדורים בצבעי הדרופ"
                width={1600}
                height={1600}
                fetchPriority="high"
                className="w-full rounded-[2.5rem]"
              />
            </picture>
          </div>
        </div>
      </section>

      {/* The four tubs */}
      <section aria-labelledby="tubs-title" className="bg-cloud">
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="tubs-title">כל שבוע, מכסה נפתח</h2>
            <p className="mt-2 max-w-md">הטעמים נעולים עד הבוקר שלהם. אחרי שהם נפתחים, הם בוויטרינה רק עד שנגמרים.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setWeeksAhead((w) => (w + 1) % (DROP.length + 1))}
              className="rounded-full border-2 border-chocolate px-5 py-2 font-extrabold"
            >
              {weeksAhead === DROP.length ? "חזרה להיום" : "הציצו קדימה (דמו)"}
            </button>
            {simNow !== null && weeksAhead > 0 && (
              <span className="rounded-full bg-cloud px-3 py-1 text-sm font-extrabold">מדמים את {fmtDate(simNow)}</span>
            )}
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {DROP.map((d, i) => {
            const isOpen = i < openCount;
            return (
              <li key={d.name} className={`tub tub-${i}`}>
                <div className="relative mx-auto aspect-[4/5] w-full max-w-[15rem]">
                  {/* scoop rises out of the tub when open */}
                  <img
                    src={`/images/game-ball-${d.ball}.webp`}
                    alt=""
                    width={512}
                    height={512}
                    className="tub-scoop absolute inset-x-[12%] bottom-[6%] w-[76%]"
                  />
                  {/* sparkles */}
                  {[0, 1, 2, 3].map((k) => (
                    <span
                      key={k}
                      aria-hidden
                      className="tub-spark absolute size-3 rounded-full bg-mango opacity-0"
                      style={{ top: `${18 + (k % 2) * 14}%`, insetInlineStart: `${15 + k * 22}%` }}
                    />
                  ))}
                  {/* tub body */}
                  <div
                    aria-hidden
                    className="absolute inset-x-[6%] bottom-0 h-[52%] bg-white"
                    style={{ clipPath: "polygon(0 0, 100% 0, 88% 100%, 12% 100%)" }}
                  >
                    <div className="absolute inset-x-0 top-[30%] h-[22%]" style={{ background: d.lid }} />
                  </div>
                  {/* lid, hinged at its end corner */}
                  <div
                    aria-hidden
                    className="tub-lid absolute inset-x-[2%] bottom-[48%] h-[11%] origin-bottom-left rounded-[40%/60%]"
                    style={{ background: d.lid }}
                  >
                    {!isOpen && (
                      <span className="absolute inset-0 flex items-center justify-center font-display text-lg font-black text-cream">?</span>
                    )}
                  </div>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm font-extrabold">{fmtDate(d.time)}</p>
                  <h3 className="text-xl">{isOpen ? d.name : "טעם נעול"}</h3>
                  <p className="text-sm">{isOpen ? d.note : `נפתח בעוד ${Math.max(0, Math.ceil((d.time - (simNow ?? d.time)) / DAY))} ימים`}</p>
                </div>
              </li>
            );
          })}
        </ul>
        </div>
      </section>

      {/* Sign-up + share */}
      <section aria-labelledby="remind-title" className="bg-chocolate text-cream">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:grid-cols-2 md:px-8">
          <div>
            <h2 id="remind-title" className="mb-3">
              תזכירו לי
            </h2>
            <p className="mb-6 max-w-md">SMS אחד יום לפני כל פתיחה. בלי ספאם, ואפשר להסיר בכל רגע.</p>
            {signed ? (
              <div className="max-w-md rounded-[2rem] bg-mango p-6 text-chocolate" role="status">
                <p className="font-display text-2xl font-black">נרשמת, {signed}!</p>
                <p className="mt-2">נזכיר לך יום לפני כל אחד מארבעת הטעמים. בדמו הזה לא נשלח SMS ולא נשמר שום מידע.</p>
                <a href={ics()} download="nuvola-drop.ics" className="mt-4 inline-flex rounded-full bg-chocolate px-6 py-3 font-extrabold text-cream">
                  הוספה ליומן
                </a>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="flex max-w-md flex-col gap-3">
                <label className="flex flex-col gap-1">
                  <span className="font-extrabold">שם</span>
                  <input name="name" autoComplete="given-name" className="rounded-full border-2 border-cream bg-cream px-5 py-3 text-chocolate" />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-extrabold">טלפון נייד</span>
                  <input
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    dir="ltr"
                    className="rounded-full border-2 border-cream bg-cream px-5 py-3 text-end text-chocolate"
                  />
                </label>
                <label className="flex items-start gap-2 text-sm">
                  <input type="checkbox" name="marketing" className="mt-1 size-4 accent-mango" />
                  <span>אשמח לקבל גם עדכונים ודיוור שיווקי מנובולה (לא חובה)</span>
                </label>
                {error && (
                  <p role="alert" className="font-extrabold text-mango">
                    {error}
                  </p>
                )}
                <button type="submit" className="self-start rounded-full bg-mango px-7 py-3 font-extrabold text-chocolate">
                  תזכירו לי
                </button>
              </form>
            )}
          </div>
          <div>
            <h2 className="mb-3 text-[clamp(1.75rem,3vw,2.5rem)]">טעים יותר עם חברים</h2>
            <p className="mb-6 max-w-md">שלחו את הדרופ למי שתמיד בא איתכם לגלידה.</p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full bg-pistachio px-6 py-3 font-extrabold text-chocolate"
              >
                שליחה בוואטסאפ
              </a>
              <button type="button" onClick={copy} className="inline-flex rounded-full border-2 border-cream px-6 py-3 font-extrabold">
                {copied ? "הקישור הועתק" : "העתקת קישור"}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

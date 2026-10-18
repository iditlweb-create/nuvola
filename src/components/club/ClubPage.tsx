"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

/* Spec: "מועדון" — join with marketing consent. Lead animation: the member card flips and reveals a QR code (transform only). */

const PERKS = [
  { title: "טעם הדרופ לפני כולם", text: "חברי מועדון טועמים את טעם החודש יום לפני שהוא נפתח לכולם." },
  { title: "כדור ביום ההולדת", text: "כל השבוע של יום ההולדת, כדור במתנה בכל סניף." },
  { title: "הטבת המשחק בלי לשחק", text: "תוספת חינם על כל כדור, גם אם לא בניתם מגדל." },
  { title: "הזמנה לטעימות במעבדה", text: "פעם בעונה, ערב טעימות של טעמים שעוד לא יצאו." },
];

function Finder({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x} y={y} width={7} height={7} fill="var(--color-chocolate)" />
      <rect x={x + 1} y={y + 1} width={5} height={5} fill="white" />
      <rect x={x + 2} y={y + 2} width={3} height={3} fill="var(--color-chocolate)" />
    </g>
  );
}

/** A decorative QR-like pattern derived from the member code (demo only — not a real, scannable code). */
function FakeQR({ seed }: { seed: string }) {
  const cells = useMemo(() => {
    let h = 2166136261;
    for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    const rnd = () => ((h = Math.imul(h ^ (h >>> 13), 1274126177)) >>> 0) / 4294967296;
    const n = 21;
    const finder = (x: number, y: number) =>
      [
        [0, 0],
        [n - 7, 0],
        [0, n - 7],
      ].some(([fx, fy]) => x >= fx && x < fx + 7 && y >= fy && y < fy + 7);
    const out: { x: number; y: number }[] = [];
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!finder(x, y) && rnd() > 0.52) out.push({ x, y });
    return out;
  }, [seed]);
  return (
    <svg viewBox="-1 -1 23 23" className="w-full rounded-xl bg-white p-1" aria-hidden>
      {cells.map((c) => (
        <rect key={`${c.x}-${c.y}`} x={c.x} y={c.y} width={1} height={1} fill="var(--color-chocolate)" />
      ))}
      <Finder x={0} y={0} />
      <Finder x={14} y={0} />
      <Finder x={0} y={14} />
    </svg>
  );
}

export default function ClubPage() {
  const [member, setMember] = useState<{ name: string; code: string } | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "").trim();
    const phone = String(fd.get("phone") ?? "").replace(/[\s-]/g, "");
    if (!name) return setError("איך לקרוא לך על הכרטיס?");
    if (!/^05\d{8}$/.test(phone)) return setError("מספר נייד בפורמט 05X-XXXXXXX");
    if (!fd.get("consent")) return setError("המועדון שולח הטבות ב־SMS, לכן צריך לאשר קבלת דיוור כדי להצטרף");
    setError(null);
    const code = `NUV-${phone.slice(-4)}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
    setMember({ name, code });
    setFlipped(true);
    console.info("[nuvola:event]", "club_join", { birthday: Boolean(fd.get("birthday")) });
  };

  return (
    <>
      <section className="bg-pistachio">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-14 md:grid-cols-2 md:px-8 md:py-20">
          <div>
            <p className="mb-3 inline-block rounded-full bg-cream px-4 py-1 font-extrabold">חינם · בלי כרטיס פלסטיק</p>
            <h1 className="mb-4">מועדון נובולה</h1>
            <p className="mb-8 max-w-md text-lg">כרטיס חבר בטלפון, טעם הדרופ לפני כולם וכדור ביום ההולדת. מצטרפים בחצי דקה.</p>
            <a href="#join" className="inline-flex rounded-full bg-cherry px-7 py-3 font-extrabold text-white">
              להצטרפות
            </a>
          </div>

          {/* Member card */}
          <div className="mx-auto w-full max-w-sm [perspective:1200px]">
            <button
              type="button"
              onClick={() => setFlipped((f) => !f)}
              aria-label={flipped ? "הצגת חזית הכרטיס" : "הצגת גב הכרטיס עם הקוד"}
              className="relative block aspect-[1.6] w-full transition-transform duration-[900ms] ease-[var(--ease-melt)] [transform-style:preserve-3d]"
              style={{ transform: flipped ? "rotateY(180deg)" : "none" }}
            >
              {/* front */}
              <span className="absolute inset-0 flex flex-col justify-between rounded-[1.75rem] bg-chocolate p-6 text-start text-cream [backface-visibility:hidden]">
                <span className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/brand/logo-symbol-cream.svg" alt="" className="h-10 w-auto" />
                  <span className="font-display text-2xl font-black">נובולה</span>
                </span>
                <span>
                  <span className="block text-sm opacity-80">חבר/ת מועדון</span>
                  <span className="block font-display text-2xl font-black">{member?.name ?? "השם שלך כאן"}</span>
                </span>
                <span className="text-xs opacity-70">לחצו כדי להפוך</span>
              </span>
              {/* back */}
              <span className="absolute inset-0 flex items-center gap-5 rounded-[1.75rem] bg-cream p-5 text-start [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <span className="w-2/5 shrink-0">
                  <FakeQR seed={member?.code ?? "nuvola"} />
                </span>
                <span>
                  <span className="block text-sm">מציגים בקופה</span>
                  <span dir="ltr" className="block font-display text-xl font-black tracking-wider">
                    {member?.code ?? "NUV-0000-XXX"}
                  </span>
                  <span className="mt-2 block text-xs">קוד לדוגמה בלבד, לא לסריקה.</span>
                </span>
              </span>
            </button>
          </div>
        </div>
      </section>

      <section aria-labelledby="perks-title" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <h2 id="perks-title" className="mb-8">
          מה מקבלים
        </h2>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PERKS.map((p, i) => (
            <li key={p.title} className="rounded-[2rem] p-6" style={{ background: ["var(--color-cloud)", "var(--color-mango)", "var(--color-cream)", "var(--color-cloud)"][i] }}>
              <h3 className="mb-2 text-2xl">{p.title}</h3>
              <p>{p.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section id="join" aria-labelledby="join-title" className="scroll-mt-20 bg-chocolate text-cream">
        <div className="mx-auto max-w-2xl px-4 py-16 md:px-8">
          <h2 id="join-title" className="mb-2">
            להצטרפות
          </h2>
          {member ? (
            <div className="rounded-[2rem] bg-mango p-6 text-chocolate" role="status">
              <p className="font-display text-3xl font-black">ברוכים הבאים, {member.name}!</p>
              <p className="mt-2">הכרטיס שלך מוכן למעלה. בדמו הזה לא נשלח SMS ולא נשמר שום מידע.</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="grid gap-4">
              <p className="mb-2">שלושה פרטים, ואתם בפנים.</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1">
                  <span className="font-extrabold">שם</span>
                  <input name="name" autoComplete="given-name" className="rounded-full border-2 border-cream bg-cream px-5 py-3 text-chocolate" />
                </label>
                <label className="grid gap-1">
                  <span className="font-extrabold">טלפון נייד</span>
                  <input name="phone" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" className="rounded-full border-2 border-cream bg-cream px-5 py-3 text-end text-chocolate" />
                </label>
              </div>
              <label className="grid gap-1">
                <span className="font-extrabold">חודש יום ההולדת (לא חובה)</span>
                <select name="birthday" className="rounded-full border-2 border-cream bg-cream px-5 py-3 text-chocolate">
                  <option value="">בלי</option>
                  {["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"].map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
              </label>
              <label className="flex items-start gap-2 text-sm">
                <input type="checkbox" name="consent" className="mt-1 size-4 accent-mango" />
                <span>
                  אני מסכימה לקבל ממועדון נובולה הטבות ודיוור שיווקי ב־SMS. אפשר להסיר בכל רגע. פרטים ב<Link href="/privacy" className="underline">מדיניות הפרטיות</Link>.
                </span>
              </label>
              {error && (
                <p role="alert" className="font-extrabold text-mango">
                  {error}
                </p>
              )}
              <button type="submit" className="justify-self-start rounded-full bg-mango px-7 py-3 font-extrabold text-chocolate">
                הצטרפות למועדון
              </button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

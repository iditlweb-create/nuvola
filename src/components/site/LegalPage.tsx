import Link from "next/link";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";

export type LegalSection = { title: string; body: (string | string[])[] };

/** Legal pages (spec: "עמודים משפטיים") — no animation, maximum readability. */
export default function LegalPage({ title, updated, intro, sections }: { title: string; updated: string; intro: string; sections: LegalSection[] }) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto max-w-3xl px-4 py-14 md:px-8 md:py-20">
        <p className="mb-6 rounded-2xl bg-mango/40 px-4 py-3 text-sm">
          מסמך לדוגמה בפרויקט קונספט לתיק עבודות. נובולה היא מותג פיקטיבי, והטקסט אינו ייעוץ משפטי.
        </p>
        <h1 className="mb-3 text-[clamp(2.5rem,6vw,4.5rem)]">{title}</h1>
        <p className="mb-8 text-sm">עודכן לאחרונה: {updated}</p>
        <p className="mb-10 text-lg">{intro}</p>

        <nav aria-label="תוכן העניינים" className="mb-12 rounded-[1.5rem] bg-white/80 p-6">
          <p className="mb-2 font-extrabold">בעמוד הזה</p>
          <ol className="list-inside list-decimal space-y-1">
            {sections.map((s, i) => (
              <li key={s.title}>
                <a href={`#s${i + 1}`} className="underline underline-offset-2">
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-10 leading-[1.75]">
          {sections.map((s, i) => (
            <section key={s.title} id={`s${i + 1}`} aria-labelledby={`h${i + 1}`} className="scroll-mt-24">
              <h2 id={`h${i + 1}`} className="mb-3 text-[clamp(1.6rem,3vw,2.2rem)]">
                {i + 1}. {s.title}
              </h2>
              {s.body.map((b, k) =>
                Array.isArray(b) ? (
                  <ul key={k} className="mb-4 list-inside list-disc space-y-1">
                    {b.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                ) : (
                  <p key={k} className="mb-4">
                    {b}
                  </p>
                ),
              )}
            </section>
          ))}
        </div>

        <p className="mt-14">
          <Link href="/" className="inline-block py-2 font-extrabold underline underline-offset-4">
            → חזרה לדף הבית
          </Link>
        </p>
      </main>
      <SiteFooter />
    </>
  );
}

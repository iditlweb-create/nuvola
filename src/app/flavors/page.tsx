import type { Metadata } from "next";
import FlavorsGrid from "@/components/flavors/FlavorsGrid";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: "הטעמים — נובולה",
  description: "8 מתוך 32 הטעמים שבוויטרינה עכשיו. סינון לפי טבעוני, ללא גלוטן וסניף.",
};

export default function FlavorsPage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto max-w-7xl px-4 pb-24 md:px-8">
        <div className="py-14 md:py-20">
          <p className="mb-3 inline-block rounded-full bg-mango px-4 py-1 font-extrabold">32 טעמים בתחלופה</p>
          <h1 className="mb-4">הטעמים</h1>
          <p className="max-w-xl text-lg">
            מה שבוויטרינה היום, מחר אולי כבר אחר. מחפשים טבעוני, בלי גלוטן או מה שיש עכשיו בסניף הקרוב? סננו, ותעברו עם העכבר כדי לטעום בעיניים.
          </p>
        </div>
        <FlavorsGrid />
      </main>
      <SiteFooter />
    </>
  );
}

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";

// Spec: "עמוד 404 עם כדור שנפל מהגביע ונמס על הרצפה" · copy: "נמס. העמוד הזה לא שרד את הקיץ."
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-2 md:px-8">
        <div>
          <p className="mb-3 font-display text-7xl font-black text-cherry">404</p>
          <h1 className="mb-4 text-[clamp(2.5rem,6vw,5rem)]">נמס.</h1>
          <p className="mb-8 max-w-md text-lg">העמוד הזה לא שרד את הקיץ. אולי הוא עוד לא נבנה, ואולי הקישור התקלקל בדרך.</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/" className="inline-flex rounded-full bg-cherry px-7 py-3 font-extrabold text-white">
              חזרה לדף הבית
            </Link>
            <Link href="/flavors" className="inline-flex rounded-full border-2 border-chocolate px-7 py-3 font-extrabold">
              לטעמים
            </Link>
          </div>
        </div>
        <div aria-hidden className="relative mx-auto h-80 w-72">
          <img src="/images/game-cone.webp" alt="" className="melt-cone absolute start-6 top-0 w-40" />
          <img src="/images/game-ball-raspberry.webp" alt="" className="melt-drop absolute bottom-6 end-2 w-40 origin-bottom" />
          <div className="melt-puddle absolute bottom-4 end-0 h-6 w-52 origin-center rounded-[50%] bg-cherry/80" />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

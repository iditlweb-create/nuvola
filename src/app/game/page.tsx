import type { Metadata } from "next";
import TowerGame from "@/components/game/TowerGame";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: "מגדל נובולה — המשחק",
  description: "בונים מגדל כדורי גלידה על גביע, כמה שיותר גבוה, ומקבלים הטבה לפי הגובה.",
};

export default function GamePage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto max-w-6xl px-4 pb-16 md:px-8">
        <div className="py-8 md:py-10">
          <h1 className="text-[clamp(2.25rem,6vw,4rem)]">מגדל נובולה</h1>
          <p className="mt-2 max-w-xl">כמה גבוה תגיעו? 10 נקודות זה תוספת חינם, 20 זה כדור שני במתנה. בלי הרשמה כדי לשחק.</p>
        </div>
        <TowerGame />
      </main>
      <SiteFooter />
    </>
  );
}

import type { Metadata } from "next";
import EventsPage from "@/components/events/EventsPage";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: "עגלה לאירוע — נובולה",
  description: "עגלת ג׳לטו לחתונות, ימי גיבוש והפקות. בונים עגלה, מקבלים הערכת מחיר מיד והצעה תוך 4 שעות עבודה.",
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <EventsPage />
      </main>
      <SiteFooter />
    </>
  );
}

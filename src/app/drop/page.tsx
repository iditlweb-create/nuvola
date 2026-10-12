import type { Metadata } from "next";
import DropLanding from "@/components/drop/DropLanding";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: "הדרופ של נובמבר — נובולה",
  description: "ארבעה טעמים במהדורה מוגבלת, אחד בכל שבוע. השאירו פרטים ונזכיר לכם יום לפני כל פתיחה.",
};

export default function DropPage() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <DropLanding />
      </main>
      <SiteFooter />
    </>
  );
}

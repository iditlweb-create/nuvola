import type { Metadata } from "next";
import StoryPage from "@/components/story/StoryPage";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: "הסיפור — נובולה",
  description: "שירה, עומר ומעבדה אחת: איך ויטרינה אחת בפלורנטין הפכה לשלושה סניפים ועגלות לאירועים.",
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <StoryPage />
      </main>
      <SiteFooter />
    </>
  );
}

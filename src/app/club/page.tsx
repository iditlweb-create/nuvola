import type { Metadata } from "next";
import ClubPage from "@/components/club/ClubPage";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: "מועדון נובולה",
  description: "כרטיס חבר בטלפון, טעם הדרופ לפני כולם וכדור ביום ההולדת.",
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <ClubPage />
      </main>
      <SiteFooter />
    </>
  );
}

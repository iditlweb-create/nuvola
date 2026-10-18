import type { Metadata } from "next";
import BranchesPage from "@/components/branches/BranchesPage";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";

export const metadata: Metadata = {
  title: "הסניפים — נובולה",
  description: "תל אביב, חיפה וירושלים: שעות פתיחה, מה פתוח עכשיו ומה בוויטרינה היום.",
};

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <BranchesPage />
      </main>
      <SiteFooter />
    </>
  );
}

import type { Metadata } from "next";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  title: "נובולה — ג'לטו שנולד בענן",
  description: "מעבדת ג'לטו בוטיק: תל אביב, חיפה, ירושלים ועגלות לאירועים.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl">
      <body className="min-h-screen bg-cream text-chocolate">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}

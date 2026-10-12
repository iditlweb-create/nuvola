import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/components/Logo";
import TowerGame from "@/components/game/TowerGame";

export const metadata: Metadata = {
  title: "מגדל נובולה — המשחק",
  description: "בונים מגדל כדורי גלידה על גביע, כמה שיותר גבוה, ומקבלים הטבה לפי הגובה.",
};

export default function GamePage() {
  return (
    <div className="min-h-screen bg-cream">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="/" aria-label="נובולה — חזרה לדף הבית">
          <Logo />
        </Link>
        <Link href="/" className="font-extrabold underline underline-offset-4">
          → חזרה לאתר
        </Link>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-16 md:px-8">
        <TowerGame />
      </main>
    </div>
  );
}

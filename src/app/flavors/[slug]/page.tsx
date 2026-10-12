import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import FlavorDetail from "@/components/flavors/FlavorDetail";
import SiteFooter from "@/components/site/SiteFooter";
import SiteHeader from "@/components/site/SiteHeader";
import { FLAVORS } from "@/data/site";

export function generateStaticParams() {
  return FLAVORS.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const flavor = FLAVORS.find((f) => f.slug === slug);
  if (!flavor) return {};
  return { title: `${flavor.name} — נובולה`, description: flavor.description };
}

async function FlavorContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const flavor = FLAVORS.find((f) => f.slug === slug);
  if (!flavor) notFound();
  return <FlavorDetail flavor={flavor} />;
}

export default function FlavorPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto min-h-[70svh] max-w-7xl px-4 md:px-8">
        <Suspense fallback={<p className="py-24 text-center">רגע, מוציאים מהוויטרינה…</p>}>
          <FlavorContent params={params} />
        </Suspense>
      </main>
      <SiteFooter />
    </>
  );
}

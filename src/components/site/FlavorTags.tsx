import type { Flavor } from "@/data/site";

export default function FlavorTags({ flavor, className = "" }: { flavor: Flavor; className?: string }) {
  const tags = [flavor.vegan && "טבעוני", flavor.glutenFree && "ללא גלוטן"].filter(Boolean) as string[];
  if (!tags.length) return null;
  return (
    <p className={`flex flex-wrap gap-2 ${className}`}>
      {tags.map((t) => (
        <span key={t} className="rounded-full bg-pistachio/40 px-3 py-0.5 text-xs font-extrabold">
          {t}
        </span>
      ))}
    </p>
  );
}

/* eslint-disable @next/next/no-img-element */

/** Horizontal logo: approved symbol (SVG) + wordmark set in Leon Heavy as live text. */
export default function Logo({ className = "", tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  return (
    <span className={`inline-flex items-center gap-2 ${tone === "light" ? "text-cream" : "text-chocolate"} ${className}`}>
      <img
        src={tone === "light" ? "/brand/logo-symbol-cream.svg" : "/brand/logo-symbol.svg"}
        alt=""
        width={32}
        height={40}
        className="h-10 w-auto"
      />
      <span className="flex flex-col leading-none">
        <span className="font-display text-2xl font-black">נובולה</span>
        <span className="font-display text-[0.7rem] font-black tracking-[0.3em]">NUVOLA</span>
      </span>
    </span>
  );
}

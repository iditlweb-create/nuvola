type ScoopProps = {
  color: string;
  cone?: boolean;
  drip?: boolean;
  className?: string;
  title?: string;
};

/** Sketch illustration: a cloud-shaped gelato scoop, optionally on a cone. Temporary until the ChatGPT images land. */
export default function Scoop({ color, cone = false, drip = false, className, title }: ScoopProps) {
  return (
    <svg
      viewBox={cone ? "0 0 200 240" : "0 10 200 160"}
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {cone && <path d="M52 128 L148 128 L100 232 Z" fill="var(--color-chocolate)" />}
      <g fill={color}>
        <circle cx="62" cy="96" r="38" />
        <circle cx="104" cy="70" r="48" />
        <circle cx="146" cy="98" r="36" />
        <rect x="26" y="96" width="156" height="42" rx="21" />
        {drip && <path d="M124 130 h22 v26 a11 11 0 0 1 -22 0 Z" />}
      </g>
    </svg>
  );
}

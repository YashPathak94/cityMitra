import { useId } from "react";

// The single canonical CityMitra mark — a pin (destination) inside a dashed
// orbit ring (the "AI-guided discovery" cue), on the brand orange→blue
// gradient badge. Every header/footer/auth screen on the site renders this
// exact component so the logo is identical everywhere, not a stand-in
// lucide icon on subpages. useId keeps the gradient id collision-free when
// the mark appears more than once on a page (e.g. header + footer).
export default function LogoMark({ size = 34 }: { size?: number }) {
  const gradId = useId();

  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="34" y2="34" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fb923c" />
          <stop offset="0.55" stopColor="#ea580c" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      <rect width="34" height="34" rx="9.5" fill={`url(#${gradId})`} />
      <circle cx="17" cy="17" r="12" stroke="#fff" strokeOpacity="0.4" strokeWidth="1.1" strokeDasharray="2.2 3.4" />
      <path
        d="M17 8.4c-3.9 0-7.1 3.1-7.1 7 0 5 7.1 12.2 7.1 12.2s7.1-7.2 7.1-12.2c0-3.9-3.2-7-7.1-7z"
        fill="#fff"
      />
      <circle cx="17" cy="15.4" r="2.7" fill={`url(#${gradId})`} />
    </svg>
  );
}

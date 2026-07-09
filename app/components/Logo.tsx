import { useId } from "react";

// The single canonical CityMitra mark — a "CM" route monogram (the C opens
// into the M like a path with waypoints) on the brand orange→blue gradient
// disc, ringed by a faint route line with a few stop dots. Every
// header/footer/auth screen — and every generated favicon/social asset —
// renders this exact artwork so the logo is identical everywhere. useId
// keeps the gradient id collision-free when the mark appears more than
// once on a page (e.g. header + footer).
export default function LogoMark({ size = 34 }: { size?: number }) {
  const gradId = useId();

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="6" y1="6" x2="94" y2="94" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fb923c" />
          <stop offset="0.55" stopColor="#ea580c" />
          <stop offset="1" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="50" fill={`url(#${gradId})`} />
      <circle cx="50" cy="50" r="40" fill="none" stroke="#fff" strokeOpacity="0.22" strokeWidth="1.4" />
      <circle cx="27" cy="24" r="2.1" fill="#fff" fillOpacity="0.75" />
      <circle cx="14" cy="53" r="1.7" fill="#fff" fillOpacity="0.5" />
      <circle cx="46" cy="84" r="1.9" fill="#fff" fillOpacity="0.6" />
      <path d="M63.5 33.9A21 21 0 1 0 63.5 66.1" fill="none" stroke="#fff" strokeWidth="11" strokeLinecap="round" />
      <path
        d="M63 70L63 30L74 52L85 30L85 70"
        fill="none"
        stroke="#fff"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

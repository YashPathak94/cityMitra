import { useId } from "react";

export interface LogoProps {
  /** Rendered width and height in pixels (the mark is a square). Default 34. */
  size?: number;
}

/**
 * The canonical CityMitra "CM" route monogram — a stylized C flowing into an M
 * on a circular orange→blue gradient disc, ringed by a faint route line with
 * waypoint dots (the "AI-guided discovery" cue). This is the single brand mark
 * used across the site, favicons, and social assets. `useId` keeps the
 * gradient id collision-free when the mark renders more than once on a page.
 */
export function Logo({ size = 34 }: LogoProps) {
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

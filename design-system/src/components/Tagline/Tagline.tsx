import "./Tagline.css";
import type { ReactNode } from "react";

export interface TaglineProps {
  /** Override the words. Defaults to the brand tagline. */
  children?: ReactNode;
}

/**
 * The CityMitra brand tagline, rendered as warm-to-cool gradient text.
 * Defaults to "Your Need. Your Mitra." — pair it under the Logo/wordmark.
 */
export function Tagline({ children = "Your Need. Your Mitra." }: TaglineProps) {
  return <span className="cmTagline">{children}</span>;
}

import type { HTMLAttributes, ReactNode } from "react";
import "./Badge.css";

export type BadgeVariant = "soft" | "eyebrow";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * - `soft` — a rounded, orange-tinted pill for labels/status (default)
   * - `eyebrow` — an uppercase red section kicker that sits above a heading
   */
  variant?: BadgeVariant;
  /** Optional leading icon (e.g. a lucide-react icon at ~14px). */
  icon?: ReactNode;
  children?: ReactNode;
}

/**
 * A small text label. Use `soft` for inline status/category chips and
 * `eyebrow` as the little uppercase kicker above a section heading.
 */
export function Badge({ variant = "soft", icon, children, className, ...rest }: BadgeProps) {
  const classes = ["cmBadge", `cmBadge--${variant}`, className].filter(Boolean).join(" ");
  return (
    <span className={classes} {...rest}>
      {icon}
      {children}
    </span>
  );
}

import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./Button.css";

export type ButtonVariant = "primary" | "secondary" | "ghost";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style:
   * - `primary` — the brand orange gradient CTA (default)
   * - `secondary` — quiet outlined button on a translucent surface
   * - `ghost` — text-only button for low-emphasis actions
   */
  variant?: ButtonVariant;
  /** Icon rendered before the label (e.g. a lucide-react icon). */
  leadingIcon?: ReactNode;
  /** Icon rendered after the label (e.g. an arrow). */
  trailingIcon?: ReactNode;
  children?: ReactNode;
}

/**
 * The CityMitra action button. Use `primary` for the single most important
 * action on a surface, `secondary` for alternatives, and `ghost` for tertiary
 * actions. Forwards all native `<button>` props (onClick, disabled, type, …).
 */
export function Button({
  variant = "primary",
  leadingIcon,
  trailingIcon,
  children,
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = ["cmButton", `cmButton--${variant}`, className].filter(Boolean).join(" ");
  return (
    <button type={type} className={classes} {...rest}>
      {leadingIcon}
      {children}
      {trailingIcon}
    </button>
  );
}

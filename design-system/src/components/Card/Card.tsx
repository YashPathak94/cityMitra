import type { HTMLAttributes, ReactNode } from "react";
import "./Card.css";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Adds a hover lift + deeper shadow for clickable cards. Default false. */
  interactive?: boolean;
  children?: ReactNode;
}

/**
 * The CityMitra surface card — a soft warm panel with a subtle blue corner
 * glow, used to group content (recommendations, concierge actions, offers).
 * Set `interactive` when the whole card is clickable.
 */
export function Card({ interactive = false, children, className, ...rest }: CardProps) {
  const classes = ["cmCard", interactive ? "cmCard--interactive" : "", className].filter(Boolean).join(" ");
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

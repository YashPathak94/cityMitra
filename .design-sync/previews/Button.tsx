import { Button } from "@citymitra/ui";

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const Primary = () => (
  <Button variant="primary" trailingIcon={<ArrowIcon />}>
    Ask AI Guide
  </Button>
);

export const Secondary = () => <Button variant="secondary">Browse Categories</Button>;

export const Ghost = () => <Button variant="ghost">Maybe later</Button>;

export const Disabled = () => (
  <Button variant="primary" disabled>
    Please wait…
  </Button>
);

export const Group = () => (
  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
    <Button variant="primary">Get started</Button>
    <Button variant="secondary">Learn more</Button>
    <Button variant="ghost">Skip</Button>
  </div>
);

import { Badge } from "@citymitra/ui";

export const Soft = () => <Badge variant="soft">Sponsored</Badge>;

export const Eyebrow = () => <Badge variant="eyebrow">AI City Guide</Badge>;

export const Group = () => (
  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
    <Badge variant="soft">New</Badge>
    <Badge variant="soft">Curated</Badge>
    <Badge variant="soft">Verified</Badge>
  </div>
);

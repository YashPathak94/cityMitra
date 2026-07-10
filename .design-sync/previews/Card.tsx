import { Card, Badge, Button, Tagline, Logo } from "@citymitra/ui";

export const Basic = () => (
  <Card style={{ maxWidth: 320 }}>
    <Badge variant="eyebrow">Top Pick</Badge>
    <h3 style={{ margin: "8px 0 4px", fontFamily: "var(--cm-font-sans)", color: "var(--cm-ink)" }}>Sadar Bazaar</h3>
    <p style={{ margin: 0, color: "var(--cm-muted)", fontFamily: "var(--cm-font-sans)", fontSize: 14, lineHeight: 1.5 }}>
      Delhi's largest wholesale market — 12 min away.
    </p>
    <div style={{ marginTop: 12 }}>
      <Button variant="primary">Open in Maps</Button>
    </div>
  </Card>
);

export const Interactive = () => (
  <Card interactive style={{ maxWidth: 320, display: "flex", alignItems: "center", gap: 12 }}>
    <Logo size={40} />
    <div>
      <strong style={{ fontFamily: "var(--cm-font-sans)", color: "var(--cm-ink)" }}>CityMitra</strong>
      <div>
        <Tagline />
      </div>
    </div>
  </Card>
);

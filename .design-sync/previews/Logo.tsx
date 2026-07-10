import { Logo } from "@citymitra/ui";

export const Default = () => <Logo />;

export const Large = () => <Logo size={72} />;

export const SizeRamp = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
    <Logo size={24} />
    <Logo size={40} />
    <Logo size={64} />
  </div>
);

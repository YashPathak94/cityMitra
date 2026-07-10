# @citymitra/ui

The CityMitra brand design system — the reusable primitives and tokens that
carry the CityMitra look, extracted from the main app so they can be shared,
versioned, and synced to **claude.ai/design** (so Claude Design builds new UI
out of the real, on-brand parts).

## Components

| Component | What it is |
|---|---|
| `Logo` | The "CM" route monogram on the orange→blue gradient disc. Prop: `size`. |
| `Button` | Action button. `variant`: `primary` (gradient CTA) · `secondary` (outlined) · `ghost` (text). Optional `leadingIcon` / `trailingIcon`. |
| `Badge` | Small label. `variant`: `soft` (orange pill) · `eyebrow` (uppercase red kicker). Optional `icon`. |
| `Card` | Warm surface panel with a subtle blue corner glow. `interactive` adds hover lift. |
| `Tagline` | Brand tagline as gradient text; defaults to "Your Need. Your Mitra." |

## Usage

```tsx
import { Logo, Button, Badge, Card, Tagline } from "@citymitra/ui";
import "@citymitra/ui/styles.css"; // tokens + component styles

export function Example() {
  return (
    <Card>
      <Badge variant="eyebrow">AI City Guide</Badge>
      <Logo size={40} />
      <Tagline />
      <Button variant="primary">Ask AI Guide</Button>
    </Card>
  );
}
```

## Design tokens

All styling flows from CSS variables defined in `src/tokens.css` (`--cm-ink`,
`--cm-orange`, `--cm-blue`, `--cm-gradient`, `--cm-shadow`, `--cm-smooth`,
`--cm-radius`, `--cm-font-sans`, …). Re-theme the whole system by overriding
that block — components never hard-code brand values.

## Build

```bash
npm install
npm run build   # esbuild → dist/index.js + dist/styles.css, tsc → dist/index.d.ts
```

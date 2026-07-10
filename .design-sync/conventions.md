# Building with @citymitra/ui

The CityMitra brand design system. Five primitives — `Logo`, `Button`,
`Badge`, `Card`, `Tagline` — plus a token layer. Small on purpose: compose
these with your own layout, styled from the CityMitra CSS variables below.

## Setup — no provider needed

There is **no context provider or theme wrapper**. Components style
themselves from a single stylesheet. Import it once at the app root:

```tsx
import "@citymitra/ui/styles.css"; // defines the --cm-* tokens on :root + all component CSS
```

Without that stylesheet the `--cm-*` variables are undefined and components
render unstyled (browser-default). The brand font (Plus Jakarta Sans) is
pulled in by that same stylesheet via a Google Fonts `@import`.

## Styling idiom — props on components, CSS variables for your own layout

Components are configured by **props, never utility classes**:

- `Button` — `variant="primary" | "secondary" | "ghost"`, plus `leadingIcon` / `trailingIcon` (any ReactNode) and all native `<button>` props.
- `Badge` — `variant="soft" | "eyebrow"`, plus `icon`.
- `Card` — `interactive` (boolean) for a hover-lift clickable surface.
- `Logo` — `size` (px number).
- `Tagline` — `children` (defaults to "Your Need. Your Mitra.").

For **your own** layout/markup around these, style from the CityMitra
tokens (CSS custom properties) rather than hard-coded values:

| Token | Use |
|---|---|
| `--cm-ink` / `--cm-muted` | primary / secondary text |
| `--cm-paper` / `--cm-soft` / `--cm-white` | warm surfaces |
| `--cm-orange` / `--cm-gold` / `--cm-blue` | brand + accent |
| `--cm-line` | borders / hairlines |
| `--cm-gradient` | the signature orange→blue brand gradient |
| `--cm-shadow` / `--cm-glow` | elevation / orange glow |
| `--cm-smooth` | easing for transitions |
| `--cm-radius` / `--cm-radius-lg` / `--cm-radius-pill` | corner radii |
| `--cm-font-sans` | the brand font stack |

```tsx
<section style={{ background: "var(--cm-paper)", fontFamily: "var(--cm-font-sans)", color: "var(--cm-ink)" }}>
  <Badge variant="eyebrow">AI City Guide</Badge>
  <h2 style={{ color: "var(--cm-ink)" }}>Find the right city, fast</h2>
  <p style={{ color: "var(--cm-muted)" }}>Markets, hotels, doctors, EV charging — map-ready.</p>
  <Button variant="primary">Ask AI Guide</Button>
</section>
```

## Where the truth lives

Read the bound `styles.css` (and the `_ds_bundle.css` it imports) for the
exact token values and component rules, and each component's `.d.ts` +
`.prompt.md` for its full prop contract before composing it.

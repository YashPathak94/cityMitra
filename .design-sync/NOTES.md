# design-sync notes — @citymitra/ui

Repo-specific gotchas for future syncs of the CityMitra design system.

## Setup

- The DS package lives in `design-system/` (not repo root). It's a standalone
  `@citymitra/ui` package, extracted from the main Next.js app.
- Build with `cd design-system && npm run build` (esbuild → `dist/index.js` +
  `dist/styles.css`, tsc → `dist/index.d.ts`). Converter entry:
  `--entry ./design-system/dist/index.js`,
  `--node-modules ./design-system/node_modules`.
- `dist/index.js` has **no CSS imports** (esbuild extracts component CSS to
  `dist/styles.css` at package build time). So `cfg.cssEntry` must point at
  `dist/styles.css` (package-relative) — that file carries tokens + all
  component CSS and is what the converter copies.
- Render check (playwright): none bundled in `.ds-sync`. The environment's
  global playwright (`/opt/node22/lib/node_modules/playwright`, 1.56.1, pins
  chromium 1194 which matches the `/opt/pw-browsers` cache) was symlinked into
  `.ds-sync/node_modules/{playwright,playwright-core}`, and validate is run
  with `PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`. The symlink is gitignored
  (node_modules) — recreate it on a fresh clone.

## Known render warns (checked, benign)

- `[RENDER_THIN] Logo` — the Logo is a pure inline **SVG** with no text nodes,
  so the text-based "thin" heuristic always fires. Confirmed against the
  screenshot: the CM monogram paints correctly at all sizes (24/40/64). Benign;
  do not "fix" by adding text.
- `[FONT_REMOTE] "Plus Jakarta Sans"` — tokens.css `@import`s the Google Fonts
  stylesheet, so the family loads at runtime. Intentional; not shipped as
  `@font-face`.

## Re-sync risks

- **Logo `[RENDER_THIN]` is permanent** by construction (text-free SVG). It is
  recorded above so it reads as known, not new. If a future Logo preview adds a
  text label the warn may clear — that's fine either way.
- **Google-fonts dependency**: the brand font is fetched from fonts.googleapis
  at runtime (not shipped). If offline/self-hosted fonts become a requirement,
  ship `@font-face` + woff2 via `cfg.extraFonts` and drop the remote `@import`.
- **Previews import icons inline** (a hand-rolled `ArrowIcon` SVG in
  `Button.tsx`) rather than `lucide-react`, to keep previews dependency-free.
  lucide-react is only in the app's node_modules, not the DS package's.
- The DS is intentionally small (5 primitives: Logo, Button, Badge, Card,
  Tagline). New primitives added to `design-system/src` will be picked up
  automatically (PascalCase `.d.ts` exports); author a preview for each.

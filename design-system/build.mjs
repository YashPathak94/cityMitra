// Builds @citymitra/ui into dist/: a bundled ESM entry (react kept external),
// the concatenated stylesheet, then tsc emits the .d.ts (see package build
// script). Kept intentionally small — esbuild is the whole toolchain.
import { build } from "esbuild";
import { rename, rm, access } from "node:fs/promises";
import { constants } from "node:fs";

await rm("dist", { recursive: true, force: true });

await build({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  format: "esm",
  platform: "browser",
  target: ["es2020"],
  jsx: "automatic",
  // React is a peer dependency — never bundle it, so consumers (and the
  // design-sync runtime) supply the single React instance.
  external: ["react", "react-dom", "react/jsx-runtime", "react-dom/client"],
  loader: { ".css": "css" },
  logLevel: "info"
});

// esbuild names the emitted stylesheet after the JS outfile (dist/index.css);
// publish it under the conventional name consumers import.
try {
  await access("dist/index.css", constants.F_OK);
  await rename("dist/index.css", "dist/styles.css");
} catch {
  console.warn("no dist/index.css emitted — no component styles were imported");
}

console.log("built dist/index.js + dist/styles.css");

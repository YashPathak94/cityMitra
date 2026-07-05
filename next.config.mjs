import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: currentDir,
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "geolocation=(self), camera=(), microphone=(), payment=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          {
            key: "Content-Security-Policy",
            // Hardening directives only (no default-src) so image/script/style
            // loading is unaffected, while clickjacking, base-uri, plugins and
            // off-site form posting are locked down.
            value: "base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; upgrade-insecure-requests"
          }
        ]
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
      },
      {
        source: "/admin",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
      }
    ];
  },
  async redirects() {
    // Both Vercel project aliases 301 to the real domain. This is a durable
    // fix independent of NEXT_PUBLIC_SITE_URL: even if that env var is ever
    // unset/wrong again, or someone lands on/links the vercel.app URL, Google
    // and users both get sent to ctmitra.com instead of splitting signal
    // across two domains. Only exact production aliases match -- branch/
    // preview deployment URLs (city-mitra-<hash>.vercel.app) are untouched.
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "city-mitra.vercel.app" }],
        destination: "https://ctmitra.com/:path*",
        permanent: true
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "citymitra.vercel.app" }],
        destination: "https://ctmitra.com/:path*",
        permanent: true
      }
    ];
  }
};

export default nextConfig;

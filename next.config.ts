import type { NextConfig } from "next";

/**
 * Two build targets:
 *  • default — full Next.js server (Vercel / Node): ISR, image optimisation,
 *    /api/leads, security headers.
 *  • STATIC_EXPORT=true — fully static site in ./out for GitHub Pages
 *    (see .github/workflows/deploy-pages.yml). Set NEXT_PUBLIC_BASE_PATH to
 *    the repository sub-path, e.g. "/mk01".
 */
const isStatic = process.env.STATIC_EXPORT === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const turbopack: NextConfig["turbopack"] = {
  rules: {
    "*.css": {
      loaders: ["@tailwindcss/turbopack"],
      as: "*.css",
    },
  },
};

const staticConfig: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_STATIC_EXPORT: "true", NEXT_PUBLIC_TRAILING_SLASH: "true" },
  turbopack,
};

const serverConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Add CMS / CDN hosts here when images are served remotely.
    remotePatterns: [],
  },
  turbopack,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default isStatic ? staticConfig : serverConfig;

import os from "node:os";
import path from "node:path";
import type { NextConfig } from "next";

// Public URL of the site, used for canonical links, the sitemap and Open
// Graph tags. Set NEXT_PUBLIC_SITE_URL in production (see README); on
// Vercel the production domain is picked up automatically.
const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/+$/, "");

// This computer's own network addresses, so a phone or another computer on the
// same Wi-Fi can open the dev server at http://<address>:3000. Development only.
const lanAddresses = Object.values(os.networkInterfaces())
  .flat()
  .filter((info): info is os.NetworkInterfaceInfo => !!info && info.family === "IPv4" && !info.internal)
  .map((info) => info.address);

// Set only by the GitHub Pages workflow (.github/workflows/deploy.yml): builds a
// static site into out/ that lives under a sub-path such as /speedster-website.
// Unset for `npm run dev` and `npm run build`, which work as before.
const pagesBasePath = process.env.PAGES_BASE_PATH?.replace(/\/+$/, "");

const nextConfig: NextConfig = {
  ...(pagesBasePath !== undefined && {
    output: "export",
    basePath: pagesBasePath,
    trailingSlash: true,
  }),
  allowedDevOrigins: lanAddresses,
  poweredByHeader: false,
  env: {
    NEXT_PUBLIC_SITE_URL: siteUrl,
    // Lets absoluteUrl() match the trailing-slash URLs of the Pages export.
    NEXT_PUBLIC_TRAILING_SLASH: pagesBasePath !== undefined ? "1" : "",
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // A static export has no server to resize images.
    unoptimized: pagesBasePath !== undefined,
  },
  turbopack: {
    root: path.resolve(__dirname),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;

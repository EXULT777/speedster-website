import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

// Generated once at build time (also required by the static GitHub Pages export).
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}

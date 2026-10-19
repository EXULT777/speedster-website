import type { MetadataRoute } from "next";
import { site } from "@/content/site";

// Generated once at build time (also required by the static GitHub Pages export).
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "Speedster",
    description: site.description,
    // Relative to the manifest, so the app also works under a sub-path (GitHub Pages).
    start_url: "./",
    display: "standalone",
    background_color: "#0a0a0b",
    theme_color: "#0a0a0b",
    icons: [
      { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}

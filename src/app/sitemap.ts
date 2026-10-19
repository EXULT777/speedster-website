import type { MetadataRoute } from "next";
import { cities } from "@/content/areas";
import { brands } from "@/content/brands";
import { allSubServicePages, categories } from "@/content/services";
import { absoluteUrl } from "@/lib/seo";

// Generated once at build time (also required by the static GitHub Pages export).
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/car-key-replacement", priority: 0.9 },
    { path: "/services", priority: 0.9 },
    { path: "/service-areas", priority: 0.9 },
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.8 },
    { path: "/privacy", priority: 0.2 },
    ...categories.map((c) => ({ path: `/services/${c.slug}`, priority: 0.8 })),
    ...allSubServicePages().map(({ category, service }) => ({
      path: `/services/${category.slug}/${service.slug}`,
      priority: 0.7,
    })),
    ...cities.map((c) => ({ path: `/service-areas/${c.slug}`, priority: 0.8 })),
    ...brands.map((b) => ({ path: `/car-key-replacement/${b.slug}`, priority: 0.6 })),
  ];

  return paths.map(({ path, priority }) => ({
    url: absoluteUrl(path),
    changeFrequency: "monthly",
    priority,
  }));
}

import type { Metadata } from "next";
import { site } from "@/content/site";

type PageMeta = {
  /** Page title without the brand suffix (the root layout adds it). */
  title: string;
  description: string;
  /** Path beginning with "/", used for the canonical URL. */
  path: string;
  /** Use the title as-is, without the " | Speedster Lock & Key" suffix. */
  absoluteTitle?: boolean;
};

export function pageMetadata({ title, description, path, absoluteTitle }: PageMeta): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: path,
      siteName: site.name,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

/** A path under /public with the GitHub Pages sub-path in front, for next/image string sources. */
export function withBasePath(path: string) {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}

/** Full URL for a site path. Joined as text so a sub-path in site.url (GitHub Pages) is kept. */
export function absoluteUrl(path = "/") {
  let rest = path.replace(/^\/+/, "");
  // The Pages export serves pages at "/about/"; files ("logo.png") and anchors keep their form.
  if (process.env.NEXT_PUBLIC_TRAILING_SLASH && rest && !/[.#?]|\/$/.test(rest)) rest += "/";
  return `${site.url.replace(/\/+$/, "")}/${rest}`;
}

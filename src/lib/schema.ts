import { cities } from "@/content/areas";
import type { FaqItem } from "@/content/faq";
import { site } from "@/content/site";
import { absoluteUrl } from "@/lib/seo";

const businessId = () => absoluteUrl("/#business");

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Locksmith",
    "@id": businessId(),
    name: site.name,
    description: site.description,
    url: absoluteUrl("/"),
    logo: absoluteUrl(site.logo.src),
    image: absoluteUrl(site.logo.src),
    telephone: site.phone.e164,
    email: site.email.address,
    areaServed: cities.map((city) => ({
      "@type": "City",
      name: `${city.name}, ${site.state.name}`,
    })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: site.hours.days,
        opens: site.hours.opens,
        closes: site.hours.closes,
      },
    ],
    ...(site.licenseNumber
      ? { hasCredential: { "@type": "EducationalOccupationalCredential", name: `${site.state.code} License #${site.licenseNumber}` } }
      : {}),
  };
}

export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbSchema(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

export function serviceSchema({ name, description, path }: { name: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: absoluteUrl(path),
    serviceType: name,
    provider: { "@id": businessId() },
    areaServed: cities.map((city) => ({
      "@type": "City",
      name: `${city.name}, ${site.state.name}`,
    })),
  };
}

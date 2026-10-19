import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/sections/cta-band";
import { Faq } from "@/components/sections/faq";
import { HowItWorks } from "@/components/sections/how-it-works";
import { PageHero } from "@/components/sections/page-hero";
import { ServiceGrid } from "@/components/sections/service-grid";
import { Section, SectionHeading } from "@/components/ui/section";
import { categories, getCategory } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[category]">): Promise<Metadata> {
  const category = getCategory((await params).category);
  if (!category) return {};
  return pageMetadata({
    title: `${category.title} in Midland, Odessa, Lubbock & Amarillo`,
    description: category.summary,
    path: `/services/${category.slug}`,
  });
}

export default async function CategoryPage({ params }: PageProps<"/services/[category]">) {
  const category = getCategory((await params).category);
  if (!category) notFound();

  return (
    <>
      <PageHero
        crumbs={[
          { name: "Our Services", path: "/services" },
          { name: category.name, path: `/services/${category.slug}` },
        ]}
        eyebrow={`${category.name} locksmith`}
        title={category.title}
        intro={<p>{category.summary}</p>}
      />

      <Section aria-labelledby="category-services">
        <SectionHeading id="category-services" eyebrow="Services" title={`${category.name} services`} />
        <ServiceGrid category={category} className="mt-10" />
      </Section>

      <HowItWorks tone="carbon" />
      <CtaBand />
      <Faq />
    </>
  );
}

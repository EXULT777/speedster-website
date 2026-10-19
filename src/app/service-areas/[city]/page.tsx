import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryCards } from "@/components/sections/category-cards";
import { CtaBand } from "@/components/sections/cta-band";
import { Faq } from "@/components/sections/faq";
import { HowItWorks } from "@/components/sections/how-it-works";
import { MiniMap } from "@/components/sections/mini-map";
import { PageHero } from "@/components/sections/page-hero";
import { Section, SectionHeading } from "@/components/ui/section";
import { cities, getCity } from "@/content/areas";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return cities.map((city) => ({ city: city.slug }));
}

export async function generateMetadata({ params }: PageProps<"/service-areas/[city]">): Promise<Metadata> {
  const city = getCity((await params).city);
  if (!city) return {};
  return pageMetadata({
    title: `Locksmith in ${city.name}, TX`,
    description: `${city.intro} Call Speedster Lock & Key at ${site.phone.display}.`,
    path: `/service-areas/${city.slug}`,
  });
}

export default async function CityPage({ params }: PageProps<"/service-areas/[city]">) {
  const city = getCity((await params).city);
  if (!city) notFound();

  return (
    <>
      <PageHero
        crumbs={[
          { name: "Service Areas", path: "/service-areas" },
          { name: city.name, path: `/service-areas/${city.slug}` },
        ]}
        eyebrow={city.county}
        title={`Locksmith Services in ${city.name}, TX`}
        intro={<p>{city.intro}</p>}
        aside={
          <div className="card bg-carbon-fiber mx-auto max-w-sm p-6">
            <MiniMap highlight={city.slug} />
          </div>
        }
      />

      <Section aria-labelledby="city-services">
        <SectionHeading
          id="city-services"
          eyebrow={`${city.name} services`}
          title={`Home, business, and vehicle help in ${city.name}`}
        />
        <CategoryCards className="mt-10" />
      </Section>

      <HowItWorks tone="carbon" />
      <CtaBand />
      <Faq />
    </>
  );
}

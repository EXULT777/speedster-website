import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChecklistCard } from "@/components/sections/checklist-card";
import { CtaBand } from "@/components/sections/cta-band";
import { Faq } from "@/components/sections/faq";
import { HowItWorks } from "@/components/sections/how-it-works";
import { PageHero } from "@/components/sections/page-hero";
import { ServiceGrid } from "@/components/sections/service-grid";
import { JsonLd } from "@/components/seo/json-ld";
import { Section, SectionHeading } from "@/components/ui/section";
import { getServiceDetail } from "@/content/service-details";
import { allSubServicePages, getSubService } from "@/content/services";
import { serviceSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return allSubServicePages().map(({ category, service }) => ({
    category: category.slug,
    service: service.slug,
  }));
}

export async function generateMetadata({ params }: PageProps<"/services/[category]/[service]">): Promise<Metadata> {
  const { category, service } = await params;
  const match = getSubService(category, service);
  if (!match) return {};
  return pageMetadata({
    title: `${match.service.title} in Midland, Odessa, Lubbock & Amarillo`,
    description: match.service.summary,
    path: `/services/${match.category.slug}/${match.service.slug}`,
  });
}

export default async function SubServicePage({ params }: PageProps<"/services/[category]/[service]">) {
  const { category: categorySlug, service: serviceSlug } = await params;
  const match = getSubService(categorySlug, serviceSlug);
  if (!match) notFound();

  const { category, service } = match;
  const detail = getServiceDetail(category.slug, service.slug);
  // Fail the build rather than publish a page without its copy.
  if (!detail) throw new Error(`Missing copy in service-details.ts for ${category.slug}/${service.slug}`);
  const path = `/services/${category.slug}/${service.slug}`;
  const related = category.services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <PageHero
        crumbs={[
          { name: "Our Services", path: "/services" },
          { name: category.name, path: `/services/${category.slug}` },
          { name: service.title, path },
        ]}
        eyebrow={`${category.name} locksmith`}
        title={
          <>
            {service.title}
            <span className="mt-3 block text-[0.42em] leading-tight text-chrome-2">
              in Midland, Odessa, Lubbock &amp; Amarillo
            </span>
          </>
        }
        intro={<p>{service.summary}</p>}
      />

      <Section aria-labelledby="service-details">
        {/* Phones read top to bottom: intro, situations, approach. Desktop puts
            the situations card in a sticky right-hand column. */}
        <div className="grid items-start gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:gap-x-14 lg:gap-y-10">
          <div>
            <SectionHeading id="service-details" eyebrow={service.title} title="What to expect" />
            <div className="mt-5 space-y-4 leading-relaxed text-chrome-2 md:mt-6 md:text-lg">
              {detail.intro.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <ChecklistCard
            as="h3"
            heading={detail.situationsHeading}
            items={detail.situations}
            className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:col-start-2 lg:row-span-2 lg:row-start-1"
          />
          <div>
            <h3 className="display h3">{detail.approachHeading}</h3>
            <div className="mt-4 space-y-4 leading-relaxed text-chrome-2 md:text-lg">
              {detail.approach.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <HowItWorks tone="carbon" heading={detail.stepsHeading} steps={detail.steps} />

      <Section aria-labelledby="related-heading">
        <SectionHeading id="related-heading" eyebrow="Related services" title={`More ${category.name.toLowerCase()} services`} />
        <ServiceGrid category={category} services={related} className="mt-10" />
      </Section>

      <CtaBand />
      <Faq />
      <JsonLd data={serviceSchema({ name: service.title, description: service.summary, path })} />
    </>
  );
}

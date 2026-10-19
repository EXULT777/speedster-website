import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ChecklistCard } from "@/components/sections/checklist-card";
import { CtaBand } from "@/components/sections/cta-band";
import { HowItWorks } from "@/components/sections/how-it-works";
import { KeyTypesList } from "@/components/sections/key-types";
import { PageHero } from "@/components/sections/page-hero";
import { CallButton } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { brands, getBrand } from "@/content/brands";
import { carKeySteps, whatToHaveReady } from "@/content/car-keys";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return brands.map((brand) => ({ brand: brand.slug }));
}

export async function generateMetadata({ params }: PageProps<"/car-key-replacement/[brand]">): Promise<Metadata> {
  const brand = getBrand((await params).brand);
  if (!brand) return {};
  return pageMetadata({
    title: `${brand.name} Key Replacement in Midland, Odessa, Lubbock & Amarillo`,
    description: `Lost or broken ${brand.name} key? Speedster Lock & Key cuts and programs replacement keys and fobs for many ${brand.name} models on-site in Midland, Odessa, Lubbock, and Amarillo.`,
    path: `/car-key-replacement/${brand.slug}`,
  });
}

export default async function BrandPage({ params }: PageProps<"/car-key-replacement/[brand]">) {
  const brand = getBrand((await params).brand);
  if (!brand) notFound();

  const title = `${brand.name} Key Replacement`;
  const path = `/car-key-replacement/${brand.slug}`;

  return (
    <>
      <PageHero
        crumbs={[
          { name: "Car Key Replacement", path: "/car-key-replacement" },
          { name: brand.name, path },
        ]}
        eyebrow="Car key replacement"
        title={title}
      />

      <Section aria-labelledby="brand-intro">
        <SectionHeading id="brand-intro" title={brand.heading} className="max-w-4xl" />
        <div className="mt-5 max-w-3xl space-y-4 leading-relaxed text-chrome-2 md:mt-6 md:text-lg">
          {brand.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Section>

      <Section tone="carbon" aria-labelledby="brand-keys">
        <SectionHeading
          id="brand-keys"
          eyebrow="Key types"
          title={`${brand.name} keys we can help with`}
          intro={<p>Depending on the year and model, your {brand.name} may use one of these key types.</p>}
        />
        <KeyTypesList only={brand.keyTypes} className="mt-10" />
      </Section>

      <HowItWorks eyebrow="How it works" heading="From lost key to working key" steps={carKeySteps} />

      <Section tone="carbon" aria-labelledby="brand-ready">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <ChecklistCard id="brand-ready" heading={whatToHaveReady.heading} items={whatToHaveReady.items} note={whatToHaveReady.note} />
          <div className="card flex h-full flex-col justify-center gap-6 p-7 md:p-9">
            <p className="display h3">Need a {brand.name} key today?</p>
            <p className="text-lg leading-relaxed text-muted">
              Call with your {brand.name}&apos;s year and model and we&apos;ll tell you what we can do.
            </p>
            <CallButton size="lg" pulse className="self-start" />
          </div>
        </div>
      </Section>

      <CtaBand />
    </>
  );
}

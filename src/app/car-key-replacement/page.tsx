import type { Metadata } from "next";
import { KeyArt } from "@/components/art/key-art";
import { BrandTiles } from "@/components/sections/brand-tiles";
import { ChecklistCard } from "@/components/sections/checklist-card";
import { CtaBand } from "@/components/sections/cta-band";
import { Faq } from "@/components/sections/faq";
import { HowItWorks } from "@/components/sections/how-it-works";
import { PageHero } from "@/components/sections/page-hero";
import { KeyShowroom } from "@/components/showroom/key-showroom";
import { CallButton } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { carKeyPage, carKeySteps, whatToHaveReady } from "@/content/car-keys";
import { pageMetadata } from "@/lib/seo";

const path = "/car-key-replacement";

export const metadata: Metadata = pageMetadata({
  title: "Car Key Replacement in Midland, Odessa, Lubbock & Amarillo",
  description:
    "Lost your car key? We cut and program transponder keys, remote-head keys, flip keys, and smart fobs on-site in Midland, Odessa, Lubbock, and Amarillo. No tow to the dealer.",
  path,
});

export default function CarKeyReplacementPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: carKeyPage.title, path }]}
        eyebrow={carKeyPage.eyebrow}
        title={carKeyPage.title}
        aside={<KeyArt />}
      />

      <Section aria-labelledby="ckr-intro">
        <SectionHeading id="ckr-intro" title={carKeyPage.heading} intro={<p>{carKeyPage.intro}</p>} className="max-w-4xl" />
      </Section>

      <Section tone="carbon" texture="carbon" aria-labelledby="showroom-heading">
        <SectionHeading id="showroom-heading" eyebrow="Key types" title={carKeyPage.showroomHeading} />
        <KeyShowroom className="mt-6 md:mt-10" />
      </Section>

      <HowItWorks eyebrow="How it works" heading="From lost key to working key" steps={carKeySteps} />

      <Section tone="carbon" aria-labelledby="ready-heading">
        <div className="grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <ChecklistCard id="ready-heading" heading={whatToHaveReady.heading} items={whatToHaveReady.items} note={whatToHaveReady.note} />
          <div className="card flex h-full flex-col justify-center gap-6 p-7 md:p-9">
            <p className="text-lg leading-relaxed text-muted">
              Have your vehicle&apos;s year, make, and model handy when you call. It helps us confirm the right key
              and bring the right blank and programming equipment.
            </p>
            <CallButton size="lg" pulse className="self-start" />
          </div>
        </div>
      </Section>

      <Section aria-labelledby="makes-heading">
        <SectionHeading id="makes-heading" eyebrow="Makes" title={carKeyPage.makesHeading} />
        <div className="mt-10">
          <BrandTiles />
        </div>
        <p className="mt-10 max-w-2xl text-lg text-muted">{carKeyPage.missingMake}</p>
        <div className="mt-6">
          <CallButton size="lg" />
        </div>
      </Section>

      <CtaBand />
      <Faq />
    </>
  );
}

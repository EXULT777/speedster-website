import type { Metadata } from "next";
import { CarKeyTeaser } from "@/components/home/car-key-teaser";
import { FeatureCards } from "@/components/home/feature-cards";
import { HomeHero } from "@/components/home/hero";
import { ServiceAreasStrip } from "@/components/home/service-areas-strip";
import { WhatWeDoBest } from "@/components/home/what-we-do-best";
import { WhoWeAre } from "@/components/home/who-we-are";
import { WhyChooseUs } from "@/components/home/why-choose-us";
import { CategoryCards } from "@/components/sections/category-cards";
import { CtaBand } from "@/components/sections/cta-band";
import { Faq } from "@/components/sections/faq";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Reviews } from "@/components/sections/reviews";
import { CallButton } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/ui/section";
import { servicesOverview } from "@/content/home";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `Locksmith in Midland, Odessa, Lubbock & Amarillo | ${site.name}`,
  description:
    "Locked out or need a new key? Speedster Lock & Key is a mobile locksmith for homes, businesses, and vehicles in Midland, Odessa, Lubbock, and Amarillo. Open daily 8 AM to midnight.",
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <FeatureCards />
      <WhoWeAre />

      <Section tone="carbon" aria-labelledby="services-heading">
        <SectionHeading
          id="services-heading"
          eyebrow={servicesOverview.eyebrow}
          title={servicesOverview.heading}
          intro={<p>{servicesOverview.intro}</p>}
        />
        <CategoryCards className="mt-12" />
        <div className="mt-10 flex justify-center">
          <CallButton size="lg" pulse />
        </div>
      </Section>

      <HowItWorks />
      <Reviews />
      <WhyChooseUs />
      <CtaBand />
      <WhatWeDoBest />
      <CarKeyTeaser />
      <ServiceAreasStrip />
      <Faq />
    </>
  );
}

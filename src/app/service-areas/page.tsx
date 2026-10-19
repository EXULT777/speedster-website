import type { Metadata } from "next";
import { CityCards } from "@/components/sections/city-cards";
import { CtaBand } from "@/components/sections/cta-band";
import { Faq } from "@/components/sections/faq";
import { PageHero } from "@/components/sections/page-hero";
import { TexasMap } from "@/components/sections/texas-map";
import { Section } from "@/components/ui/section";
import { serviceAreasPage } from "@/content/areas";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

const path = "/service-areas";

export const metadata: Metadata = pageMetadata({
  title: "Service Areas: Midland, Odessa, Lubbock & Amarillo, TX",
  description:
    `Speedster Lock & Key provides mobile locksmith service in four West Texas cities: Midland, Odessa, Lubbock, and Amarillo. Choose your city or call ${site.phone.display}.`,
  path,
});

export default function ServiceAreasPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: serviceAreasPage.title, path }]}
        title={serviceAreasPage.title}
        intro={<p>{serviceAreasPage.intro}</p>}
      />

      <Section aria-labelledby="cities-heading">
        <h2 id="cities-heading" className="sr-only">
          Our four cities
        </h2>
        <div className="grid items-start gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <TexasMap className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]" />
          <CityCards withIntro withCall />
        </div>
      </Section>

      <CtaBand />
      <Faq />
    </>
  );
}

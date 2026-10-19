import { CityCards } from "@/components/sections/city-cards";
import { MiniMap } from "@/components/sections/mini-map";
import { Section, SectionHeading } from "@/components/ui/section";
import { serviceAreasStrip } from "@/content/home";

export function ServiceAreasStrip() {
  return (
    <Section aria-labelledby="areas-heading">
      <div className="grid items-center gap-8 md:gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="card bg-carbon-fiber mx-auto hidden w-full max-w-sm p-6 md:block">
          <MiniMap />
        </div>
        <div>
          <SectionHeading id="areas-heading" eyebrow={serviceAreasStrip.eyebrow} title={serviceAreasStrip.heading} />
          <CityCards className="mt-8 md:mt-10" />
        </div>
      </div>
    </Section>
  );
}

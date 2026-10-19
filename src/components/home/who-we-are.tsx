import { PadlockArt } from "@/components/art/padlock-art";
import { Section } from "@/components/ui/section";
import { PillarsGrid } from "@/components/sections/pillars-grid";
import { whoWeAre } from "@/content/home";

export function WhoWeAre() {
  return (
    <Section aria-labelledby="who-heading" className="pt-14 md:pt-28">
      <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="card bg-carbon-fiber relative mx-auto hidden aspect-square w-full max-w-md items-center justify-center p-12 md:flex">
          <div aria-hidden="true" className="absolute inset-[18%] rounded-full bg-red/20 blur-3xl" />
          <PadlockArt className="relative max-w-64" />
        </div>
        <div>
          <p className="eyebrow mb-4">{whoWeAre.eyebrow}</p>
          <h2 id="who-heading" className="display h2-sm">
            {whoWeAre.heading}
          </h2>
          <div className="speed-rule my-7 hidden md:block" aria-hidden="true" />
          <p className="relative mt-5 pl-4 text-[0.95rem] leading-relaxed text-chrome-2 before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:rounded-full before:bg-linear-to-b before:from-red before:via-red/40 before:to-transparent md:mt-0 md:pl-0 md:text-lg md:text-muted md:before:hidden">
            {whoWeAre.text}
          </p>
        </div>
      </div>
      <PillarsGrid className="mt-10 md:mt-16" />
    </Section>
  );
}

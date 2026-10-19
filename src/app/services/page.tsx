import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CtaBand } from "@/components/sections/cta-band";
import { Faq } from "@/components/sections/faq";
import { PageHero } from "@/components/sections/page-hero";
import { Icon } from "@/components/ui/icon";
import { Section } from "@/components/ui/section";
import { servicesPage } from "@/content/services";
import { pageMetadata } from "@/lib/seo";

const path = "/services";

export const metadata: Metadata = pageMetadata({
  title: "Locksmith Services in Midland, Odessa, Lubbock & Amarillo",
  description:
    "Residential, commercial, and automotive locksmith services: lockouts, rekeying, lock changes, car key replacement, and more across Midland, Odessa, Lubbock, and Amarillo.",
  path,
});

export default function ServicesPage() {
  return (
    <>
      <PageHero crumbs={[{ name: servicesPage.title, path }]} title={servicesPage.title} intro={<p>{servicesPage.intro}</p>} />

      <Section aria-label="Services">
        <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
          {servicesPage.tiles.map((tile, i) => (
            <li key={tile.label}>
              <Link
                href={tile.href}
                className="card card-hover group relative flex aspect-square flex-col justify-between overflow-hidden p-4 md:p-6"
              >
                <span aria-hidden="true" className="text-chrome display absolute -right-2 -top-3 text-6xl leading-none opacity-10 md:-top-4 md:text-[6rem]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="icon-chip">
                  <Icon name={tile.icon} className="size-5 md:size-6" />
                </span>
                <span>
                  <span className="display block text-lg leading-tight md:text-2xl">{tile.label}</span>
                  <span className="mt-1 inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-red-glow md:mt-3 md:gap-2 md:text-sm">
                    Explore
                    <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <CtaBand />
      <Faq />
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { PadlockArt } from "@/components/art/padlock-art";
import { CategoryCards } from "@/components/sections/category-cards";
import { CtaBand } from "@/components/sections/cta-band";
import { Faq } from "@/components/sections/faq";
import { MiniMap } from "@/components/sections/mini-map";
import { PageHero } from "@/components/sections/page-hero";
import { PillarsGrid } from "@/components/sections/pillars-grid";
import { Icon } from "@/components/ui/icon";
import { Section, SectionHeading } from "@/components/ui/section";
import { cities } from "@/content/areas";
import { aboutPage } from "@/content/pages";
import { site } from "@/content/site";
import { pageMetadata, withBasePath } from "@/lib/seo";

const path = "/about";

export const metadata: Metadata = pageMetadata({
  title: "About Us",
  description:
    "Speedster Lock & Key is a mobile locksmith team serving Midland, Odessa, Lubbock, and Amarillo. Fast, honest, professional service for homes, businesses, and vehicles.",
  path,
});

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "About Us", path }]}
        title={aboutPage.title}
        intro={<p className="display text-2xl text-fg md:text-3xl">{aboutPage.subheading}</p>}
        aside={<PadlockArt className="mx-auto max-w-72" />}
      />

      <Section aria-labelledby="story-heading">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            <p className="eyebrow mb-4">{aboutPage.storyHeading}</p>
            <h2 id="story-heading" className="display h2">
              Built around one simple idea
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted">
              {aboutPage.story.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </div>
          <aside aria-labelledby="mission-heading" className="card glow-red relative self-start overflow-hidden p-8">
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-red to-red-glow" />
            <h2 id="mission-heading" className="eyebrow">
              {aboutPage.missionHeading}
            </h2>
            <p className="display mt-5 text-2xl leading-snug md:text-3xl">{aboutPage.mission}</p>
          </aside>
        </div>
      </Section>

      <Section tone="carbon" texture="brushed" aria-labelledby="values-heading">
        <SectionHeading id="values-heading" eyebrow="Values" title={aboutPage.valuesHeading} />
        <ul className="mt-6 grid grid-cols-2 gap-3 md:mt-12 md:gap-5 lg:grid-cols-4">
          {aboutPage.values.map((value) => (
            <li key={value.title} className="card p-4 md:p-7">
              <span className="icon-chip mb-3 md:mb-6">
                <Icon name={value.icon} className="size-5 md:size-6" />
              </span>
              <h3 className="display text-base leading-tight md:text-xl">{value.title}</h3>
              <p className="mt-1.5 text-[0.8125rem] leading-snug text-muted md:mt-3 md:text-base md:leading-relaxed">{value.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      {site.photos.length > 0 && (
        // Real team / vehicle photos from site.photos. Hidden while the list is empty.
        <Section aria-label="Photos">
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {site.photos.map((photo) => (
              <li key={photo.src} className="card overflow-hidden">
                <Image src={withBasePath(photo.src)} alt={photo.alt} width={photo.width} height={photo.height} className="h-auto w-full" sizes="(min-width: 1024px) 33vi, (min-width: 640px) 50vi, 100vi" />
                {photo.caption && <p className="p-4 text-sm text-muted">{photo.caption}</p>}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {site.stats.length > 0 && (
        <Section tone="carbon" aria-label="By the numbers">
          <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {site.stats.map((stat) => (
              <div key={stat.label} className="card p-7 text-center">
                <dt className="text-sm uppercase tracking-[0.14em] text-muted">{stat.label}</dt>
                <dd className="display text-chrome mt-2 text-5xl">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </Section>
      )}

      <Section aria-labelledby="what-heading">
        <SectionHeading id="what-heading" eyebrow="Services" title={aboutPage.whatWeDoHeading} />
        <CategoryCards compact className="mt-10" />
      </Section>

      <Section tone="carbon" aria-labelledby="where-heading">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading id="where-heading" eyebrow="Service areas" title={aboutPage.whereWeWorkHeading} />
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {cities.map((city) => (
                <li key={city.slug}>
                  <Link
                    href={`/service-areas/${city.slug}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 font-semibold text-chrome-1 transition-colors hover:border-red/60 hover:text-fg"
                  >
                    <MapPin aria-hidden="true" className="size-4 text-red-glow" />
                    {city.name}, TX
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="card bg-carbon-fiber mx-auto w-full max-w-sm p-6">
            <MiniMap />
          </div>
        </div>
      </Section>

      <Section aria-labelledby="pillars-heading">
        <SectionHeading id="pillars-heading" eyebrow="Who we are" title="What you can count on" />
        <PillarsGrid className="mt-6 md:mt-12" />
      </Section>

      <CtaBand />
      <Faq />
    </>
  );
}

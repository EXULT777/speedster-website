import Link from "next/link";
import { MapPin, Phone } from "lucide-react";
import { HeroShell } from "@/components/hero/hero-shell";
import { IntroLoader } from "@/components/home/intro-loader";
import { ButtonLink, CallButton } from "@/components/ui/button";
import { cities } from "@/content/areas";
import { hero } from "@/content/home";
import { quoteHref } from "@/content/navigation";
import { site } from "@/content/site";

export function HomeHero() {
  const [before, after] = hero.heading.split("Speedster");

  return (
    <>
      <IntroLoader />
      <HeroShell>
        {/* Below lg the wrapper dissolves (contents) so the shell can slot the
            key between the headline and the paragraph. */}
        <div className="max-lg:contents">
          <div className="max-lg:order-1">
            <a
              href={site.phone.href}
              className="inline-flex min-h-11 -skew-x-10 items-center gap-2.5 rounded-md border border-red/50 bg-red/12 px-4 text-sm text-chrome-1 transition-colors hover:border-red hover:bg-red/20"
            >
              <span className="inline-flex skew-x-10 items-center gap-2.5">
                <Phone aria-hidden="true" className="size-4 text-red-glow" strokeWidth={2.5} />
                {hero.pillLabel} <strong className="font-bold tracking-wide text-fg">{site.phone.display}</strong>
              </span>
            </a>

            <h1 id="hero-heading" className="display h1 mt-4 md:mt-6">
              {before}
              <span className="text-chrome">Speedster</span>
              {after}
            </h1>
          </div>

          <div className="max-lg:order-3">
            <p className="max-w-xl text-[0.95rem] leading-relaxed text-chrome-2 md:text-xl lg:mt-6">{hero.text}</p>

            <div className="mt-5 grid gap-2.5 sm:flex sm:flex-wrap md:mt-8 md:gap-3">
              <CallButton size="lg" pulse className="btn-block sm:mx-0 sm:w-auto" />
              <ButtonLink href={quoteHref} variant="ghost" size="lg" className="btn-block sm:mx-0 sm:w-auto">
                Get a Quote
              </ButtonLink>
          </div>

          {/* Phones: one four-up bar. Wider: a row of chips. */}
          <ul
            className="mt-4 grid grid-cols-4 overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm sm:flex sm:flex-wrap sm:gap-2 sm:overflow-visible sm:rounded-none sm:border-0 sm:bg-transparent sm:backdrop-blur-none md:mt-7"
            aria-label="Cities we serve"
          >
            {cities.map((city, i) => (
              <li key={city.slug} className={i > 0 ? "border-l border-white/10 sm:border-0" : undefined}>
                <Link
                  href={`/service-areas/${city.slug}`}
                  className="flex min-h-14 flex-col items-center justify-center gap-1 text-[0.78rem] font-semibold text-chrome-1 transition-colors hover:bg-white/5 hover:text-fg sm:min-h-11 sm:flex-row sm:gap-1.5 sm:rounded-full sm:border sm:border-white/10 sm:bg-white/5 sm:px-3.5 sm:text-[0.8125rem] sm:hover:border-red/60 md:px-4 md:text-sm"
                >
                  <MapPin aria-hidden="true" className="size-3.5 text-red-glow" />
                  {city.name}
                </Link>
              </li>
            ))}
          </ul>
          </div>
        </div>
      </HeroShell>
    </>
  );
}

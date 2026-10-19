import { MapPin } from "lucide-react";
import { cities } from "@/content/areas";
import { ctaBand, site } from "@/content/site";
import { SpeedStreaks } from "@/components/sections/speed-streaks";

/** "Need help now?" band: one call button per city. */
export function CtaBand() {
  return (
    <section aria-labelledby="cta-band-heading" className="relative overflow-hidden bg-ink py-10 md:py-20">
      <div className="container-x">
        <div className="relative isolate overflow-hidden rounded-2xl border border-red/40 bg-linear-to-br from-red-deep via-[#5c060a] to-ink px-5 py-8 sm:px-8 md:px-12 md:py-14">
          <SpeedStreaks count={5} className="opacity-50" />
          <div
            aria-hidden="true"
            className="absolute -right-24 -top-24 size-80 rounded-full bg-red/35 blur-3xl"
          />
          <div className="relative grid items-center gap-7 md:gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="mb-4 inline-flex items-center gap-2.5 text-[0.8125rem] font-bold uppercase tracking-[0.16em] text-white before:h-[0.3rem] before:w-6 before:-skew-x-[20deg] before:bg-white">
                {ctaBand.eyebrow}
              </p>
              <h2 id="cta-band-heading" className="display h2">
                {ctaBand.heading}
              </h2>
              <p className="mt-4 max-w-xl leading-relaxed text-white/85 md:mt-5 md:text-lg">{ctaBand.text}</p>
            </div>
            <ul className="grid grid-cols-2 gap-2.5 md:gap-3">
              {cities.map((city) => (
                <li key={city.slug}>
                  <a
                    href={site.phone.href}
                    className="group flex min-h-14 items-center gap-2 rounded-xl border border-white/15 bg-ink/55 px-3 py-2.5 md:min-h-16 md:gap-3 md:px-4 md:py-3 backdrop-blur transition-[border-color,background-color,transform] duration-300 hover:-translate-y-0.5 hover:border-white/50 hover:bg-ink/75"
                  >
                    <MapPin aria-hidden="true" className="size-5 shrink-0 text-red-glow" />
                    <span>
                      <span className="display block text-lg md:text-xl">{city.name}</span>
                      <span className="hidden whitespace-nowrap text-sm text-white/75 md:block">
                        Call {site.phone.display}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { CallButton } from "@/components/ui/button";
import { cities } from "@/content/areas";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/** One card per city, linking to its page. */
export function CityCards({ withIntro = false, withCall = false, className }: { withIntro?: boolean; withCall?: boolean; className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-3 md:gap-4", className)}>
      {cities.map((city) => (
        <li key={city.slug} className="card card-hover flex flex-col p-4 md:p-6">
          <Link href={`/service-areas/${city.slug}`} className="group flex-1">
            <span className="flex items-center gap-1.5 text-xs text-muted md:gap-2 md:text-sm">
              <MapPin aria-hidden="true" className="size-4 text-red-glow" />
              {city.county}
            </span>
            <h3 className="display mt-1.5 text-xl md:mt-2 md:text-2xl">{city.name}, TX</h3>
            {withIntro && <p className="mt-1.5 line-clamp-4 text-[0.8125rem] leading-snug text-muted md:mt-3 md:line-clamp-none md:text-base md:leading-relaxed">{city.intro}</p>}
            <span className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-red-glow md:mt-4 md:gap-2 md:text-base">
              View <span className="sr-only md:not-sr-only">{city.name}</span> services
              <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
          {withCall && (
            <CallButton size="sm" variant="dark" className="mt-3 self-start md:mt-5" label={<><span className="md:hidden">Call</span><span className="hidden md:inline">Call {site.phone.display}</span></>} srContext={`${city.name}, ${site.phone.display}`} />
          )}
        </li>
      ))}
    </ul>
  );
}

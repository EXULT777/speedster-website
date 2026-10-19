import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { cities } from "@/content/areas";
import { categories } from "@/content/services";
import { footer, licenseLine, site } from "@/content/site";
import { CallButton } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { CopyrightYear } from "@/components/layout/copyright-year";

const headingClass =
  "display mb-3 text-base tracking-wide text-fg md:mb-5 md:text-lg after:mt-3 after:block after:h-[3px] after:w-10 after:-skew-x-[30deg] after:bg-red";

export function Footer() {
  return (
    <footer className="bg-carbon-fiber relative overflow-hidden border-t border-white/5 bg-carbon">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-red to-transparent" />
      <div className="container-x grid grid-cols-2 gap-x-6 gap-y-10 py-12 md:gap-12 lg:grid-cols-[1.2fr_1fr_0.8fr_1.4fr] lg:gap-10 lg:py-20">
        <div className="col-span-2 md:col-span-1">
          <Logo height={80} />
          <p className="display mt-5 text-lg md:mt-6 md:text-xl">{site.name}</p>
          <p className="mt-1 text-muted">{footer.tagline}</p>
          <ul className="mt-6 space-y-1">
            <li>
              <a href={site.email.href} className="flex min-h-11 items-center gap-3 text-chrome-2 transition-colors hover:text-fg">
                <Mail aria-hidden="true" className="size-5 text-red-glow" />
                {site.email.display}
              </a>
            </li>
            <li>
              <a href={site.phone.href} className="flex min-h-11 items-center gap-3 font-bold text-fg transition-colors hover:text-red-glow">
                <Phone aria-hidden="true" className="size-5 text-red-glow" />
                {site.phone.display}
              </a>
            </li>
          </ul>
        </div>

        <nav aria-labelledby="footer-services">
          <h2 id="footer-services" className={headingClass}>
            {footer.servicesHeading}
          </h2>
          <ul className="space-y-1">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={`/services/${category.slug}`}
                  className="flex min-h-11 items-center text-[0.95rem] text-chrome-2 transition-colors hover:text-fg md:text-base"
                >
                  {category.footerLabel}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-areas">
          <h2 id="footer-areas" className={headingClass}>
            {footer.areasHeading}
          </h2>
          <ul className="space-y-1">
            {cities.map((city) => (
              <li key={city.slug}>
                <Link
                  href={`/service-areas/${city.slug}`}
                  className="flex min-h-11 items-center gap-2 text-chrome-2 transition-colors hover:text-fg"
                >
                  <MapPin aria-hidden="true" className="size-4 text-red-glow" />
                  {city.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-2 md:col-span-1">
          <h2 className={headingClass}>{footer.closingHeading}</h2>
          <p className="leading-relaxed text-muted">{footer.closingText}</p>
          <ul className="mt-6 grid grid-cols-2 gap-2.5">
            {cities.map((city) => (
              <li key={city.slug}>
                <CallButton
                  variant="dark"
                  size="sm"
                  className="btn-block"
                  label={city.name}
                  srContext={`— call ${site.name} at ${site.phone.display}`}
                />
              </li>
            ))}
          </ul>
          <CallButton
            size="lg"
            pulse
            className="btn-block mt-4"
            label={
              <>
                {footer.callLabel} {site.phone.display}
              </>
            }
          />
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-sm text-muted sm:flex-row">
          <p>
            © <CopyrightYear /> {site.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {licenseLine && <p>{licenseLine}</p>}
            <Link href="/privacy" className="flex min-h-11 items-center underline-offset-4 hover:text-fg hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

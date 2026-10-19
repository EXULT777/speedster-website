import { KeyArt } from "@/components/art/key-art";
import { ButtonLink } from "@/components/ui/button";
import { brands } from "@/content/brands";
import { carKeyTeaser } from "@/content/car-keys";

export function CarKeyTeaser() {
  return (
    <section aria-labelledby="car-key-heading" className="bg-carbon-fiber relative bg-carbon py-12 md:py-24">
      <div className="container-x grid items-center gap-8 md:gap-12 lg:grid-cols-2">
        <div className="card relative order-2 flex aspect-[16/9] items-center justify-center overflow-hidden bg-ink p-6 md:aspect-[4/3] md:p-8 lg:order-1">
          <div aria-hidden="true" className="absolute inset-[15%] rounded-full bg-red/20 blur-3xl" />
          <KeyArt className="relative" />
        </div>
        <div className="order-1 lg:order-2">
          <p className="eyebrow mb-4">Car key replacement</p>
          <h2 id="car-key-heading" className="display h2">
            {carKeyTeaser.heading}
          </h2>
          <p className="mt-4 leading-relaxed text-muted md:mt-5 md:text-lg">{carKeyTeaser.text}</p>
          <div className="mt-6 md:mt-8">
            <ButtonLink href="/car-key-replacement" size="lg" arrow>
              {carKeyTeaser.button}
            </ButtonLink>
          </div>
        </div>
      </div>

      <BrandMarquee />
    </section>
  );
}

function BrandMarquee() {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-10 pr-10">
      {brands.map((brand) => (
        <li key={brand.slug} className="display text-chrome whitespace-nowrap text-2xl md:text-4xl">
          {brand.name}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="relative mt-10 overflow-hidden border-y border-white/5 py-4 md:mt-16 md:py-6 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <p className="sr-only">Makes we work with</p>
      <div className="flex w-max motion-safe:animate-[marquee_45s_linear_infinite]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}

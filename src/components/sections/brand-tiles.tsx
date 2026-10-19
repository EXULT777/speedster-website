import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { StaticImageData } from "next/image";
import { brandLogos } from "@/content/brand-logos";
import { brands } from "@/content/brands";

/** Make tiles with each make's logo, linking to each brand page. */
export function BrandTiles() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {brands.map((brand) => (
        <li key={brand.slug}>
          <Link
            href={`/car-key-replacement/${brand.slug}`}
            className="card card-hover group flex h-full flex-col p-5 [perspective:600px]"
          >
            <span className="flex h-[3em] items-center sm:text-lg">
              <BrandLogo logo={brandLogos[brand.slug]} />
            </span>
            <span className="display text-chrome mt-4 block text-2xl leading-none transition-transform duration-500 group-hover:-skew-x-6 group-hover:[text-shadow:0_0_24px_rgb(229_8_15/0.45)] sm:text-[1.7rem]">
              {brand.name}
            </span>
            <span className="mt-2 text-sm text-muted">Key replacement</span>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-red-glow">
              Read more
              <ArrowRight aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Largest logo box, in em, so wide wordmarks and tall emblems both fit the tile. */
const MAX_W = 7;
const MAX_H = 3;
/** Every logo gets roughly the same ink area, so wordmarks don't tower over emblems. */
const AREA = 7;

/**
 * Decorative logo (the make's name is the text beside it), drawn as a CSS
 * mask over the same chrome gradient as `.text-chrome`.
 */
function BrandLogo({ logo }: { logo: StaticImageData }) {
  const ratio = logo.width / logo.height;
  let h = Math.min(Math.sqrt(AREA / ratio), MAX_H);
  if (h * ratio > MAX_W) h = MAX_W / ratio;

  const style: CSSProperties = {
    width: `${(h * ratio).toFixed(3)}em`,
    height: `${h.toFixed(3)}em`,
    background:
      "linear-gradient(180deg, var(--chrome-1) 0%, #fff 30%, var(--chrome-2) 52%, var(--chrome-3) 58%, var(--chrome-1) 100%)",
    mask: `url(${logo.src}) center / contain no-repeat`,
    WebkitMask: `url(${logo.src}) center / contain no-repeat`,
  };

  return (
    <span
      aria-hidden="true"
      style={style}
      className="block transition-[transform,filter] duration-500 group-hover:-skew-x-6 group-hover:[filter:drop-shadow(0_0_10px_rgb(229_8_15/0.6))]"
    />
  );
}

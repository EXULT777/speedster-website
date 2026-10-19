/**
 * One-colour logo for each make in brands.ts, keyed by slug. The files in
 * public/brands are single-colour SVGs cropped to the artwork; the tiles use
 * them as a CSS mask, so the colour comes from the page, not the file.
 */

import type { StaticImageData } from "next/image";

import acura from "../../public/brands/acura.svg";
import amc from "../../public/brands/amc.svg";
import cadillac from "../../public/brands/cadillac.svg";
import chrysler from "../../public/brands/chrysler.svg";
import ford from "../../public/brands/ford.svg";
import gmc from "../../public/brands/gmc.svg";
import hummer from "../../public/brands/hummer.svg";
import infiniti from "../../public/brands/infiniti.svg";
import isuzu from "../../public/brands/isuzu.svg";
import jeep from "../../public/brands/jeep.svg";
import kia from "../../public/brands/kia.svg";
import lexus from "../../public/brands/lexus.svg";
import mazda from "../../public/brands/mazda.svg";
import nissan from "../../public/brands/nissan.svg";
import plymouth from "../../public/brands/plymouth.svg";
import pontiac from "../../public/brands/pontiac.svg";
import subaru from "../../public/brands/subaru.svg";
import suzuki from "../../public/brands/suzuki.svg";
import toyota from "../../public/brands/toyota.svg";

export const brandLogos: Record<string, StaticImageData> = {
  gmc,
  lexus,
  amc,
  plymouth,
  nissan,
  pontiac,
  cadillac,
  hummer,
  acura,
  chrysler,
  mazda,
  infiniti,
  subaru,
  ford,
  toyota,
  kia,
  isuzu,
  suzuki,
  jeep,
};

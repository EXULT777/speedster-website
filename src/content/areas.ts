/**
 * The four cities we serve. City pages, the service-area map, the CTA band
 * and the footer are all generated from this list.
 */

export type CitySlug = "midland" | "odessa" | "lubbock" | "amarillo";

export type City = {
  slug: CitySlug;
  name: string;
  county: string;
  region: string;
  /** One-line intro used on cards and at the top of the city page. */
  intro: string;
  /** Approximate city-centre coordinates, used to place map pins. */
  geo: { lat: number; lng: number };
};

export const cities: City[] = [
  {
    slug: "midland",
    name: "Midland",
    county: "Midland County",
    region: "Permian Basin",
    intro:
      "From homes and offices to work trucks across the Permian Basin, Midland residents and businesses can count on us for fast, professional locksmith help.",
    geo: { lat: 31.9973, lng: -102.0779 },
  },
  {
    slug: "odessa",
    name: "Odessa",
    county: "Ector County",
    region: "Permian Basin",
    intro:
      "Locked out, lost a key, or upgrading your security? Odessa homeowners, businesses, and drivers can call us for dependable mobile locksmith service.",
    geo: { lat: 31.8457, lng: -102.3676 },
  },
  {
    slug: "lubbock",
    name: "Lubbock",
    county: "Lubbock County",
    region: "South Plains",
    intro:
      "Serving homes, businesses, and vehicles across Lubbock and the South Plains with fast, reliable locksmith service.",
    geo: { lat: 33.5779, lng: -101.8552 },
  },
  {
    slug: "amarillo",
    name: "Amarillo",
    county: "Potter and Randall Counties",
    region: "Texas Panhandle",
    intro:
      "Professional locksmith service for Amarillo homes, businesses, and vehicles throughout the Texas Panhandle.",
    geo: { lat: 35.222, lng: -101.8313 },
  },
];

export const serviceAreasPage = {
  title: "Service Areas",
  intro:
    "Speedster Lock & Key serves four West Texas cities. Choose yours to learn more, or call us now.",
};

export const cityNames = cities.map((c) => c.name);

export function getCity(slug: string) {
  return cities.find((c) => c.slug === slug);
}

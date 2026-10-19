import { useId } from "react";
import { cities, type CitySlug } from "@/content/areas";
import { cn } from "@/lib/cn";

// Simple equirectangular projection: ~1 px per mile, centred on the route.
const MAX_LAT = 35.75;
const CENTER_LNG = -101.95;
const MILES_PER_DEG_LAT = 69;
const MILES_PER_DEG_LNG = 69 * Math.cos((33.6 * Math.PI) / 180);

function project(lat: number, lng: number) {
  return {
    x: 150 + (lng - CENTER_LNG) * MILES_PER_DEG_LNG,
    y: 22 + (MAX_LAT - lat) * MILES_PER_DEG_LAT,
  };
}

const ROUTE: CitySlug[] = ["amarillo", "lubbock", "midland", "odessa"];

/** Flat map of the four cities at their real relative positions. */
export function MiniMap({ className, highlight }: { className?: string; highlight?: CitySlug }) {
  const gridId = `mm-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}-grid`;
  const points = ROUTE.map((slug) => {
    const city = cities.find((c) => c.slug === slug)!;
    return { city, ...project(city.geo.lat, city.geo.lng) };
  });
  const route = points.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  return (
    <svg
      viewBox="0 0 300 320"
      role="img"
      aria-label="Map of West Texas showing Amarillo at the top, Lubbock about 120 miles south, and Midland and Odessa about 120 miles further south"
      className={cn("h-auto w-full", className)}
    >
      <defs>
        <pattern id={gridId} width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 H0 V20" fill="none" stroke="#ffffff" strokeOpacity="0.05" />
        </pattern>
      </defs>
      <rect width="300" height="320" fill={`url(#${gridId})`} />
      <polyline points={route} fill="none" stroke="#e5080f" strokeOpacity="0.35" strokeWidth="6" strokeLinejoin="round" />
      <polyline
        points={route}
        fill="none"
        stroke="#ff3b3f"
        strokeWidth="2"
        strokeDasharray="6 7"
        strokeLinejoin="round"
        className="motion-safe:animate-[dash_1.2s_linear_infinite]"
      />
      {points.map(({ city, x, y }) => {
        const active = !highlight || highlight === city.slug;
        const labelLeft = city.slug === "odessa";
        return (
          <g key={city.slug} opacity={active ? 1 : 0.45}>
            <circle cx={x} cy={y} r="14" fill="#e5080f" opacity="0.18" className="motion-safe:animate-pulse" />
            <circle cx={x} cy={y} r="6" fill="#e5080f" stroke="#ffffff" strokeWidth="2" />
            <text
              x={labelLeft ? x - 14 : x + 14}
              y={y + 5}
              textAnchor={labelLeft ? "end" : "start"}
              fill="#f5f5f6"
              fontSize="15"
              fontWeight="700"
              fontStyle="italic"
              style={{ fontFamily: "var(--font-display)", textTransform: "uppercase" }}
            >
              {city.name}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

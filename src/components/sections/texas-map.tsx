"use client";

import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { useId, useState } from "react";
import { CallButton } from "@/components/ui/button";
import { cities, type City, type CitySlug } from "@/content/areas";
import { cn } from "@/lib/cn";

/*
 * Tilted map of West Texas with a pin standing on each city. The tilt is plain
 * CSS 3D (no WebGL): the map is an SVG plane leaned back in perspective, and
 * each pin is a real button counter-rotated so it stands upright on it.
 */

// Map window in degrees, projected at ~1 unit per mile (equirectangular).
const WEST = -103.6;
const EAST = -100.15;
const NORTH = 36.65;
const SOUTH = 31.35;
const MILES_PER_DEG_LAT = 69;
const MILES_PER_DEG_LNG = 69 * Math.cos((34 * Math.PI) / 180);
const W = (EAST - WEST) * MILES_PER_DEG_LNG;
const H = (NORTH - SOUTH) * MILES_PER_DEG_LAT;

function project(lat: number, lng: number) {
  return { x: (lng - WEST) * MILES_PER_DEG_LNG, y: (NORTH - lat) * MILES_PER_DEG_LAT };
}

// Simplified state border (lat, lng). Only the Panhandle and the western edge
// fall inside the window; the rest keeps the shape closed off-screen.
const BORDER: [number, number][] = [
  [36.5, -103.04],
  [36.5, -100.0],
  [34.56, -100.0],
  [34.38, -99.6],
  [34.2, -99.2],
  [33.9, -97.5],
  [29.7, -93.8],
  [26.0, -97.2],
  [29.8, -101.4],
  [29.8, -102.4],
  [30.6, -104.9],
  [32.0, -106.6],
  [32.0, -103.06],
];

const ROUTE: CitySlug[] = ["amarillo", "lubbock", "midland", "odessa"];

// Plane tilt; pins apply the exact inverse so they face the viewer.
const TILT_X = 52;
const TURN_Z = -8;

const toPath = (points: { x: number; y: number }[]) =>
  points.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");

export function TexasMap({ className }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const [selected, setSelected] = useState<CitySlug | null>(null);
  const city = cities.find((c) => c.slug === selected) ?? null;
  const panelId = `tx-${uid}-panel`;

  const border = toPath(BORDER.map(([lat, lng]) => project(lat, lng))) + " Z";
  const routePoints = ROUTE.map((slug) => {
    const c = cities.find((x) => x.slug === slug)!;
    return project(c.geo.lat, c.geo.lng);
  });
  const route = toPath(routePoints);

  return (
    <div className={cn("card overflow-hidden bg-ink", className)}>
      <div
        className="relative aspect-[1/0.9] overflow-hidden sm:aspect-[1/0.8]"
        style={{ perspective: "1100px", perspectiveOrigin: "50% 20%" }}
      >
        <div aria-hidden="true" className="absolute inset-x-[10%] top-[30%] h-1/2 rounded-full bg-red/20 blur-3xl" />
        <div
          className="absolute left-1/2 top-[47%] w-[56%] -translate-x-1/2 -translate-y-1/2"
          style={{
            aspectRatio: `${W} / ${H}`,
            transform: `rotateX(${TILT_X}deg) rotateZ(${TURN_Z}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <svg viewBox={`0 0 ${W.toFixed(1)} ${H.toFixed(1)}`} aria-hidden="true" className="absolute inset-0 h-full w-full overflow-visible">
            <defs>
              <pattern id={`tx-${uid}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M20 0 H0 V20" fill="none" stroke="#ffffff" strokeOpacity="0.07" />
              </pattern>
              <linearGradient id={`tx-${uid}-land`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#26272c" />
                <stop offset="1" stopColor="#16171a" />
              </linearGradient>
              <clipPath id={`tx-${uid}-clip`}>
                <rect x="-40" y="-40" width={W + 80} height={H + 80} rx="18" />
              </clipPath>
            </defs>
            <g clipPath={`url(#tx-${uid}-clip)`}>
              <rect x="-40" y="-40" width={W + 80} height={H + 80} fill={`url(#tx-${uid}-grid)`} />
              <path d={border} fill={`url(#tx-${uid}-land)`} stroke="#cfd0d3" strokeOpacity="0.55" strokeWidth="1.5" strokeLinejoin="round" />
              <path d={border} fill={`url(#tx-${uid}-grid)`} />
            </g>
            <path d={route} fill="none" stroke="#e5080f" strokeOpacity="0.35" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" />
            <path
              d={route}
              fill="none"
              stroke="#ff3b3f"
              strokeWidth="2.5"
              strokeDasharray="6 7"
              strokeLinejoin="round"
              className="motion-safe:animate-[dash_1.2s_linear_infinite]"
            />
            {routePoints.map((p, i) => {
              const slug = ROUTE[i];
              const active = selected === slug;
              return (
                <g key={slug}>
                  <circle cx={p.x} cy={p.y} r={active ? 16 : 12} fill="#e5080f" opacity="0.22" className="motion-safe:animate-pulse" />
                  <circle cx={p.x} cy={p.y} r="4.5" fill="#e5080f" stroke="#ffffff" strokeWidth="1.5" />
                </g>
              );
            })}
          </svg>

          {ROUTE.map((slug, i) => {
            const c = cities.find((x) => x.slug === slug)!;
            const p = routePoints[i];
            return (
              <Pin
                key={slug}
                city={c}
                left={(p.x / W) * 100}
                top={(p.y / H) * 100}
                // Midland and Odessa sit close together: label them outward.
                side={slug === "odessa" ? "left" : "right"}
                active={selected === slug}
                controls={panelId}
                onSelect={() => setSelected(slug)}
              />
            );
          })}
        </div>
        <p className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-xs font-semibold uppercase tracking-[0.16em] text-muted">
          West Texas
        </p>
      </div>

      <div id={panelId} aria-live="polite" className="border-t border-white/8 p-5 md:p-6">
        {city ? (
          <div>
            <p className="eyebrow mb-2">{city.county}</p>
            <h3 className="display h3">{city.name}, TX</h3>
            <p className="mt-2 leading-relaxed text-muted">{city.intro}</p>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
              <CallButton size="sm" srContext={`in ${city.name}`} />
              <Link
                href={`/service-areas/${city.slug}`}
                className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold uppercase tracking-wide text-red-glow"
              >
                View {city.name} services
                <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        ) : (
          <p className="flex items-center gap-2 text-muted">
            <MapPin aria-hidden="true" className="size-5 shrink-0 text-red-glow" />
            Tap a pin to see each city.
          </p>
        )}
      </div>
    </div>
  );
}

function Pin({
  city,
  left,
  top,
  side,
  active,
  controls,
  onSelect,
}: {
  city: City;
  left: number;
  top: number;
  side: "left" | "right";
  active: boolean;
  controls: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-controls={controls}
      onClick={onSelect}
      onPointerEnter={(e) => e.pointerType === "mouse" && onSelect()}
      onFocus={onSelect}
      className="group absolute flex h-16 w-11 items-end justify-center focus-visible:outline-none"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        transform: `translate(-50%, -100%) rotateZ(${-TURN_Z}deg) rotateX(${-TILT_X}deg)`,
        transformOrigin: "50% 100%",
      }}
    >
      <span className="sr-only">{city.name}</span>
      {/* needle */}
      <span
        aria-hidden="true"
        className={cn(
          "mb-0 block h-12 w-0.5 origin-bottom rounded-full bg-linear-to-t from-red/0 to-chrome-1 transition-transform duration-300",
          active && "scale-y-110",
        )}
      />
      {/* head */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-1/2 top-1 size-3.5 -translate-x-1/2 rounded-full border-2 border-white bg-red shadow-[0_0_14px_rgb(255_59_63/0.9)] transition-transform duration-300 group-hover:scale-125 group-focus-visible:scale-125",
          active && "scale-125",
        )}
      />
      {/* label */}
      <span
        aria-hidden="true"
        className={cn(
          "display absolute top-0 whitespace-nowrap rounded-md border px-2 py-1 text-[0.8rem] transition-colors md:text-sm",
          side === "left" ? "right-[calc(50%+0.9rem)]" : "left-[calc(50%+0.9rem)]",
          active
            ? "border-red bg-red text-white"
            : "border-white/15 bg-graphite/90 text-chrome-1 group-hover:border-red/70 group-focus-visible:border-red",
        )}
      >
        {city.name}
      </span>
    </button>
  );
}

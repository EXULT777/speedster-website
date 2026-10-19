import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * Static car-key fob and blade, styled after the logo. Shown in the hero
 * until WebGL is ready, and kept as the fallback when it is not available.
 */
export function KeyArt({ className, float = true }: { className?: string; float?: boolean }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const id = (name: string) => `ka-${uid}-${name}`;
  return (
    <svg
      viewBox="0 0 680 300"
      role="img"
      aria-label="Chrome car key with a black remote fob"
      className={cn("h-auto w-full overflow-visible", float && "motion-safe:animate-[float-y_6s_ease-in-out_infinite]", className)}
      style={{ transform: "rotate(-14deg)" }}
    >
      <defs>
        <linearGradient id={id("chrome")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.28" stopColor="#e7e8ea" />
          <stop offset="0.5" stopColor="#8f9399" />
          <stop offset="0.62" stopColor="#f5f5f6" />
          <stop offset="0.86" stopColor="#c4c6ca" />
          <stop offset="1" stopColor="#6f737a" />
        </linearGradient>
        <linearGradient id={id("fob")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#34353b" />
          <stop offset="0.45" stopColor="#141417" />
          <stop offset="1" stopColor="#050506" />
        </linearGradient>
        <linearGradient id={id("gloss")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.28" />
          <stop offset="0.5" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={id("floor")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#e5080f" stopOpacity="0.55" />
          <stop offset="1" stopColor="#e5080f" stopOpacity="0" />
        </radialGradient>
        <filter id={id("glow")} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={id("shadow")} x="-10%" y="-10%" width="120%" height="140%">
          <feDropShadow dx="0" dy="18" stdDeviation="14" floodColor="#000" floodOpacity="0.75" />
        </filter>
      </defs>

      <ellipse cx="340" cy="270" rx="300" ry="26" fill={`url(#${id("floor")})`} />

      <g filter={`url(#${id("shadow")})`}>
        {/* key ring */}
        <circle cx="46" cy="150" r="28" fill="none" stroke={`url(#${id("chrome")})`} strokeWidth="9" />

        {/* blade */}
        <path
          d="M330 128 H604 L642 150 L626 172 H598 L588 160 H570 L560 172 H534 L522 158 H502 L492 172 H468 L458 162 H440 L430 172 H330 Z"
          fill={`url(#${id("chrome")})`}
          stroke="#5d6168"
          strokeWidth="1.2"
        />
        <path d="M346 136 H598" stroke="#ffffff" strokeOpacity="0.75" strokeWidth="2.5" />
        <path d="M346 150 H596" stroke="#5d6168" strokeOpacity="0.8" strokeWidth="3" />

        {/* collar */}
        <path d="M280 114 L334 126 V174 L280 186 Z" fill={`url(#${id("chrome")})`} stroke="#5d6168" strokeWidth="1.2" />

        {/* fob body with chrome bezel */}
        <rect x="40" y="68" width="252" height="164" rx="72" fill={`url(#${id("fob")})`} stroke={`url(#${id("chrome")})`} strokeWidth="7" />
        <rect x="56" y="84" width="220" height="132" rx="58" fill="none" stroke="#ff3b3f" strokeWidth="2.5" filter={`url(#${id("glow")})`} />
        <rect x="44" y="72" width="244" height="80" rx="40" fill={`url(#${id("gloss")})`} />

        {/* buttons */}
        <rect x="86" y="108" width="74" height="84" rx="16" fill="#101013" stroke="#3a3b41" strokeWidth="2" />
        <rect x="170" y="108" width="74" height="84" rx="16" fill="#101013" stroke="#3a3b41" strokeWidth="2" />
        <line x1="165" y1="104" x2="165" y2="196" stroke="#2a2b30" strokeWidth="2" />

        {/* lock icon */}
        <g fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M112 146 v-9 a11 11 0 0 1 22 0 v9" />
          <rect x="106" y="146" width="34" height="26" rx="5" />
          <path d="M123 156 v6" />
        </g>
        {/* unlock icon */}
        <g fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M196 146 v-9 a11 11 0 0 1 22 0" />
          <rect x="190" y="146" width="34" height="26" rx="5" />
          <path d="M207 156 v6" />
        </g>
      </g>
    </svg>
  );
}

import { useId } from "react";
import { cn } from "@/lib/cn";

/**
 * 404 scene: a key keeps trying the padlock and wiggles in the keyhole. The
 * shackle pops open while the page's "Back to home" button is hovered or
 * focused (see .lockout-* in globals.css). Pure SVG and CSS.
 */
export function LockoutArt({ className }: { className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const id = (name: string) => `lo-${uid}-${name}`;
  return (
    <svg
      viewBox="0 0 420 380"
      role="img"
      aria-label="A key trying to open a chrome padlock"
      className={cn("h-auto w-full overflow-visible", className)}
    >
      <defs>
        <linearGradient id={id("chrome")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.35" stopColor="#d9dadd" />
          <stop offset="0.55" stopColor="#8f9399" />
          <stop offset="0.7" stopColor="#eef0f2" />
          <stop offset="1" stopColor="#7d8189" />
        </linearGradient>
        <linearGradient id={id("shackle")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9a9ea5" />
          <stop offset="0.45" stopColor="#ffffff" />
          <stop offset="1" stopColor="#8f9399" />
        </linearGradient>
        <linearGradient id={id("key")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#c9cbcf" />
          <stop offset="0.6" stopColor="#8f9399" />
          <stop offset="1" stopColor="#e7e8ea" />
        </linearGradient>
        <radialGradient id={id("floor")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#e5080f" stopOpacity="0.6" />
          <stop offset="1" stopColor="#e5080f" stopOpacity="0" />
        </radialGradient>
        <filter id={id("shadow")} x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="18" stdDeviation="14" floodColor="#000" floodOpacity="0.8" />
        </filter>
      </defs>

      <ellipse cx="170" cy="350" rx="150" ry="18" fill={`url(#${id("floor")})`} />

      <g filter={`url(#${id("shadow")})`}>
        <path
          className="lockout-shackle"
          d="M98 178 V128 a52 52 0 0 1 104 0 V178"
          fill="none"
          stroke={`url(#${id("shackle")})`}
          strokeWidth="26"
          strokeLinecap="round"
        />
        <rect x="46" y="150" width="208" height="176" rx="28" fill={`url(#${id("chrome")})`} />
        <rect x="56" y="160" width="188" height="156" rx="20" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="2" />
        <circle cx="150" cy="222" r="19" fill="#0a0a0b" />
        <path d="M140 232 L131 282 H169 L160 232 Z" fill="#0a0a0b" />
        <path className="lockout-led" d="M58 300 H242" stroke="#e5080f" strokeWidth="3" strokeOpacity="0.85" />
      </g>

      {/* The key, drawn pointing left with its tip at the origin, then
          placed at the keyhole and angled up from the lower right. */}
      <g transform="translate(150 238) rotate(38)">
        <g className="lockout-key" filter={`url(#${id("shadow")})`}>
          <path
            d="M0 -7 L10 -12 H96 V12 H78 L72 6 L66 12 H56 L50 4 L44 12 H34 L28 6 L22 12 H10 Z"
            fill={`url(#${id("key")})`}
            stroke="#5d6168"
            strokeWidth="1.2"
          />
          <path d="M14 -4 H92" stroke="#5d6168" strokeOpacity="0.7" strokeWidth="2" />
          <rect x="94" y="-18" width="16" height="36" rx="4" fill={`url(#${id("key")})`} stroke="#5d6168" strokeWidth="1.2" />
          <circle cx="140" cy="0" r="32" fill={`url(#${id("key")})`} stroke="#5d6168" strokeWidth="1.2" />
          <circle cx="148" cy="0" r="11" fill="#0a0a0b" />
          <circle cx="140" cy="0" r="24" fill="none" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1.5" />
        </g>
      </g>
    </svg>
  );
}

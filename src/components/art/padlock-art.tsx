import { useId } from "react";
import { cn } from "@/lib/cn";

/** Static chrome padlock, shackle open. Fallback for the 3D padlock. */
export function PadlockArt({ className, open = true }: { className?: string; open?: boolean }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const id = (name: string) => `pa-${uid}-${name}`;
  return (
    <svg
      viewBox="0 0 300 360"
      role="img"
      aria-label={open ? "Open chrome padlock" : "Chrome padlock"}
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
        <radialGradient id={id("floor")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#e5080f" stopOpacity="0.6" />
          <stop offset="1" stopColor="#e5080f" stopOpacity="0" />
        </radialGradient>
        <filter id={id("shadow")} x="-20%" y="-10%" width="140%" height="130%">
          <feDropShadow dx="0" dy="20" stdDeviation="16" floodColor="#000" floodOpacity="0.8" />
        </filter>
      </defs>

      <ellipse cx="150" cy="338" rx="130" ry="18" fill={`url(#${id("floor")})`} />

      <g filter={`url(#${id("shadow")})`}>
        <path
          d={open ? "M98 178 V98 a52 52 0 0 1 104 0 V118" : "M98 178 V128 a52 52 0 0 1 104 0 V178"}
          transform={open ? "translate(0 -34)" : undefined}
          fill="none"
          stroke={`url(#${id("shackle")})`}
          strokeWidth="26"
          strokeLinecap="round"
        />
        <rect x="46" y="150" width="208" height="176" rx="28" fill={`url(#${id("chrome")})`} />
        <rect x="56" y="160" width="188" height="156" rx="20" fill="none" stroke="#ffffff" strokeOpacity="0.55" strokeWidth="2" />
        <circle cx="150" cy="222" r="19" fill="#0a0a0b" />
        <path d="M140 232 L131 282 H169 L160 232 Z" fill="#0a0a0b" />
        <path d="M58 300 H242" stroke="#e5080f" strokeWidth="3" strokeOpacity="0.85" />
      </g>
    </svg>
  );
}

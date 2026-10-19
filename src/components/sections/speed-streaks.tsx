import type { CSSProperties } from "react";
import { cn } from "@/lib/cn";

type Streak = { y: number; w: number; h: number; o: number; d: number; delay: number };

// Fixed values (not random) so server and client render identically.
const STREAKS: Streak[] = [
  { y: 14, w: 34, h: 2, o: 0.35, d: 4.2, delay: -1.1 },
  { y: 22, w: 46, h: 3, o: 0.55, d: 3.4, delay: -2.6 },
  { y: 31, w: 28, h: 2, o: 0.3, d: 5.1, delay: -0.4 },
  { y: 39, w: 52, h: 4, o: 0.6, d: 3.1, delay: -1.9 },
  { y: 47, w: 30, h: 2, o: 0.35, d: 4.6, delay: -3.3 },
  { y: 56, w: 40, h: 3, o: 0.5, d: 3.7, delay: -0.9 },
  { y: 64, w: 24, h: 2, o: 0.3, d: 5.4, delay: -2.2 },
  { y: 72, w: 44, h: 3, o: 0.45, d: 3.9, delay: -3.8 },
  { y: 81, w: 32, h: 2, o: 0.3, d: 4.8, delay: -1.5 },
];

/** Animated red motion lines, echoing the streaks in the logo. Decorative. */
export function SpeedStreaks({ className, count = STREAKS.length }: { className?: string; count?: number }) {
  return (
    <div aria-hidden="true" className={cn("speed-streaks", className)}>
      {STREAKS.slice(0, count).map((s, i) => (
        <span
          key={i}
          style={
            {
              "--y": `${s.y}%`,
              "--w": `${s.w}%`,
              "--h": `${s.h}px`,
              "--o": s.o,
              "--d": `${s.d}s`,
              "--delay": `${s.delay}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { INTRO_STORAGE_KEY } from "./intro-script";

/**
 * Resolves as the first-visit intro starts fading out (at once if it is not
 * showing), so the hero key's entrance plays in view rather than behind it.
 * Browser only.
 */
export function introFinished(): Promise<void> {
  const intro = document.getElementById("intro-loader");
  if (!intro || getComputedStyle(intro).display === "none") return Promise.resolve();
  const fadeOut = intro.getAnimations().find((a) => a instanceof CSSAnimation && a.animationName === "intro-out");
  if (!fadeOut) return Promise.resolve();
  const untilFade = Number(fadeOut.effect?.getComputedTiming().delay ?? 0) - Number(fadeOut.currentTime ?? 0);
  return Promise.race([
    new Promise<void>((resolve) => setTimeout(resolve, Math.max(0, untilFade))),
    // Skipping the intro hides it, which cancels the animation (rejects `finished`).
    fadeOut.finished.then(() => undefined, () => undefined),
  ]);
}

/**
 * First-visit intro (under 1 s): a key outline is revealed left to right,
 * turns once and fades into the hero. Only transform and opacity animate, so
 * it never competes with the page loading underneath. Plays only on the first
 * full page load of a session, never on client-side navigation, never with
 * reduced motion. Click or any key skips it. Purely CSS, so it runs before
 * the page hydrates.
 */
export function IntroLoader() {
  // Server render: false. Client navigation: true, so the intro stays hidden.
  // On hydration React keeps the server attribute (suppressHydrationWarning).
  const [clientRendered] = useState(() => typeof window !== "undefined");
  const [done, setDone] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    } catch {
      // Storage blocked: the head script already hid the intro.
    }
    const skip = () => setDone(true);
    window.addEventListener("keydown", skip, { once: true });
    return () => window.removeEventListener("keydown", skip);
  }, []);

  return (
    <>
      <div
        id="intro-loader"
        aria-hidden="true"
        className="intro-loader"
        data-seen={clientRendered ? "" : undefined}
        data-done={done ? "" : undefined}
        onClick={() => setDone(true)}
        onAnimationEnd={(e) => {
          if (e.animationName === "intro-out") setDone(true);
        }}
        suppressHydrationWarning
      >
        {/* Drawn with plain CSS shapes (not SVG or text) so the intro does not count
            as the page's first contentful paint. */}
        <div className="intro-key">
          <span className="intro-bow" />
          <span className="intro-bow intro-bow-inner" />
          <span className="intro-shaft" />
          <span className="intro-tooth" style={{ left: 120 }} />
          <span className="intro-tooth" style={{ left: 146 }} />
          <span className="intro-tooth" style={{ left: 172 }} />
          <span className="intro-tip" />
          {/* Slides away to reveal the outline; only transforms animate. */}
          <span className="intro-wipe" />
        </div>
      </div>
    </>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { SpeedStreaks } from "@/components/sections/speed-streaks";
import { cn } from "@/lib/cn";
import { noopSubscribe, readCapabilities } from "@/lib/webgl";
import { SceneBoundary } from "@/components/three/scene-boundary";
import { heroState } from "./hero-state";

// Imported directly (not lazily) so its code downloads in parallel with the
// page from the first moment; the scene itself is only created in an effect.
import HeroCanvas from "./hero-canvas";

/**
 * Home hero. The text is server-rendered (passed as children); the gently
 * turning 3D key loads right after the page and fades in. With reduced motion
 * the key is shown still. Without a GPU it waits for a first interaction and
 * is shown still. Without WebGL only the red glow remains.
 */
export function HeroShell({ children }: { children: ReactNode }) {
  const caps = useSyncExternalStore(noopSubscribe, readCapabilities, () => null);
  const [sceneFailed, setSceneFailed] = useState(false);
  const support = caps?.webgl ?? "none";
  const enhanced = support !== "none" && !sceneFailed;
  const softwareGL = support === "software";
  const still = (caps ? !caps.motion : false) || softwareGL;

  // GPU: load right away. No GPU: only after a first interaction.
  const [interacted, setInteracted] = useState(false);
  const armed = enhanced && (support === "hardware" || interacted);
  const [ready, setReady] = useState(false);
  const markReady = useCallback(() => setReady(true), []);
  const [onScreen, setOnScreen] = useState(true);
  const slotRef = useRef<HTMLDivElement>(null);

  // Without a GPU, the key waits for a first interaction: rendering on the CPU costs
  // seconds of main-thread time (see lib/webgl.ts).
  useEffect(() => {
    if (!enhanced || support !== "software") return;
    const interactions = ["pointerdown", "touchstart", "scroll", "keydown"] as const;
    const onInteract = () => setInteracted(true);
    interactions.forEach((type) => window.addEventListener(type, onInteract, { once: true, passive: true }));
    return () => interactions.forEach((type) => window.removeEventListener(type, onInteract));
  }, [enhanced, support]);

  // Only render frames while the hero is on screen.
  useEffect(() => {
    const slot = slotRef.current;
    if (!armed || !slot) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { rootMargin: "120px" });
    observer.observe(slot);
    return () => observer.disconnect();
  }, [armed]);

  // The fob's unlock button presses in while a call button is hovered or focused.
  useEffect(() => {
    if (!enhanced) return;
    const isCall = (target: EventTarget | null) => target instanceof Element && target.closest("[data-call-button]");
    const onOver = (e: Event) => {
      if (isCall(e.target)) heroState.press = 1;
    };
    const onOut = (e: Event) => {
      const related = (e as PointerEvent | FocusEvent).relatedTarget;
      if (isCall(e.target) && !isCall(related)) heroState.press = 0;
    };
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("focusin", onOver);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("focusin", onOver);
      document.removeEventListener("focusout", onOut);
      heroState.press = 0;
    };
  }, [enhanced]);

  return (
    <section aria-labelledby="hero-heading" className="relative bg-ink">
      <div className="bg-carbon-fiber relative overflow-clip pb-16 pt-[calc(var(--header-h)+1rem)] md:pb-44 md:pt-[calc(var(--header-h)+2rem)] lg:min-h-[52rem] lg:pt-[calc(var(--header-h)+3.5rem)]">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,rgb(229_8_15/0.3),transparent_55%),radial-gradient(ellipse_at_0%_100%,rgb(176_10_16/0.2),transparent_45%)] lg:bg-[radial-gradient(ellipse_at_75%_35%,rgb(229_8_15/0.28),transparent_55%),radial-gradient(ellipse_at_0%_100%,rgb(176_10_16/0.22),transparent_45%)]"
        />
        <SpeedStreaks />
        <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-b from-transparent to-ink md:h-40" />

        <div className="container-x relative grid items-center lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          {children}

          {/* Phones and tablets: a compact full-width stage between the headline
              and the paragraph (see HomeHero). Desktop: the right-hand column. */}
          <div
            ref={slotRef}
            className="relative -mx-4 my-1 h-[clamp(9.5rem,26svh,12.5rem)] max-lg:order-2 md:-mx-6 md:my-4 md:h-[17rem] lg:mx-auto lg:my-0 lg:aspect-[4/3] lg:h-auto lg:w-full"
          >
            <div aria-hidden="true" className="absolute inset-[12%] hidden rounded-full bg-red/25 blur-3xl lg:block" />
            <div aria-hidden="true" className="hero-stage lg:hidden">
              <span className="hero-stage-glow" />
              <span className="hero-stage-floor" />
            </div>
            {armed && enhanced && (
              <div className="hero-canvas pointer-events-none">
                <div className={cn("h-full w-full transition-opacity duration-200", ready ? "opacity-100" : "opacity-0")}>
                  <SceneBoundary onError={() => setSceneFailed(true)}>
                    <HeroCanvas active={onScreen} still={still} onReady={markReady} />
                  </SceneBoundary>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { Hand } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { KeyArt } from "@/components/art/key-art";
import { CallButton } from "@/components/ui/button";
import { keyTypes, type KeyTypeId } from "@/content/car-keys";
import { cn } from "@/lib/cn";
import { noopSubscribe, readCapabilities } from "@/lib/webgl";
import type { ShowroomScene } from "./showroom-scene";

/**
 * Key Showroom: tabs for each key type beside a 3D turntable. The tab text is
 * server-rendered; the 3D scene downloads only when the showroom nears the
 * screen, and only on devices with a GPU. Elsewhere the static key art stays.
 */
export function KeyShowroom({ className }: { className?: string }) {
  const caps = useSyncExternalStore(noopSubscribe, readCapabilities, () => null);
  const [selected, setSelected] = useState<KeyTypeId>(keyTypes[0].id);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ShowroomScene | null>(null);
  const selectedRef = useRef(selected);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const enabled = caps?.webgl === "hardware" && !failed;
  const still = caps ? !caps.motion : false;

  // Create the scene once the showroom is close to the screen; render only while visible.
  useEffect(() => {
    const stage = stageRef.current;
    const host = canvasHostRef.current;
    if (!enabled || !stage || !host) return;
    // A new canvas per scene: dispose() frees its WebGL context for good.
    const canvas = document.createElement("canvas");
    canvas.className = "block h-full w-full";
    host.appendChild(canvas);
    let disposed = false;
    let started = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        sceneRef.current?.setActive(entry.isIntersecting);
        if (!entry.isIntersecting || started) return;
        started = true;
        import("./showroom-scene")
          .then(({ createShowroomScene }) => {
            if (disposed) return;
            sceneRef.current = createShowroomScene(canvas, {
              initial: selectedRef.current,
              still,
              onReady: () => setReady(true),
            });
          })
          .catch(() => setFailed(true));
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(stage);
    return () => {
      disposed = true;
      observer.disconnect();
      sceneRef.current?.dispose();
      sceneRef.current = null;
      canvas.remove();
    };
  }, [enabled, still]);

  const select = (id: KeyTypeId) => {
    setSelected(id);
    selectedRef.current = id;
    try {
      sceneRef.current?.show(id);
    } catch {
      setFailed(true);
    }
  };

  // WAI-ARIA tabs: arrow keys move between tabs and select them.
  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = keyTypes.length - 1;
    const next =
      event.key === "ArrowRight" || event.key === "ArrowDown"
        ? index === last ? 0 : index + 1
        : event.key === "ArrowLeft" || event.key === "ArrowUp"
          ? index === 0 ? last : index - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : -1;
    if (next < 0) return;
    event.preventDefault();
    select(keyTypes[next].id);
    tabRefs.current[next]?.focus();
  };

  const show3d = enabled && ready;

  return (
    <div className={cn("grid items-center gap-5 md:gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12", className)}>
      <div ref={stageRef} className="card relative min-w-0 aspect-[4/3] overflow-hidden bg-ink sm:aspect-[16/10] lg:aspect-[4/3]">
        <div aria-hidden="true" className="absolute inset-[18%] rounded-full bg-red/25 blur-3xl" />
        <div aria-hidden="true" className="absolute inset-x-[12%] bottom-[14%] h-px bg-linear-to-r from-transparent via-red-glow/70 to-transparent" />
        <div
          className={cn(
            "absolute inset-0 grid place-items-center p-10 transition-opacity duration-300 md:p-16",
            show3d ? "opacity-0" : "opacity-100",
          )}
        >
          <KeyArt />
        </div>
        {enabled && (
          <div
            ref={canvasHostRef}
            aria-hidden="true"
            className={cn(
              "absolute inset-0 h-full w-full cursor-grab touch-pan-y transition-opacity duration-300 active:cursor-grabbing",
              show3d ? "opacity-100" : "opacity-0",
            )}
          />
        )}
        {show3d && (
          <p className="pointer-events-none absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            <Hand aria-hidden="true" className="size-3.5" />
            Drag to turn
          </p>
        )}
      </div>

      {/* Phones: all five tabs in a 2-column grid (no sideways scrolling); the odd one out spans both columns. */}
      <div className="min-w-0">
        <div
          role="tablist"
          aria-label="Key types"
          className="grid grid-cols-2 gap-2 py-1 [&>:last-child:nth-child(odd)]:col-span-2 md:flex md:flex-wrap lg:flex-col lg:flex-nowrap"
        >
          {keyTypes.map((key, i) => {
            const active = key.id === selected;
            return (
              <button
                key={key.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`showroom-tab-${key.id}`}
                aria-selected={active}
                aria-controls={`showroom-panel-${key.id}`}
                tabIndex={active ? 0 : -1}
                onClick={() => select(key.id)}
                onKeyDown={(e) => onKeyDown(e, i)}
                className={cn(
                  "group flex min-h-11 shrink-0 items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm font-semibold leading-tight transition-colors md:gap-3 md:px-4 md:text-base lg:px-5 lg:py-3.5",
                  active
                    ? "border-red bg-red/12 text-fg"
                    : "border-white/10 bg-graphite text-chrome-2 hover:border-white/25 hover:text-fg",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn("font-display text-sm font-black italic", active ? "text-red-glow" : "text-chrome-3")}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="md:whitespace-nowrap lg:whitespace-normal">{key.name}</span>
              </button>
            );
          })}
        </div>

        {keyTypes.map((key) => (
          <div
            key={key.id}
            role="tabpanel"
            id={`showroom-panel-${key.id}`}
            aria-labelledby={`showroom-tab-${key.id}`}
            hidden={key.id !== selected}
            className="mt-5 md:mt-6"
          >
            <h3 className="display h3">{key.name}</h3>
            <p className="mt-2 leading-relaxed text-muted md:text-lg">{key.description}</p>
          </div>
        ))}
        <CallButton size="lg" className="mt-6" />
      </div>
    </div>
  );
}

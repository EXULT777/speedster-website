"use client";

import { useEffect, useRef } from "react";
import { createKeyScene, type KeyScene } from "./key-scene";
import { heroState } from "./hero-state";
import { introFinished } from "@/components/home/intro-loader";

/** Thin React wrapper around the plain Three.js key scene (key-scene.ts). */
export default function HeroCanvas({
  active,
  still,
  onReady,
}: {
  /** Renders only while true (the hero is on screen). */
  active: boolean;
  /** Reduced motion or no GPU: hold the key still. */
  still: boolean;
  /** Must be stable (the scene is created once per `still` value). */
  onReady: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<KeyScene | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    // A new canvas per scene: dispose() frees its WebGL context for good.
    const canvas = document.createElement("canvas");
    canvas.className = "block h-full w-full";
    host.appendChild(canvas);
    const scene = createKeyScene(canvas, {
      still,
      getPress: () => heroState.press,
      onReady,
      entrance: introFinished(),
    });
    sceneRef.current = scene;
    return () => {
      scene.dispose();
      canvas.remove();
      sceneRef.current = null;
    };
  }, [still, onReady]);

  useEffect(() => {
    sceneRef.current?.setActive(active);
  }, [active]);

  return <div ref={hostRef} aria-hidden="true" className="h-full w-full" />;
}

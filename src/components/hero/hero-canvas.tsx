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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<KeyScene | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const scene = createKeyScene(canvas, {
      still,
      getPress: () => heroState.press,
      onReady,
      entrance: introFinished(),
    });
    sceneRef.current = scene;
    return () => {
      scene.dispose();
      sceneRef.current = null;
    };
  }, [still, onReady]);

  useEffect(() => {
    sceneRef.current?.setActive(active);
  }, [active]);

  return <canvas ref={canvasRef} aria-hidden="true" className="block h-full w-full" />;
}

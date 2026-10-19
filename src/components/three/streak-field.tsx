"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { seeded } from "./shapes";

type Streak = { x: number; y: number; z: number; len: number; thick: number; speed: number };

function streakTexture() {
  const W = 256;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = 4;
  const ctx = canvas.getContext("2d")!;
  // Bright head on the left (direction of travel), fading tail on the right.
  const g = ctx.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0, "rgba(255,255,255,0)");
  g.addColorStop(0.04, "rgba(255,120,120,1)");
  g.addColorStop(0.3, "rgba(229,8,15,0.85)");
  g.addColorStop(1, "rgba(229,8,15,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, 4);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/** Instanced red motion lines flowing right to left behind the key. */
export function StreakField({ count, getBoost }: { count: number; getBoost?: () => number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const texture = useMemo(() => streakTexture(), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const streaks = useMemo<Streak[]>(() => {
    const rand = seeded(7);
    return Array.from({ length: count }, () => ({
      x: -8 + rand() * 16,
      y: -2.6 + rand() * 5.2,
      z: -5 + rand() * 3.4,
      len: 0.7 + rand() * 1.9,
      thick: 0.01 + rand() * 0.028,
      speed: 1.6 + rand() * 2.6,
    }));
  }, [count]);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame((_, delta) => {
    const instanced = mesh.current;
    if (!instanced) return;
    const boost = 1 + (getBoost?.() ?? 0) * 3;
    const dt = Math.min(delta, 0.05);
    streaks.forEach((s, i) => {
      s.x -= s.speed * boost * dt;
      if (s.x < -9) s.x = 9;
      dummy.position.set(s.x, s.y, s.z);
      dummy.scale.set(s.len, s.thick, 1);
      dummy.updateMatrix();
      instanced.setMatrixAt(i, dummy.matrix);
    });
    instanced.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <planeGeometry />
      <meshBasicMaterial
        map={texture}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
        color={[2.4, 1.2, 1.2]}
      />
    </instancedMesh>
  );
}

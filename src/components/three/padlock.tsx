"use client";

import { useFrame, type ThreeElements } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { createMaterials, disposeMaterials } from "./materials";
import { extrudeCentered, roundedRect } from "./shapes";

/**
 * Procedural chrome padlock. Local axes: keyhole faces +Z, shackle on top.
 * The shackle pivots around its left (long) leg, like a real padlock.
 */

const BODY_W = 1.7;
const BODY_H = 1.45;
const BODY_DEPTH = 0.5;
const BODY_BEVEL = 0.08;
export const LOCK_FRONT = BODY_DEPTH / 2 + BODY_BEVEL;
/** Where a key enters, in local units (centre of the keyhole slot). */
export const KEYHOLE = new THREE.Vector3(0, -0.04, LOCK_FRONT);

const LEG_X = 0.48;
const ARC_Y = 1.32;
const TUBE = 0.11;

function keyholeShapes() {
  const circle = new THREE.Shape();
  circle.absarc(0, 0.12, 0.15, 0, Math.PI * 2, false);
  const slot = new THREE.Shape();
  slot.moveTo(-0.075, 0.04);
  slot.lineTo(0.075, 0.04);
  slot.lineTo(0.11, -0.34);
  slot.lineTo(-0.11, -0.34);
  slot.lineTo(-0.075, 0.04);
  return [circle, slot];
}

/** open: 0 closed → 1 fully open. glow: extra brightness on the red line. */
export type LockDrive = { open: number; swing: number; glow: number };

export function Padlock({ drive, ...props }: ThreeElements["group"] & { drive?: LockDrive }) {
  const m = useMemo(() => createMaterials(), []);
  const shackle = useRef<THREE.Group>(null);

  const geo = useMemo(() => {
    const body = extrudeCentered(roundedRect(BODY_W, BODY_H, 0.24) as THREE.Shape, BODY_DEPTH, BODY_BEVEL, 6);
    const keyhole = new THREE.ShapeGeometry(keyholeShapes(), 24);
    const leg = new THREE.CylinderGeometry(TUBE, TUBE, 0.95, 24);
    const arc = new THREE.TorusGeometry(LEG_X, TUBE, 20, 48, Math.PI);
    return { body, keyhole, leg, arc };
  }, []);

  useEffect(
    () => () => {
      Object.values(geo).forEach((g) => g.dispose());
      disposeMaterials(m);
    },
    [geo, m],
  );

  useFrame(() => {
    if (!drive || !shackle.current) return;
    shackle.current.position.y = 0.36 * drive.open;
    shackle.current.rotation.y = -0.75 * drive.swing;
    m.accent.emissiveIntensity = 2 + drive.glow * 8;
  });

  return (
    <group {...props}>
      <mesh geometry={geo.body} material={m.chromeBody} />
      <mesh geometry={geo.keyhole} material={m.keyhole} position={[0, 0, LOCK_FRONT + 0.003]} />
      <mesh position={[0, -0.52, LOCK_FRONT + 0.004]} material={m.accent}>
        <boxGeometry args={[1.25, 0.03, 0.01]} />
      </mesh>

      {/* Pivot sits on the long (left) leg so the shackle swings open around it. */}
      <group position={[-LEG_X, 0, 0]}>
        <group ref={shackle}>
          <mesh geometry={geo.leg} material={m.chrome} position={[0, ARC_Y - 0.475, 0]} />
          <mesh geometry={geo.leg} material={m.chrome} position={[LEG_X * 2, ARC_Y - 0.475, 0]} />
          <mesh geometry={geo.arc} material={m.chrome} position={[LEG_X, ARC_Y, 0]} />
        </group>
      </group>
    </group>
  );
}

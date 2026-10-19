import * as THREE from "three";

/** Shared materials, created once per scene and disposed with it. */
export function createMaterials() {
  return {
    chrome: new THREE.MeshStandardMaterial({ color: "#eceef1", metalness: 1, roughness: 0.15 }),
    chromeDark: new THREE.MeshStandardMaterial({ color: "#9a9ea6", metalness: 1, roughness: 0.32 }),
    // Large flat chrome faces (the padlock body) read as plain white if fully polished.
    chromeBody: new THREE.MeshStandardMaterial({ color: "#b9bdc4", metalness: 1, roughness: 0.24 }),
    fob: new THREE.MeshPhysicalMaterial({
      color: "#0b0b0d",
      metalness: 0.15,
      roughness: 0.28,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
    }),
    rubber: new THREE.MeshStandardMaterial({ color: "#16171a", metalness: 0.1, roughness: 0.55 }),
    // Emissive above 1 with tone mapping off, so only these parts trigger bloom.
    accent: new THREE.MeshStandardMaterial({
      color: "#ff2a30",
      emissive: "#ff1a22",
      emissiveIntensity: 2.2,
      toneMapped: false,
    }),
    keyhole: new THREE.MeshBasicMaterial({ color: "#050506" }),
  };
}

export type Materials = ReturnType<typeof createMaterials>;

export function disposeMaterials(materials: Materials) {
  Object.values(materials).forEach((m) => m.dispose());
}

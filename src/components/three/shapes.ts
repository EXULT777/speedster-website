import * as THREE from "three";

/** Centred rounded rectangle in the XY plane. */
export function roundedRect(width: number, height: number, radius: number, target: THREE.Shape | THREE.Path = new THREE.Shape()) {
  const x = -width / 2;
  const y = -height / 2;
  const r = Math.min(radius, width / 2, height / 2);
  target.moveTo(x + r, y);
  target.lineTo(x + width - r, y);
  target.absarc(x + width - r, y + r, r, -Math.PI / 2, 0, false);
  target.lineTo(x + width, y + height - r);
  target.absarc(x + width - r, y + height - r, r, 0, Math.PI / 2, false);
  target.lineTo(x + r, y + height);
  target.absarc(x + r, y + height - r, r, Math.PI / 2, Math.PI, false);
  target.lineTo(x, y + r);
  target.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
  return target;
}

/** Extrudes a shape and centres it on z = 0. */
export function extrudeCentered(shape: THREE.Shape | THREE.Shape[], depth: number, bevel: number, bevelSegments = 4) {
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments,
    curveSegments: 32,
  });
  geometry.translate(0, 0, -depth / 2);
  geometry.computeVertexNormals();
  return geometry;
}

/** Closed tube following a 2D outline, placed at height z. */
export function outlineTube(shape: THREE.Shape, z: number, radius: number) {
  const points = shape.getSpacedPoints(160).map((p) => new THREE.Vector3(p.x, p.y, z));
  const curve = new THREE.CatmullRomCurve3(points, true);
  return new THREE.TubeGeometry(curve, 240, radius, 8, true);
}

/** White line-art icon on a transparent canvas (for the fob buttons). */
export function iconTexture(draw: (ctx: CanvasRenderingContext2D) => void) {
  const SIZE = 128;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;
  ctx.strokeStyle = "#ffffff";
  ctx.fillStyle = "#ffffff";
  ctx.lineWidth = 9;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  draw(ctx);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/** Padlock glyph; `open` lifts the shackle off one side. */
export function drawLockIcon(ctx: CanvasRenderingContext2D, open: boolean) {
  ctx.beginPath();
  if (open) {
    ctx.moveTo(42, 60);
    ctx.lineTo(42, 40);
    ctx.arc(64, 40, 22, Math.PI, 0);
    ctx.lineTo(86, 46);
  } else {
    ctx.moveTo(42, 60);
    ctx.lineTo(42, 44);
    ctx.arc(64, 44, 22, Math.PI, 0);
    ctx.lineTo(86, 60);
  }
  ctx.stroke();
  ctx.beginPath();
  ctx.roundRect(30, 60, 68, 50, 9);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(64, 78);
  ctx.lineTo(64, 92);
  ctx.stroke();
}

/** Seeded random numbers so instanced layouts are identical every load. */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Greyscale radial gradient (white centre → black edge), used as an alpha map. */
export function radialFade() {
  const SIZE = 256;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(SIZE / 2, SIZE / 2, 0, SIZE / 2, SIZE / 2, SIZE / 2);
  g.addColorStop(0, "#ffffff");
  g.addColorStop(0.55, "#777777");
  g.addColorStop(1, "#000000");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SIZE, SIZE);
  return new THREE.CanvasTexture(canvas);
}

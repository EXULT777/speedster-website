/**
 * The hero's 3D car key in plain Three.js (no React renderer), importing only
 * what it uses so the download stays small and the key appears quickly.
 *
 * The key is built procedurally, modelled after the fob in the logo: glossy
 * black body with a chrome band and red accent line, lock / unlock buttons,
 * chrome collar, cut blade and key ring. It turns gently back and forth.
 */
import {
  ACESFilmicToneMapping,
  AmbientLight,
  CanvasTexture,
  CatmullRomCurve3,
  Color,
  DirectionalLight,
  DoubleSide,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Path,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  Shape,
  SRGBColorSpace,
  TorusGeometry,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
  BoxGeometry,
  Box3,
  type BufferGeometry,
  type Material,
  type Texture,
} from "three";

/* ------------------------------------------------------------------ */
/* Geometry helpers                                                     */
/* ------------------------------------------------------------------ */

export function roundedRect<T extends Shape | Path>(target: T, width: number, height: number, radius: number): T {
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

export function extrudeCentered(shape: Shape, depth: number, bevel: number, bevelSegments = 4, curveSegments = 20) {
  // ExtrudeGeometry computes its own vertex normals.
  const geometry = new ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevel > 0,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments,
    curveSegments,
  });
  geometry.translate(0, 0, -depth / 2);
  return geometry;
}

export function outlineTube(shape: Shape, z: number, radius: number) {
  const points = shape.getSpacedPoints(96).map((p) => new Vector3(p.x, p.y, z));
  return new TubeGeometry(new CatmullRomCurve3(points, true), 128, radius, 6, true);
}

/** White padlock glyph on a transparent canvas; `open` lifts the shackle. */
export function lockIcon(open: boolean) {
  const SIZE = 128;
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 9;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(42, 60);
  if (open) {
    ctx.lineTo(42, 40);
    ctx.arc(64, 40, 22, Math.PI, 0);
    ctx.lineTo(86, 46);
  } else {
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
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/* ------------------------------------------------------------------ */
/* Key model (local axes: blade along +X, buttons face +Z)              */
/* ------------------------------------------------------------------ */

const FOB_W = 1.7;
const FOB_H = 1.05;
const FOB_R = 0.42;
const FOB_DEPTH = 0.32;
const FOB_BEVEL = 0.06;
export const FRONT = FOB_DEPTH / 2 + FOB_BEVEL;
export const KEY_TIP_X = 3.38;
const CUTS = [
  { x: 1.6, depth: 0.07 },
  { x: 1.95, depth: 0.045 },
  { x: 2.3, depth: 0.085 },
  { x: 2.65, depth: 0.05 },
  { x: 2.98, depth: 0.065 },
];

export function bladeShape() {
  const s = new Shape();
  const top = 0.14;
  const base = -0.14;
  s.moveTo(1.18, top);
  s.lineTo(3.16, top);
  s.lineTo(KEY_TIP_X, 0.02);
  s.lineTo(3.26, -0.1);
  s.lineTo(3.12, base);
  for (const cut of [...CUTS].reverse()) {
    s.lineTo(cut.x + 0.1, base);
    s.lineTo(cut.x, base + cut.depth);
    s.lineTo(cut.x - 0.1, base);
  }
  s.lineTo(1.18, base);
  s.lineTo(1.18, top);
  return s;
}

export function collarShape() {
  const s = new Shape();
  s.moveTo(0.78, -0.25);
  s.lineTo(1.24, -0.17);
  s.lineTo(1.24, 0.17);
  s.lineTo(0.78, 0.25);
  s.lineTo(0.78, -0.25);
  return s;
}

export function buildKey(track: (item: { dispose: () => void }) => void) {
  const chrome = new MeshStandardMaterial({ color: "#eceef1", metalness: 1, roughness: 0.15 });
  const chromeDark = new MeshStandardMaterial({ color: "#9a9ea6", metalness: 1, roughness: 0.32 });
  const fob = new MeshPhysicalMaterial({ color: "#0b0b0d", metalness: 0.15, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.05 });
  const rubber = new MeshStandardMaterial({ color: "#16171a", metalness: 0.1, roughness: 0.55 });
  // Emissive above 1 with tone mapping off: a bright red line.
  const accent = new MeshStandardMaterial({ color: "#ff2a30", emissive: "#ff1a22", emissiveIntensity: 2.2, toneMapped: false });
  const icons = { lock: lockIcon(false), unlock: lockIcon(true) };

  const band = roundedRect(new Shape(), FOB_W + 0.1, FOB_H + 0.1, FOB_R + 0.05);
  band.holes.push(roundedRect(new Path(), FOB_W - 0.02, FOB_H - 0.02, FOB_R - 0.01));
  // Curve detail is set per part (small corners need few segments): building
  // the geometry is a large share of the time before the key appears.
  const geo: Record<string, BufferGeometry> = {
    fob: extrudeCentered(roundedRect(new Shape(), FOB_W, FOB_H, FOB_R), FOB_DEPTH, FOB_BEVEL, 4, 14),
    band: extrudeCentered(band, 0.16, 0.012, 2, 14),
    accent: outlineTube(roundedRect(new Shape(), FOB_W - 0.16, FOB_H - 0.16, FOB_R - 0.08), FRONT + 0.004, 0.013),
    blade: extrudeCentered(bladeShape(), 0.06, 0.012, 2),
    collar: extrudeCentered(collarShape(), 0.2, 0.03, 3),
    button: extrudeCentered(roundedRect(new Shape(), 0.48, 0.56, 0.06), 0.06, 0.03, 3, 4),
    icon: new PlaneGeometry(0.34, 0.34),
    groove: new BoxGeometry(1.85, 0.03, 0.075),
    ring: new TorusGeometry(0.27, 0.05, 12, 40),
  };
  const iconMaterials = {
    lock: new MeshBasicMaterial({ map: icons.lock, transparent: true, toneMapped: false }),
    unlock: new MeshBasicMaterial({ map: icons.unlock, transparent: true, toneMapped: false }),
  };
  [chrome, chromeDark, fob, rubber, accent, iconMaterials.lock, iconMaterials.unlock, icons.lock, icons.unlock, ...Object.values(geo)].forEach(track);

  const key = new Group();
  const add = (geometry: BufferGeometry, material: Material, parent: Group = key) => {
    const mesh = new Mesh(geometry, material);
    parent.add(mesh);
    return mesh;
  };
  add(geo.fob, fob);
  add(geo.band, chrome);
  add(geo.accent, accent);
  const button = (x: number, material: Material) => {
    const group = new Group();
    add(geo.button, rubber, group).position.set(x, 0, FRONT - 0.04);
    add(geo.icon, material, group).position.set(x, 0, FRONT + 0.022);
    key.add(group);
    return group;
  };
  button(-0.3, iconMaterials.lock);
  const unlockButton = button(0.3, iconMaterials.unlock);
  add(geo.collar, chrome);
  add(geo.blade, chrome);
  add(geo.groove, chromeDark).position.set(2.18, 0.035, 0);
  add(geo.ring, chrome).position.set(-0.98, 0.16, 0);

  return { key, unlockButton, accent };
}

/* ------------------------------------------------------------------ */
/* Studio lighting: soft white panels and a red rim, pre-filtered once  */
/* ------------------------------------------------------------------ */

export function studioEnvironment(renderer: WebGLRenderer, size = 256): Texture {
  const studio = new Scene();
  studio.background = new Color("#3e4148"); // so chrome always has something to reflect
  const panels: Array<[number, number, [number, number, number], [number, number, number], string, number]> = [
    [10, 3, [0, 5, 1], [Math.PI / 2, 0, 0], "#ffffff", 2.6],
    [3, 6, [-6, 1.5, 3], [0, Math.PI / 3, 0], "#ffffff", 1.6],
    [2, 5, [6, 0, 2], [0, -Math.PI / 3, 0], "#ffffff", 1.2],
    [12, 2.5, [0, -1, -6], [0, 0, 0], "#ff1a22", 4],
  ];
  const temp: Array<{ dispose: () => void }> = [];
  for (const [w, h, position, rotation, color, intensity] of panels) {
    const geometry = new PlaneGeometry(w, h);
    const material = new MeshBasicMaterial({ color: new Color(color).multiplyScalar(intensity), side: DoubleSide, toneMapped: false });
    const mesh = new Mesh(geometry, material);
    mesh.position.set(...position);
    mesh.rotation.set(...rotation);
    studio.add(mesh);
    temp.push(geometry, material);
  }
  const pmrem = new PMREMGenerator(renderer);
  const texture = pmrem.fromScene(studio, 0.03, 0.1, 100, { size }).texture;
  pmrem.dispose();
  temp.forEach((t) => t.dispose());
  return texture;
}

/* ------------------------------------------------------------------ */
/* Scene                                                                */
/* ------------------------------------------------------------------ */

export type KeyScene = {
  /** Render only while true (the hero is on screen). */
  setActive: (active: boolean) => void;
  dispose: () => void;
};

export function createKeyScene(
  canvas: HTMLCanvasElement,
  options: {
    /** Reduced motion or no GPU: draw once, hold still. */
    still: boolean;
    /** 0–1: how far the unlock button is pressed (a call button is hovered). */
    getPress: () => number;
    /** The key has been drawn and can be shown. */
    onReady: () => void;
    /** The entrance swing waits for this (the first-visit intro covering the page). */
    entrance?: Promise<unknown>;
  },
): KeyScene {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = ACESFilmicToneMapping;

  const disposables: Array<{ dispose: () => void }> = [];
  const scene = new Scene();
  const environment = studioEnvironment(renderer, 128);
  scene.environment = environment;
  disposables.push(environment);

  const camera = new PerspectiveCamera(32, 1, 0.1, 50);
  camera.position.set(0, 0, 6.5);
  scene.add(new AmbientLight(0xffffff, 0.2));
  const sun = new DirectionalLight(0xffffff, 1.1);
  sun.position.set(3, 5, 4);
  scene.add(sun);

  const { key, unlockButton, accent } = buildKey((item) => disposables.push(item));
  const SCALE = 0.72;
  const centerX = (KEY_TIP_X - 1.25) / 2;
  key.scale.setScalar(SCALE);
  key.position.x = -centerX * SCALE;
  const sway = new Group();
  sway.add(key);
  const tilt = new Group();
  tilt.rotation.set(0.12, 0, 0.26);
  tilt.add(sway);
  scene.add(tilt);

  // The key's on-screen size at rest, used to frame it on phones (see resize).
  tilt.updateMatrixWorld(true);
  const bounds = new Box3().setFromObject(tilt);
  const keyWidth = bounds.max.x - bounds.min.x;
  const keyHeight = bounds.max.y - bounds.min.y;
  const halfFov = Math.tan((camera.fov * Math.PI) / 360);

  const resize = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // The phone stage sets --key-fill: the camera moves so the key spans that
    // share of the canvas width (and at most ~60% of its height, leaving room
    // for the sway), whatever the stage's shape. Without it: the desktop framing.
    const fill = parseFloat(getComputedStyle(canvas).getPropertyValue("--key-fill"));
    camera.position.z =
      fill > 0
        ? Math.max(keyWidth / (fill * 2 * halfFov * camera.aspect), keyHeight / (0.6 * 2 * halfFov))
        : 6.5;
    camera.updateProjectionMatrix();
  };
  let compiled = false;
  let disposed = false;
  const observer = new ResizeObserver(() => {
    resize();
    if (options.still && compiled) renderer.render(scene, camera);
  });
  observer.observe(canvas);
  resize();

  // The first frames upload textures and warm up the GPU while the key is still
  // hidden; then it is revealed and the entrance starts, so it plays in full.
  const HIDDEN_FRAMES = options.still ? 1 : 3;
  let entranceAllowed = !options.entrance;
  options.entrance?.then(() => (entranceAllowed = true));

  let press = 0;
  let frame = 0;
  let last = performance.now();
  // Animation time, summed from frame times capped at 1/30 s: a slow frame
  // (common while the page is still loading) slows the motion briefly instead
  // of making the key jump.
  let time = 0;
  let raf = 0;
  let active = true;

  const draw = (now: number) => {
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    if (!options.still) {
      if (frame >= HIDDEN_FRAMES && entranceAllowed) time += dt;
      // Entrance: the key swings in and settles over 0.7 s as it appears.
      const enter = 1 - Math.pow(1 - Math.min(1, time / 0.7), 3);
      tilt.scale.setScalar(0.88 + 0.12 * enter);
      sway.rotation.y = Math.sin(time * 0.6) * 0.55 + (1 - enter) * 0.9;
      sway.rotation.x = Math.sin(time * 0.45) * 0.08;
      sway.position.y = Math.sin(time * 1.1) * 0.08;
    }
    press += (options.getPress() - press) * (1 - Math.exp(-12 * dt));
    unlockButton.position.z = -0.045 * press;
    accent.emissiveIntensity = 2.2 + press * 4;
    renderer.render(scene, camera);
    if (++frame === HIDDEN_FRAMES) options.onReady();
  };
  const loop = (now: number) => {
    draw(now);
    raf = active && (!options.still || frame < HIDDEN_FRAMES) ? requestAnimationFrame(loop) : 0;
  };
  const begin = () => {
    if (disposed) return;
    compiled = true;
    if (active) {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
  };
  // Compile the shaders off the main thread where the browser supports it
  // (KHR_parallel_shader_compile); compiling inside the first render freezes
  // the page for a moment on phones.
  renderer.compileAsync(scene, camera).then(begin, begin);

  return {
    setActive(next) {
      active = next;
      if (active && compiled && !raf && (!options.still || frame < HIDDEN_FRAMES)) {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    },
    dispose() {
      disposed = true;
      active = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      // Free the WebGL context now; browsers cap how many a page may hold.
      renderer.forceContextLoss();
    },
  };
}

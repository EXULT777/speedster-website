/**
 * The Car Key Replacement page's "Key Showroom": the five key types, built
 * procedurally in plain Three.js like the hero key (and sharing its helpers),
 * on a slow turntable. Switching keys flies the current one out and the next
 * one in; dragging turns the key within limits (no zoom).
 */
import {
  ACESFilmicToneMapping,
  AmbientLight,
  CanvasTexture,
  DirectionalLight,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Path,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  Shape,
  SRGBColorSpace,
  TorusGeometry,
  Box3,
  Vector3,
  WebGLRenderer,
  type BufferGeometry,
  type Material,
} from "three";
import type { KeyTypeId } from "@/content/car-keys";
import {
  bladeShape,
  buildKey,
  collarShape,
  extrudeCentered,
  lockIcon,
  outlineTube,
  roundedRect,
  studioEnvironment,
} from "@/components/hero/key-scene";

type Track = <T extends { dispose: () => void }>(item: T) => T;

/** White glyph on a transparent canvas, for button decals. */
function glyph(draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  ctx.strokeStyle = "#ffffff";
  ctx.fillStyle = "#ffffff";
  ctx.lineWidth = 9;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  draw(ctx);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/** Car seen from behind with the trunk lid raised. */
const trunkGlyph = (ctx: CanvasRenderingContext2D) => {
  ctx.beginPath();
  ctx.moveTo(26, 96);
  ctx.lineTo(26, 72);
  ctx.lineTo(40, 56);
  ctx.lineTo(88, 56);
  ctx.lineTo(102, 72);
  ctx.lineTo(102, 96);
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(40, 56);
  ctx.lineTo(52, 26);
  ctx.lineTo(76, 26);
  ctx.lineTo(88, 56);
  ctx.stroke();
};

function createKit(track: Track) {
  const textures = {
    lock: track(lockIcon(false)),
    unlock: track(lockIcon(true)),
    trunk: track(glyph(trunkGlyph)),
  };
  const materials = {
    chrome: track(new MeshStandardMaterial({ color: "#eceef1", metalness: 1, roughness: 0.15 })),
    chromeDark: track(new MeshStandardMaterial({ color: "#9a9ea6", metalness: 1, roughness: 0.32 })),
    // Slightly less than fully metallic so the brass keeps its warm colour
    // even when it faces away from the bright studio panels.
    brass: track(new MeshStandardMaterial({ color: "#e6c47c", metalness: 0.82, roughness: 0.3 })),
    gold: track(new MeshStandardMaterial({ color: "#f1d892", metalness: 1, roughness: 0.1 })),
    gloss: track(new MeshPhysicalMaterial({ color: "#0b0b0d", metalness: 0.15, roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.05 })),
    plastic: track(new MeshStandardMaterial({ color: "#141518", metalness: 0.05, roughness: 0.6 })),
    rubber: track(new MeshStandardMaterial({ color: "#1b1c20", metalness: 0.1, roughness: 0.55 })),
    panic: track(new MeshStandardMaterial({ color: "#b00a10", emissive: "#e5080f", emissiveIntensity: 0.6, roughness: 0.45 })),
    accent: track(new MeshStandardMaterial({ color: "#ff2a30", emissive: "#ff1a22", emissiveIntensity: 2.2, toneMapped: false })),
    icon: {
      lock: track(new MeshBasicMaterial({ map: textures.lock, transparent: true, toneMapped: false })),
      unlock: track(new MeshBasicMaterial({ map: textures.unlock, transparent: true, toneMapped: false })),
      trunk: track(new MeshBasicMaterial({ map: textures.trunk, transparent: true, toneMapped: false })),
    },
  };
  const geo = {
    blade: track(extrudeCentered(bladeShape(), 0.06, 0.012, 2)),
    collar: track(extrudeCentered(collarShape(), 0.2, 0.03, 3)),
    button: track(extrudeCentered(roundedRect(new Shape(), 0.36, 0.42, 0.08), 0.05, 0.025, 3)),
    icon: track(new PlaneGeometry(0.28, 0.28)),
    ring: track(new TorusGeometry(0.27, 0.05, 12, 40)),
  };
  const add = (parent: Group, geometry: BufferGeometry, material: Material) => {
    const mesh = new Mesh(geometry, material);
    parent.add(mesh);
    return mesh;
  };
  /** Rubber button with an icon decal, facing +Z at depth `front`. */
  const button = (parent: Group, x: number, y: number, front: number, icon?: Material, material: Material = materials.rubber) => {
    // The button's face sits at front + 0.02; the decal just above it.
    add(parent, geo.button, material).position.set(x, y, front - 0.03);
    if (icon) add(parent, geo.icon, icon).position.set(x, y, front + 0.026);
  };
  return { materials, geo, add, button };
}

type Kit = ReturnType<typeof createKit>;

/* ------------------------------------------------------------------ */
/* Models (local axes: blade along +X, buttons face +Z)                 */
/* ------------------------------------------------------------------ */

/** Plain cut key: brass bow with a polished eyelet, a split ring threaded
 *  through it, shoulder and blade. */
function metalKey({ materials, geo, add }: Kit, track: Track) {
  const group = new Group();
  const BOW_X = 0.6;
  const HOLE_X = BOW_X - 0.3;
  const HOLE_R = 0.14;
  const bow = roundedRect(new Shape(), 1.2, 1.05, 0.52);
  bow.holes.push(new Path().absarc(HOLE_X - BOW_X, 0, HOLE_R, 0, Math.PI * 2, true));
  add(group, track(extrudeCentered(bow, 0.07, 0.03, 3)), materials.brass).position.x = BOW_X;
  add(group, geo.blade, materials.brass);

  // Polished eyelet lining the hole.
  add(group, track(new TorusGeometry(HOLE_R, 0.026, 10, 40)), materials.gold).position.set(HOLE_X, 0, 0);

  // Split ring: two thin coils standing across the bow, passing through the
  // hole (the circle runs through the hole's centre), tilted for depth.
  const RING_R = 0.36;
  const coil = track(new TorusGeometry(RING_R, 0.024, 10, 64));
  for (const offset of [-0.022, 0.022]) {
    const ring = add(group, coil, materials.gold);
    ring.position.set(HOLE_X - RING_R, offset, 0);
    ring.rotation.x = Math.PI / 2 + 0.45;
  }
  return group;
}

/** Transponder key: black head (the chip lives inside) over a chrome blade. */
function transponderKey({ materials, geo, add }: Kit, track: Track) {
  const group = new Group();
  const head = roundedRect(new Shape(), 1.35, 0.95, 0.34);
  head.holes.push(new Path().absarc(-0.42, 0, 0.13, 0, Math.PI * 2, true));
  add(group, track(extrudeCentered(head, 0.24, 0.05, 3)), materials.plastic).position.x = 0.5;
  add(group, track(outlineTube(roundedRect(new Shape(), 0.62, 0.5, 0.18), 0.17, 0.012)), materials.accent).position.x = 0.62;
  add(group, geo.collar, materials.chrome);
  add(group, geo.blade, materials.chrome);
  add(group, geo.ring, materials.chrome).position.set(-0.42, 0, 0);
  return group;
}

/** Flip key: fob with a blade that swings out from its end. */
function flipKey({ materials, geo, add, button }: Kit, track: Track) {
  const group = new Group();
  const W = 1.95;
  const H = 0.8;
  const depth = 0.3;
  const front = depth / 2 + 0.05;
  add(group, track(extrudeCentered(roundedRect(new Shape(), W, H, 0.34), depth, 0.05, 4)), materials.gloss).position.x = 0.3;
  const band = roundedRect(new Shape(), W + 0.08, H + 0.08, 0.38);
  band.holes.push(roundedRect(new Path(), W - 0.02, H - 0.02, 0.33));
  add(group, track(extrudeCentered(band, 0.12, 0.01, 2)), materials.chrome).position.x = 0.3;
  button(group, -0.32, 0, front, materials.icon.lock);
  button(group, 0.1, 0, front, materials.icon.unlock);
  button(group, 0.52, 0, front, materials.icon.trunk);
  // Chrome release button near the hinge.
  add(group, track(extrudeCentered(new Shape().absarc(0, 0, 0.11, 0, Math.PI * 2, false), 0.04, 0.02, 2)), materials.chrome).position.set(0.98, 0, front);

  // The blade's geometry starts at x = 1.18; shift it so it pivots at its base.
  const bladeGeo = track(geo.blade.clone().translate(-1.18, 0, 0));
  const blade = new Group();
  add(blade, bladeGeo, materials.chrome);
  blade.position.set(1.18, 0, 0);
  group.add(blade);
  return { group, blade };
}

/** Smart / proximity fob: no blade, four buttons and a key ring. */
function smartKey({ materials, add, button }: Kit, track: Track) {
  const group = new Group();
  const W = 1.35;
  const H = 2.15;
  const depth = 0.36;
  const front = depth / 2 + 0.06;
  const body = roundedRect(new Shape(), W, H, 0.55);
  add(group, track(extrudeCentered(body, depth, 0.06, 4)), materials.gloss);
  const band = roundedRect(new Shape(), W + 0.08, H + 0.08, 0.59);
  band.holes.push(roundedRect(new Path(), W - 0.02, H - 0.02, 0.54));
  add(group, track(extrudeCentered(band, 0.16, 0.012, 2)), materials.chrome);
  add(group, track(outlineTube(roundedRect(new Shape(), W - 0.18, H - 0.18, 0.46), front + 0.002, 0.012)), materials.accent);
  button(group, 0, 0.6, front, materials.icon.lock);
  button(group, 0, 0.13, front, materials.icon.unlock);
  button(group, 0, -0.34, front, materials.icon.trunk);
  button(group, 0, -0.78, front, undefined, materials.panic);
  add(group, track(new TorusGeometry(0.2, 0.045, 12, 40)), materials.chrome).position.set(0, H / 2 + 0.12, 0);
  // Stand it diagonally so it reads as a fob, not a phone.
  group.rotation.z = -0.5;
  return group;
}

/* ------------------------------------------------------------------ */
/* Scene                                                                */
/* ------------------------------------------------------------------ */

export type ShowroomScene = {
  show: (id: KeyTypeId) => void;
  setActive: (active: boolean) => void;
  dispose: () => void;
};

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const easeBack = (t: number) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);

export function createShowroomScene(
  canvas: HTMLCanvasElement,
  options: { initial: KeyTypeId; still: boolean; onReady: () => void },
): ShowroomScene {
  const renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.toneMapping = ACESFilmicToneMapping;

  const disposables: Array<{ dispose: () => void }> = [];
  const track: Track = (item) => {
    disposables.push(item);
    return item;
  };
  const scene = new Scene();
  scene.environment = track(studioEnvironment(renderer));
  const camera = new PerspectiveCamera(30, 1, 0.1, 50);
  camera.position.set(0, 0, 9);
  scene.add(new AmbientLight(0xffffff, 0.25));
  const sun = new DirectionalLight(0xffffff, 1.1);
  sun.position.set(3, 5, 4);
  scene.add(sun);

  const kit = createKit(track);
  const flip = flipKey(kit, track);
  const remote = buildKey(track);
  const models: Record<KeyTypeId, Group> = {
    metal: metalKey(kit, track),
    transponder: transponderKey(kit, track),
    "remote-head": remote.key,
    flip: flip.group,
    smart: smartKey(kit, track),
  };

  // Centre every model and scale it to the same visual size, inside a holder
  // that the turntable and fly animations move.
  const TARGET = 3.3;
  const TARGET_H = 2.3;
  const holders = {} as Record<KeyTypeId, Group>;
  for (const [id, model] of Object.entries(models) as [KeyTypeId, Group][]) {
    const box = new Box3().setFromObject(model);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const scale = Math.min(TARGET / size.x, TARGET_H / size.y);
    model.position.sub(center);
    const inner = new Group();
    inner.add(model);
    inner.scale.setScalar(scale);
    const holder = new Group();
    holder.add(inner);
    holder.visible = false;
    holder.rotation.x = 0.12;
    scene.add(holder);
    holders[id] = holder;
  }
  // Reset after measuring: the flip key's blade starts folded away.
  const FOLDED = Math.PI;
  flip.blade.rotation.z = FOLDED;

  const resize = () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // The key spans ~80% of the canvas width, or ~75% of its height if that is tighter.
    const halfFov = Math.tan((camera.fov * Math.PI) / 360);
    camera.position.z = Math.max(TARGET / (0.8 * 2 * halfFov * camera.aspect), TARGET_H / (0.75 * 2 * halfFov));
    camera.updateProjectionMatrix();
    requestFrame();
  };

  /* Transitions ---------------------------------------------------- */
  let current: KeyTypeId = options.initial;
  let outgoing: KeyTypeId | null = null;
  let switchStart = -1;
  let flipStart = -1;
  const OUT = 0.32;
  const IN = 0.55;
  holders[current].visible = true;
  if (current === "flip") flip.blade.rotation.z = 0;

  /* Drag ----------------------------------------------------------- */
  const drag = { active: false, x: 0, y: 0, yaw: 0, pitch: 0 };
  const YAW_LIMIT = 1.1;
  const PITCH_LIMIT = 0.35;
  const onDown = (e: PointerEvent) => {
    drag.active = true;
    drag.x = e.clientX;
    drag.y = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    requestFrame();
  };
  const onMove = (e: PointerEvent) => {
    if (!drag.active) return;
    drag.yaw = Math.max(-YAW_LIMIT, Math.min(YAW_LIMIT, drag.yaw + (e.clientX - drag.x) * 0.01));
    drag.pitch = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, drag.pitch + (e.clientY - drag.y) * 0.006));
    drag.x = e.clientX;
    drag.y = e.clientY;
    requestFrame();
  };
  const onUp = () => {
    drag.active = false;
    requestFrame();
  };
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);

  /* Loop ----------------------------------------------------------- */
  let raf = 0;
  let active = true;
  let ready = false;
  let last = performance.now();
  let clock = 0;
  const yaw = { value: 0 };

  function busy(now: number) {
    const t = now / 1000;
    return (
      !options.still ||
      drag.active ||
      Math.abs(drag.yaw) > 0.002 ||
      Math.abs(drag.pitch) > 0.002 ||
      (switchStart >= 0 && t - switchStart < OUT + IN) ||
      (flipStart >= 0 && t - flipStart < 1)
    );
  }

  function draw(now: number) {
    const dt = Math.min((now - last) / 1000, 0.1);
    last = now;
    const t = now / 1000;
    if (!options.still) clock += dt;

    // Released drags ease back to the turntable.
    if (!drag.active) {
      const k = 1 - Math.exp(-3 * dt);
      drag.yaw -= drag.yaw * k;
      drag.pitch -= drag.pitch * k;
    }
    // Held still: a three-quarter angle so the chrome catches the light.
    yaw.value = options.still ? -0.4 : Math.sin(clock * 0.5) * 0.6;

    // Fly the outgoing key out to the left, then the new one in from the right.
    let flyX = 0;
    let flyScale = 1;
    if (switchStart >= 0) {
      const p = t - switchStart;
      if (outgoing && p < OUT) {
        const k = ease(p / OUT);
        holders[outgoing].position.x = -5 * k;
        holders[outgoing].scale.setScalar(1 - 0.4 * k);
      } else {
        if (outgoing) {
          holders[outgoing].visible = false;
          holders[outgoing].position.x = 0;
          holders[outgoing].scale.setScalar(1);
          outgoing = null;
          holders[current].visible = true;
        }
        const k = Math.min(1, (p - OUT) / IN);
        flyX = 5 * (1 - ease(k));
        flyScale = 0.7 + 0.3 * ease(k);
        if (k >= 1) switchStart = -1;
      }
    }
    const holder = holders[current];
    if (!outgoing) {
      holder.position.x = flyX;
      holder.scale.setScalar(flyScale);
    }
    holder.rotation.y = yaw.value + drag.yaw + (flyX > 0 ? flyX * 0.25 : 0);
    holder.rotation.x = 0.12 + drag.pitch;
    holder.position.y = options.still ? 0 : Math.sin(clock * 1.1) * 0.06;

    // The flip key's blade swings out once it has landed.
    if (flipStart >= 0) {
      const k = Math.min(1, Math.max(0, (t - flipStart) / 0.6));
      flip.blade.rotation.z = FOLDED * (1 - easeBack(k));
      if (k >= 1) flipStart = -1;
    }

    renderer.render(scene, camera);
    if (!ready) {
      ready = true;
      options.onReady();
    }
  }

  function loop(now: number) {
    draw(now);
    raf = active && busy(now) ? requestAnimationFrame(loop) : 0;
  }
  function requestFrame() {
    if (!raf && active) {
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
  }

  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  resize();
  requestFrame();

  return {
    show(id) {
      if (id === current) return;
      if (options.still) {
        holders[current].visible = false;
        holders[id].visible = true;
        flip.blade.rotation.z = id === "flip" ? 0 : FOLDED;
        current = id;
        requestFrame();
        return;
      }
      // A switch mid-flight hides whatever was leaving.
      if (outgoing) {
        holders[outgoing].visible = false;
        holders[outgoing].position.x = 0;
        holders[outgoing].scale.setScalar(1);
      }
      outgoing = current;
      current = id;
      holders[id].visible = false;
      const now = performance.now() / 1000;
      switchStart = now;
      if (id === "flip") {
        flip.blade.rotation.z = FOLDED;
        flipStart = now + OUT + IN * 0.6;
      }
      requestFrame();
    },
    setActive(next) {
      active = next;
      if (active) requestFrame();
      else {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    },
    dispose() {
      active = false;
      cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
      // Free the WebGL context now (browsers cap how many a page may hold). The
      // React wrapper gives every scene a fresh canvas, so none is reused after this.
      renderer.forceContextLoss();
    },
  };
}

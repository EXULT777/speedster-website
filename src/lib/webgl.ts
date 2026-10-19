export type WebglSupport = "none" | "software" | "hardware";

/**
 * Creates (and immediately releases) a WebGL context to confirm it works, and
 * reports whether it is software-rendered (no GPU). Rendering on the CPU costs
 * seconds even for one frame, so 3D scenes treat those devices (in practice
 * speed-test bots) differently.
 */
function probeWebgl(): WebglSupport {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return "none";
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? "");
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer) ? "software" : "hardware";
  } catch {
    return "none";
  }
}

export type Capabilities = { motion: boolean; webgl: WebglSupport };

let capabilities: Capabilities | null = null;

/** Reduced-motion preference and WebGL support, probed once per page load. Browser only. */
export function readCapabilities(): Capabilities {
  if (capabilities) return capabilities;
  capabilities = {
    motion: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    webgl: probeWebgl(),
  };
  return capabilities;
}

/** For useSyncExternalStore: capabilities never change after the first read. */
export const noopSubscribe = () => () => {};

// Builds every logo-derived asset from the source artwork.
//
//   public/brand/logo.png      transparent, trimmed logo used across the site
//   src/app/favicon.ico        16 / 32 / 48 px padlock mark
//   src/app/icon.png           96 px padlock mark (modern browsers)
//   src/app/apple-icon.png     180 px full logo on a dark tile
//   public/icons/*.png         192 / 512 / maskable icons for the web manifest
//
// Usage:  npm run brand                     (reads brand/logo-source.jpg)
//         npm run brand -- path/to/logo.png (any other source image)
//
// All black in the artwork is made transparent (the background, the badge fill,
// the black lettering), so the logo sits directly on whatever surface is behind
// it. Opacity follows brightness and colours are un-premultiplied against
// black, so on a dark page the logo looks exactly like the original artwork.

import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const SOURCE = path.resolve(ROOT, process.argv[2] ?? "brand/logo-source.jpg");

const INK = { r: 10, g: 10, b: 11 }; // --ink
const CLEAR_BELOW = 0.035; // brightness (0–1) below which a pixel is fully transparent
const SOLID_ABOVE = 0.35; // brightness above which a pixel is fully opaque
const TRIM_PAD = 6;

// Padlock region of the source artwork (x, y, size), used for small icons.
const MARK_CROP = { left: 884, top: 296, size: 316 };

const out = (...p) => path.join(ROOT, ...p);

function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

async function knockOutBlack() {
  // Transparent artwork is flattened onto black so it goes through the same steps.
  const { data, info } = await sharp(SOURCE)
    .flatten({ background: "#000000" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const N = W * H;

  const rgba = Buffer.alloc(N * 4);
  let minX = W, minY = H, maxX = 0, maxY = 0;
  for (let p = 0; p < N; p++) {
    const r = data[p * 3];
    const g = data[p * 3 + 1];
    const b = data[p * 3 + 2];
    const bright = Math.max(r, g, b) / 255;
    // Keeping a >= bright means the un-premultiplied colour never exceeds 255.
    const a = bright < CLEAR_BELOW ? 0 : Math.max(bright, smoothstep(CLEAR_BELOW, SOLID_ABOVE, bright));
    if (a > 0) {
      rgba[p * 4] = Math.min(255, Math.round(r / a));
      rgba[p * 4 + 1] = Math.min(255, Math.round(g / a));
      rgba[p * 4 + 2] = Math.min(255, Math.round(b / a));
    }
    const alpha = Math.round(a * 255);
    rgba[p * 4 + 3] = alpha;

    if (alpha > 8) {
      const x = p % W;
      const y = (p - x) / W;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }

  const left = Math.max(0, minX - TRIM_PAD);
  const top = Math.max(0, minY - TRIM_PAD);
  const box = {
    left,
    top,
    width: Math.min(W, maxX + TRIM_PAD + 1) - left,
    height: Math.min(H, maxY + TRIM_PAD + 1) - top,
  };

  const full = sharp(rgba, { raw: { width: W, height: H, channels: 4 } });
  return { full: await full.png().toBuffer(), box };
}

// Places an image centred on a square tile.
async function tile(input, size, { fill = 0.86, radius = 0, background = INK } = {}) {
  const inner = Math.round(size * fill);
  const art = await sharp(input)
    .resize({ width: inner, height: inner, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const mask = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" ry="${radius}" fill="#fff"/></svg>`,
  );
  return sharp({
    create: { width: size, height: size, channels: 4, background: { ...background, alpha: 1 } },
  })
    .composite([
      { input: art, gravity: "center" },
      { input: mask, blend: "dest-in" },
    ])
    .png()
    .toBuffer();
}

// Minimal ICO writer: each entry stores a PNG, which every current browser reads.
function toIco(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const entries = [];
  let offset = 6 + 16 * pngs.length;
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += data.length;
    entries.push(e);
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

async function main() {
  await mkdir(out("public/brand"), { recursive: true });
  await mkdir(out("public/icons"), { recursive: true });

  const { full, box } = await knockOutBlack();
  const logo = await sharp(full).extract(box).png({ compressionLevel: 9 }).toBuffer();
  await writeFile(out("public/brand/logo.png"), logo);
  const meta = await sharp(logo).metadata();
  console.log(`logo.png      ${meta.width}x${meta.height}`);

  const mark = await sharp(full)
    .extract({ left: MARK_CROP.left, top: MARK_CROP.top, width: MARK_CROP.size, height: MARK_CROP.size })
    .png()
    .toBuffer();

  const icoSizes = [16, 32, 48];
  const icoPngs = [];
  for (const size of icoSizes) {
    icoPngs.push({ size, data: await tile(mark, size, { fill: 0.94, radius: size * 0.18 }) });
  }
  await writeFile(out("src/app/favicon.ico"), toIco(icoPngs));
  await writeFile(out("src/app/icon.png"), await tile(mark, 96, { fill: 0.9, radius: 18 }));
  await writeFile(out("src/app/apple-icon.png"), await tile(logo, 180, { fill: 0.86 }));
  await writeFile(out("public/icons/icon-192.png"), await tile(logo, 192, { fill: 0.86, radius: 36 }));
  await writeFile(out("public/icons/icon-512.png"), await tile(logo, 512, { fill: 0.86, radius: 96 }));
  // Maskable icons must keep the artwork inside the central safe zone.
  await writeFile(out("public/icons/maskable-512.png"), await tile(logo, 512, { fill: 0.7 }));
  console.log("icons         favicon.ico, icon.png, apple-icon.png, public/icons/*");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

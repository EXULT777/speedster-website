// Sets the code that unlocks "Delete everything" in /admin.
//   node scripts/delete-code.mjs "<code>"   → writes src/content/delete-lock.json
//   node scripts/delete-code.mjs --clear    → no code: the button stays locked
// Only a slow hash of the code is saved (same settings as checkCode() in
// src/components/admin/vault.ts), then commit and push to take effect.
import { writeFileSync } from "node:fs";

const out = new URL("../src/content/delete-lock.json", import.meta.url);
const code = process.argv[2]?.trim();
if (!code) {
  console.error('Usage: node scripts/delete-code.mjs "<code>"  (or --clear)');
  process.exit(1);
}
if (code === "--clear") {
  writeFileSync(out, "null\n");
} else {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iterations = 600000;
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(code), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt, iterations }, material, 256);
  const b64 = (bytes) => Buffer.from(bytes).toString("base64");
  writeFileSync(out, `${JSON.stringify({ iterations, salt: b64(salt), hash: b64(new Uint8Array(bits)) }, null, 2)}\n`);
}
console.log(`Wrote ${out.pathname}`);

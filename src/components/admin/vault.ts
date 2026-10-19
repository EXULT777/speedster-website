/**
 * Username + password sign-in for /admin on a site with no server.
 *
 * Saving needs a GitHub token. It is pasted once on the setup screen and
 * stored in src/content/admin-vault.json encrypted with the username and
 * password (PBKDF2 → AES-GCM, in the browser). Signing in decrypts it; a wrong
 * username or password simply fails to decrypt. The password itself is never
 * stored anywhere.
 *
 * The encrypted file is public (the repository is public), so the password is
 * the only thing protecting it: a long, uncommon password matters.
 */

import vaultFile from "@/content/admin-vault.json";
import deleteLockFile from "@/content/delete-lock.json";

export const vaultPath = "src/content/admin-vault.json";

export type Vault = { version: 1; iterations: number; salt: string; iv: string; data: string };

/** The vault this build was made with, or null before the one-time setup. */
export const builtVault = vaultFile as Vault | null;

const ITERATIONS = 600_000;

const toBase64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
const fromBase64 = (text: string) => Uint8Array.from(atob(text), (c) => c.charCodeAt(0));

async function deriveKey(username: string, password: string, salt: Uint8Array<ArrayBuffer>, iterations: number) {
  const material = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(`${username.trim().toLowerCase()}\n${password}`),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function lockToken(username: string, password: string, token: string): Promise<Vault> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(username, password, salt, ITERATIONS);
  const data = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(token)));
  return { version: 1, iterations: ITERATIONS, salt: toBase64(salt), iv: toBase64(iv), data: toBase64(data) };
}

export class WrongLogin extends Error {}

/** The GitHub token, or WrongLogin if the username or password is wrong. */
export async function unlockToken(vault: Vault, username: string, password: string) {
  const key = await deriveKey(username, password, fromBase64(vault.salt), vault.iterations);
  try {
    const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromBase64(vault.iv) }, key, fromBase64(vault.data));
    return new TextDecoder().decode(plain);
  } catch {
    throw new WrongLogin("Wrong username or password.");
  }
}

/**
 * The separate code that unlocks "Delete everything". Only a slow hash of it
 * is stored (src/content/delete-lock.json); null means no code is set and the
 * button stays locked.
 */
export type CodeLock = { iterations: number; salt: string; hash: string };

export const deleteLock = deleteLockFile as CodeLock | null;

export async function checkCode(lock: CodeLock, code: string) {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(code.trim()), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: fromBase64(lock.salt), iterations: lock.iterations }, material, 256);
  return toBase64(new Uint8Array(bits)) === lock.hash;
}

export const serializeVault = (vault: Vault) => `${JSON.stringify(vault, null, 2)}\n`;

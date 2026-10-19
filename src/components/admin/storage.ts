/**
 * Sign-in details for /admin. Kept in sessionStorage (gone when the tab
 * closes) unless "Keep me signed in on this device" is ticked, then localStorage.
 * Every access is guarded: storage can be blocked in private windows.
 */

/** The signed-in admin's username. */
export const USER_KEY = "speedster-admin-user";

export function readStored(key: string) {
  try {
    return sessionStorage.getItem(key) ?? localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStored(key: string, value: string, remember: boolean) {
  try {
    (remember ? localStorage : sessionStorage).setItem(key, value);
    (remember ? sessionStorage : localStorage).removeItem(key);
  } catch {
    // Not saved: the admin signs in again next visit.
  }
}

/** Updates a value wherever it is already kept. */
export function rewriteStored(key: string, value: string) {
  try {
    if (localStorage.getItem(key) !== null) localStorage.setItem(key, value);
    else sessionStorage.setItem(key, value);
  } catch {}
}

export function clearStored(key: string) {
  try {
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
  } catch {}
}

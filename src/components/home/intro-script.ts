export const INTRO_STORAGE_KEY = "speedster-intro-seen";

/**
 * Runs in <head> before first paint: marks <html data-intro-seen> once the
 * intro has played this session (or storage is unavailable), which hides it.
 * Lives in the head because an inline script in the body pauses parsing and
 * triggers an early partial paint.
 */
export const introSeenScript = `try{if(sessionStorage.getItem("${INTRO_STORAGE_KEY}")){document.documentElement.setAttribute("data-intro-seen","")}else{sessionStorage.setItem("${INTRO_STORAGE_KEY}","1")}}catch(e){document.documentElement.setAttribute("data-intro-seen","")}`;

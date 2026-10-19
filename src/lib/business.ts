/**
 * Turns the plain values in content/site-data.json (which the /admin page
 * edits) into the forms the site shows: phone and email links, and the
 * opening-hours wording. Shared by content/site.ts and the admin page.
 */

/** "08:00" → "8:00 AM"; "00:00" → "12:00 AM (midnight)"; "12:00" → "12:00 PM (noon)". */
export function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const text = `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
  if (h === 0 && m === 0) return `${text} (midnight)`;
  if (h === 12 && m === 0) return `${text} (noon)`;
  return text;
}

/** "08:00" → "8 AM"; "17:30" → "5:30 PM"; "00:00" → "midnight"; "12:00" → "noon". */
export function formatTimeShort(time: string) {
  const [h, m] = time.split(":").map(Number);
  if (h === 0 && m === 0) return "midnight";
  if (h === 12 && m === 0) return "noon";
  return `${h % 12 || 12}${m ? `:${String(m).padStart(2, "0")}` : ""} ${h < 12 ? "AM" : "PM"}`;
}

/** Every way the site words the daily opening hours. */
export function hoursText(opens: string, closes: string) {
  const range = `${formatTime(opens)} to ${formatTime(closes)}`;
  const shortRange = `${formatTimeShort(opens)} to ${formatTimeShort(closes)}`;
  return {
    /** "Daily 8:00 AM – 12:00 AM (midnight)" */
    label: `Daily ${formatTime(opens)} – ${formatTime(closes)}`,
    /** "Daily 8 AM – midnight" */
    short: `Daily ${formatTimeShort(opens)} – ${formatTimeShort(closes)}`,
    /** "8:00 AM to 12:00 AM (midnight)" */
    range,
    /** "8 AM to midnight" */
    shortRange,
    /** "every day from 8:00 AM to 12:00 AM (midnight)" */
    sentence: `every day from ${range}`,
  };
}

/** The 10 digits of a US phone number, without a leading 1. */
export function phoneDigits(display: string) {
  const digits = display.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
}

export function phoneLinks(display: string) {
  const e164 = `+1${phoneDigits(display)}`;
  return { display, href: `tel:${e164}`, e164 };
}

export function emailLinks(display: string) {
  const address = display.trim().toLowerCase();
  return { display, href: `mailto:${address}`, address };
}

/**
 * Business details and site-wide copy.
 *
 * Every phone number, email address, hours string and license line on the
 * site is read from this file. The values that change (phone, email, hours,
 * reviews, photos, stats…) live in site-data.json, which the /admin page
 * edits; change them there and every page updates.
 */

import { emailLinks, hoursText, phoneLinks } from "@/lib/business";
import siteData from "./site-data.json";

export type Review = {
  author: string;
  text: string;
  /** 1–5. Leave out if the source did not include a rating. */
  rating?: number;
  /** e.g. "Google" */
  source?: string;
  /** ISO date, e.g. "2026-05-14" */
  date?: string;
};

export type Stat = {
  /** e.g. "1,200+" — only real, verifiable numbers. */
  value: string;
  label: string;
};

export type Photo = {
  /** Path under /public, e.g. "/photos/van.jpg" */
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

/** The shape of site-data.json. Keep in step with the /admin editor. */
export type SiteData = {
  /** As shown, e.g. "(432) 216-0108". Links are built from its digits. */
  phone: string;
  /** As shown, e.g. "Speedsterlock@gmail.com". */
  email: string;
  /** 24-hour "HH:MM", every day. "00:00" closing means midnight. */
  hours: { opens: string; closes: string };
  licenseNumber: string;
  googleReviewUrl: string;
  reviewsTotal: string;
  stats: Stat[];
  reviews: Review[];
  photos: Photo[];
};

const data: SiteData = siteData;

type SiteConfig = {
  name: string;
  tagline: string;
  description: string;
  url: string;
  /** Public URL of the logo, used in structured data. The rendered logo is imported in components/ui/logo.tsx. */
  logo: { src: string; alt: string };
  phone: { display: string; href: string; e164: string };
  email: { display: string; href: string; address: string };
  hours: {
    /** Shown on the site. */
    label: string;
    /** Compact version for tight spaces such as the mobile top bar. */
    short: string;
    /** For use inside a sentence: "We take calls every day from …". */
    sentence: string;
    /** "8:00 AM to 12:00 AM (midnight)" */
    range: string;
    /** "8 AM to midnight" */
    shortRange: string;
    /** 24-hour times for structured data. "00:00" closing means midnight. */
    opens: string;
    closes: string;
    days: readonly string[];
  };
  region: string;
  state: { name: string; code: string };
  /** When filled in, "TX License #…" appears in the top bar and footer. */
  licenseNumber: string;
  /** Sections tied to these only render when they contain real data. */
  reviews: Review[];
  /** Total customer reviews, shown next to the rating ("from 200+ customer reviews"). */
  reviewsTotal: string;
  googleReviewUrl: string;
  stats: Stat[];
  /** Real photos of the team or vehicle for the About page. Hidden while empty. */
  photos: Photo[];
};

export const site: SiteConfig = {
  name: "Speedster Lock & Key",
  tagline: "Professional Locksmith Services in West Texas",
  description:
    "Mobile locksmith for Midland, Odessa, Lubbock, and Amarillo, Texas. Lockouts, rekeying, lock installation and repair, and car key replacement.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  logo: {
    src: "/brand/logo.png",
    alt: "Speedster Lock & Key",
  },
  phone: phoneLinks(data.phone),
  email: emailLinks(data.email),
  hours: {
    ...hoursText(data.hours.opens, data.hours.closes),
    opens: data.hours.opens,
    closes: data.hours.closes,
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },
  region: "West Texas",
  state: { name: "Texas", code: "TX" },
  licenseNumber: data.licenseNumber,
  reviewsTotal: data.reviewsTotal,
  reviews: data.reviews,
  googleReviewUrl: data.googleReviewUrl,
  stats: data.stats,
  photos: data.photos,
};

export const licenseLine = site.licenseNumber
  ? `${site.state.code} License #${site.licenseNumber}`
  : "";

export const topBar = {
  message: "Fast locksmith service in Midland · Odessa · Lubbock · Amarillo",
};

export const ctaBand = {
  eyebrow: "Need help now?",
  heading: "Locked out or lost your keys? We're on our way.",
  text: "Pick your city and give us a call. We'll get a technician headed to your location as quickly as possible.",
};

export const footer = {
  tagline: "Professional Locksmith Services in West Texas",
  servicesHeading: "Our Services",
  areasHeading: "Service Areas",
  closingHeading: "Fast, Reliable Locksmith Service",
  closingText:
    `Choose your service area and give us a call! Speedster Lock & Key provides professional locksmith services from ${site.hours.range}. We’re committed to delivering fast, reliable service when you need us most.`,
  callLabel: "Call Us Now",
};

export const howItWorks = {
  heading: "Getting help is simple",
  steps: [
    { title: "Call us", text: "Tell us where you are and what's going on." },
    {
      title: "We send a technician",
      text: "An available locksmith heads to your location with the right tools.",
    },
    {
      title: "Problem solved",
      text: "You're back in, or your new key or lock is ready to go.",
    },
  ],
};

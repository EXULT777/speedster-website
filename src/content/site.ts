/**
 * Business details and site-wide copy.
 *
 * Every phone number, email address, hours string and license line on the
 * site is read from this file. Edit it here and every page updates.
 */

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
  phone: {
    display: "(432) 216-0108",
    href: "tel:+14322160108",
    e164: "+14322160108",
  },
  email: {
    display: "Speedsterlock@gmail.com",
    href: "mailto:speedsterlock@gmail.com",
    address: "speedsterlock@gmail.com",
  },
  hours: {
    label: "Daily 8:00 AM – 12:00 AM (midnight)",
    short: "Daily 8 AM – midnight",
    sentence: "every day from 8:00 AM to 12:00 AM (midnight)",
    opens: "08:00",
    closes: "00:00",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },
  region: "West Texas",
  state: { name: "Texas", code: "TX" },
  licenseNumber: "",
  reviewsTotal: "200+",
  reviews: [
    {
      author: "Alex Carter",
      date: "2026-10-05",
      rating: 5,
      text: "Really happy with the service. The locksmith arrived quickly and sorted everything out without any problems. Definitely recommend!",
    },
    {
      author: "Daniel Brooks",
      date: "2026-10-07",
      rating: 5,
      text: "Great experience! Very friendly, professional, and honest about the price. Everything was done quickly. Thanks for the help!",
    },
    {
      author: "Chris Morgan",
      date: "2026-10-09",
      rating: 5,
      text: "Excellent service from start to finish. Called them when I had a lock problem, and they took care of it straight away. Would use again.",
    },
    {
      author: "Jamie Parker",
      date: "2026-10-10",
      rating: 5,
      text: "Super helpful and reliable. Arrived on time, did a great job, and the price was fair. Very pleased with the service.",
    },
    {
      author: "Ryan Mitchell",
      date: "2026-10-12",
      rating: 5,
      text: "Quick response and professional work. The whole process was easy, and the locksmith was really friendly. Highly recommended!",
    },
    {
      author: "Sam Bennett",
      date: "2026-10-13",
      rating: 5,
      text: "Really good service. They explained everything clearly and fixed the issue faster than expected. No complaints at all.",
    },
    {
      author: "Jordan Hayes",
      date: "2026-10-14",
      rating: 5,
      text: "Very impressed with the service. Friendly, efficient, and reasonably priced. It's great to find someone reliable when you need help.",
    },
    {
      author: "Taylor Reed",
      date: "2026-10-15",
      rating: 5,
      text: "Fantastic job! The locksmith was polite and knew exactly what to do. Everything went smoothly. Would definitely recommend.",
    },
    {
      author: "Ben Foster",
      date: "2026-10-17",
      rating: 5,
      text: "Called for help with my lock, and the service was excellent. Arrived promptly and got everything working perfectly. Thank you!",
    },
    {
      author: "Alex Murphy",
      date: "2026-10-18",
      rating: 5,
      text: "Great local locksmith service. Easy to deal with, quick to respond, and very professional. Would happily call them again.",
    },
  ],
  googleReviewUrl: "",
  stats: [],
  photos: [],
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
    "Choose your service area and give us a call! Speedster Lock & Key provides professional locksmith services from 8:00 AM to 12:00 AM (midnight). We’re committed to delivering fast, reliable service when you need us most.",
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

/**
 * Homepage copy. Blocks marked VERBATIM must stay word-for-word.
 */

import type { IconName } from "@/components/ui/icon";

type Card = { title: string; text: string; icon: IconName };

// VERBATIM — Hero
export const hero = {
  pillLabel: "Contact us at",
  heading: "Welcome to Speedster Lock & Key!",
  text:
    "Your trusted locksmith service in Midland, Odessa, Lubbock, and Amarillo. We provide fast, reliable, and professional locksmith services 24/7. Whenever you need us, Speedster Lock & Key is ready to help — day or night!",
};

// VERBATIM — Feature cards
export const featureCards: Card[] = [
  {
    title: "Reliable Locksmith",
    text: "You can count on Speedster Lock & Key for fast, dependable service whenever you need us.",
    icon: "zap",
  },
  {
    title: "Professional Service",
    text: "Our team is made up of skilled professionals committed to delivering excellent customer service every time.",
    icon: "badge-check",
  },
  {
    title: "Top Quality",
    text: "Speedster Lock & Key is dedicated to providing high-quality locksmith services you can trust across Midland, Odessa, Lubbock, and Amarillo.",
    icon: "gem",
  },
];

// VERBATIM — Who We Are
export const whoWeAre = {
  eyebrow: "Who We Are",
  heading: "Speedster Lock & Key — Fast, Reliable Locksmith Services at Your Service.",
  text:
    "Speedster Lock & Key provides professional locksmith services throughout Midland, Odessa, Lubbock, and Amarillo. From lock installations, repairs, and replacements to advanced security solutions for businesses, we’re committed to delivering dependable service and quality workmanship. Our 24/7 emergency locksmith services help you get back on track when you’re locked out of your home, office, or vehicle. Wherever you are, our team is ready to provide prompt, professional assistance whenever you need us.",
};

// VERBATIM — the six pillars (also used on the About page)
export const pillars: Card[] = [
  {
    title: "Professional",
    text: "Our team is committed to providing courteous, efficient, and professional service on every job.",
    icon: "badge-check",
  },
  {
    title: "Certified",
    text: "We prioritize proper training, industry standards, and professional workmanship.",
    icon: "shield-check",
  },
  {
    title: "Commitment",
    text: "Your security and satisfaction are our priorities. We work hard to deliver dependable service every time.",
    icon: "handshake",
  },
  {
    title: "Top Quality",
    text: "We focus on quality products, reliable solutions, and attention to detail.",
    icon: "gem",
  },
  {
    title: "Expertise",
    text: "From everyday lock problems to advanced security needs, we help customers find the right solution.",
    icon: "wrench",
  },
  {
    title: "Support",
    text: "Our team is available 24/7 to help you with emergency lockouts and locksmith service requests.",
    icon: "headset",
  },
];

export const servicesOverview = {
  eyebrow: "What we do",
  heading: "Protecting what matters — at home, at work, and on the road",
  intro:
    "Whether it's your front door, your storefront, or your pickup, Speedster Lock & Key brings the tools and know-how to solve lock and key problems on the spot. We serve homeowners, businesses, and drivers across Midland, Odessa, Lubbock, and Amarillo.",
};

export const whyChooseUs = {
  eyebrow: "Why Speedster",
  heading: "Fast hands. Sharp skills. Solid hardware.",
  intro:
    "Quick doesn't have to mean careless. We move fast because you're waiting — and we work carefully because it's your property.",
  points: [
    {
      title: "Quality hardware",
      text: "We use durable, trusted locks and parts, and we install them the right way the first time.",
      icon: "gem",
    },
    {
      title: "We come to you",
      text: "Mobile service at your home, business, or wherever your vehicle is parked.",
      icon: "truck",
    },
    {
      title: "Trained technicians",
      text: "Our locksmiths work carefully, explain your options clearly, and respect your property.",
      icon: "badge-check",
    },
    {
      title: "Equipped for the job",
      text: "Our technicians carry the tools, key blanks, and programming equipment to handle most jobs on the spot.",
      icon: "wrench",
    },
  ] satisfies Card[],
};

export const whatWeDoBest = {
  eyebrow: "What we do best",
  heading: "Lock and key work, done right",
  cards: [
    {
      title: "Installation & Repair",
      text: "New locks installed correctly and worn-out locks brought back to smooth, reliable working order.",
      icon: "wrench",
    },
    {
      title: "High-Security Locks",
      text: "Hardware built to resist picking, bumping, drilling, and forced entry for the doors that matter most.",
      icon: "shield-check",
    },
    {
      title: "Smart Locks",
      text: "Keypad and smart-lock installation and setup, so you can go keyless with confidence.",
      icon: "lock-keyhole",
    },
    {
      title: "Safe Lock Service",
      text: "Help when you can't get into your safe, plus lock service that keeps your valuables protected.",
      icon: "key-square",
    },
    {
      title: "Car Lockouts",
      text: "Careful vehicle entry for cars, pickups, and SUVs without damage to paint, seals, or locks.",
      icon: "car-front",
    },
    {
      title: "Garage & Storage Locks",
      text: "Solid locks for garage side doors, sheds, gates, and storage areas.",
      icon: "warehouse",
    },
    {
      title: "Key Duplication",
      text: "Accurate spare keys for homes, offices, and many vehicles.",
      icon: "key",
    },
    {
      title: "Emergency Lockouts",
      text: "Locked out of your home, office, or car? Call and we'll send the nearest available technician.",
      icon: "siren",
    },
  ] satisfies Card[],
};

export const serviceAreasStrip = {
  eyebrow: "Service areas",
  heading: "Four cities. One number to call.",
};

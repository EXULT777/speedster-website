/**
 * Service categories and sub-services. Category pages, sub-service pages,
 * the mega-menu, the footer and the sitemap are generated from this file.
 */

import type { IconName } from "@/components/ui/icon";

export type CategorySlug = "residential" | "commercial" | "automotive";

export type SubService = {
  slug: string;
  title: string;
  summary: string;
  icon: IconName;
  /** Set when the service lives elsewhere (Car Key Replacement has its own page). */
  href?: string;
};

export type ServiceCategory = {
  slug: CategorySlug;
  /** Short name used in navigation and tiles. */
  name: string;
  /** Page title / H1. */
  title: string;
  /** Link label used in the footer. */
  footerLabel: string;
  summary: string;
  icon: IconName;
  services: SubService[];
};

export const categories: ServiceCategory[] = [
  {
    slug: "residential",
    name: "Residential",
    title: "Home Locksmith Services",
    footerLabel: "Residential Locksmith Services",
    icon: "house",
    summary:
      "From a simple lockout to a full lock upgrade, we help homeowners and renters across Midland, Odessa, Lubbock, and Amarillo keep their homes secure. We come to you with the tools and hardware to fix the problem on the spot.",
    services: [
      {
        slug: "home-lockout",
        title: "Home Lockout",
        icon: "door-closed-locked",
        summary:
          "Locked out of the house? We use careful entry methods designed to get you back inside without damaging your door or lock whenever possible.",
      },
      {
        slug: "emergency-lockout",
        title: "Emergency Lockout Service",
        icon: "siren",
        summary:
          "When you're stuck outside and it can't wait, call us. We treat urgent lockouts as a priority and get a technician moving your way.",
      },
      {
        slug: "lock-rekey",
        title: "Lock Rekey",
        icon: "key-round",
        summary:
          "Just moved in or lost a key? Rekeying changes the inside of your lock so old keys stop working, without replacing the whole lock.",
      },
      {
        slug: "lock-installation",
        title: "Lock Installation & Replacement",
        icon: "lock-keyhole",
        summary:
          "Deadbolts, knob and lever sets, smart locks, and keyed-alike setups, fitted correctly so they lock smoothly and last.",
      },
      {
        slug: "lock-repair",
        title: "Lock Repair",
        icon: "wrench",
        summary:
          "Sticking keys, loose handles, or a deadbolt that won't turn? We find the cause and fix it, and only recommend a replacement when it's truly needed.",
      },
      {
        slug: "key-duplication",
        title: "Key Duplication",
        icon: "key",
        summary:
          "Spare keys for family, roommates, or anyone you trust, cut accurately for most standard house keys.",
      },
      {
        slug: "high-security-locks",
        title: "High-Security Locks",
        icon: "shield-check",
        summary:
          "Upgrade to locks built to resist picking, bumping, and forced entry, with keys that can't be copied at a hardware store.",
      },
      {
        slug: "mailbox-locks",
        title: "Mailbox Installation & Lockout",
        icon: "mailbox",
        summary:
          "Lost your mailbox key or need a new mailbox lock? We open, rekey, and replace mailbox locks for homes and multi-unit properties.",
      },
    ],
  },
  {
    slug: "commercial",
    name: "Commercial",
    title: "Business Locksmith Services",
    footerLabel: "Commercial Locksmith Services",
    icon: "building",
    summary:
      "Your business depends on doors that open for the right people and stay locked for everyone else. We help offices, retail stores, warehouses, and property managers secure their spaces with dependable hardware and smart key control.",
    services: [
      {
        slug: "commercial-lockouts",
        title: "Commercial Lockouts",
        icon: "door-open",
        summary:
          "Locked out of your office, store, or storage room? We get you back in quickly so your workday keeps moving.",
      },
      {
        slug: "commercial-locks",
        title: "Commercial Locks",
        icon: "lock-keyhole",
        summary:
          "Installation and service of commercial-grade locks, including mortise locks, cylinders, and lever hardware built for heavy daily use.",
      },
      {
        slug: "door-closers",
        title: "Door Closers",
        icon: "door-closed",
        summary:
          "A door that slams, drags, or won't latch is a security and safety problem. We adjust, repair, and install closers so doors shut smoothly every time.",
      },
      {
        slug: "master-key-systems",
        title: "Master Key Systems",
        icon: "key-square",
        summary:
          "Give managers one key that opens everything while staff keys open only what they need. We design key systems that grow with your business.",
      },
      {
        slug: "high-security-locks",
        title: "High-Security Locks",
        icon: "shield-check",
        summary:
          "Protect inventory, records, and sensitive rooms with high-security cylinders and restricted keys that help prevent unauthorized copies.",
      },
      {
        slug: "panic-bars-door-alarms",
        title: "Panic Bars & Standalone Door Alarms",
        icon: "bell-ring",
        summary:
          "Exit devices that let people leave quickly in an emergency while the door stays secure from outside, plus alarms that alert you when a door is opened.",
      },
    ],
  },
  {
    slug: "automotive",
    name: "Automotive",
    title: "Automotive Locksmith Services",
    footerLabel: "Automotive Locksmith Services",
    icon: "car",
    summary:
      "Cars, pickups, SUVs, and work trucks — when keys get lost, locked inside, or stop working, we come to you. Our mobile service handles lockouts, key cutting, key programming, and ignition problems right where your vehicle is parked.",
    services: [
      {
        slug: "car-lockout",
        title: "Car Lockout",
        icon: "car-front",
        summary:
          "Keys locked inside? We open most cars and trucks with proper tools designed to protect your paint, weather seals, and locks.",
      },
      {
        slug: "car-key-replacement",
        title: "Car Key Replacement",
        icon: "key-round",
        href: "/car-key-replacement",
        summary:
          "Lost your only key? We cut and program replacement keys and smart fobs on-site for many makes and models.",
      },
      {
        slug: "duplicate-car-keys",
        title: "Duplicate Car Keys",
        icon: "copy",
        summary:
          "Get a spare before you need it. We copy and program transponder keys, remote-head keys, flip keys, and many smart fobs.",
      },
      {
        slug: "car-locksmith",
        title: "Car Locksmith",
        icon: "car",
        summary:
          "From a key broken off in the door to a fob that won't sync, we handle the full range of vehicle lock and key problems.",
      },
      {
        slug: "ignition-repair-replacement",
        title: "Ignition Repair & Replacement",
        icon: "gauge",
        summary:
          "If your key won't turn or the ignition feels loose, we can repair or replace the ignition cylinder and match it to your keys.",
      },
    ],
  },
];

/** Href for a sub-service, honouring services that live on their own page. */
export function serviceHref(category: CategorySlug, service: SubService) {
  return service.href ?? `/services/${category}/${service.slug}`;
}

export function getCategory(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getSubService(categorySlug: string, serviceSlug: string) {
  const category = getCategory(categorySlug);
  const service = category?.services.find((s) => s.slug === serviceSlug && !s.href);
  return category && service ? { category, service } : undefined;
}

/** Every sub-service that has its own page under /services. */
export function allSubServicePages() {
  return categories.flatMap((category) =>
    category.services
      .filter((service) => !service.href)
      .map((service) => ({ category, service })),
  );
}

export const servicesPage = {
  title: "Our Services",
  intro:
    "Lock and key help for homes, businesses, and vehicles across Midland, Odessa, Lubbock, and Amarillo. Pick a service to learn more, or call and tell us what's going on.",
  tiles: [
    { label: "Residential", href: "/services/residential", icon: "house" },
    { label: "Commercial", href: "/services/commercial", icon: "building" },
    { label: "Automotive", href: "/services/automotive", icon: "car" },
    { label: "Locksmith Services", href: "/services", icon: "wrench" },
    { label: "Lock Rekey", href: "/services/residential/lock-rekey", icon: "key-round" },
    { label: "Car Key Replacement", href: "/car-key-replacement", icon: "key" },
    { label: "Emergency Lockouts", href: "/services/residential/emergency-lockout", icon: "siren" },
    { label: "Lock Change", href: "/services/residential/lock-installation", icon: "lock-keyhole" },
  ] satisfies { label: string; href: string; icon: IconName }[],
};

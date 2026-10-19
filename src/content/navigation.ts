export type NavItem = {
  label: string;
  href: string;
  /** Opens a sub-menu on desktop and an expandable group on mobile. */
  menu?: "services" | "areas";
};

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Car Key Replacement", href: "/car-key-replacement" },
  { label: "Our Services", href: "/services", menu: "services" },
  { label: "Service Areas", href: "/service-areas", menu: "areas" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export const quoteHref = "/contact";

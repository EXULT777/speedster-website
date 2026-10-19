"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Renders the public site's header, footer, action bar and smooth scrolling
 * everywhere except the /admin page, which has its own simple layout.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return pathname?.startsWith("/admin") ? null : children;
}

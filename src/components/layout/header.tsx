"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Clock, Mail, MapPin, Menu, Phone, X } from "lucide-react";
import { cities } from "@/content/areas";
import { mainNav, quoteHref, type NavItem } from "@/content/navigation";
import { categories, serviceHref } from "@/content/services";
import { site } from "@/content/site";
import { ButtonLink, CallButton } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/cn";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

const noopSubscribe = () => () => {};

/** False during server render and hydration, true once running in the browser. */
function useIsClient() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

/** True when a click landed on (or inside) a link. */
function isLinkClick(event: ReactMouseEvent<HTMLElement>) {
  return Boolean((event.target as HTMLElement).closest("a"));
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      data-scrolled={scrolled ? "" : undefined}
      className={cn(
        "sticky top-0 z-40 -mb-[var(--header-h)] h-[var(--header-h)] transition-[background-color,box-shadow,border-color] duration-300",
        "border-b border-transparent",
        scrolled && "border-white/5 bg-graphite/85 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.8)] backdrop-blur-lg",
      )}
    >
      <div className="container-x relative flex h-full items-center justify-between gap-4">
        <div className="hidden xl:block">
          <Logo height={scrolled ? 48 : 56} eager className="transition-[width] duration-300" />
        </div>
        <div className="xl:hidden">
          <Logo height={44} eager />
        </div>

        <nav aria-label="Main" className="hidden h-full xl:block">
          <ul className="flex h-full items-center gap-0.5">
            {mainNav.map((item) =>
              item.menu ? (
                <NavMenu key={item.href} item={item} active={isActive(pathname, item.href)} />
              ) : (
                <li key={item.href} className="flex h-full items-center">
                  <NavLink href={item.href} active={isActive(pathname, item.href)}>
                    {item.label}
                  </NavLink>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-2.5">
          <CallButton size="sm" pulse className="hidden md:inline-flex" />
          <ButtonLink href={quoteHref} variant="ghost" size="sm" className="hidden md:inline-flex">
            Get a Quote
          </ButtonLink>
          <a
            href={site.phone.href}
            className="grid size-11 place-items-center rounded-lg bg-red text-white shadow-[0_8px_20px_-8px_rgb(229_8_15/0.8)] md:hidden"
          >
            <Phone aria-hidden="true" className="size-5" strokeWidth={2.25} />
            <span className="sr-only">Call {site.phone.display}</span>
          </a>
          <MobileMenu pathname={pathname} />
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group relative flex min-h-11 items-center whitespace-nowrap px-2.5 text-[0.8125rem] font-semibold uppercase tracking-[0.06em] transition-colors",
        active ? "text-fg" : "text-chrome-2 hover:text-fg",
      )}
    >
      {children}
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-2.5 bottom-1.5 h-[3px] origin-left -skew-x-[30deg] bg-red transition-transform duration-300",
          active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
        )}
      />
    </Link>
  );
}

/** Desktop disclosure menu: link to the section plus a toggle for its sub-menu. */
function NavMenu({ item, active }: { item: NavItem; active: boolean }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLLIElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const openedByHover = useRef(false);
  const wide = item.menu === "services";

  const show = () => {
    window.clearTimeout(closeTimer.current);
    if (!open) openedByHover.current = true;
    setOpen(true);
  };
  const hideSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      openedByHover.current = false;
      setOpen(false);
    }, 160);
  };

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const onKeyDown = (event: ReactKeyboardEvent) => {
    if (event.key === "Escape" && open) {
      event.stopPropagation();
      setOpen(false);
      toggleRef.current?.focus();
    }
  };

  return (
    <li
      ref={rootRef}
      className={cn("flex h-full items-center", wide ? "static" : "relative")}
      onPointerEnter={(e) => e.pointerType === "mouse" && show()}
      onPointerLeave={(e) => e.pointerType === "mouse" && hideSoon()}
      onKeyDown={onKeyDown}
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <NavLink href={item.href} active={active}>
        {item.label}
      </NavLink>
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          // A mouse click right after hovering should keep the menu open, not toggle it shut.
          if (openedByHover.current) {
            openedByHover.current = false;
            setOpen(true);
          } else {
            setOpen((v) => !v);
          }
        }}
        className="-ml-3 grid size-11 place-items-center rounded-md text-chrome-2 transition-colors hover:text-fg"
      >
        <span className="sr-only">{item.label} menu</span>
        <ChevronDown
          aria-hidden="true"
          className={cn("size-4 transition-transform duration-300", open && "rotate-180")}
          strokeWidth={2.25}
        />
      </button>

      <div
        id={panelId}
        onClick={(e) => isLinkClick(e) && setOpen(false)}
        className={cn(
          "absolute top-full pt-2",
          wide ? "inset-x-0" : "left-0 w-72",
          open
            ? "visible translate-y-0 opacity-100 [transition:opacity_200ms,transform_200ms,visibility_0s]"
            : "pointer-events-none invisible -translate-y-2 opacity-0 [transition:opacity_200ms,transform_200ms,visibility_0s_200ms]",
        )}
      >
        {item.menu === "services" ? <ServicesPanel /> : <AreasPanel />}
      </div>
    </li>
  );
}

function ServicesPanel() {
  return (
    <div className="container-x">
      <div className="relative grid grid-cols-[1fr_1fr_1fr_16rem] gap-8 overflow-hidden rounded-xl border border-white/8 bg-graphite p-8 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)]">
        <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-linear-to-r from-red via-red-glow to-transparent" />
        {categories.map((category) => (
          <div key={category.slug}>
            <Link
              href={`/services/${category.slug}`}
              className="group mb-4 flex items-center gap-2.5 font-display text-lg font-extrabold uppercase italic tracking-wide text-fg"
            >
              <Icon name={category.icon} className="size-5 text-red-glow" />
              {category.name}
              <span className="sr-only"> locksmith services</span>
            </Link>
            <ul className="space-y-0.5">
              {category.services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={serviceHref(category.slug, service)}
                    className="flex min-h-9 items-center rounded-md px-2 -mx-2 text-[0.95rem] text-chrome-2 transition-colors hover:bg-white/5 hover:text-fg"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="flex flex-col justify-between gap-5 rounded-lg border border-white/5 bg-ink p-5">
          <div>
            <p className="eyebrow mb-3">Locked out?</p>
            <p className="text-[0.95rem] leading-relaxed text-muted">
              Call now and we&apos;ll get a technician moving your way.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <CallButton size="sm" />
            <Link href="/services" className="text-sm font-semibold text-red-glow underline-offset-4 hover:underline">
              View all services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function AreasPanel() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/8 bg-graphite p-3 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9)]">
      <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[3px] bg-linear-to-r from-red via-red-glow to-transparent" />
      <ul>
        {cities.map((city) => (
          <li key={city.slug}>
            <Link
              href={`/service-areas/${city.slug}`}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/5"
            >
              <MapPin aria-hidden="true" className="size-4 shrink-0 text-red-glow" />
              <span>
                <span className="block font-semibold text-fg">{city.name}, TX</span>
                <span className="block text-sm text-muted">{city.county}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/service-areas"
        className="mt-1 flex min-h-11 items-center justify-center rounded-lg border-t border-white/5 text-sm font-semibold text-red-glow hover:underline"
      >
        All service areas
      </Link>
    </div>
  );
}

/**
 * Full-screen menu for phones and tablets. The panel is portalled to <body>:
 * inside the sticky, blurred header it would be clipped to the header's box
 * and sit underneath the top bar and the mobile action bar.
 */
function MobileMenu({ pathname }: { pathname: string }) {
  const isClient = useIsClient();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const restoreFocus = useRef(false);

  const close = (refocus: boolean) => {
    restoreFocus.current = refocus;
    setOpen(false);
  };

  useEffect(() => {
    if (!open) {
      if (restoreFocus.current) triggerRef.current?.focus();
      restoreFocus.current = false;
      return;
    }
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() =>
      panelRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus(),
    );

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        restoreFocus.current = true;
        setOpen(false);
      }
      if (event.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(focusFrame);
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
        className="grid size-11 place-items-center rounded-lg border border-white/10 bg-white/5 text-fg xl:hidden"
      >
        <Menu aria-hidden="true" className="size-5" />
        <span className="sr-only">Open menu</span>
      </button>

      {isClient &&
        createPortal(
          <div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            data-lenis-prevent=""
            inert={!open}
            className={cn(
              "fixed inset-0 z-[60] flex flex-col bg-ink xl:hidden",
              open
                ? "visible opacity-100 [transition:opacity_300ms,visibility_0s]"
                : "invisible opacity-0 [transition:opacity_300ms,visibility_0s_300ms]",
            )}
          >
            <div className="bg-carbon-fiber pointer-events-none absolute inset-0" aria-hidden="true" />
            <div className="container-x relative flex h-[var(--header-h)] shrink-0 items-center justify-between border-b border-white/5">
              <Logo height={44} />
              <button
                type="button"
                onClick={() => close(true)}
                className="grid size-11 place-items-center rounded-lg border border-white/10 bg-white/5 text-fg"
                data-autofocus=""
              >
                <X aria-hidden="true" className="size-5" />
                <span className="sr-only">Close menu</span>
              </button>
            </div>

            <div className="relative flex-1 overflow-y-auto overscroll-contain" onClick={(e) => isLinkClick(e) && close(false)}>
              <div className="container-x py-6">
                <a
                  href={site.phone.href}
                  className="card glow-red flex items-center gap-4 p-4"
                >
                  <span className="icon-chip shrink-0">
                    <Phone aria-hidden="true" className="size-5" strokeWidth={2.25} />
                  </span>
                  <span>
                    <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-red-glow">
                      Tap to call
                    </span>
                    <span className="display block text-[1.75rem] leading-tight">{site.phone.display}</span>
                  </span>
                </a>
                <p className="mt-3 flex items-center gap-2 text-sm text-muted">
                  <Clock aria-hidden="true" className="size-4 text-red-glow" />
                  {site.hours.label}
                </p>

                <nav aria-label="Mobile" className="mt-6">
                  <ul className="divide-y divide-white/5 border-y border-white/5">
                    {mainNav.map((item) =>
                      item.menu ? (
                        <li key={item.href}>
                          <MobileGroup item={item} active={isActive(pathname, item.href)} />
                        </li>
                      ) : (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            aria-current={isActive(pathname, item.href) ? "page" : undefined}
                            className="display flex min-h-14 items-center text-2xl text-chrome-1 aria-[current=page]:text-red-glow"
                          >
                            {item.label}
                          </Link>
                        </li>
                      ),
                    )}
                  </ul>
                </nav>

                <div className="mt-8 grid gap-3">
                  <ButtonLink href={quoteHref} variant="ghost" size="lg" className="btn-block">
                    Get a Quote
                  </ButtonLink>
                  <a
                    href={site.email.href}
                    className="flex min-h-11 items-center justify-center gap-2 text-sm text-muted hover:text-fg"
                  >
                    <Mail aria-hidden="true" className="size-4 text-red-glow" />
                    {site.email.display}
                  </a>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function MobileGroup({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <details className="faq-item group" name="mobile-nav">
      <summary className="display flex min-h-14 items-center justify-between text-2xl text-chrome-1">
        <span className={cn(active && "text-red-glow")}>{item.label}</span>
        <ChevronDown aria-hidden="true" className="size-6 text-chrome-3 transition-transform group-open:rotate-180" />
      </summary>
      <div className="pb-5">
        {item.menu === "services" ? (
          <div className="grid gap-5">
            {categories.map((category) => (
              <div key={category.slug}>
                <Link
                  href={`/services/${category.slug}`}
                  className="flex min-h-11 items-center gap-2 font-bold uppercase tracking-wide text-fg"
                >
                  <Icon name={category.icon} className="size-5 text-red-glow" />
                  {category.name}
                </Link>
                <ul className="ml-7 border-l border-white/10 pl-4">
                  {category.services.map((service) => (
                    <li key={service.slug}>
                      <Link
                        href={serviceHref(category.slug, service)}
                        className="flex min-h-11 items-center text-chrome-2"
                      >
                        {service.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <Link href="/services" className="flex min-h-11 items-center font-semibold text-red-glow">
              View all services
            </Link>
          </div>
        ) : (
          <ul>
            {cities.map((city) => (
              <li key={city.slug}>
                <Link
                  href={`/service-areas/${city.slug}`}
                  className="flex min-h-12 items-center gap-3 text-lg text-chrome-1"
                >
                  <MapPin aria-hidden="true" className="size-5 text-red-glow" />
                  {city.name}, TX
                </Link>
              </li>
            ))}
            <li>
              <Link href="/service-areas" className="flex min-h-11 items-center font-semibold text-red-glow">
                All service areas
              </Link>
            </li>
          </ul>
        )}
      </div>
    </details>
  );
}

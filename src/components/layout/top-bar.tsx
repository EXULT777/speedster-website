import { Clock, Phone, ShieldCheck, Zap } from "lucide-react";
import { licenseLine, site, topBar } from "@/content/site";

export function TopBar() {
  return (
    <div className="relative z-50 border-b border-white/5 bg-carbon text-[0.8125rem]">
      <div className="container-x flex h-[var(--topbar-h)] items-center justify-between gap-4">
        <p className="hidden items-center gap-2 text-muted lg:flex">
          <Zap aria-hidden="true" className="size-3.5 text-red-glow" strokeWidth={2.25} />
          {topBar.message}
        </p>

        <div className="flex w-full items-center justify-between gap-5 lg:w-auto lg:justify-end">
          <p className="flex items-center gap-1.5 text-muted">
            <Clock aria-hidden="true" className="size-3.5 text-red-glow" strokeWidth={2.25} />
            <span className="sm:hidden">{site.hours.short}</span>
            <span className="hidden sm:inline">{site.hours.label}</span>
          </p>

          {licenseLine && (
            <p className="hidden items-center gap-1.5 text-muted md:flex">
              <ShieldCheck aria-hidden="true" className="size-3.5 text-red-glow" strokeWidth={2.25} />
              {licenseLine}
            </p>
          )}

          <a
            href={site.phone.href}
            className="flex min-h-11 items-center gap-1.5 font-bold tracking-wide text-fg transition-colors hover:text-red-glow"
          >
            <Phone aria-hidden="true" className="size-3.5 text-red-glow" strokeWidth={2.5} />
            {site.phone.display}
          </a>
        </div>
      </div>
    </div>
  );
}

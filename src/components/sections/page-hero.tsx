import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CallButton, ButtonLink } from "@/components/ui/button";
import { SpeedStreaks } from "@/components/sections/speed-streaks";
import { quoteHref } from "@/content/navigation";
import type { Crumb } from "@/lib/schema";
import { cn } from "@/lib/cn";

type Props = {
  title: ReactNode;
  eyebrow?: string;
  intro?: ReactNode;
  crumbs?: Crumb[];
  /** Replaces the default Call / Get a Quote buttons. */
  actions?: ReactNode;
  /** Optional visual for the right-hand column on large screens. */
  aside?: ReactNode;
  className?: string;
};

/** Top-of-page hero for inner pages. Holds the page's only H1. */
export function PageHero({ title, eyebrow, intro, crumbs, actions, aside, className }: Props) {
  return (
    <section
      className={cn(
        "bg-carbon-fiber relative overflow-hidden bg-ink pb-10 pt-[calc(var(--header-h)+1.25rem)] md:pb-20 md:pt-[calc(var(--header-h)+3.5rem)]",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgb(229_8_15/0.22),transparent_55%),radial-gradient(ellipse_at_10%_100%,rgb(176_10_16/0.18),transparent_50%)]"
      />
      <SpeedStreaks count={6} className="opacity-60" />
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent" />

      <div className={cn("container-x relative", Boolean(aside) && "grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]")}>
        <div className="max-w-3xl">
          {crumbs && <Breadcrumbs items={crumbs} />}
          {eyebrow && <p className="eyebrow mb-3 md:mb-4">{eyebrow}</p>}
          <h1 className="display h1">{title}</h1>
          {intro && <div className="mt-4 max-w-2xl leading-relaxed text-chrome-2 md:mt-6 md:text-xl">{intro}</div>}
          <div className="mt-6 flex flex-wrap gap-2.5 md:mt-8 md:gap-3">
            {actions ?? (
              <>
                <CallButton size="lg" pulse />
                <ButtonLink href={quoteHref} variant="ghost" size="lg">
                  Get a Quote
                </ButtonLink>
              </>
            )}
          </div>
        </div>
        {aside && <div className="relative hidden lg:block">{aside}</div>}
      </div>
    </section>
  );
}

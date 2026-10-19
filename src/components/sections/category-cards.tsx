import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { categories } from "@/content/services";
import { cn } from "@/lib/cn";

/** Residential / Commercial / Automotive cards linking to each category. */
export function CategoryCards({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div className={className}>
      {/* Phones: 2 columns with the third card full width, so nothing needs a sideways swipe. */}
      <ul className="grid grid-cols-2 gap-3 [&>:last-child:nth-child(odd)]:col-span-2 md:[&>:last-child:nth-child(odd)]:col-span-1 md:grid-cols-3 md:gap-5">
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              href={`/services/${category.slug}`}
              className={cn("card card-hover group flex h-full flex-col", compact ? "p-4 md:p-6" : "p-4 md:p-8")}
            >
              <span
                className={cn(
                  "relative mb-3 grid place-items-center rounded-xl border border-white/8 bg-ink md:mb-6",
                  compact ? "size-14 md:size-16" : "size-14 md:size-24",
                )}
              >
                <span aria-hidden="true" className="absolute inset-3 rounded-full bg-red/25 blur-xl" />
                <Icon
                  name={category.icon}
                  className={cn("relative text-chrome-1 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110", compact ? "size-7 md:size-8" : "size-7 md:size-11")}
                  strokeWidth={1.5}
                />
              </span>
              <h3 className="display h3">{category.name}</h3>
              {!compact && <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-muted md:mt-3 md:text-base">{category.summary}</p>}
              <span className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-semibold uppercase tracking-wide text-red-glow md:mt-6 md:text-base">
                Learn more<span className="sr-only"> about {category.footerLabel.toLowerCase()}</span>
                <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import { serviceHref, type ServiceCategory, type SubService } from "@/content/services";
import { cn } from "@/lib/cn";

/** Cards for a category's sub-services. */
export function ServiceGrid({
  category,
  services = category.services,
  className,
}: {
  category: ServiceCategory;
  services?: SubService[];
  className?: string;
}) {
  return (
    <ul className={cn("grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3", className)}>
      {services.map((service) => (
        <li key={service.slug}>
          <Link href={serviceHref(category.slug, service)} className="card card-hover group flex h-full flex-col p-4 md:p-6">
            <span className="icon-chip mb-3 md:mb-5">
              <Icon name={service.icon} className="size-5 md:size-6" />
            </span>
            <h3 className="display text-base leading-tight md:text-xl">{service.title}</h3>
            <p className="mt-1.5 line-clamp-4 flex-1 text-[0.8125rem] leading-snug text-muted md:mt-2.5 md:line-clamp-none md:text-base md:leading-relaxed">{service.summary}</p>
            <span className="mt-2 inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-red-glow md:mt-5 md:gap-2 md:text-sm">
              <span className="md:hidden">Details<span className="sr-only"> about {service.title.toLowerCase()}</span></span>
              <span className="hidden md:inline">
                {service.href ? "See car key replacement" : `About ${service.title.toLowerCase()}`}
              </span>
              <ArrowRight aria-hidden="true" className="size-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

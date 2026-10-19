import { Icon } from "@/components/ui/icon";
import { pillars } from "@/content/home";
import { cn } from "@/lib/cn";

/** The six pillars (Professional, Certified, …). Used on Home and About. */
export function PillarsGrid({ className }: { className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-3", className)}>
      {pillars.map((pillar) => (
        <li key={pillar.title} className="card p-4 md:flex md:gap-5 md:p-6">
          <span className="icon-chip mb-3 md:mb-0">
            <Icon name={pillar.icon} className="size-5 md:size-6" />
          </span>
          <div>
            <h3 className="display text-base md:text-xl">{pillar.title}</h3>
            <p className="mt-1.5 text-[0.8125rem] leading-snug text-muted md:mt-2 md:text-base md:leading-relaxed">{pillar.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

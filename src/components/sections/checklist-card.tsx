import { CircleCheck } from "lucide-react";
import { cn } from "@/lib/cn";

export function ChecklistCard({
  heading,
  items,
  note,
  id,
  as: Heading = "h2",
  className,
}: {
  heading: string;
  items: string[];
  note?: string;
  id?: string;
  /** Use h3 when the card sits inside a section that already has an h2. */
  as?: "h2" | "h3";
  className?: string;
}) {
  return (
    <div className={cn("card bg-brushed p-7 md:p-9", className)}>
      <Heading id={id} className="display h3">
        {heading}
      </Heading>
      <ul className="mt-6 space-y-3.5">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-chrome-2">
            <CircleCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-red-glow" />
            {item}
          </li>
        ))}
      </ul>
      {note && <p className="mt-6 border-t border-white/8 pt-5 text-sm text-muted">{note}</p>}
    </div>
  );
}

import { KeyRound } from "lucide-react";
import { keyTypes, type KeyTypeId } from "@/content/car-keys";
import { cn } from "@/lib/cn";

/** List of key types; pass `only` to show a subset (brand pages). */
export function KeyTypesList({ only, className }: { only?: KeyTypeId[]; className?: string }) {
  const items = only ? keyTypes.filter((k) => only.includes(k.id)) : keyTypes;
  return (
    <ul className={cn("grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3", className)}>
      {items.map((key) => (
        <li key={key.id} className="card p-4 md:p-6">
          <KeyRound aria-hidden="true" className="mb-3 size-6 text-red-glow md:mb-4 md:size-7" strokeWidth={1.5} />
          <h3 className="display text-base leading-tight md:text-xl">{key.name}</h3>
          <p className="mt-1.5 text-[0.8125rem] leading-snug text-muted md:mt-2 md:text-base md:leading-relaxed">{key.description}</p>
        </li>
      ))}
    </ul>
  );
}

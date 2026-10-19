import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "ink" | "carbon";

type SectionProps = {
  id?: string;
  tone?: Tone;
  texture?: "carbon" | "brushed" | "none";
  className?: string;
  containerClassName?: string;
  children: ReactNode;
  "aria-labelledby"?: string;
  "aria-label"?: string;
};

export function Section({
  id,
  tone = "ink",
  texture = "none",
  className,
  containerClassName,
  children,
  ...rest
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={rest["aria-labelledby"]}
      aria-label={rest["aria-label"]}
      className={cn(
        "relative py-12 md:py-24",
        tone === "carbon" ? "bg-carbon" : "bg-ink",
        texture === "carbon" && "bg-carbon-fiber",
        texture === "brushed" && "bg-brushed",
        className,
      )}
    >
      <div className={cn("container-x relative", containerClassName)}>{children}</div>
    </section>
  );
}

type HeadingProps = {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  className?: string;
  /** Heading level; sections use h2 by default. */
  as?: "h1" | "h2";
};

export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  align = "left",
  className,
  as: Tag = "h2",
}: HeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <p className={cn("eyebrow mb-3 md:mb-4", align === "center" && "justify-center")}>{eyebrow}</p>}
      <Tag id={id} className={cn("display", Tag === "h1" ? "h1" : "h2")}>
        {title}
      </Tag>
      {intro && <div className="mt-4 leading-relaxed text-muted md:mt-5 md:text-lg">{intro}</div>}
    </div>
  );
}

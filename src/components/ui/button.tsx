import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

type Variant = "primary" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";

const sizeClass: Record<Size, string> = { sm: "btn-sm", md: "", lg: "btn-lg" };

export function buttonClass(variant: Variant = "primary", size: Size = "md", extra?: string) {
  return cn("btn", `btn-${variant}`, sizeClass[size], extra);
}

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  size?: Size;
  className?: string;
  icon?: ReactNode;
  arrow?: boolean;
};

/** Internal navigation styled as a skewed button. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  icon,
  arrow,
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={buttonClass(variant, size, className)} {...props}>
      <span className="btn-label">
        {icon}
        {children}
        {arrow && <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2.25} />}
      </span>
    </Link>
  );
}

type CallButtonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Visible label. Defaults to "Call (432) 216-0108". */
  label?: ReactNode;
  pulse?: boolean;
  /** Extra context for screen readers, e.g. a city name. */
  srContext?: string;
};

/** Click-to-call button. Every call link on the site comes through here. */
export function CallButton({
  variant = "primary",
  size = "md",
  className,
  label,
  pulse = false,
  srContext,
}: CallButtonProps) {
  return (
    <a
      href={site.phone.href}
      className={buttonClass(variant, size, cn(pulse && "btn-pulse", className))}
      data-call-button=""
    >
      <span className="btn-label">
        <Phone aria-hidden="true" className="size-[1.1em]" strokeWidth={2.25} />
        {label ?? <>Call {site.phone.display}</>}
        {srContext && <span className="sr-only"> {srContext}</span>}
      </span>
    </a>
  );
}

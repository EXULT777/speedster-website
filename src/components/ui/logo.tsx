import Image from "next/image";
import Link from "next/link";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
// Imported (not referenced by path) so the URL changes whenever the file does.
import logoImage from "../../../public/brand/logo.png";

type Props = {
  /** Rendered height in px; width follows the logo's aspect ratio. */
  height: number;
  className?: string;
  eager?: boolean;
  /** Wrap in a link to the homepage (default). */
  link?: boolean;
};

export function Logo({ height, className, eager = false, link = true }: Props) {
  const width = Math.round((height * logoImage.width) / logoImage.height);
  const image = (
    <Image
      src={logoImage}
      alt={link ? `${site.name} home` : site.logo.alt}
      width={width}
      height={height}
      sizes={`${width}px`}
      loading={eager ? "eager" : "lazy"}
      className="h-auto w-full select-none"
      draggable={false}
    />
  );

  if (!link) {
    return (
      <span className={cn("inline-block shrink-0", className)} style={{ width }}>
        {image}
      </span>
    );
  }

  return (
    <Link href="/" className={cn("inline-block shrink-0", className)} style={{ width }}>
      {image}
    </Link>
  );
}

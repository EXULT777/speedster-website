import Link from "next/link";
import { FileText, Phone } from "lucide-react";
import { quoteHref } from "@/content/navigation";
import { site } from "@/content/site";

/**
 * Always-visible call / quote bar on phones. The body reserves its height
 * (see .pb-action-bar) so it never covers content or the footer.
 */
export function MobileActionBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-ink/92 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden">
      <div className="grid h-[var(--action-bar-h)] grid-cols-[1.15fr_1fr] gap-2.5 px-3 py-2.5">
        <a
          href={site.phone.href}
          className="flex items-center justify-center gap-2 rounded-xl bg-linear-to-b from-red to-red-deep font-bold uppercase tracking-wide text-white shadow-[0_8px_24px_-10px_rgb(229_8_15/0.9),inset_0_1px_0_rgb(255_255_255/0.25)] active:scale-[0.98]"
        >
          <Phone aria-hidden="true" className="size-5" strokeWidth={2.25} />
          Call Now
          <span className="sr-only">{site.phone.display}</span>
        </a>
        <Link
          href={quoteHref}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-graphite font-bold uppercase tracking-wide text-fg active:scale-[0.98]"
        >
          <FileText aria-hidden="true" className="size-5 text-red-glow" strokeWidth={2} />
          Get a Quote
        </Link>
      </div>
    </div>
  );
}

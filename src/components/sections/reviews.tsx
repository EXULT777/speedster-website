import { Quote, Star } from "lucide-react";
import { buttonClass } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section";
import { site, type Review } from "@/content/site";
import { cn } from "@/lib/cn";

/** Set on the SVG itself so the colour never depends on generated CSS. */
const STAR_COLOR = "#fbbf24";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "2026-10-05" → "October 5, 2026", without Date so the page stays static. */
function formatDate(iso: string) {
  const [year, month, day] = iso.split("-").map(Number);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const AVATARS = [
  "bg-gradient-to-br from-red to-red-deep text-white",
  "bg-gradient-to-br from-chrome-1 to-chrome-3 text-ink",
  "bg-graphite text-red-glow ring-1 ring-red/50",
];

function Stars({ rating, className }: { rating: number; className?: string }) {
  return (
    <span
      className="flex gap-1"
      role="img"
      aria-label={`${rating} out of 5 stars`}
      style={{ filter: "drop-shadow(0 0 6px rgb(251 191 36 / 0.35))" }}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={className}
          color={i < rating ? STAR_COLOR : "#3a3c42"}
          fill={i < rating ? STAR_COLOR : "transparent"}
          strokeWidth={1.5}
        />
      ))}
    </span>
  );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <li className="card flex w-[17.5rem] shrink-0 flex-col p-5 md:w-[23rem] md:p-6">
      <span
        aria-hidden="true"
        className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[#fbbf24]/60 to-transparent"
      />
      <div className="flex items-center gap-3.5">
        <span
          aria-hidden="true"
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-full font-display text-[0.95rem] font-black italic shadow-lg",
            AVATARS[index % AVATARS.length],
          )}
        >
          {initials(review.author)}
        </span>
        <div className="min-w-0">
          <p className="truncate font-semibold leading-tight">
            {review.author}
            {review.source && <span className="font-normal text-muted"> · {review.source}</span>}
          </p>
          {review.date && (
            <time dateTime={review.date} className="mt-0.5 block text-sm text-muted">
              {formatDate(review.date)}
            </time>
          )}
        </div>
        <Quote aria-hidden="true" className="ml-auto size-8 shrink-0 fill-red/15 text-red/40" />
      </div>

      <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-chrome-2 md:text-base">
        {review.text}
      </blockquote>

      {review.rating && (
        <div className="mt-5 border-t border-white/[0.06] pt-4">
          <Stars rating={review.rating} className="size-[1.15rem]" />
        </div>
      )}
    </li>
  );
}

/** Renders only when site.reviews holds real customer reviews. */
export function Reviews() {
  const reviews = [...site.reviews].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));
  if (reviews.length === 0) return null;

  // Computed from the reviews themselves, never typed in.
  const rated = reviews.filter((r) => r.rating);
  const average = rated.length ? rated.reduce((sum, r) => sum + (r.rating ?? 0), 0) / rated.length : 0;

  // The list is drawn twice so the -50% marquee loop is seamless; the copy is hidden from screen readers.
  const row = (copy: boolean) => (
    <ul
      aria-hidden={copy || undefined}
      className={cn("flex shrink-0 gap-3 pr-3 md:gap-6 md:pr-6", copy && "motion-reduce:hidden")}
    >
      {reviews.map((review, i) => (
        <ReviewCard key={`${review.author}-${review.date ?? ""}`} review={review} index={i} />
      ))}
    </ul>
  );

  return (
    <section aria-labelledby="reviews-heading" className="bg-carbon-fiber relative overflow-clip bg-carbon py-12 md:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 size-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(229_8_15/0.14),transparent)]"
      />

      <div className="container-x relative">
        <SectionHeading id="reviews-heading" eyebrow="Reviews" title="What customers say" align="center" />
        {rated.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 md:mt-6">
            <span className="display text-chrome text-3xl leading-none md:text-4xl">{average.toFixed(1)}</span>
            <Stars rating={Math.round(average)} className="size-5 md:size-6" />
            <span className="text-sm text-muted md:text-base">
              from {site.reviewsTotal || reviews.length} customer reviews
            </span>
          </div>
        )}
      </div>

      {/* A slow marquee; phones run it a little faster as their cards are narrower. */}
      <div className="relative mt-7 overflow-hidden py-2 motion-reduce:overflow-x-auto md:mt-14 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="flex w-max items-stretch motion-safe:animate-[marquee_80s_linear_infinite_reverse] md:motion-safe:animate-[marquee_110s_linear_infinite_reverse]">
          {row(false)}
          {row(true)}
        </div>
      </div>

      {site.googleReviewUrl && (
        <div className="container-x relative mt-7 flex justify-center md:mt-12">
          <a href={site.googleReviewUrl} target="_blank" rel="noopener" className={buttonClass("ghost", "md")}>
            <span className="btn-label">
              <Star aria-hidden="true" className="size-4" strokeWidth={2.25} />
              Leave us a review on Google
            </span>
          </a>
        </div>
      )}
    </section>
  );
}

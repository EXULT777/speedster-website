import { Icon } from "@/components/ui/icon";
import { featureCards } from "@/content/home";

/** Three cards that overlap the bottom edge of the hero. */
export function FeatureCards() {
  return (
    <section aria-label="Why customers call us" className="relative z-10 -mt-8 md:-mt-32">
      <div className="container-x">
        {/* Phones: 2 columns with the third card full width, so nothing needs a sideways swipe. */}
        <ul className="grid grid-cols-2 gap-3 [&>:last-child:nth-child(odd)]:col-span-2 md:[&>:last-child:nth-child(odd)]:col-span-1 md:grid-cols-3 md:gap-5">
          {featureCards.map((card) => (
            <li key={card.title} className="card p-4 md:p-8">
              <div>
                <span className="icon-chip mb-3 md:mb-6">
                  <Icon name={card.icon} className="size-5 md:size-6" />
                </span>
                <h2 className="display h3">{card.title}</h2>
              </div>
              <p className="mt-3 text-[0.9rem] leading-relaxed text-muted md:mt-3 md:text-base">{card.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

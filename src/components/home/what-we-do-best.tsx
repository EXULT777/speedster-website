import { Icon } from "@/components/ui/icon";
import { Section, SectionHeading } from "@/components/ui/section";
import { whatWeDoBest } from "@/content/home";

export function WhatWeDoBest() {
  return (
    <Section aria-labelledby="best-heading">
      <SectionHeading id="best-heading" eyebrow={whatWeDoBest.eyebrow} title={whatWeDoBest.heading} />
      <ul className="mt-6 grid grid-cols-2 gap-3 md:mt-12 md:gap-4 lg:grid-cols-4">
        {whatWeDoBest.cards.map((card) => (
          <li key={card.title} className="card p-4 md:p-6">
            <Icon name={card.icon} className="mb-3 size-7 text-red-glow md:mb-5 md:size-8" strokeWidth={1.5} />
            <div>
              <h3 className="display text-base leading-tight md:text-xl">{card.title}</h3>
              <p className="mt-1.5 text-[0.8125rem] leading-snug text-muted md:mt-2.5 md:text-[0.95rem] md:leading-relaxed">{card.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}

import { Icon } from "@/components/ui/icon";
import { CallButton } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { whyChooseUs } from "@/content/home";

export function WhyChooseUs() {
  return (
    <Section tone="carbon" texture="brushed" aria-labelledby="why-heading">
      <div className="grid gap-8 md:gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
          <p className="eyebrow mb-4">{whyChooseUs.eyebrow}</p>
          <h2 id="why-heading" className="display h2">
            {whyChooseUs.heading}
          </h2>
          <p className="mt-4 leading-relaxed text-muted md:mt-5 md:text-lg">{whyChooseUs.intro}</p>
          <div className="mt-6 md:mt-8">
            <CallButton size="lg" />
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-3 md:gap-5">
          {whyChooseUs.points.map((point) => (
            <li key={point.title} className="card p-4 md:p-7">
              <span className="icon-chip mb-3 md:mb-6">
                <Icon name={point.icon} className="size-5 md:size-6" />
              </span>
              <div>
                <h3 className="display text-base md:text-[1.6rem] md:leading-tight">{point.title}</h3>
                <p className="mt-1.5 text-[0.8125rem] leading-snug text-muted md:mt-3 md:text-base md:leading-relaxed">{point.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

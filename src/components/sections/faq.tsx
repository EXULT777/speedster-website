import { Plus } from "lucide-react";
import { faqHeading, faqs } from "@/content/faq";
import { CallButton } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { JsonLd } from "@/components/seo/json-ld";
import { faqSchema } from "@/lib/schema";

/** FAQ accordion (native <details>, keyboard friendly) plus FAQPage data. */
export function Faq({ tone = "carbon" }: { tone?: "ink" | "carbon" }) {
  return (
    <Section tone={tone} aria-labelledby="faq-heading">
      <div className="grid gap-6 md:gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="eyebrow mb-4">FAQ</p>
          <h2 id="faq-heading" className="display h2">
            {faqHeading}
          </h2>
          <div className="mt-8 hidden lg:block">
            <CallButton size="lg" />
          </div>
        </div>

        <div className="divide-y divide-white/8 border-y border-white/8">
          {faqs.map((item, i) => (
            <details key={item.question} name="faq" className="faq-item group">
              <summary className="flex min-h-14 items-center justify-between gap-4 py-4 text-left md:min-h-16 md:gap-6 md:py-5">
                <h3 className="font-semibold text-fg md:text-xl">
                  <span className="font-display font-black italic text-red-glow">{i + 1}.</span> {item.question}
                </h3>
                <span className="grid size-9 shrink-0 place-items-center rounded-md border border-white/10 bg-white/5 transition-colors group-open:border-red/60 group-open:bg-red/15">
                  <Plus aria-hidden="true" className="faq-icon size-4" strokeWidth={2.5} />
                </span>
              </summary>
              <p className="max-w-2xl pb-5 pr-10 text-[0.95rem] leading-relaxed text-muted md:pb-6 md:pr-12 md:text-base">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
      <JsonLd data={faqSchema(faqs)} />
    </Section>
  );
}

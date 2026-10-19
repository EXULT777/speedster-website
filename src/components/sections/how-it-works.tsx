import { howItWorks } from "@/content/site";
import { Section, SectionHeading } from "@/components/ui/section";
import { cn } from "@/lib/cn";

type Step = { title: string; text: string };

export function HowItWorks({
  heading = howItWorks.heading,
  eyebrow = "How it works",
  steps = howItWorks.steps,
  tone = "ink",
}: {
  heading?: string;
  eyebrow?: string;
  steps?: Step[];
  tone?: "ink" | "carbon";
}) {
  return (
    <Section tone={tone} aria-labelledby="how-heading">
      <SectionHeading id="how-heading" eyebrow={eyebrow} title={heading} />
      <div className="mt-6 md:mt-12">
        {steps.length === 3 ? <Stepper steps={steps} label={heading} /> : <StepCards steps={steps} label={heading} />}
      </div>
    </Section>
  );
}

/**
 * Three steps as a connected stepper: numbered nodes on one red line, so the
 * section reads as a sequence and doesn't look like the card grids around it.
 * All three fit side by side on phones, so nothing needs a sideways swipe.
 */
function Stepper({ steps, label }: { steps: Step[]; label: string }) {
  return (
    <div className="relative">
      {/* The line runs from the first node's centre to the last; the nodes sit on top of it. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-[16.67%] top-5 h-0.5 bg-gradient-to-r from-red via-red-glow to-red md:top-8"
      />
      <ol className="relative grid grid-cols-3 gap-2 md:gap-10" aria-label={label}>
        {steps.map((step, i) => (
          <li key={step.title} className="flex flex-col items-center text-center">
            <span className="grid size-10 place-items-center rounded-full border-2 border-red bg-ink font-display text-lg font-black italic text-fg shadow-[0_10px_28px_-6px_rgb(229_8_15/0.75)] md:size-16 md:text-2xl">
              {i + 1}
            </span>
            <h3 className="display mt-3 text-[0.95rem] leading-tight md:mt-6 md:text-2xl">{step.title}</h3>
            <p className="mt-1.5 text-xs leading-snug text-muted md:mt-3 md:max-w-xs md:text-base md:leading-relaxed">
              {step.text}
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Four or more steps as cards: 2 columns on phones (an odd last step spans both), so nothing needs a sideways swipe. */
function StepCards({ steps, label }: { steps: Step[]; label: string }) {
  return (
    <ol
      className={cn(
        "grid grid-cols-2 gap-3 [&>:last-child:nth-child(odd)]:col-span-2 md:[&>:last-child:nth-child(odd)]:col-span-1 md:gap-5",
        steps.length === 4 ? "lg:grid-cols-4" : "md:grid-cols-3",
      )}
      aria-label={label}
    >
      {steps.map((step, i) => (
        <li key={step.title} className="card relative p-4 md:p-7">
          <span
            aria-hidden="true"
            className="text-chrome display pointer-events-none absolute right-5 top-4 hidden text-[4.5rem] leading-none opacity-15 md:block"
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <div>
            <span className="icon-chip mb-3 font-display text-lg font-black italic md:mb-6">
              <span className="inline-block skew-x-[10deg]">{i + 1}</span>
            </span>
            <h3 className="display h3">{step.title}</h3>
          </div>
          <p className="mt-3 text-[0.9rem] leading-relaxed text-muted md:text-base">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}

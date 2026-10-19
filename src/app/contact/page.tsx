import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { ContactForm } from "@/components/contact/contact-form";
import { ChecklistCard } from "@/components/sections/checklist-card";
import { CtaBand } from "@/components/sections/cta-band";
import { Faq } from "@/components/sections/faq";
import { PageHero } from "@/components/sections/page-hero";
import { CallButton } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { cityNames } from "@/content/areas";
import { contactPage, privacyPage } from "@/content/pages";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

const path = "/contact";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description:
    `Call Speedster Lock & Key at ${site.phone.display} or send a message. Mobile locksmith service in Midland, Odessa, Lubbock, and Amarillo, daily ${site.hours.shortRange}.`,
  path,
});

function ContactCard({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <li className="card p-4 md:p-6">
      <span className="icon-chip mb-3 md:mb-5">{icon}</span>
      <h2 className="display text-base md:text-xl">{title}</h2>
      <div className="mt-1.5 text-[0.8125rem] leading-snug text-muted md:mt-2 md:text-base md:leading-relaxed">{children}</div>
    </li>
  );
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "Contact Us", path }]}
        title={contactPage.title}
        intro={<p>{contactPage.intro}</p>}
        actions={<CallButton size="lg" pulse />}
      />

      <Section aria-label="Ways to reach us">
        <ul className="grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
          <ContactCard icon={<Phone aria-hidden="true" className="size-5 md:size-6" />} title="Call us">
            <a href={site.phone.href} className="display flex min-h-11 items-center whitespace-nowrap text-[1.05rem] text-fg hover:text-red-glow md:text-2xl">
              {site.phone.display}
            </a>
            <p className="mt-2">{contactPage.callNote}</p>
          </ContactCard>
          <ContactCard icon={<Mail aria-hidden="true" className="size-5 md:size-6" />} title="Email us">
            <a href={site.email.href} className="inline-flex min-h-11 items-center font-semibold text-fg underline-offset-4 hover:underline">
              {/* Allow a line break only after the @ on narrow cards. */}
              <span>
                {site.email.display.split("@")[0]}@<wbr />
                {site.email.display.split("@")[1]}
              </span>
            </a>
          </ContactCard>
          <ContactCard icon={<Clock aria-hidden="true" className="size-5 md:size-6" />} title="Hours">
            <p>{site.hours.label}</p>
          </ContactCard>
          <ContactCard icon={<MapPin aria-hidden="true" className="size-5 md:size-6" />} title="Service areas">
            <p>
              {cityNames.join(" · ")}, {site.state.name}
            </p>
          </ContactCard>
        </ul>
      </Section>

      <Section tone="carbon" aria-labelledby="form-heading">
        <div className="grid items-start gap-10 lg:grid-cols-[1.25fr_0.75fr]">
          <div>
            <h2 id="form-heading" className="display h2">
              {contactPage.formHeading}
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{contactPage.formIntro}</p>
            <ContactForm className="mt-8" />
            <p className="mt-4 text-sm text-muted">
              <Link href="/privacy" className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-fg">
                {privacyPage.formLinkText}
              </Link>
            </p>
          </div>
          <ChecklistCard heading={contactPage.checklistHeading} items={contactPage.checklist} />
        </div>
      </Section>

      <CtaBand />
      <Faq />
    </>
  );
}

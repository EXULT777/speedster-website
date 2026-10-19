import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/section";
import { privacyPage } from "@/content/pages";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

const path = "/privacy";

export const metadata: Metadata = pageMetadata({
  title: privacyPage.title,
  description: "How Speedster Lock & Key handles the information you send through this website or when you contact us.",
  path,
});

const linkClass = "font-semibold text-fg underline underline-offset-4";

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: privacyPage.title, path }]}
        title={privacyPage.title}
        intro={
          <>
            <p>{privacyPage.intro}</p>
            <p className="mt-3 text-base text-muted">Last updated {privacyPage.lastUpdated}</p>
          </>
        }
        actions={<></>}
      />

      <Section>
        <div className="max-w-3xl space-y-10 text-lg leading-relaxed text-muted">
          {privacyPage.sections.map((section) => (
            <section key={section.id} aria-labelledby={`privacy-${section.id}`}>
              <h2 id={`privacy-${section.id}`} className="display h3 text-fg">
                {section.heading}
              </h2>
              {section.paragraphs.map((text) => (
                <p key={text} className="mt-3">
                  {text}
                </p>
              ))}
              {section.list && (
                <ul className="mt-3 list-disc space-y-1.5 pl-6 marker:text-red">
                  {section.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
              {section.after &&
                section.after.map((text) => (
                  <p key={text} className="mt-3">
                    {text}
                  </p>
                ))}
            </section>
          ))}

          <section aria-labelledby="privacy-contact">
            <h2 id="privacy-contact" className="display h3 text-fg">
              {privacyPage.contactHeading}
            </h2>
            <p className="mt-3">
              To ask about, correct, or remove information you&apos;ve sent us, email{" "}
              <a href={site.email.href} className={linkClass}>
                {site.email.display}
              </a>{" "}
              or call{" "}
              <a href={site.phone.href} className={linkClass}>
                {site.phone.display}
              </a>
              .
            </p>
          </section>
        </div>
      </Section>
    </>
  );
}

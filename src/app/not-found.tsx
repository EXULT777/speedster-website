import type { Metadata } from "next";
import { House } from "lucide-react";
import { LockoutArt } from "@/components/art/lockout-art";
import { SpeedStreaks } from "@/components/sections/speed-streaks";
import { ButtonLink, CallButton } from "@/components/ui/button";
import { notFoundPage } from "@/content/pages";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="lockout-scene bg-carbon-fiber relative overflow-hidden bg-ink pb-24 pt-[calc(var(--header-h)+3rem)] md:pb-32 md:pt-[calc(var(--header-h)+5rem)]">
      <SpeedStreaks count={6} className="opacity-50" />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="eyebrow mb-4">Error 404</p>
          <h1 className="display h1">{notFoundPage.heading}</h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-chrome-2">{notFoundPage.text}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/" size="lg" className="lockout-trigger" icon={<House aria-hidden="true" className="size-5" />}>
              Back to home
            </ButtonLink>
            <CallButton size="lg" variant="ghost" />
          </div>
        </div>
        <div className="mx-auto w-full max-w-[16rem] md:max-w-sm">
          <LockoutArt />
        </div>
      </div>
    </section>
  );
}

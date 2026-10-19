"use client";

import type { SiteData } from "@/content/site";
import { hoursText, phoneDigits } from "@/lib/business";
import { Field, TabHeading, panelClass } from "./admin-ui";

export type Editor = {
  data: SiteData;
  update: (change: (data: SiteData) => SiteData) => void;
};

/** Problems that block saving, keyed by field. */
export function businessErrors(data: SiteData) {
  const errors: Partial<Record<"phone" | "email" | "opens" | "closes" | "googleReviewUrl", string>> = {};
  if (phoneDigits(data.phone).length !== 10) errors.phone = "Enter a 10-digit US phone number.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = "Enter a valid email address.";
  if (!/^\d\d:\d\d$/.test(data.hours.opens)) errors.opens = "Choose an opening time.";
  if (!/^\d\d:\d\d$/.test(data.hours.closes)) errors.closes = "Choose a closing time.";
  if (data.googleReviewUrl && !/^https:\/\/\S+$/.test(data.googleReviewUrl.trim()))
    errors.googleReviewUrl = "Paste the full link, starting with https://";
  return errors;
}

function formatPhone(input: string) {
  const digits = phoneDigits(input);
  if (digits.length !== 10) return input;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function BusinessTab({ data, update }: Editor) {
  const errors = businessErrors(data);
  const hours = errors.opens || errors.closes ? null : hoursText(data.hours.opens, data.hours.closes);
  const set = <K extends keyof SiteData>(key: K, value: SiteData[K]) => update((d) => ({ ...d, [key]: value }));

  return (
    <section aria-labelledby="business-heading">
      <TabHeading id="business-heading" title="Business info" text="Shown in the header, footer, contact page, call buttons and search listings." />
      <div className={`${panelClass} grid gap-x-5 gap-y-6 p-5 sm:grid-cols-2 md:p-7`}>
        <Field label="Phone number" error={errors.phone} hint="Every call button dials this number.">
          {(props) => (
            <input
              {...props}
              type="tel"
              inputMode="tel"
              value={data.phone}
              onChange={(e) => set("phone", e.target.value)}
              onBlur={(e) => set("phone", formatPhone(e.target.value))}
            />
          )}
        </Field>
        <Field label="Email address" error={errors.email}>
          {(props) => (
            <input {...props} type="email" inputMode="email" value={data.email} onChange={(e) => set("email", e.target.value)} onBlur={(e) => set("email", e.target.value.trim())} />
          )}
        </Field>
        <Field label="Opens at" error={errors.opens}>
          {(props) => (
            <input {...props} type="time" value={data.hours.opens} onChange={(e) => set("hours", { ...data.hours, opens: e.target.value })} />
          )}
        </Field>
        <Field label="Closes at" error={errors.closes} hint="12:00 AM means midnight.">
          {(props) => (
            <input {...props} type="time" value={data.hours.closes} onChange={(e) => set("hours", { ...data.hours, closes: e.target.value })} />
          )}
        </Field>
        {hours && (
          <p className="text-sm text-muted sm:col-span-2">
            The site will say: <span className="font-semibold text-chrome-1">{hours.label}</span>
          </p>
        )}
        <Field label="Texas license number" hint={"Leave empty to hide. When filled in, \u201cTX License #\u2026\u201d shows in the top bar and footer."}>
          {(props) => <input {...props} value={data.licenseNumber} onChange={(e) => set("licenseNumber", e.target.value.trim())} />}
        </Field>
        <Field label="Total customer reviews" hint={"Shown as \u201cfrom 200+ customer reviews\u201d. Only use a real number."}>
          {(props) => <input {...props} value={data.reviewsTotal} onChange={(e) => set("reviewsTotal", e.target.value)} />}
        </Field>
        <Field
          label="Google review link"
          error={errors.googleReviewUrl}
          hint="Optional. The link customers use to leave a Google review."
          className="sm:col-span-2"
        >
          {(props) => (
            <input
              {...props}
              type="url"
              inputMode="url"
              placeholder="https://"
              value={data.googleReviewUrl}
              onChange={(e) => set("googleReviewUrl", e.target.value.trim())}
            />
          )}
        </Field>
      </div>
    </section>
  );
}

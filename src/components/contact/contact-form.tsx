"use client";

import { CircleAlert, CircleCheck, LoaderCircle, Mail, Send } from "lucide-react";
import { useId, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { CallButton, buttonClass } from "@/components/ui/button";
import { contactPage } from "@/content/pages";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { leadsEnabled, saveLead, type LeadInput } from "@/lib/leads";

const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY ?? "";
const WEB3FORMS_URL = "https://api.web3forms.com/submit";

const copy = contactPage.form;

type Values = {
  name: string;
  phone: string;
  email: string;
  city: string;
  service: string;
  vehicle: string;
  message: string;
};
type Field = keyof Values;
type Errors = Partial<Record<Field, string>>;
type Status = "idle" | "sending" | "sent" | "emailed" | "failed";

const empty: Values = { name: "", phone: "", email: "", city: "", service: "", vehicle: "", message: "" };
/** Order used to focus the first field with an error. */
const fieldOrder: Field[] = ["name", "phone", "email", "city", "service", "vehicle", "message"];

const needsVehicle = (service: string) => copy.vehicleServices.includes(service);

/** Formats digits as (432) 216-0108 while typing; drops a leading US 1. */
function formatPhone(input: string) {
  let digits = input.replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("1")) digits = digits.slice(1);
  digits = digits.slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function validate(values: Values): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = "Please enter your name.";
  if (values.phone.replace(/\D/g, "").length !== 10) errors.phone = "Please enter a 10-digit phone number.";
  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Please check your email address, or leave it blank.";
  if (!values.city) errors.city = "Please choose your city.";
  if (!values.service) errors.service = "Please choose the service you need.";
  if (values.message.trim().length < 5) errors.message = "Please tell us a little about what you need.";
  return errors;
}

/** The message as plain lines, shared by the email fallback. */
function summary(values: Values) {
  const details = [
    `Name: ${values.name.trim()}`,
    `Phone: ${values.phone}`,
    values.email.trim() && `Email: ${values.email.trim()}`,
    `City: ${values.city}`,
    `Service needed: ${values.service}`,
    needsVehicle(values.service) && values.vehicle.trim() && `Vehicle: ${values.vehicle.trim()}`,
  ].filter(Boolean);
  return `${details.join("\n")}\n\n${values.message.trim()}`;
}

const subject = (values: Values) => `Website message: ${values.service} in ${values.city}`;

function mailtoHref(values: Values) {
  return `mailto:${site.email.address}?subject=${encodeURIComponent(subject(values))}&body=${encodeURIComponent(summary(values))}`;
}

function leadFrom(values: Values): LeadInput {
  return {
    name: values.name.trim(),
    phone: values.phone,
    email: values.email.trim() || undefined,
    city: values.city,
    service: values.service,
    vehicle: needsVehicle(values.service) ? values.vehicle.trim() || undefined : undefined,
    message: values.message.trim(),
  };
}

async function sendWithWeb3Forms(values: Values) {
  const response = await fetch(WEB3FORMS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: WEB3FORMS_KEY,
      subject: subject(values),
      from_name: site.name,
      ...leadFrom(values),
    }),
  });
  const result = (await response.json().catch(() => null)) as { success?: boolean } | null;
  if (!response.ok || !result?.success) throw new Error("Web3Forms rejected the message");
}

/**
 * Contact form. Sends through Web3Forms when NEXT_PUBLIC_WEB3FORMS_KEY is set,
 * and saves the message for /admin when Firebase is set up (lib/leads.ts).
 * With neither, or if both fail, it opens a pre-filled email in the visitor's
 * own email app instead. Stores nothing in the browser.
 */
export function ContactForm({ className }: { className?: string }) {
  const uid = useId();
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [sentValues, setSentValues] = useState<Values | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const showVehicle = needsVehicle(values.service);

  const fieldId = (field: Field) => `${uid}-${field}`;

  const update = (field: Field) => (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = field === "phone" ? formatPhone(event.target.value) : event.target.value;
    const next = { ...values, [field]: value };
    setValues(next);
    // Once a field has been left (or the form submitted), re-check it as the visitor types.
    if (touched[field]) setErrors((prev) => ({ ...prev, [field]: validate(next)[field] }));
  };

  const blur = (field: Field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validate(values)[field] }));
  };

  const showResult = (next: Status) => {
    setStatus(next);
    // Move focus to the result so screen readers announce it.
    requestAnimationFrame(() => resultRef.current?.focus());
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setTouched(Object.fromEntries(fieldOrder.map((f) => [f, true])));
    const firstInvalid = fieldOrder.find((f) => nextErrors[f]);
    if (firstInvalid) {
      document.getElementById(fieldId(firstInvalid))?.focus();
      return;
    }

    // Honeypot: people never see this field, so anything in it came from a bot.
    const trap = new FormData(event.currentTarget).get("botcheck");
    if (typeof trap === "string" && trap.trim()) {
      showResult("sent");
      return;
    }

    setSentValues(values);
    if (!WEB3FORMS_KEY && !leadsEnabled) {
      window.location.href = mailtoHref(values);
      showResult("emailed");
      return;
    }
    setStatus("sending");
    // Email it and save it for /admin at the same time; either one reaching us is enough.
    const results = await Promise.allSettled([
      WEB3FORMS_KEY ? sendWithWeb3Forms(values) : Promise.reject(),
      leadsEnabled ? saveLead(leadFrom(values)) : Promise.reject(),
    ]);
    if (results.some((result) => result.status === "fulfilled")) {
      showResult("sent");
    } else {
      window.location.href = mailtoHref(values);
      showResult("failed");
    }
  };

  const reset = () => {
    setValues(empty);
    setErrors({});
    setTouched({});
    setSentValues(null);
    setStatus("idle");
    requestAnimationFrame(() => document.getElementById(fieldId("name"))?.focus());
  };

  if (status === "sent" || status === "emailed" || status === "failed") {
    const viaEmail = status !== "sent";
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        role="status"
        className={cn("card p-6 outline-none md:p-9", className)}
      >
        <span className="icon-chip mb-5">
          {viaEmail ? <Mail aria-hidden="true" className="size-5" /> : <CircleCheck aria-hidden="true" className="size-5" />}
        </span>
        <h3 className="display h3">
          {status === "sent" ? copy.successHeading : status === "emailed" ? copy.emailHeading : copy.failedHeading}
        </h3>
        <p className="mt-3 text-lg leading-relaxed text-chrome-2">
          {status === "sent" ? (
            <>
              {copy.success}{" "}
              <a href={site.phone.href} className="font-semibold whitespace-nowrap text-fg underline underline-offset-4">
                {site.phone.display}
              </a>
              .
            </>
          ) : status === "emailed" ? (
            copy.emailText
          ) : (
            copy.failedText
          )}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <CallButton size="lg" pulse />
          {viaEmail && sentValues && (
            <a href={mailtoHref(sentValues)} className={buttonClass("ghost", "lg")}>
              <span className="btn-label">
                <Mail aria-hidden="true" className="size-5" />
                {copy.reopenEmail}
              </span>
            </a>
          )}
        </div>
        {viaEmail && (
          <p className="mt-5 text-sm text-muted">
            Email:{" "}
            <a href={site.email.href} className="font-semibold text-fg underline underline-offset-4">
              {site.email.display}
            </a>
          </p>
        )}
        <button type="button" onClick={reset} className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-muted underline underline-offset-4 hover:text-fg">
          {copy.another}
        </button>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-busy={sending} className={cn("card p-5 md:p-8", className)}>
      <p className="mb-5 text-sm text-muted">
        Fields marked <span className="text-red-glow">*</span> are required.
      </p>
      <div className="grid gap-x-4 gap-y-5 sm:grid-cols-2">
        <FormField id={fieldId("name")} label="Full name" required error={errors.name}>
          {(props) => (
            <input {...props} type="text" name="name" maxLength={120} autoComplete="name" value={values.name} onChange={update("name")} onBlur={blur("name")} />
          )}
        </FormField>
        <FormField id={fieldId("phone")} label="Phone" required error={errors.phone}>
          {(props) => (
            <input
              {...props}
              type="tel"
              name="phone"
              autoComplete="tel-national"
              inputMode="tel"
              placeholder="(432) 555-0123"
              value={values.phone}
              onChange={update("phone")}
              onBlur={blur("phone")}
            />
          )}
        </FormField>
        <FormField id={fieldId("email")} label="Email" error={errors.email} className="sm:col-span-2">
          {(props) => (
            <input {...props} type="email" name="email" maxLength={200} autoComplete="email" inputMode="email" value={values.email} onChange={update("email")} onBlur={blur("email")} />
          )}
        </FormField>
        <FormField id={fieldId("city")} label="City" required error={errors.city}>
          {(props) => (
            <select {...props} name="city" value={values.city} onChange={update("city")} onBlur={blur("city")}>
              <option value="" disabled>
                Choose your city
              </option>
              {copy.cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          )}
        </FormField>
        <FormField id={fieldId("service")} label="Service needed" required error={errors.service}>
          {(props) => (
            <select {...props} name="service" value={values.service} onChange={update("service")} onBlur={blur("service")}>
              <option value="" disabled>
                Choose a service
              </option>
              {copy.services.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </select>
          )}
        </FormField>
        {showVehicle && (
          <FormField id={fieldId("vehicle")} label="Vehicle year, make & model" error={errors.vehicle} className="sm:col-span-2">
            {(props) => (
              <input
                {...props}
                type="text"
                name="vehicle"
                maxLength={120}
                placeholder="e.g. 2016 Ford F-150"
                value={values.vehicle}
                onChange={update("vehicle")}
                onBlur={blur("vehicle")}
              />
            )}
          </FormField>
        )}
        <FormField id={fieldId("message")} label="Message" required error={errors.message} className="sm:col-span-2">
          {(props) => (
            <textarea {...props} name="message" rows={5} maxLength={5000} value={values.message} onChange={update("message")} onBlur={blur("message")} />
          )}
        </FormField>

        {/* Honeypot: hidden from people and screen readers, tempting to bots. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          {/* A name browser autofill doesn't recognise, so real visitors never fill it. */}
          <label>
            Leave this empty
            <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" defaultValue="" />
          </label>
        </div>
      </div>

      <button type="submit" disabled={sending} className={buttonClass("primary", "lg", "mt-7 disabled:cursor-wait disabled:opacity-80")}>
        <span className="btn-label">
          {sending ? (
            <LoaderCircle aria-hidden="true" className="size-5 animate-spin" />
          ) : (
            <Send aria-hidden="true" className="size-5" />
          )}
          {sending ? copy.sending : copy.submit}
        </span>
      </button>
      <p aria-live="polite" className="sr-only">
        {sending ? copy.sending : ""}
      </p>
    </form>
  );
}

type ControlProps = {
  id: string;
  required?: boolean;
  "aria-invalid"?: true;
  "aria-describedby"?: string;
  className: string;
};

function FormField({
  id,
  label,
  required,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: (props: ControlProps) => ReactNode;
}) {
  const errorId = `${id}-error`;
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="text-[0.9375rem] font-semibold text-chrome-1">
        {label}
        {required && (
          <span aria-hidden="true" className="ml-0.5 text-red-glow">
            *
          </span>
        )}
      </label>
      {children({
        id,
        required,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? errorId : undefined,
        className: "form-control",
      })}
      {error && (
        <p id={errorId} className="flex items-start gap-1.5 text-sm text-red-glow">
          <CircleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

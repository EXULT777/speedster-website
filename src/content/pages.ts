/**
 * Copy for the About, Contact, Privacy and 404 pages.
 */

import type { IconName } from "@/components/ui/icon";
import { leadsEnabled } from "@/lib/leads";

export const aboutPage = {
  title: "About Speedster Lock & Key",
  subheading: "Built for speed. Trusted with your security.",
  storyHeading: "Our story",
  story: [
    "Speedster Lock & Key was built around a simple idea: when you're locked out or your keys stop working, you shouldn't be left waiting for help. We're a West Texas locksmith team serving Midland, Odessa, Lubbock, and Amarillo, and we bring our tools, key-cutting equipment, and programming technology directly to you — whether you're at home, at work, or stuck in a parking lot.",
    "Every day we work with homeowners, renters, property managers, business owners, and drivers. Some calls are simple, like a spare key or a lock that keeps sticking. Others are urgent, like a family locked out of the house or a work truck with the keys sitting on the seat. Either way, we handle every call the same way: show up prepared, explain your options clearly, and do the job right.",
  ],
  missionHeading: "Our mission",
  mission:
    "To get you back in — and keep what matters secure — with fast, honest, professional locksmith service.",
  valuesHeading: "What we stand for",
  values: [
    {
      title: "Speed without shortcuts",
      text: "We move quickly because you're waiting, but we never rush the work.",
      icon: "zap",
    },
    {
      title: "Clear communication",
      text: "We explain what's wrong and what we recommend before we start, in plain language.",
      icon: "headset",
    },
    {
      title: "Respect for your property",
      text: "We use careful methods and quality hardware, and we leave your space the way we found it.",
      icon: "house",
    },
    {
      title: "Built for West Texas",
      text: "Long drives, hot summers, and hard-working trucks — we know what local customers need.",
      icon: "truck",
    },
  ] satisfies { title: string; text: string; icon: IconName }[],
  whatWeDoHeading: "What we do",
  whereWeWorkHeading: "Where we work",
};

export const contactPage = {
  title: "Contact Speedster Lock & Key",
  intro:
    "Locked out, need a new key, or planning a security upgrade? Reach out and we'll help you find the fastest way forward.",
  callNote: "The fastest way to reach us, especially for lockouts.",
  formHeading: "Send us a message.",
  formIntro:
    "Tell us what you need and where you are, and we'll get back to you as soon as possible. For lockouts and anything urgent, please call.",
  form: {
    cities: ["Midland", "Odessa", "Lubbock", "Amarillo", "Other nearby"],
    services: ["Residential", "Commercial", "Automotive", "Car key replacement", "Not sure"],
    /** Services that show the vehicle field. */
    vehicleServices: ["Automotive", "Car key replacement"],
    submit: "Send Message",
    sending: "Sending…",
    successHeading: "Message sent",
    success: "Thanks — your message is on its way. If this is urgent, call us now at",
    // Shown when the message goes through the visitor's own email app: nothing
    // has been sent yet, so the copy must not say it has.
    emailHeading: "Your email is ready to send",
    emailText:
      "Your email app should now be open with your message filled in. Press send there to reach us. If nothing opened, email us directly or give us a call.",
    failedHeading: "We couldn't send that directly",
    failedText:
      "Something went wrong on our end, so we've opened your email app with your message filled in instead. Press send there to reach us, or give us a call.",
    reopenEmail: "Open the email again",
    another: "Send another message",
  },
  checklistHeading: "Before you call",
  checklist: [
    "Your exact location",
    "The type of lock, or your vehicle's year, make, and model",
    "Whether you have a working key",
    "Photo ID and proof you own or are authorized to access the property or vehicle",
  ],
};

export const privacyPage = {
  title: "Privacy Policy",
  /** Update this whenever the policy changes. */
  lastUpdated: "October 19, 2026",
  intro:
    "This policy explains what information Speedster Lock & Key receives through this website and when you contact us, and how we use it.",
  formLinkText: "How we handle your information",
  sections: [
    {
      id: "collect",
      heading: "What we collect",
      paragraphs: [
        "When you send a message through our contact form, we receive the details you enter:",
      ],
      list: [
        "Your name and phone number",
        "Your email address, if you give one",
        "Your city and the service you need",
        "Your vehicle's year, make, and model (only for automotive requests)",
        "Your message",
      ],
      after: [
        "When you call, text, or email us, we receive your phone number or email address and whatever you choose to tell us.",
      ],
    },
    {
      id: "use",
      heading: "How we use it",
      paragraphs: [
        "We use your information only to respond to your request: to call you back, answer your questions, give you a quote, and schedule and carry out the work.",
      ],
    },
    {
      id: "delivery",
      heading: "How form messages reach us",
      paragraphs: [
        "Contact form messages are delivered to our email inbox by Web3Forms, a form-delivery service. If that service is unavailable, the form opens a pre-filled email in your own email app instead, and nothing is sent until you choose to send it.",
        ...(leadsEnabled
          ? [
              "We also keep a copy of each form message in a private database run by Google Firebase, so we can follow up on every request. Only we can read it, and we delete messages once we no longer need them.",
            ]
          : []),
        "Like most websites, the company that hosts this site may keep standard technical logs, such as IP addresses and the pages requested, to keep the site running and secure.",
      ],
    },
    {
      id: "tracking",
      heading: "Cookies and tracking",
      paragraphs: [
        "This website doesn't use analytics, advertising trackers, or cookies.",
        "Your browser stores one small setting so the opening animation doesn't replay each time you visit the homepage. It stays on your device, is never sent to us, and clears when you close the tab.",
      ],
    },
    {
      id: "choices",
      heading: "Your choices",
      paragraphs: [
        "You can ask what information you've sent us, or ask us to correct or delete it, at any time. Use the contact details below.",
      ],
    },
    {
      id: "changes",
      heading: "Changes to this policy",
      paragraphs: [
        "If we change how we handle information, we'll update this page and the date at the top.",
      ],
    },
  ] satisfies { id: string; heading: string; paragraphs: string[]; list?: string[]; after?: string[] }[],
  contactHeading: "Questions",
};

export const notFoundPage = {
  heading: "Looks like you're locked out.",
  text: "The page you're looking for isn't here. Head back home, or call us if you're locked out for real.",
};

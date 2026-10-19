/**
 * Frequently asked questions. Shown on Home, Services, Car Key Replacement,
 * About, Contact and the inner pages, and published as FAQPage structured data.
 */

import { site } from "./site";

export type FaqItem = { question: string; answer: string };

export const faqHeading = "Frequently Asked Questions";

export const faqs: FaqItem[] = [
  {
    question: "What locksmith services do you offer?",
    answer:
      "We provide automotive, residential, and commercial locksmith services, including lockouts, repairs, replacements, and rekeying.",
  },
  {
    question: "What are your business hours?",
    answer:
      `We’re available daily from ${site.hours.range} to assist with your locksmith needs.`,
  },
  {
    question: "How quickly can a locksmith arrive?",
    answer:
      "We aim to provide fast service by connecting you with an available technician near your location.",
  },
  {
    question: "Which areas do you serve?",
    answer:
      "We serve Midland, Odessa, Lubbock, and Amarillo, Texas.",
  },
  {
    question: "How much do your services cost?",
    answer:
      "Pricing depends on the type of service required. Contact us for assistance with your specific needs.",
  },
  {
    question: "Why choose Speedster Lock & Key?",
    answer:
      "We focus on fast response times, professional service, and reliable locksmith solutions.",
  },
];

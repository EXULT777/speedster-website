import type { Metadata, Viewport } from "next";
import { Barlow, Saira } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MobileActionBar } from "@/components/layout/mobile-action-bar";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { TopBar } from "@/components/layout/top-bar";
import { introSeenScript } from "@/components/home/intro-script";
import { JsonLd } from "@/components/seo/json-ld";
import { InlineScript } from "@/components/ui/inline-script";
import { site } from "@/content/site";
import { localBusinessSchema } from "@/lib/schema";
import "./globals.css";

const saira = Saira({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["700", "800", "900"],
  variable: "--font-saira",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const defaultTitle = `Locksmith in Midland, Odessa, Lubbock & Amarillo | ${site.name}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: defaultTitle, template: `%s | ${site.name}` },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_US",
    title: defaultTitle,
    description: site.description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: defaultTitle, description: site.description },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the head script may add data-intro-seen before React hydrates.
    <html
      lang="en-US"
      data-scroll-behavior="smooth"
      className={`${saira.variable} ${barlow.variable}`}
      suppressHydrationWarning
    >
      <head>
        <InlineScript html={introSeenScript} />
      </head>
      <body className="pb-action-bar min-h-dvh antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <TopBar />
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <MobileActionBar />
        <SmoothScroll />
        <JsonLd data={localBusinessSchema()} />
      </body>
    </html>
  );
}

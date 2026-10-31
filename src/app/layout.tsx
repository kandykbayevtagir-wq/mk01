import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { contacts, site } from "@/data/site";
import { defaultLocale, localeMeta } from "@/i18n/config";
import { t } from "@/i18n";
import { jsonLd } from "@/lib/seo";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

/**
 * Pages are prerendered and refreshed hourly (ISR) so that past course
 * sessions disappear from listings without a redeploy.
 */
export const revalidate = 3600;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.tagline} — ${site.name}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#fbf7f1",
  width: "device-width",
  initialScale: 1,
};

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: site.name,
  url: site.url,
  description: site.description,
  ...(contacts.phone ? { telephone: contacts.phone } : {}),
  ...(contacts.email ? { email: contacts.email } : {}),
  ...(contacts.address
    ? {
        address: {
          "@type": "PostalAddress",
          streetAddress: contacts.address,
          ...(contacts.city ? { addressLocality: contacts.city } : {}),
          addressCountry: "KZ",
        },
      }
    : {}),
  sameAs: [
    contacts.instagram && `https://instagram.com/${contacts.instagram}`,
    contacts.telegram && `https://t.me/${contacts.telegram}`,
  ].filter(Boolean),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={localeMeta[defaultLocale].htmlLang} className={manrope.variable} suppressHydrationWarning>
      <head>
        {/* Enables scroll-reveal styles only when JS is running. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(organizationLd)} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="fixed left-4 top-3 z-[100] -translate-y-20 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition-transform focus:translate-y-0"
        >
          {t.common.skipToContent}
        </a>
        <Header />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

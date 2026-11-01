import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PressRipple } from "@/components/ui/press-ripple";
import { channels, site, socialProfiles } from "@/data/site";
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
  telephone: channels.phone.value,
  areaServed: { "@type": "City", name: "Актобе" },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: channels.phone.value,
    contactType: "customer service",
    availableLanguage: ["ru"],
  },
  sameAs: socialProfiles,
  // Branch addresses are added as LocalBusiness on /center once verified.
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={localeMeta[defaultLocale].htmlLang} className={manrope.variable} suppressHydrationWarning>
      <head>
        {/* Enables scroll-reveal styles only when JS runs; if the app's scripts
            fail to load (flaky network, blocked JS), reveal everything after
            3.5 s so content is never left invisible. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "var d=document.documentElement,n=navigator,c=n.connection;d.classList.add('js');" +
              // Low-capability or data-saving devices keep every decoration but skip ambient loops.
              "if((n.deviceMemory&&n.deviceMemory<=2)||(n.hardwareConcurrency&&n.hardwareConcurrency<=2)||(c&&c.saveData))d.classList.add('motion-lite');" +
              "setTimeout(function(){if(!window.__revealReady)d.classList.add('reveal-fallback')},3500)",
          }}
        />
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
        <PressRipple />
      </body>
    </html>
  );
}

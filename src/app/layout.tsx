import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Hebrew } from "next/font/google";
import { BottomNav } from "@/components/layout/BottomNav";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Toast } from "@/components/layout/Toast";
import { JsonLd } from "@/components/ui/primitives";
import { site } from "@/lib/site";
import "./globals.css";

const plex = IBM_Plex_Sans_Hebrew({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-plex",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | חומרי בניין, שיפוץ וכלי עבודה`,
    template: `%s | ${site.name}`,
  },
  description: "חומרי בניין, צבע, איטום, גבס, אינסטלציה, חשמל וכלי עבודה מהמותגים המובילים. ייעוץ מקצועי, משלוחים לכל הארץ, איסוף עצמי ומחירים לקבלנים.",
  openGraph: { type: "website", locale: "he_IL", siteName: site.name },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#1c1f23",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl" className={plex.variable}>
      <body className="min-h-dvh font-sans antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:right-2 focus:z-[100] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
          דילוג לתוכן הראשי
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <BottomNav />
        <FloatingWhatsApp />
        <Toast />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "HardwareStore",
            name: site.name,
            url: site.url,
            telephone: site.phoneDigits ?? undefined,
            email: site.email,
            address: { "@type": "PostalAddress", streetAddress: site.address, addressLocality: site.city, addressCountry: "IL" },
            currenciesAccepted: "ILS",
            paymentAccepted: "Credit Card, Apple Pay, Google Pay, Bit",
          }}
        />
      </body>
    </html>
  );
}

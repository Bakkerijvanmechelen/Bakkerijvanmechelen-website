import type { Metadata } from "next";
import { Fraunces, Lato, Montserrat } from "next/font/google";
import { site, SITE_URL } from "@/lib/site";
import ConsentHead from "@/components/ConsentHead";
import CookieBanner from "@/components/CookieBanner";
import "./globals.css";

const lato = Lato({ variable: "--font-lato", subsets: ["latin"], weight: ["400", "700"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });
const montserrat = Montserrat({ variable: "--font-montserrat", subsets: ["latin"], weight: ["400", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "./" },
  title: site.metaTitle,
  description: site.metaDescription,
  icons: site.logo ? { icon: site.logo.src } : undefined,
  // Niet vindbaar voor Google zolang de site niet live staat (zie next.config.ts).
  robots: process.env.ALLOW_INDEXING === "true" ? undefined : { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const t = site.theme;
  // De huisstijlkleuren van deze bakkerij; alle pagina's gebruiken ze via bg-brand, text-brand, bg-dark en bg-soft.
  const sans = site.style?.sansHeadings;
  const vars = {
    "--brand": t.brand,
    "--on-brand": t.onBrand,
    "--dark": t.dark,
    "--soft": t.soft,
    // Montserrat voor koppen en tekst, zoals op de oorspronkelijke site.
    ...(sans ? { "--font-fraunces": "var(--font-montserrat)", "--font-lato": "var(--font-montserrat)" } : {}),
  } as React.CSSProperties;
  return (
    <html lang="nl" className={`${lato.variable} ${sans ? montserrat.variable : fraunces.variable}`} style={vars}>
      <head>
        <ConsentHead />
      </head>
      <body className="antialiased">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}

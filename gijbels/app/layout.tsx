import type { Metadata } from "next";
import { Fraunces, Lato } from "next/font/google";
import ConsentHead from "@/components/ConsentHead";
import CookieBanner from "@/components/CookieBanner";
import { SITE_URL } from "@/lib/site-url";
import "./globals.css";

const lato = Lato({ variable: "--font-lato", subsets: ["latin"], weight: ["400", "700"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "./" },
  title: "Bakkerij Gijbels: uw bakker in Antwerpen",
  description: "Bakkerij Gijbels is een begrip in Antwerpen. Onze vestigingen brengen het vakmanschap van uw bakker tot vlakbij uw deur. Proef meer op onze website.",
  icons: { icon: "/images/logo.jpg" },
  // Niet vindbaar voor Google zolang de site niet live staat (zie next.config.ts).
  robots: process.env.ALLOW_INDEXING === "true" ? undefined : { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noimageindex: true } },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nl" className={`${lato.variable} ${fraunces.variable}`}>
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

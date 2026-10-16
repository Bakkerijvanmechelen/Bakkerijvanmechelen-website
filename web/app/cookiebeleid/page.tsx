import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { company } from "@/lib/content";

export const metadata: Metadata = { title: "Cookiebeleid | Bakkerij Van Mechelen" };

export default function Cookiebeleid() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-36">
        <h1 className="font-display text-4xl sm:text-5xl">Cookiebeleid</h1>
        {/* TODO: de officiële tekst staat op de oude site in een externe cookie-plugin en is nog niet overgenomen. */}
        <p className="mt-6 text-lg leading-relaxed">
          Deze website gebruikt enkel functionele opslag die nodig is om het contactformulier te laten
          werken. Vragen over de verwerking van uw gegevens? Mail naar{" "}
          <a className="underline" href={`mailto:${company.email}`}>
            {company.email}
          </a>
          .
        </p>
      </main>
      <Footer />
    </>
  );
}

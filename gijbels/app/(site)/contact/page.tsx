import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import { hoursLines, telHref } from "@/lib/shop-types";
import Rich from "@/components/Rich";
import { getContent } from "@/lib/cms";
import { getShops } from "@/lib/shops";

export const metadata: Metadata = {
  title: "Contact | Gijbels Bakkerij Antwerpen",
  description: "Neem contact op met Bakkerij Gijbels in Antwerpen",
};

export default async function Contact() {
  const [shops, c] = await Promise.all([getShops(), getContent()]);
  const main = shops.find((s) => s.kind === "eigen");

  return (
    <>
      <PageHero eyebrow={c["contact.hero.eyebrow"]} title={c["contact.hero.title"]} subtitle={c["contact.hero.subtitle"]} image={{ src: c["contact.hero.image"], alt: "" }} />
      <section className="mx-auto grid max-w-6xl gap-8 px-5 pb-24 pt-12 md:grid-cols-[1.4fr_1fr]">
        <Reveal className="rounded-2xl bg-paper p-7 shadow-sm ring-1 ring-ink/5 md:p-10">
          <h2 className="mb-7 font-display text-3xl text-blue">{c["contact.form.title"]}</h2>
          <ContactForm />
        </Reveal>
        <Reveal delay={120} className="grid content-start gap-6">
          {main && (
            <address className="rounded-2xl bg-blue-deep p-8 not-italic text-white">
              <p className="font-display text-2xl text-butter">{main.name}</p>
              <p className="mt-4 text-lg leading-relaxed text-white/90">
                {main.street}
                <br />
                {main.postal_code} {main.city}
              </p>
              {main.phone && (
                <p className="mt-4">
                  <a href={telHref(main.phone)} className="text-xl font-bold hover:text-butter">
                    {main.phone}
                  </a>
                </p>
              )}
              {hoursLines(main.hours).map((l) => (
                <p key={l} className="mt-2 text-white/75">{l}</p>
              ))}
            </address>
          )}
          <div className="rounded-2xl bg-butter p-8">
            <p className="font-display text-2xl">{c["contact.visit.title"]}</p>
            <div className="mt-2 space-y-2 text-lg">
              <Rich text={c["contact.visit.text"]} boldClass="font-bold text-blue" />
            </div>
            <Link href="/winkels" className="mt-5 inline-block rounded-full bg-blue px-6 py-3 font-bold text-white hover:bg-blue-deep">
              {c["contact.visit.button"]} →
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}

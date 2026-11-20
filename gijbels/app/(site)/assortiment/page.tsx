import type { Metadata } from "next";
import Image from "next/image";
import CtaBand from "@/components/CtaBand";
import Gallery from "@/components/Gallery";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Rich from "@/components/Rich";
import { getContent } from "@/lib/cms";
import { featureIds, galleryCount } from "@/lib/cms-schema";

export const metadata: Metadata = {
  title: "Het heerlijke assortiment van Bakkerij Gijbels",
  description: "Het assortiment van uw bakker smaakt op elk moment van de dag. Ontdek het aanbod van Bakkerij Gijbels, uw ambachtelijke bakker in Antwerpen. Ontdek meer!",
};

function Feature({ id, image, title, text, flip }: { id: string; image: string; title: string; text: string; flip?: boolean }) {
  return (
    <section id={id} className="mx-auto grid max-w-6xl scroll-mt-24 items-center gap-10 px-5 pt-20 md:grid-cols-2 md:gap-16">
      <Reveal className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-blue-soft shadow-md shadow-ink/10 ${flip ? "md:order-2" : ""}`}>
        <Image src={image} alt={title} fill sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
      </Reveal>
      <Reveal delay={120} className={flip ? "md:order-1" : ""}>
        <h2 className="font-display text-[clamp(1.9rem,3.6vw,2.8rem)] leading-tight text-blue">{title}</h2>
        <div className="mt-5 space-y-4 text-lg leading-relaxed text-ink/80">
          <Rich text={text} boldClass="font-bold text-blue" />
        </div>
      </Reveal>
    </section>
  );
}

export default async function Assortiment() {
  const c = await getContent();
  const gallery = Array.from({ length: galleryCount }, (_, i) => c[`assortment.gallery${i + 1}`]);

  return (
    <>
      <PageHero eyebrow={c["assortment.hero.eyebrow"]} title={c["assortment.hero.title"]} subtitle={c["assortment.hero.subtitle"]} image={{ src: c["assortment.hero.image"], alt: "" }} />

      <section className="mx-auto max-w-4xl px-5 pt-14">
        <Reveal className="space-y-4 text-center font-display text-[clamp(1.4rem,2.6vw,2rem)] leading-snug text-ink/85">
          <Rich text={c["assortment.intro"]} boldClass="text-blue" />
        </Reveal>
      </section>

      {featureIds.map((id, i) => (
        <Feature key={id} id={id} image={c[`assortment.${id}.image`]} title={c[`assortment.${id}.title`]} text={c[`assortment.${id}.text`]} flip={i % 2 === 1} />
      ))}

      <section className="mx-auto max-w-6xl px-5 pt-24">
        <h2 className="mb-6 font-display text-3xl text-blue">{c["assortment.gallery.title"]}</h2>
        <Gallery images={gallery} />
      </section>

      <CtaBand />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Rich from "@/components/Rich";
import { getContent } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Het lekkerste brood, snel geleverd voor bedrijven",
  description: "Bakkerij Gijbels levert het lekkerste brood aan uw bedrijf of voorziening. Zo genieten u én uw klanten van overheerlijke bakkerijproducten. Ontdek meer!",
};

const b = "font-bold text-blue";

export default async function Diensten() {
  const c = await getContent();
  const forWhom = c["services.forWhom.list"].split("\n").map((s) => s.trim()).filter(Boolean);

  return (
    <>
      <PageHero eyebrow={c["services.hero.eyebrow"]} title={c["services.hero.title"]} subtitle={c["services.hero.subtitle"]} image={{ src: c["services.hero.image"], alt: "", position: "center 20%" }} />

      <section className="mx-auto max-w-6xl px-5 pt-16">
        <div className="grid gap-10 md:grid-cols-[1.15fr_1fr] md:gap-16">
          <Reveal className="space-y-6 text-xl leading-relaxed text-ink/80">
            <Rich text={c["services.intro"]} boldClass={b} />
          </Reveal>
          <Reveal delay={120} className="self-start rounded-2xl bg-blue-soft p-8">
            <p className="font-display text-2xl text-blue">{c["services.forWhom.title"]}</p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {forWhom.map((w, i) => (
                <li key={`${i}-${w}`} className="rounded-full bg-paper px-4 py-2 font-bold shadow-sm">
                  {w}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {[1, 2].map((k, i) => (
            <Reveal key={k} delay={i * 120} className="rounded-2xl bg-paper p-8 shadow-sm ring-1 ring-ink/5 md:p-10">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-crust">{c[`services.card${k}.eyebrow`]}</p>
              <h2 className="mt-3 font-display text-3xl text-blue">{c[`services.card${k}.title`]}</h2>
              <div className="mt-4 space-y-3 text-lg leading-relaxed text-ink/80">
                <Rich text={c[`services.card${k}.text`]} boldClass={b} />
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-8 flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-butter p-8 md:p-10">
          <div className="max-w-xl space-y-2 font-display text-2xl leading-snug">
            <Rich text={c["services.cta.text"]} boldClass="font-normal text-blue" />
          </div>
          <Link href="/contact" className="rounded-full bg-blue px-8 py-4 text-lg font-bold text-white transition hover:-translate-y-0.5 hover:bg-blue-deep">
            {c["services.cta.button"]} →
          </Link>
        </Reveal>
      </section>

      <CtaBand />
    </>
  );
}

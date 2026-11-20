import type { Metadata } from "next";
import CtaBand from "@/components/CtaBand";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Rich from "@/components/Rich";
import { getContent, withCount } from "@/lib/cms";
import { historyStepCount } from "@/lib/cms-schema";
import { getShopCount } from "@/lib/shops";

export const metadata: Metadata = {
  title: "De geschiedenis van Bakkerij Gijbels (Antwerpen)",
  description: "Bakkerij Gijbels, uw bakker in Antwerpen, heeft een rijke geschiedenis. Jarenlange verfijning van het ambacht, dat is genieten voor ú. Lees meer!",
};

export default async function Geschiedenis() {
  const [n, c] = await Promise.all([getShopCount(), getContent()]);
  const t = (key: string) => withCount(c[key], n);
  const steps = Array.from({ length: historyStepCount }, (_, i) => i + 1);

  return (
    <>
      <PageHero eyebrow={t("history.hero.eyebrow")} title={t("history.hero.title")} subtitle={t("history.hero.subtitle")} image={{ src: c["history.hero.image"], alt: "", position: "center 30%" }} />

      <section className="mx-auto max-w-4xl px-5 pt-16">
        <ol className="relative grid gap-8 before:absolute before:bottom-6 before:left-[1.7rem] before:top-6 before:hidden before:w-px before:bg-ink/15 md:before:block">
          {steps.map((k, i) => (
            <Reveal as="li" key={k} delay={i * 100} className="relative grid gap-5 rounded-2xl bg-paper p-7 shadow-sm ring-1 ring-ink/5 md:grid-cols-[3.5rem_1fr] md:gap-8 md:p-10">
              <span className="relative z-10 grid size-14 place-items-center rounded-full bg-blue font-display text-xl text-white">{String(k).padStart(2, "0")}</span>
              <div>
                <h2 className="font-display text-2xl leading-tight text-blue md:text-3xl">{t(`history.step${k}.title`)}</h2>
                <div className="mt-4 space-y-4 text-lg leading-relaxed text-ink/80">
                  <Rich text={t(`history.step${k}.text`)} boldClass="font-bold text-blue" />
                </div>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-8 space-y-3 rounded-2xl bg-butter p-8 text-center font-display text-2xl leading-snug md:p-10 md:text-3xl">
          <Rich text={t("history.closing")} boldClass="font-normal text-blue" />
        </Reveal>
      </section>

      <CtaBand />
    </>
  );
}

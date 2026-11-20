import Image from "next/image";
import Link from "next/link";
import CountUp from "@/components/CountUp";
import CtaBand from "@/components/CtaBand";
import Parallax from "@/components/Parallax";
import Reveal from "@/components/Reveal";
import Words from "@/components/Words";
import Rich from "@/components/Rich";
import { getContent, withCount } from "@/lib/cms";
import { homeBlockCount, homeCardCount } from "@/lib/cms-schema";
import { getShopCount } from "@/lib/shops";

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);
const cardHref = ["/assortiment#broden", "/assortiment#klassiek", "/assortiment#patisserie", "/assortiment#patisserie"];

export default async function Home() {
  const [n, c] = await Promise.all([getShopCount(), getContent()]);
  const t = (key: string) => withCount(c[key], n);

  return (
    <>
      <section className="relative flex min-h-[min(58vh,620px)] items-center overflow-hidden bg-blue-deep text-flour">
        <Parallax speed={0.3}>
          <Image src={c["home.hero.image"]} alt="" fill priority sizes="100vw" className="hero-zoom object-cover opacity-50 mix-blend-luminosity" />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-deep/90 via-blue-deep/50 to-transparent" />
        <div className="relative mx-auto w-full max-w-6xl px-5 pb-12 pt-28">
          <p className="fade-up text-sm font-bold uppercase tracking-[0.25em] text-butter">{t("home.hero.eyebrow")}</p>
          <h1 className="fade-up mt-4 max-w-3xl font-display text-4xl leading-[1.05] md:text-6xl">
            <Words text={t("home.hero.title")} />
          </h1>
          <div className="fade-up mt-4 max-w-xl space-y-3 text-lg leading-relaxed text-flour/90" style={{ animationDelay: "240ms" }}>
            <Rich text={t("home.hero.text").replace(/ u\./g, "\u00A0u.")} />
          </div>
          <Link href="/winkels" className="btn-arrow fade-up mt-6 inline-block rounded-full bg-butter px-7 py-3 font-bold text-ink transition hover:bg-white" style={{ animationDelay: "700ms" }}>
            {t("home.hero.button")} <span aria-hidden>→</span>
          </Link>
        </div>
        <a href="#assortiment" aria-label="Naar beneden" className="bob absolute bottom-4 left-1/2 hidden size-10 -translate-x-1/2 place-items-center rounded-full border border-flour/40 text-flour/80 md:grid">
          ↓
        </a>
      </section>

      <section id="assortiment" className="mx-auto max-w-6xl scroll-mt-16 px-5 pb-24 pt-14 md:pt-16">
        <Reveal>
          <h2 className="font-display text-4xl text-blue md:text-5xl">{t("home.cards.title")}</h2>
          <div className="mt-4 max-w-2xl space-y-3 text-lg text-ink/80">
            <Rich text={t("home.cards.intro")} boldClass="font-bold text-blue" />
          </div>
        </Reveal>
        <ul className="mt-10 grid gap-6 md:grid-cols-2">
          {range(homeCardCount).map((k, i) => (
            <Reveal as="li" key={k} delay={(i % 2) * 120} from={i % 2 ? "right" : "left"} className="lift overflow-hidden rounded-2xl bg-white shadow-md shadow-ink/10">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image src={c[`home.card${k}.image`]} alt={t(`home.card${k}.title`)} fill sizes="(min-width: 768px) 560px, 100vw" className="zoom-img object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-display text-2xl text-blue">{t(`home.card${k}.title`)}</h3>
                <div className="mt-2 space-y-2 text-ink/80">
                  <Rich text={t(`home.card${k}.text`)} boldClass="font-bold text-blue" />
                </div>
                <Link href={cardHref[k - 1] ?? "/assortiment"} className="mt-4 inline-block text-sm font-bold uppercase tracking-wider text-crust underline underline-offset-4 hover:text-blue">
                  {t("home.cards.link")}
                </Link>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="relative overflow-hidden bg-blue-deep text-flour">
        <Image src={c["home.shops.image"]} alt="" fill sizes="100vw" className="object-cover opacity-20 mix-blend-luminosity" />
        <div className="relative mx-auto max-w-6xl px-5 py-24">
          <Reveal>
            <h2 className="font-display text-4xl md:text-5xl"><span className="text-butter"><CountUp to={n} /></span> {t("home.shops.title")}</h2>
          </Reveal>
          <ul className="mt-10 grid gap-4 md:grid-cols-3">
            {range(homeBlockCount).map((k, i) => (
              <Reveal as="li" key={k} delay={i * 140} from="zoom" className="rounded-xl border border-flour/15 bg-blue-deep/70 p-6 backdrop-blur">
                <h3 className="font-display text-xl text-butter">{t(`home.block${k}.title`)}</h3>
                <div className="mt-3 space-y-2 text-sm leading-relaxed text-flour/85">
                  <Rich text={t(`home.block${k}.text`)} boldClass="font-bold text-white" />
                </div>
              </Reveal>
            ))}
          </ul>
          <div className="mt-10 max-w-2xl space-y-3 text-flour/90">
            <Rich text={t("home.shops.closing")} boldClass="font-bold text-white" />
          </div>
          <Link href="/winkels" className="mt-6 inline-block rounded-full bg-butter px-7 py-3 font-bold text-ink transition hover:bg-white">
            {t("home.shops.button")}
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-24 md:grid-cols-2">
        <Reveal from="left" className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-md shadow-ink/10">
          <Image src={c["home.about.image"]} alt="" fill sizes="(min-width: 768px) 560px, 100vw" className="object-cover" />
        </Reveal>
        <Reveal delay={150} from="right">
          <h2 className="font-display text-4xl text-blue md:text-5xl">{t("home.about.title")}</h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink/80">
            <Rich text={t("home.about.text")} boldClass="font-bold text-blue" />
          </div>
          <div className="mt-8 rounded-xl bg-blue-soft p-6 text-sm leading-relaxed text-blue-deep">
            <p className="font-display text-xl">{t("home.about.boxTitle")}</p>
            <div className="mt-2 space-y-2">
              <Rich text={t("home.about.boxText")} />
            </div>
          </div>
        </Reveal>
      </section>

      <CtaBand />
    </>
  );
}

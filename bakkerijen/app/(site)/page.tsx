import Image from "next/image";
import Link from "next/link";
import Parallax from "@/components/Parallax";
import Reveal from "@/components/Reveal";
import Rich from "@/components/Rich";
import Shops from "@/components/Shops";
import Words from "@/components/Words";
import { getContent } from "@/lib/cms";
import { blockKey } from "@/lib/cms-schema";
import { site } from "@/lib/site";
import type { Block } from "@/lib/sites/types";

const bold = "font-bold text-ink";

export default async function Home() {
  const c = await getContent();

  // Blokken zonder foto die op elkaar volgen, komen naast elkaar te staan (zoals op de oorspronkelijke site).
  type Item = { b: Block; i: number };
  const groups: (Item | Item[])[] = [];
  site.blocks.forEach((b, i) => {
    const last = groups[groups.length - 1];
    if (b.type === "feature" && !b.image) {
      if (Array.isArray(last)) last.push({ b, i });
      else groups.push([{ b, i }]);
    } else groups.push({ b, i });
  });
  // Blokken met foto wisselen af: foto links, dan foto rechts.
  const withImage = site.blocks.map((b, i) => (b.type === "feature" && b.image ? i : -1)).filter((i) => i >= 0);

  return (
    <>
      {groups.map((g) => {
        if (Array.isArray(g)) {
          return (
            <section key={`g${g[0].i}`} className={site.style?.plainColumns ? "bg-white" : ""}>
              <ul className={`mx-auto grid max-w-6xl gap-6 px-5 py-12 ${site.style?.plainColumns ? "md:gap-14 md:py-16" : ""} ${g.length > 1 ? "md:grid-cols-2" : ""}`}>
                {g.map(({ i }, n) => {
                  const k = blockKey(i);
                  return (
                    <Reveal as="li" key={k} delay={n * 120} className={site.style?.plainColumns ? "" : "lift rounded-2xl bg-white p-7 shadow-md shadow-ink/10 md:p-10"}>
                      {c[`${k}.title`] && <h2 className={`mb-4 font-display text-3xl ${site.style?.plainColumns ? "text-ink/80" : "text-brand"}`}>{c[`${k}.title`]}</h2>}
                      <div className="space-y-4 text-lg leading-relaxed text-ink/80">
                        <Rich text={c[`${k}.text`]} boldClass={bold} />
                      </div>
                    </Reveal>
                  );
                })}
              </ul>
            </section>
          );
        }

        const { b, i } = g;
        const k = blockKey(i);
        switch (b.type) {
          case "hero":
            return (
              <section key={k} className="relative flex min-h-[min(56vh,600px)] items-center overflow-hidden bg-dark text-flour">
                <Parallax speed={0.3}>
                  <Image src={c[`${k}.image`]} alt="" fill priority sizes="100vw" className={`hero-zoom object-cover ${site.style?.heroBright ? "opacity-95" : site.style?.heroEmblem ? "opacity-35" : "opacity-60"}`} />
                </Parallax>
                <div className={`absolute inset-0 bg-gradient-to-r ${site.style?.heroBright ? "from-dark/75 via-dark/30 to-transparent" : "from-dark/90 via-dark/50 to-dark/10"}`} />
                {site.style?.heroEmblem ? (
                  <div className="relative mx-auto w-full max-w-4xl px-5 pb-12 pt-28 text-center">
                    <div className="fade-up flex items-center justify-center gap-4 md:gap-6">
                      {site.logo && <Image src={site.logo.src} alt="" width={site.logo.width} height={site.logo.height} className="h-20 w-auto shrink-0 md:h-28" />}
                      <span aria-hidden className="h-24 w-1 shrink-0 bg-brand md:h-32" />
                      <h1 className="text-left text-3xl font-extrabold uppercase leading-[1.05] md:text-6xl">
                        <Words text={c[`${k}.title`]} accentClass="text-brand" />
                      </h1>
                    </div>
                    {c[`${k}.subtitle`] && <p className="fade-up mt-5 text-lg text-flour/90 md:text-xl">{c[`${k}.subtitle`]}</p>}
                    <Link href="/#winkels" className="btn-arrow fade-up mt-8 inline-block rounded-full bg-brand px-7 py-3 font-bold uppercase text-on-brand transition hover:bg-white hover:text-ink" style={{ animationDelay: "650ms" }}>
                      {c[`${k}.button`]} <span aria-hidden>→</span>
                    </Link>
                  </div>
                ) : (
                <div className="relative mx-auto w-full max-w-6xl px-5 pb-12 pt-28">
                  {c[`${k}.eyebrow`] && <p className="fade-up text-sm font-bold uppercase tracking-[0.25em] text-white/80">{c[`${k}.eyebrow`]}</p>}
                  <h1 className="fade-up mt-4 max-w-4xl font-display text-4xl leading-[1.05] md:text-6xl">
                    <Words text={c[`${k}.title`]} accentClass="text-brand" />
                  </h1>
                  {c[`${k}.subtitle`] && (
                    <p className="fade-up mt-4 max-w-xl text-lg leading-relaxed text-flour/90 md:text-xl" style={{ animationDelay: "300ms" }}>
                      {c[`${k}.subtitle`]}
                    </p>
                  )}
                  <Link href="/#winkels" className="btn-arrow fade-up mt-6 inline-block rounded-full bg-brand px-7 py-3 font-bold text-on-brand transition hover:bg-white hover:text-ink" style={{ animationDelay: "650ms" }}>
                    {c[`${k}.button`]} <span aria-hidden>→</span>
                  </Link>
                </div>
                )}
              </section>
            );
          case "intro":
            if (site.style?.introOnBrand)
              return (
                <section key={k} className="bg-brand text-on-brand">
                  <Reveal className="mx-auto max-w-6xl px-5 py-14 md:py-16">
                    <h2 className="font-display text-3xl md:text-4xl">{c[`${k}.title`]}</h2>
                    {c[`${k}.text`] && (
                      <div className="mt-5 space-y-4 text-lg leading-relaxed text-on-brand/90">
                        <Rich text={c[`${k}.text`]} boldClass="font-bold text-on-brand" />
                      </div>
                    )}
                  </Reveal>
                </section>
              );
            return (
              <section key={k} className="mx-auto max-w-4xl px-5 pb-6 pt-14 text-center md:pt-16">
                <Reveal>
                  <h2 className="font-display text-4xl text-brand md:text-5xl">{c[`${k}.title`]}</h2>
                  {c[`${k}.text`] && (
                    <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink/80 md:text-xl">
                      <Rich text={c[`${k}.text`]} boldClass={bold} />
                    </div>
                  )}
                </Reveal>
              </section>
            );
          case "feature": {
            const right = withImage.indexOf(i) % 2 === 1;
            return (
              <section key={k} className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 md:grid-cols-2 md:gap-16">
                <Reveal from={right ? "right" : "left"} className={`lift relative aspect-[4/3] overflow-hidden rounded-2xl bg-soft shadow-md shadow-ink/10 ${right ? "md:order-2" : ""}`}>
                  <Image src={c[`${k}.image`]} alt={c[`${k}.title`] || ""} fill sizes="(min-width: 768px) 560px, 100vw" className="zoom-img object-cover" />
                </Reveal>
                <Reveal delay={120} from={right ? "left" : "right"} className={right ? "md:order-1" : ""}>
                  {c[`${k}.title`] && <h2 className="mb-5 font-display text-3xl text-brand md:text-4xl">{c[`${k}.title`]}</h2>}
                  <div className="space-y-4 text-lg leading-relaxed text-ink/80">
                    <Rich text={c[`${k}.text`]} boldClass={bold} />
                  </div>
                </Reveal>
              </section>
            );
          }
          case "gallery":
            return (
              <section key={k} className="mx-auto max-w-6xl px-5 py-12">
                <ul className={`grid grid-cols-2 gap-4 ${b.images.length >= 5 ? "md:grid-cols-5" : "md:grid-cols-4"}`}>
                  {b.images.map((_, n) => (
                    <Reveal as="li" key={n} delay={n * 80} from="zoom" className="lift relative aspect-square overflow-hidden rounded-2xl bg-soft shadow-md shadow-ink/10">
                      <Image src={c[`${k}.image${n + 1}`]} alt="" fill sizes="(min-width: 768px) 280px, 50vw" className="zoom-img object-cover" />
                    </Reveal>
                  ))}
                </ul>
              </section>
            );
          case "band":
            return (
              <section key={k} className={`relative overflow-hidden bg-dark text-flour ${site.style?.plainColumns ? "" : "mt-12"}`}>
                {b.image && <Image src={c[`${k}.image`]} alt="" fill sizes="100vw" className="object-cover opacity-30" />}
                <Reveal className="relative mx-auto max-w-3xl px-5 py-24 text-center md:py-28">
                  <h2 className="font-display text-4xl leading-tight md:text-5xl">{c[`${k}.title`]}</h2>
                  {b.text !== undefined && (
                    <div className="mt-6 space-y-4 text-lg leading-relaxed text-flour/90">
                      <Rich text={c[`${k}.text`]} boldClass="font-bold text-white" />
                    </div>
                  )}
                  {b.button !== undefined && (
                    <Link href="/#winkels" className="btn-arrow mt-8 inline-block rounded-full bg-brand px-7 py-3 font-bold text-on-brand transition hover:bg-white hover:text-ink">
                      {c[`${k}.button`]} <span aria-hidden>→</span>
                    </Link>
                  )}
                </Reveal>
              </section>
            );
        }
      })}
      <Shops />
    </>
  );
}

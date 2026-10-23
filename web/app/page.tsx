import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Rich from "@/components/Rich";
import { companyFrom, getContent } from "@/lib/cms";
import { productCount, quoteCount, serviceCount } from "@/lib/cms-schema";

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

export default async function Home() {
  const c = await getContent();
  const company = companyFrom(c);
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative flex min-h-[92vh] items-end overflow-hidden bg-ink text-flour">
          <Image
            src={c["home.hero.image"]}
            alt="Ambachtelijk brood met bloem bestoven korst"
            fill
            priority
            sizes="100vw"
            className="hero-zoom object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
          <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-40">
            <p className="fade-up mb-4 text-sm font-bold uppercase tracking-[0.3em] text-sage-light">
              {c["home.hero.eyebrow"]}
            </p>
            <h1 className="fade-up max-w-3xl font-display text-5xl leading-[1.05] sm:text-7xl" style={{ animationDelay: "120ms" }}>
              {c["home.hero.title"]}
            </h1>
            <div className="fade-up mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-flour/90" style={{ animationDelay: "260ms" }}>
              <Rich text={c["home.hero.text"]} />
            </div>
            <a
              href="#contact"
              className="fade-up mt-8 inline-block rounded-full bg-sage-light px-8 py-3 font-bold text-ink transition hover:-translate-y-0.5 hover:bg-flour"
              style={{ animationDelay: "400ms" }}
            >
              {c["home.hero.button"]}
            </a>
          </div>
        </section>

        {/* Producten */}
        <section id="producten" className="mx-auto max-w-6xl px-5 py-24">
          <Reveal><h2 className="font-display text-4xl sm:text-5xl">{c["home.products.title"]}</h2></Reveal>
          <div className="mt-4 max-w-2xl space-y-3 text-lg">
            <Rich text={c["home.products.intro"]} />
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {range(productCount).map((n, i) => (
              <Reveal as="article" key={n} delay={(i % 2) * 120} className="group overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={c[`home.product${n}.image`]}
                    alt={c[`home.product${n}.title`]}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl">{c[`home.product${n}.title`]}</h3>
                  <div className="mt-3 space-y-3 leading-relaxed">
                    <Rich text={c[`home.product${n}.text`]} />
                  </div>
                  <a href="#contact" className="mt-4 inline-block font-bold text-crust underline">
                    {c["home.products.link"]}
                  </a>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Diensten */}
        <section id="diensten" className="relative overflow-hidden bg-ink py-24 text-flour">
          <Image
            src={c["home.services.image"]}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-25"
          />
          <div className="relative mx-auto max-w-6xl px-5">
            <Reveal><h2 className="font-display text-4xl sm:text-5xl">{c["home.services.title"]}</h2></Reveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {range(serviceCount).map((n, i) => (
                <Reveal as="article" key={n} delay={i * 100} className="rounded-2xl border border-flour/20 bg-ink/60 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-sage-light">
                  <h3 className="font-display text-2xl text-sage-light">{c[`home.service${n}.title`]}</h3>
                  <div className="mt-3 space-y-3 leading-relaxed">
                    <Rich text={c[`home.service${n}.text`]} />
                  </div>
                </Reveal>
              ))}
            </div>
            <div className="mt-12 max-w-3xl space-y-4 text-lg leading-relaxed">
              <Rich text={c["home.services.closing"]} />
            </div>
            <a
              href="#contact"
              className="mt-8 inline-block rounded-full bg-sage-light px-8 py-3 font-bold text-ink transition hover:bg-flour"
            >
              {c["home.services.button"]}
            </a>
          </div>
        </section>

        {/* Over ons */}
        <section id="over-ons" className="mx-auto max-w-6xl px-5 py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src={c["home.about.image"]}
                alt="Ambachtelijk brood"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </Reveal>
            <Reveal delay={150}>
              <h2 className="font-display text-4xl sm:text-5xl">{c["home.about.title"]}</h2>
              <div className="mt-6 space-y-4 text-lg leading-relaxed">
                <Rich text={c["home.about.text"]} />
              </div>
              <div className="mt-8 rounded-2xl bg-sage-light/50 p-6">
                <h3 className="font-display text-2xl">{c["home.acs.title"]}</h3>
                <div className="mt-3 space-y-3 leading-relaxed">
                  <Rich text={c["home.acs.text"]} />
                </div>
              </div>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {range(quoteCount).map((n, i) => (
              <Reveal as="div" key={n} delay={i * 150} className="rounded-2xl bg-white p-8 shadow-sm">
              <figure>
                <blockquote className="font-display text-xl leading-snug">“<Rich inlineOnly text={c[`home.quote${n}.text`]} />”</blockquote>
                <figcaption className="mt-4 text-sm font-bold uppercase tracking-wider text-crust">
                  {c[`home.quote${n}.name`]}
                </figcaption>
              </figure>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="relative overflow-hidden bg-white py-24">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[1fr_1.4fr]">
            <Reveal>
              <h2 className="font-display text-4xl sm:text-5xl">{c["home.contact.title"]}</h2>
              <address className="mt-6 not-italic leading-relaxed text-lg">
                <p className="font-bold">{company.legalName}</p>
                <p>{company.street}</p>
                <p>{company.city}</p>
                <p className="mt-3">
                  <a href={company.phoneHref} className="underline">
                    {company.phone}
                  </a>
                </p>
                <p>
                  <a href={`mailto:${company.email}`} className="underline">
                    {company.email}
                  </a>
                </p>
              </address>
            </Reveal>
            <Reveal delay={150}>
              <ContactForm />
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

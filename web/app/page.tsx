import Image from "next/image";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { company, products, services, testimonials } from "@/lib/content";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="relative flex min-h-[92vh] items-end overflow-hidden bg-ink text-flour">
          <Image
            src="/images/bakkerij-van-mechelen.jpg"
            alt="Ambachtelijk brood met bloem bestoven korst"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
          <div className="relative mx-auto w-full max-w-6xl px-5 pb-20 pt-40">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.3em] text-sage-light">
              Ambachtelijke bakkerij voor uw zaak
            </p>
            <h1 className="max-w-3xl font-display text-5xl leading-[1.05] sm:text-7xl">
              Vakmanschap &amp; traditie
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-flour/90">
              Bakkerij Van Mechelen is een ambachtelijke bakkerij die sinds 2003 uw smaakvolle en krokante
              pistolets bakt, maar ook heerlijke patisserie en vlaaien maakt. Met ingrediënten uit de streek
              streven wij niet alleen naar de beste kwaliteit, maar zorgen wij er ook voor dat ze voedzaam en
              gezond zijn. Het geheim tot succes van Bakkerij Van Mechelen zijn onze werknemers, we zijn een
              bedrijf met een kloppend hart.
            </p>
            <a
              href="#contact"
              className="mt-8 inline-block rounded-full bg-sage-light px-8 py-3 font-bold text-ink transition hover:bg-flour"
            >
              Contacteer ons
            </a>
          </div>
        </section>

        {/* Producten */}
        <section id="producten" className="mx-auto max-w-6xl px-5 py-24">
          <h2 className="font-display text-4xl sm:text-5xl">Producten</h2>
          <p className="mt-4 max-w-2xl text-lg">
            Onze broden zijn gekend om hun lekkere smaak, maar ook om de lange versheid ervan.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {products.map((p) => (
              <article key={p.id} className="group overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl">{p.title}</h3>
                  <p className="mt-3 leading-relaxed">{p.text}</p>
                  <a href="#contact" className="mt-4 inline-block font-bold text-crust underline">
                    Contacteer ons
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Diensten */}
        <section id="diensten" className="relative overflow-hidden bg-ink py-24 text-flour">
          <Image
            src="/images/Camionetten.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-25"
          />
          <div className="relative mx-auto max-w-6xl px-5">
            <h2 className="font-display text-4xl sm:text-5xl">Voor wie?</h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((s) => (
                <article key={s.title} className="rounded-2xl border border-flour/20 bg-ink/60 p-6 backdrop-blur">
                  <h3 className="font-display text-2xl text-sage-light">{s.title}</h3>
                  <p className="mt-3 leading-relaxed">{s.text}</p>
                </article>
              ))}
            </div>
            <p className="mt-12 max-w-3xl text-lg leading-relaxed">
              Door onze uitgebreide vloot en aangezien wij ons transport in eigen beheer doen, kunnen we
              naadloos inspelen op de wensen van onze klanten.
            </p>
            <a
              href="#contact"
              className="mt-8 inline-block rounded-full bg-sage-light px-8 py-3 font-bold text-ink transition hover:bg-flour"
            >
              Contacteer ons
            </a>
          </div>
        </section>

        {/* Over ons */}
        <section id="over-ons" className="mx-auto max-w-6xl px-5 py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src="/images/ambachtelijk-brood.jpg"
                alt="Ambachtelijk brood"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-display text-4xl sm:text-5xl">Vakmanschap &amp; traditie</h2>
              <p className="mt-6 text-lg leading-relaxed">
                Met meer dan 20 jaar aan ervaring staat Bakkerij Van Mechelen voor lekkere producten die
                steeds gemaakt worden met hoogwaardige ingrediënten.
              </p>
              <p className="mt-4 text-lg leading-relaxed">
                Een out-of-the-box vraag? Wij zijn een flexibele partner die graag met jou nadenkt over de
                beste oplossing, en dat steeds aan scherpe prijsvoorwaarden.
              </p>
              <div className="mt-8 rounded-2xl bg-sage-light/50 p-6">
                <h3 className="font-display text-2xl">ACS gecertificeerd</h3>
                <p className="mt-3 leading-relaxed">
                  ACS staat voor autocontrole systeem. Het certificaat wordt uitgereikt door het FAVV
                  (Federaal Agentschap voor de veiligheid van de voedselketen). Dit wordt pas toegekend na
                  strenge audits die zich toeleggen op hygiëne, HACCP en traceerbaarheid van de geproduceerde
                  en getransporteerde producten. Naast dit certificaat onderleggen we onszelf ook continue
                  strenge zelfcontrole.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            {testimonials.map((t) => (
              <figure key={t.name} className="rounded-2xl bg-white p-8 shadow-sm">
                <blockquote className="font-display text-xl leading-snug">“{t.quote}”</blockquote>
                <figcaption className="mt-4 text-sm font-bold uppercase tracking-wider text-crust">
                  {t.name}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="relative overflow-hidden bg-white py-24">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[1fr_1.4fr]">
            <div>
              <h2 className="font-display text-4xl sm:text-5xl">Contacteer ons</h2>
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
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

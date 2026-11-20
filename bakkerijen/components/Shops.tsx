import GoogleMap from "@/components/GoogleMap";
import Reveal from "@/components/Reveal";
import { getContent } from "@/lib/cms";
import { addressLine, hoursLines, routeUrl, telHref } from "@/lib/shop-types";
import { getSiteShops } from "@/lib/shops";
import { site } from "@/lib/site";

/** Adres, openingsuren en kaart van de winkel(s). De gegevens komen uit de gedeelde winkellijst. */
export default async function Shops() {
  const [shops, c] = await Promise.all([getSiteShops(), getContent()]);
  const onBrand = site.style?.shopsOnBrand;

  return (
    <section id="winkels" className={`scroll-mt-24 ${onBrand ? "bg-brand text-on-brand" : ""}`}>
      <div className="mx-auto max-w-6xl px-5 py-24">
      <Reveal>
        <h2 className={`font-display text-4xl md:text-5xl ${onBrand ? "" : "text-brand"}`}>{c["shops.title"]}</h2>
      </Reveal>
      <div className="mt-10">
        <ul className="grid gap-10">
          {shops.map((s, i) => {
            const k = `shop${i + 1}`;
            const lines = hoursLines(s?.hours ?? null);
            return (
              <Reveal as="li" key={k} delay={i * 120} className="grid gap-6 md:grid-cols-2">
                <div className={onBrand ? "py-2" : "lift rounded-2xl bg-white p-6 shadow-md shadow-ink/10 md:p-8"}>
                <h3 className={`font-display text-2xl ${onBrand ? "font-bold" : "text-brand"}`}>{c[`${k}.label`]}</h3>
                {s ? (
                  <div className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-[1.25fr_1fr]">
                    <address className="not-italic leading-relaxed">
                      <p>
                        {s.street}
                        <br />
                        {s.postal_code} {s.city}
                      </p>
                      {s.phone && (
                        <p className="mt-3">
                          <a href={telHref(s.phone)} className={`font-bold ${onBrand ? "underline underline-offset-4" : "text-brand hover:text-ink"}`}>
                            {s.phone}
                          </a>
                        </p>
                      )}
                      {c[`${k}.email`] && (
                        <p className="mt-1 text-sm [overflow-wrap:anywhere]">
                          <a href={`mailto:${c[`${k}.email`]}`} className="underline underline-offset-2 hover:text-brand">
                            {c[`${k}.email`]}
                          </a>
                        </p>
                      )}
                      {c[`${k}.vat`] && <p className="mt-3 text-sm text-ink/60">{c[`${k}.vat`]}</p>}
                    </address>
                    {lines.length > 0 && (
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-wider ${onBrand ? "text-on-brand/70" : "text-ink/50"}`}>Openingsuren</p>
                        <ul className="mt-2 grid gap-0.5">
                          {lines.map((l) => (
                            <li key={l}>{l}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2 sm:col-span-2">
                      <a href={routeUrl(s)} target="_blank" rel="noopener noreferrer" className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${onBrand ? "bg-white text-brand hover:bg-dark hover:text-white" : "bg-brand text-on-brand hover:bg-dark"}`}>
                        Route
                      </a>
                      {s.phone && (
                        <a href={telHref(s.phone)} className={`rounded-full border-2 px-5 py-2 text-sm font-bold transition ${onBrand ? "border-white/50 hover:border-white" : "border-ink/15 hover:border-brand hover:text-brand"}`}>
                          Bel
                        </a>
                      )}
                      {s.webshop_url && (
                        <a href={/^https?:/i.test(s.webshop_url) ? s.webshop_url : `https://${s.webshop_url}`} target="_blank" rel="noopener noreferrer" className="rounded-full border-2 border-brand px-5 py-2 text-sm font-bold text-brand transition hover:bg-brand hover:text-on-brand">
                          Webshop ↗
                        </a>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-ink/70">De gegevens van deze winkel zijn tijdelijk niet beschikbaar.</p>
                )}
                </div>
                {s && <GoogleMap address={addressLine(s)} label={c[`${k}.label`]} />}
              </Reveal>
            );
          })}
        </ul>
      </div>
      </div>
    </section>
  );
}

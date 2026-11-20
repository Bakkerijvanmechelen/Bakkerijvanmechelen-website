import Image from "next/image";
import { hoursLines, kindLabel, routeUrl, telHref, websiteLabel, websiteUrl, type Shop } from "@/lib/shop-types";

type CardShop = Pick<Shop, "name" | "kind" | "street" | "postal_code" | "city" | "phone" | "fax" | "note" | "website" | "webshop_url" | "google_url" | "hours" | "logo_url"> & { id?: string };

function Logo({ shop }: { shop: CardShop }) {
  const box = "grid size-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10";
  if (shop.logo_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <span className={box}><img src={shop.logo_url} alt="" loading="lazy" className="max-h-full max-w-full object-contain p-2" /></span>;
  }
  if (shop.kind === "eigen") {
    return (
      <span className={box}>
        <Image src="/images/logo.jpg" alt="" width={200} height={70} className="w-full object-contain p-1.5" />
      </span>
    );
  }
  return <span className={`${box} bg-blue-soft font-display text-2xl text-blue`}>{shop.name.replace(/^(Bakkerij|Gijbels)\s+/i, "").charAt(0).toUpperCase()}</span>;
}

/** Eén winkel, zoals bezoekers hem zien. Ook gebruikt voor het voorbeeld in het beheer. */
export default function ShopCard({ shop, active, onSelect }: { shop: CardShop; active?: boolean; onSelect?: () => void }) {
  const lines = hoursLines(shop.hours);
  const head = (
    <>
      <Logo shop={shop} />
      <span className="min-w-0">
        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${shop.kind === "eigen" ? "bg-butter text-ink" : "bg-blue-soft text-blue"}`}>{kindLabel[shop.kind]}</span>
        <span className="mt-1.5 block font-display text-xl leading-snug">{shop.name || "Naam van de winkel"}</span>
        <span className="mt-0.5 block text-ink/70">
          {shop.street || "Straat en nummer"}, {shop.postal_code || "0000"} {shop.city || "Gemeente"}
        </span>
      </span>
    </>
  );

  return (
    <article id={shop.id ? `shop-${shop.id}` : undefined} className={`@container lift flex flex-col rounded-2xl bg-paper p-5 shadow-sm ring-1 transition ${active ? "shadow-lg ring-2 ring-crust" : "ring-ink/10"}`}>
      {onSelect ? (
        <button type="button" onClick={onSelect} className="flex w-full items-start gap-4 text-left" aria-label={`${shop.name} tonen op de kaart`}>
          {head}
        </button>
      ) : (
        <div className="flex items-start gap-4">{head}</div>
      )}

      <div className="mt-4 grid gap-x-6 @lg:grid-cols-2">
        <div className="flex flex-col">
      {shop.note && <p className="mt-4 text-sm text-ink/70">{shop.note}</p>}

      {(shop.phone || shop.fax || shop.website) && (
        <ul className="mt-4 grid gap-1 text-sm">
          {shop.phone && (
            <li>
              <span className="text-ink/50">Tel </span>
              <a href={telHref(shop.phone)} className="font-bold hover:text-blue">{shop.phone}</a>
            </li>
          )}
          {shop.fax && (
            <li>
              <span className="text-ink/50">Fax </span>
              {shop.fax}
            </li>
          )}
          {shop.website && (
            <li>
              <a href={websiteUrl(shop.website)} target="_blank" rel="noopener noreferrer" className="font-bold text-blue underline underline-offset-2">
                {websiteLabel(shop.website)}
              </a>
            </li>
          )}
        </ul>
      )}

      <div className="mt-auto flex flex-wrap gap-2 pt-5">
        <a
          href={shop.street && shop.city ? routeUrl(shop) : "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-blue px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-deep"
        >
          Route
        </a>
        {shop.phone && (
          <a href={telHref(shop.phone)} className="rounded-full border-2 border-ink/15 px-5 py-2 text-sm font-bold transition hover:border-blue hover:text-blue">
            Bel
          </a>
        )}
        {shop.webshop_url && (
          <a href={websiteUrl(shop.webshop_url)} target="_blank" rel="noopener noreferrer" className="rounded-full border-2 border-blue px-5 py-2 text-sm font-bold text-blue transition hover:bg-blue hover:text-white">
            Webshop ↗
          </a>
        )}
      </div>
        </div>
      {lines.length > 0 && (
        <div className="mt-4 self-start rounded-2xl bg-cream p-4 @lg:mt-0">
          <p className="text-xs font-bold uppercase tracking-wider text-ink/50">Openingsuren</p>
          <ul className="mt-2 grid gap-0.5 text-sm">
            {lines.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
          {shop.google_url && (
            <a href={websiteUrl(shop.google_url)} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-xs font-bold text-blue underline underline-offset-2">
              Actuele uren op Google ↗
            </a>
          )}
        </div>
      )}

      </div>
    </article>
  );
}

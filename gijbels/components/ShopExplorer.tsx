"use client";

import { useMemo, useState } from "react";
import { addressLine, type Shop } from "@/lib/shop-types";
import ShopCard from "./ShopCard";

type Filter = "alle" | "eigen" | "groep";

/**
 * Lijst van alle winkels met een Google Maps-kaart (zonder API-sleutel).
 * Zo'n kaart toont één adres tegelijk: de aangeklikte winkel, of de eerste uit de lijst.
 */
export default function ShopExplorer({ shops }: { shops: Shop[] }) {
  const [filter, setFilter] = useState<Filter>("alle");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | null>(null);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return shops.filter((s) => (filter === "alle" || s.kind === filter) && (!q || `${s.name} ${s.city} ${s.postal_code} ${s.street}`.toLowerCase().includes(q)));
  }, [shops, filter, query]);

  const current = shown.find((s) => s.id === active) ?? shown[0];
  const address = current ? addressLine(current) : "";
  const q = encodeURIComponent(address);

  const select = (s: Shop) => {
    setActive(s.id);
    if (window.matchMedia("(max-width: 1023px)").matches) document.getElementById("winkelkaart")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const tab = (key: Filter, label: string, count: number) => (
    <button key={key} type="button" role="tab" aria-selected={filter === key} onClick={() => setFilter(key)} className={`rounded-full px-5 py-2.5 font-bold transition ${filter === key ? "bg-blue text-white" : "bg-paper ring-1 ring-ink/10 hover:bg-blue-soft"}`}>
      {label} <span className="opacity-70">({count})</span>
    </button>
  );

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" aria-label="Soort winkel" className="flex flex-wrap gap-2">
          {tab("alle", "Alle", shops.length)}
          {tab("eigen", "Gijbels-winkels", shops.filter((s) => s.kind === "eigen").length)}
          {tab("groep", "In de groep", shops.filter((s) => s.kind === "groep").length)}
        </div>
        <label className="relative block w-full sm:w-72">
          <span className="sr-only">Zoek op gemeente of naam</span>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Zoek op gemeente of naam" className="w-full rounded-full border-0 bg-paper px-5 py-3 ring-1 ring-ink/15 outline-none focus:ring-2 focus:ring-blue" />
        </label>
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <div className="order-2 lg:order-1">
          <ul className="grid gap-4">
            {shown.map((s) => (
              <li key={s.id}>
                <ShopCard shop={s} active={current?.id === s.id} onSelect={() => select(s)} />
              </li>
            ))}
          </ul>
          {shown.length === 0 && (
            <p className="rounded-2xl bg-paper p-10 text-center text-lg text-ink/70 ring-1 ring-ink/10" role="status">
              Geen winkel gevonden voor “{query}”.
            </p>
          )}
        </div>

        {current && (
          <div id="winkelkaart" className="order-1 scroll-mt-24 lg:sticky lg:top-24 lg:order-2">
            <div className="overflow-hidden rounded-2xl bg-paper shadow-md shadow-ink/10 ring-1 ring-ink/10">
              <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                <div aria-live="polite">
                  <p className="font-display text-xl text-blue">{current.name}</p>
                  <p className="text-sm text-ink/70">{address}</p>
                </div>
                <a href={`https://www.google.com/maps/search/?api=1&query=${q}`} target="_blank" rel="noopener noreferrer" className="rounded-full border-2 border-ink/15 px-4 py-2 text-sm font-bold transition hover:border-blue hover:text-blue">
                  Openen in Google Maps ↗
                </a>
              </div>
              <iframe
                key={current.id}
                title={`Kaart: ${current.name}`}
                src={`https://maps.google.com/maps?q=${q}&z=15&output=embed`}
                width="100%"
                height="100%"
                className="block h-[340px] w-full border-0 lg:h-[calc(100vh-14rem)] lg:min-h-[420px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
            <p className="mt-3 px-2 text-sm text-ink/60">Klik op een winkel in de lijst om ze op de kaart te tonen.</p>
          </div>
        )}
      </div>
    </div>
  );
}

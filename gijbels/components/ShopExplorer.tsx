"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Map as LMap, LayerGroup, Marker } from "leaflet";
import { addressLine, routeUrl, type Shop } from "@/lib/shop-types";
import ShopCard from "./ShopCard";

type Filter = "alle" | "eigen" | "groep";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const pin = (color: string, size: number) =>
  `<svg viewBox="0 0 24 34" width="${size}" height="${Math.round(size * 1.42)}" aria-hidden="true"><path d="M12 0C5.4 0 0 5.2 0 11.7 0 20 12 34 12 34s12-14 12-22.3C24 5.2 18.6 0 12 0z" fill="${color}" stroke="#fff" stroke-width="1.5"/><circle cx="12" cy="11.5" r="4.5" fill="#fff"/></svg>`;

/** Kaart en lijst van alle winkels: klik op een kaart of een speld en de andere volgt. */
export default function ShopExplorer({ shops }: { shops: Shop[] }) {
  const [filter, setFilter] = useState<Filter>("alle");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const mapEl = useRef<HTMLDivElement>(null);
  const map = useRef<LMap | null>(null);
  const layer = useRef<LayerGroup | null>(null);
  const markers = useRef(new Map<string, Marker>());
  const leaflet = useRef<typeof import("leaflet") | null>(null);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return shops.filter((s) => (filter === "alle" || s.kind === filter) && (!q || `${s.name} ${s.city} ${s.postal_code} ${s.street}`.toLowerCase().includes(q)));
  }, [shops, filter, query]);

  // Kaart opbouwen
  useEffect(() => {
    let m: LMap | undefined;
    (async () => {
      const L = (await import("leaflet")).default;
      if (!mapEl.current) return;
      leaflet.current = L;
      m = L.map(mapEl.current, { scrollWheelZoom: false }).setView([51.23, 4.5], 10);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(m);
      layer.current = L.layerGroup().addTo(m);
      map.current = m;
      m.on("click", () => m?.scrollWheelZoom.enable());
      m.on("mouseout", () => m?.scrollWheelZoom.disable());
      setReady(true);
    })();
    return () => {
      m?.remove();
      map.current = null;
    };
  }, []);

  // Spelden bijwerken bij elke filter of zoekopdracht
  useEffect(() => {
    const L = leaflet.current;
    if (!ready || !L || !map.current || !layer.current) return;
    layer.current.clearLayers();
    markers.current.clear();
    const points: [number, number][] = [];
    for (const s of shown) {
      if (s.lat == null || s.lng == null) continue;
      const own = s.kind === "eigen";
      const icon = L.divIcon({ className: "", html: pin(own ? "#c8873a" : "#263f8f", own ? 34 : 28), iconSize: [own ? 34 : 28, own ? 48 : 40], iconAnchor: [own ? 17 : 14, own ? 48 : 40], popupAnchor: [0, -40] });
      const marker = L.marker([s.lat, s.lng], { icon, title: s.name })
        .addTo(layer.current)
        .bindPopup(`<strong>${esc(s.name)}</strong><br>${esc(addressLine(s))}<br><a href="${routeUrl(s)}" target="_blank" rel="noopener noreferrer" style="color:#263f8f;font-weight:700">Routebeschrijving</a>`)
        .on("click", () => {
          setActive(s.id);
          document.getElementById(`shop-${s.id}`)?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        });
      markers.current.set(s.id, marker);
      points.push([s.lat, s.lng]);
    }
    if (points.length) map.current.fitBounds(points, { padding: [50, 50], maxZoom: 13 });
  }, [ready, shown]);

  const select = (s: Shop) => {
    setActive(s.id);
    if (s.lat != null && s.lng != null && map.current) {
      map.current.flyTo([s.lat, s.lng], 14, { duration: 0.8 });
      markers.current.get(s.id)?.openPopup();
    }
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
                <ShopCard shop={s} active={active === s.id} onSelect={() => select(s)} />
              </li>
            ))}
          </ul>
          {shown.length === 0 && (
            <p className="rounded-2xl bg-paper p-10 text-center text-lg text-ink/70 ring-1 ring-ink/10" role="status">
              Geen winkel gevonden voor “{query}”.
            </p>
          )}
        </div>

        <div className="order-1 lg:sticky lg:top-24 lg:order-2">
          <div ref={mapEl} role="region" aria-label="Kaart met alle bakkerijen" className="h-[340px] w-full overflow-hidden rounded-2xl bg-blue-soft shadow-md shadow-ink/10 ring-1 ring-ink/10 lg:h-[calc(100vh-8rem)] lg:min-h-[480px]" />
          <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 px-2 text-sm text-ink/60">
            <span><span className="mr-1.5 inline-block size-2.5 rounded-full bg-crust" />Gijbels-winkel</span>
            <span><span className="mr-1.5 inline-block size-2.5 rounded-full bg-blue" />Bakkerij in de groep</span>
          </p>
        </div>
      </div>
    </div>
  );
}

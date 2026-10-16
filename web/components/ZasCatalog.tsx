"use client";

import Image from "next/image";
import { useState } from "react";
import { openReport } from "./ReportDialog";

export type ZasDoc = {
  id: string;
  title: string;
  description: string | null;
  file_name: string;
  size_bytes: number | null;
  viewUrl?: string;
  downloadUrl?: string;
};
export type ZasGroup = { product: string; docs: ZasDoc[] };

const size = (b: number | null) =>
  b == null ? "" : b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`;
const ext = (name: string) => name.split(".").pop()?.toUpperCase() ?? "";

/** Kiest een foto bij de naam van de categorie; onbekende categorieën krijgen een standaardfoto. */
function photo(name: string) {
  const n = name.toLowerCase();
  if (n.includes("pistolet")) return "/images/pistolets-industriele-bakker.jpg";
  if (n.includes("koek")) return "/images/koffiekoeken-industriele-bakker.jpg";
  if (n.includes("patisserie") || n.includes("pattiserie") || n.includes("vlaai")) return "/images/pattiserie-industriele-bakker.jpg";
  if (n.includes("brood")) return "/images/bakkerij-van-mechelen-2.jpg";
  return "/images/ambachtelijk-brood.jpg";
}

function Highlight({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q);
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded bg-sage-light px-0.5 text-ink">{text.slice(i, i + q.length)}</mark>
      {text.slice(i + q.length)}
    </>
  );
}

function FileIcon({ kind }: { kind: string }) {
  const pdf = kind === "PDF";
  return (
    <span className={`grid size-14 shrink-0 place-items-center rounded-2xl text-xs font-bold tracking-wide ${pdf ? "bg-crust/10 text-crust" : "bg-ink/10 text-ink/70"}`}>
      <span className="grid place-items-center gap-0.5">
        <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M6 2h8l5 5v15H6z" />
          <path d="M14 2v5h5" />
        </svg>
        {kind}
      </span>
    </span>
  );
}

export default function ZasCatalog({ groups }: { groups: ZasGroup[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Set<string>>(new Set());
  const q = query.trim().toLowerCase();
  const total = groups.reduce((n, g) => n + g.docs.length, 0);

  const shown = groups
    .map((g) => ({
      ...g,
      docs: q ? g.docs.filter((d) => `${d.title} ${d.description ?? ""}`.toLowerCase().includes(q)) : g.docs,
    }))
    .filter((g) => !q || g.docs.length);
  const hits = shown.reduce((n, g) => n + g.docs.length, 0);

  const toggle = (product: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (!next.delete(product)) next.add(product);
      return next;
    });

  return (
    <div>
      {/* Zoekbalk die over de rand van de header zweeft */}
      <div className="relative z-10 -mt-10 rounded-3xl bg-white p-3 shadow-xl shadow-ink/10 ring-1 ring-ink/5 sm:p-4">
        <label htmlFor="zas-search" className="sr-only">
          Zoek een artikel
        </label>
        <div className="flex items-center gap-3 rounded-2xl bg-flour px-4 py-1 focus-within:ring-2 focus-within:ring-crust/40">
          <svg viewBox="0 0 24 24" className="size-6 shrink-0 text-ink/50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            id="zas-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Zoek een artikel, bijvoorbeeld “pistolet”${total ? ` (${total} fiches)` : ""}`}
            className="w-full bg-transparent py-4 text-lg outline-none placeholder:text-ink/40"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Zoekopdracht wissen" className="grid size-8 shrink-0 place-items-center rounded-full bg-ink/10 hover:bg-ink/20">
              ✕
            </button>
          )}
        </div>
        {q && (
          <p className="px-2 pt-3 text-sm text-ink/60" role="status">
            {hits === 0 ? "Geen artikel gevonden." : `${hits} artikel${hits === 1 ? "" : "en"} gevonden.`}
          </p>
        )}
      </div>

      <div className="mt-8 grid gap-5">
        {shown.map((g, gi) => {
          const isOpen = !!q || open.has(g.product);
          const empty = g.docs.length === 0;
          return (
            <section key={g.product} data-open={isOpen} className="zas-cat overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-ink/5 transition hover:shadow-lg" style={{ animationDelay: `${gi * 70}ms` }}>
              <h2>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`zas-${gi}`}
                  onClick={() => toggle(g.product)}
                  className="group relative flex h-32 w-full items-center justify-between overflow-hidden text-left text-flour sm:h-40"
                >
                  <Image src={photo(g.product)} alt="" fill sizes="(min-width: 1152px) 1100px, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
                  <span className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/55 to-ink/10" />
                  <span className="relative px-6 sm:px-10">
                    <span className="block font-display text-3xl sm:text-4xl">{g.product}</span>
                    <span className="mt-2 inline-block rounded-full bg-flour/20 px-3 py-1 text-sm font-bold backdrop-blur">
                      {empty ? "Binnenkort beschikbaar" : `${g.docs.length} technische fiche${g.docs.length === 1 ? "" : "s"}`}
                    </span>
                  </span>
                  <span className="relative mr-6 grid size-12 place-items-center rounded-full bg-flour text-ink transition group-hover:bg-sage-light sm:mr-10">
                    <svg viewBox="0 0 20 20" className={`size-5 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="m4 7 6 6 6-6" />
                    </svg>
                  </span>
                </button>
              </h2>

              <div id={`zas-${gi}`} className={`grid transition-[grid-template-rows] duration-500 ease-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  {empty ? (
                    <p className="px-6 py-8 text-ink/60 sm:px-10">Voor deze groep zijn nog geen technische fiches beschikbaar.</p>
                  ) : (
                    <ul className="grid gap-3 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
                      {g.docs.map((d, i) => {
                        const kind = ext(d.file_name);
                        return (
                          <li key={d.id} className="doc-card group/card flex flex-col gap-4 rounded-2xl border border-ink/10 bg-white p-4 transition hover:-translate-y-1 hover:border-crust/40 hover:shadow-lg" style={{ ["--i" as string]: Math.min(i, 12) }}>
                            <div className="flex items-start gap-4">
                              <FileIcon kind={kind} />
                              <div className="min-w-0">
                                <h3 className="text-lg font-bold leading-snug">
                                  <Highlight text={d.title} q={q} />
                                </h3>
                                {d.description && <p className="mt-0.5 text-sm text-ink/60">{d.description}</p>}
                                <p className="mt-1 text-xs text-ink/50">{[kind, size(d.size_bytes)].filter(Boolean).join(" · ")}</p>
                              </div>
                            </div>
                            <div className="mt-auto flex items-center gap-2">
                              {d.viewUrl && (
                                <a href={d.viewUrl} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-full bg-ink px-4 py-2.5 text-center font-bold text-flour transition hover:bg-crust">
                                  Raadplegen
                                </a>
                              )}
                              {d.downloadUrl && (
                                <a href={d.downloadUrl} aria-label={`Download ${d.title}`} title="Downloaden" className="grid size-11 place-items-center rounded-full border-2 border-ink/15 transition hover:border-crust hover:text-crust">
                                  <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                    <path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14" />
                                  </svg>
                                </a>
                              )}
                              <button type="button" onClick={() => openReport(d.title)} aria-label={`Probleem melden over ${d.title}`} title="Probleem melden" className="grid size-11 place-items-center rounded-full border-2 border-ink/15 transition hover:border-crust hover:text-crust">
                                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                  <path d="M5 21V4m0 0h11l-2 4 2 4H5" />
                                </svg>
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            </section>
          );
        })}

        {q && shown.length === 0 && (
          <div className="rounded-3xl bg-white px-6 py-14 text-center shadow-sm">
            <p className="font-display text-2xl">Geen artikel gevonden voor “{query}”</p>
            <p className="mt-2 text-ink/60">Controleer de schrijfwijze, of zoek op een deel van de naam.</p>
            <button onClick={() => openReport()} className="mt-5 font-bold text-crust underline">
              Mist u een fiche? Meld het ons
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

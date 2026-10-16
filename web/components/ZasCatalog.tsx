"use client";

import { useState } from "react";

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

function PdfIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
      <path d="M6 2h8l5 5v15H6z" />
      <path d="M14 2v5h5" />
      <path d="M9 17c2-3 3-6 3-8 0-1-1-1-1 0 0 2 2 5 5 6-3 0-6 1-7 2z" />
    </svg>
  );
}

export default function ZasCatalog({ groups }: { groups: ZasGroup[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Set<string>>(new Set());
  const q = query.trim().toLowerCase();

  const shown = groups
    .map((g) => ({
      ...g,
      docs: q ? g.docs.filter((d) => `${d.title} ${d.description ?? ""}`.toLowerCase().includes(q)) : g.docs,
    }))
    .filter((g) => !q || g.docs.length);

  const toggle = (product: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (!next.delete(product)) next.add(product);
      return next;
    });

  return (
    <div>
      <label className="block text-sm font-bold" htmlFor="zas-search">
        Zoek een artikel
      </label>
      <input
        id="zas-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Bijvoorbeeld: pistolet wit"
        className="mt-1 w-full rounded-lg border border-ink/20 bg-white px-4 py-3 text-base outline-none focus:border-crust focus:ring-2 focus:ring-crust/30"
      />

      <div className="mt-8 border-t border-ink">
        {shown.map((g) => {
          const isOpen = !!q || open.has(g.product);
          return (
            <section key={g.product} className="border-b border-ink">
              <h2>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`zas-${g.product}`}
                  onClick={() => toggle(g.product)}
                  className="flex w-full items-center justify-between bg-ink/5 px-5 py-5 text-left text-lg uppercase tracking-wide transition hover:bg-ink/10"
                >
                  <span>
                    {g.product}
                    <span className="ml-3 text-sm normal-case text-ink/50">{g.docs.length}</span>
                  </span>
                  <svg
                    viewBox="0 0 20 20"
                    className={`size-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path d="m4 7 6 6 6-6" />
                  </svg>
                </button>
              </h2>
              <div
                id={`zas-${g.product}`}
                className={`grid transition-[grid-template-rows] duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
              >
                <div className="overflow-hidden">
                  {g.docs.length === 0 ? (
                    <p className="px-5 py-5 text-ink/60">Er zijn voor deze groep nog geen technische fiches beschikbaar.</p>
                  ) : (
                    <ul className="grid gap-x-12 px-5 py-4 sm:grid-cols-2 lg:grid-cols-3">
                      {g.docs.map((d) => (
                        <li key={d.id} className="flex items-center justify-between gap-3 border-b border-ink py-3">
                          <a
                            href={d.viewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex-1 text-lg transition hover:text-crust"
                            title="Technische fiche raadplegen"
                          >
                            {d.title}
                            {d.description && <span className="block text-sm text-ink/60">{d.description}</span>}
                          </a>
                          <span className="flex items-center gap-3">
                            <a href={d.viewUrl} target="_blank" rel="noopener noreferrer" aria-label={`Raadpleeg ${d.title}`} className="text-sage transition hover:text-crust">
                              <PdfIcon />
                            </a>
                            <a href={d.downloadUrl} aria-label={`Download ${d.title}`} className="text-xs font-bold uppercase text-ink/50 underline hover:text-crust">
                              {ext(d.file_name)} · {size(d.size_bytes)}
                            </a>
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </section>
          );
        })}
        {q && shown.length === 0 && <p className="py-8 text-center text-ink/60">Geen artikel gevonden voor “{query}”.</p>}
      </div>
    </div>
  );
}

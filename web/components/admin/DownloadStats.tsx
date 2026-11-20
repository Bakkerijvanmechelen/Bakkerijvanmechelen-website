"use client";

import { useMemo, useState } from "react";

export type StatRow = { id: string; title: string; category: string; thisMonth: number; thisYear: number };

const monthName = new Intl.DateTimeFormat("nl-BE", { month: "long", timeZone: "Europe/Brussels" }).format(new Date());
const year = new Intl.DateTimeFormat("nl-BE", { year: "numeric", timeZone: "Europe/Brussels" }).format(new Date());

/** Overzicht van de downloads per technische fiche, met zoeken en sorteren. */
export default function DownloadStats({ rows }: { rows: StatRow[] }) {
  const [sort, setSort] = useState<"thisYear" | "thisMonth" | "title">("thisYear");
  const [q, setQ] = useState("");
  const [all, setAll] = useState(false);

  const sorted = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = rows.filter((r) => !needle || r.title.toLowerCase().includes(needle) || r.category.toLowerCase().includes(needle));
    return list.sort((a, b) => (sort === "title" ? a.title.localeCompare(b.title, "nl") : b[sort] - a[sort] || a.title.localeCompare(b.title, "nl")));
  }, [rows, sort, q]);

  const totalMonth = rows.reduce((n, r) => n + r.thisMonth, 0);
  const totalYear = rows.reduce((n, r) => n + r.thisYear, 0);
  const shown = all || q ? sorted : sorted.slice(0, 15);
  const th = (key: typeof sort, label: string, right = false) => (
    <th className={`py-2 ${right ? "text-right" : "text-left"}`}>
      <button type="button" onClick={() => setSort(key)} className={`font-bold hover:underline ${sort === key ? "text-ink" : "text-ink/60"}`}>
        {label}
        {sort === key && " ↓"}
      </button>
    </th>
  );

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-3 sm:max-w-md">
        <div className="rounded-xl bg-ink/5 p-4">
          <p className="text-sm text-ink/60 first-letter:uppercase">{monthName}</p>
          <p className="text-3xl font-bold">{totalMonth}</p>
        </div>
        <div className="rounded-xl bg-ink/5 p-4">
          <p className="text-sm text-ink/60">{year}</p>
          <p className="text-3xl font-bold">{totalYear}</p>
        </div>
      </div>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Zoek een fiche of categorie"
        className="w-full rounded-lg border border-ink/20 px-4 py-2.5 sm:max-w-md"
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-sm">
          <thead className="border-b border-ink/15">
            <tr>
              {th("title", "Technische fiche")}
              {th("thisMonth", "Deze maand", true)}
              {th("thisYear", "Dit jaar", true)}
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id} className="border-b border-ink/10 last:border-0">
                <td className="py-2 pr-4">
                  <span className="font-bold">{r.title}</span>
                  <span className="block text-xs text-ink/60">{r.category}</span>
                </td>
                <td className="py-2 text-right tabular-nums">{r.thisMonth}</td>
                <td className="py-2 text-right tabular-nums">{r.thisYear}</td>
              </tr>
            ))}
            {!shown.length && (
              <tr>
                <td colSpan={3} className="py-4 text-ink/60">Geen fiches gevonden.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {!q && sorted.length > 15 && (
        <button type="button" onClick={() => setAll(!all)} className="justify-self-start text-sm font-bold underline">
          {all ? "Toon minder" : `Toon alle ${sorted.length} fiches`}
        </button>
      )}
    </div>
  );
}

"use client";

import { useActionState, useState } from "react";
import { deleteDocument, updateDocument, type FormState } from "@/app/admin/actions";
import ConfirmButton from "./ConfirmButton";
import { fieldCls, primaryBtn, secondaryBtn } from "./ui";

type Doc = { id: string; title: string; fileName: string; size: number | null; createdAt: string; viewUrl?: string };
type Group = { id: string; name: string; docs: Doc[] };
type Cat = { id: string; name: string };

const size = (b: number | null) => (b == null ? "" : b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);
const date = (iso: string) => new Intl.DateTimeFormat("nl-BE", { dateStyle: "medium", timeZone: "Europe/Brussels" }).format(new Date(iso));

function DocRow({ doc, groupId, categories }: { doc: Doc; groupId: string; categories: Cat[] }) {
  const [editing, setEditing] = useState(false);
  const [state, action, pending] = useActionState<FormState, FormData>(async (p, fd) => {
    const r = await updateDocument(p, fd);
    if (r?.ok) setEditing(false);
    return r;
  }, null);

  return (
    <li className="py-4">
      {editing ? (
        <form action={action} className="grid gap-3 rounded-xl bg-flour p-4">
          <input type="hidden" name="id" value={doc.id} />
          <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
            <label className="grid gap-1 font-bold">
              Naam
              <input name="title" defaultValue={doc.title} required maxLength={160} className={fieldCls} />
            </label>
            <label className="grid gap-1 font-bold">
              Categorie
              <select name="category" defaultValue={groupId} className={fieldCls}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {state && !state.ok && <p role="alert" className="font-bold text-red-700">{state.message}</p>}
          <div className="flex gap-3">
            <button disabled={pending} className={primaryBtn}>
              {pending ? "Bezig…" : "Opslaan"}
            </button>
            <button type="button" onClick={() => setEditing(false)} className={secondaryBtn}>
              Annuleren
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-lg font-bold">{doc.title}</p>
            <p className="text-sm text-ink/60">
              {doc.fileName} · {size(doc.size)} · toegevoegd op {date(doc.createdAt)}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {doc.viewUrl && (
              <a href={doc.viewUrl} target="_blank" rel="noopener noreferrer" className={secondaryBtn}>
                Bekijken
              </a>
            )}
            <button onClick={() => setEditing(true)} className={secondaryBtn}>
              Naam of categorie wijzigen
            </button>
            <ConfirmButton
              label="Verwijderen"
              question={`“${doc.title}” definitief verwijderen?`}
              confirmLabel="Ja, verwijderen"
              action={deleteDocument.bind(null, doc.id)}
            />
          </div>
        </div>
      )}
    </li>
  );
}

export default function DocumentList({ groups, categories }: { groups: Group[]; categories: Cat[] }) {
  const [q, setQ] = useState("");
  const total = groups.reduce((n, g) => n + g.docs.length, 0);
  const query = q.trim().toLowerCase();
  const shown = groups
    .map((g) => ({ ...g, docs: query ? g.docs.filter((d) => `${d.title} ${d.fileName}`.toLowerCase().includes(query)) : g.docs }))
    .filter((g) => g.docs.length);

  if (total === 0) {
    return (
      <div className="rounded-xl bg-flour px-6 py-10 text-center">
        <p className="font-display text-xl">Er staan nog geen documenten op de ZAS-pagina.</p>
        <p className="mt-1 text-ink/70">Voeg hierboven je eerste technische fiche toe.</p>
      </div>
    );
  }

  return (
    <div>
      <label className="grid gap-1 font-bold sm:max-w-md">
        Zoek een document
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Bijvoorbeeld: pistolet" className={fieldCls} />
      </label>

      <div className="mt-6 grid gap-3">
        {shown.map((g) => (
          <details key={g.id} open={total <= 40 || !!query} className="group rounded-xl border-2 border-ink/10">
            <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl bg-flour px-5 py-4 text-lg font-bold group-open:rounded-b-none">
              <span>
                {g.name} <span className="ml-2 text-base font-normal text-ink/60">{g.docs.length} document{g.docs.length === 1 ? "" : "en"}</span>
              </span>
              <span aria-hidden className="transition group-open:rotate-180">
                ⌄
              </span>
            </summary>
            <ul className="divide-y divide-ink/10 px-5">
              {g.docs.map((d) => (
                <DocRow key={d.id} doc={d} groupId={g.id} categories={categories} />
              ))}
            </ul>
          </details>
        ))}
        {shown.length === 0 && <p className="py-6 text-center text-ink/60">Geen document gevonden voor “{q}”.</p>}
      </div>
    </div>
  );
}

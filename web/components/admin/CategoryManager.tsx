"use client";

import { useActionState, useState, useTransition } from "react";
import { createCategory, deleteCategory, moveCategory, renameCategory, type FormState } from "@/app/admin/actions";
import { dangerBtn, fieldCls, primaryBtn, secondaryBtn } from "./ui";

type Cat = { id: string; name: string; count: number };

const note = (s: FormState) =>
  s && (
    <p role={s.ok ? "status" : "alert"} className={`font-bold ${s.ok ? "text-green-800" : "text-red-700"}`}>
      {s.ok ? "✓ " : ""}
      {s.message}
    </p>
  );

function AddCategory() {
  const [state, action, pending] = useActionState<FormState, FormData>(async (p, fd) => {
    const r = await createCategory(p, fd);
    if (r?.ok) (document.getElementById("new-cat") as HTMLInputElement | null)?.form?.reset();
    return r;
  }, null);
  return (
    <form action={action} className="grid gap-2">
      <label htmlFor="new-cat" className="font-bold">
        Nieuwe categorie
      </label>
      <div className="flex flex-wrap gap-3">
        <input id="new-cat" name="name" required maxLength={60} placeholder="Bijvoorbeeld: Broodjes" className={`${fieldCls} sm:max-w-sm`} />
        <button disabled={pending} className={primaryBtn}>
          {pending ? "Bezig…" : "+ Toevoegen"}
        </button>
      </div>
      {note(state)}
    </form>
  );
}

function Row({ cat, first, last, busy, onMove }: { cat: Cat; first: boolean; last: boolean; busy: boolean; onMove: (dir: "up" | "down") => void }) {
  const [renameState, rename, renaming] = useActionState<FormState, FormData>(renameCategory, null);
  const [delState, del, deleting] = useActionState<FormState, FormData>(deleteCategory, null);
  const [confirming, setConfirming] = useState(false);
  const [typed, setTyped] = useState("");
  const [name, setName] = useState(cat.name);
  const changed = name.trim() !== cat.name;

  return (
    <li className="rounded-xl border-2 border-ink/10 p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-col gap-1" role="group" aria-label={`Volgorde van ${cat.name}`}>
          <button type="button" onClick={() => onMove("up")} disabled={first || busy} aria-label={`${cat.name} hoger zetten`} title="Hoger zetten" className="grid size-8 place-items-center rounded-lg border-2 border-ink/20 text-sm font-bold transition hover:border-crust hover:text-crust disabled:opacity-30 disabled:hover:border-ink/20 disabled:hover:text-ink">
            ▲
          </button>
          <button type="button" onClick={() => onMove("down")} disabled={last || busy} aria-label={`${cat.name} lager zetten`} title="Lager zetten" className="grid size-8 place-items-center rounded-lg border-2 border-ink/20 text-sm font-bold transition hover:border-crust hover:text-crust disabled:opacity-30 disabled:hover:border-ink/20 disabled:hover:text-ink">
            ▼
          </button>
        </div>
        <form action={rename} className="flex min-w-60 flex-1 flex-wrap items-center gap-3">
          <input type="hidden" name="id" value={cat.id} />
          <input name="name" value={name} onChange={(e) => setName(e.target.value)} required maxLength={60} aria-label={`Naam van categorie ${cat.name}`} className={`${fieldCls} min-w-48 flex-1 sm:max-w-xs`} />
          <button disabled={renaming || !changed} className={secondaryBtn}>
            {renaming ? "Bezig…" : "Naam opslaan"}
          </button>
        </form>
        <span className="text-ink/60">
          {cat.count} document{cat.count === 1 ? "" : "en"}
        </span>
        {!confirming && (
          <button onClick={() => setConfirming(true)} className="rounded px-1 py-1 font-bold text-red-700 underline hover:text-red-900">
            Verwijderen
          </button>
        )}
      </div>
      {note(renameState)}

      {confirming && (
        <form action={del} className="mt-4 grid gap-3 rounded-xl border-2 border-red-300 bg-red-50 p-4">
          <input type="hidden" name="id" value={cat.id} />
          <p>
            <strong>Let op: dit kan niet ongedaan worden gemaakt.</strong> Je verwijdert de categorie “{cat.name}”
            {cat.count > 0 && (
              <>
                {" "}
                <strong>
                  en de {cat.count} document{cat.count === 1 ? "" : "en"} erin
                </strong>{" "}
                (de bestanden worden gewist)
              </>
            )}
            .
          </p>
          <label className="grid gap-1 font-bold">
            Typ <q>{cat.name}</q> om te bevestigen
            <input name="confirm" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="off" placeholder={cat.name} className={fieldCls} />
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <button disabled={deleting || typed.trim() !== cat.name} className={dangerBtn}>
              {deleting ? "Verwijderen…" : "Definitief verwijderen"}
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirming(false);
                setTyped("");
              }}
              className={secondaryBtn}
            >
              Nee, behouden
            </button>
            {typed.trim() !== cat.name && <span className="text-sm text-red-900">De knop werkt pas als de naam exact klopt.</span>}
          </div>
          {note(delState)}
        </form>
      )}
    </li>
  );
}

export default function CategoryManager({ categories }: { categories: Cat[] }) {
  // De lijst beweegt meteen mee met een klik; de server haalt het daarna bij.
  const [items, setItems] = useState(categories);
  const [seen, setSeen] = useState(categories);
  if (seen !== categories) {
    // Nieuwe gegevens van de server: neem ze over.
    setSeen(categories);
    setItems(categories);
  }
  const [pending, start] = useTransition();

  const move = (id: string, dir: "up" | "down") => {
    setItems((prev) => {
      const i = prev.findIndex((c) => c.id === id);
      const j = dir === "up" ? i - 1 : i + 1;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    start(async () => {
      await moveCategory(id, dir);
    });
  };

  return (
    <div className="grid gap-6">
      <AddCategory />
      <ul className="grid gap-3">
        {items.map((c, i) => (
          <Row key={c.id} cat={c} first={i === 0} last={i === items.length - 1} busy={pending} onMove={(dir) => move(c.id, dir)} />
        ))}
        {!items.length && <li className="rounded-xl bg-flour px-6 py-8 text-center text-ink/70">Er zijn nog geen categorieën. Voeg er hierboven één toe.</li>}
      </ul>
    </div>
  );
}

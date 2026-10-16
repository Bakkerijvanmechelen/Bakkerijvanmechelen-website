"use client";

import { useActionState, useState } from "react";
import { createCategory, deleteCategory, renameCategory, type FormState } from "@/app/admin/actions";
import { btnCls, inputCls } from "./ActionForm";

type Cat = { id: string; name: string; count: number };

const note = (s: FormState) =>
  s && (
    <p role={s.ok ? "status" : "alert"} className={`text-sm font-bold ${s.ok ? "text-green-800" : "text-red-700"}`}>
      {s.message}
    </p>
  );

function AddCategory() {
  const [state, action, pending] = useActionState<FormState, FormData>(createCategory, null);
  return (
    <form action={action} className="grid gap-2">
      <div className="flex flex-wrap gap-3">
        <input name="name" required maxLength={60} placeholder="Nieuwe categorie, bijvoorbeeld 07 Broodjes" className={`${inputCls} sm:max-w-sm`} aria-label="Naam nieuwe categorie" />
        <button disabled={pending} className={btnCls}>
          Toevoegen
        </button>
      </div>
      {note(state)}
    </form>
  );
}

function Row({ cat }: { cat: Cat }) {
  const [renameState, rename, renaming] = useActionState<FormState, FormData>(renameCategory, null);
  const [delState, del, deleting] = useActionState<FormState, FormData>(deleteCategory, null);
  const [confirming, setConfirming] = useState(false);
  const [typed, setTyped] = useState("");

  return (
    <li className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        <form action={rename} className="flex flex-1 flex-wrap items-center gap-3">
          <input type="hidden" name="id" value={cat.id} />
          <input name="name" defaultValue={cat.name} required maxLength={60} aria-label={`Naam van ${cat.name}`} className={`${inputCls} min-w-48 flex-1 sm:max-w-xs`} />
          <button disabled={renaming} className="text-sm font-bold text-crust underline">
            Hernoemen
          </button>
          <span className="text-sm text-ink/60">
            {cat.count} document{cat.count === 1 ? "" : "en"}
          </span>
        </form>
        {!confirming && (
          <button onClick={() => setConfirming(true)} className="text-sm font-bold text-red-700 underline">
            Verwijderen
          </button>
        )}
      </div>
      {note(renameState)}

      {confirming && (
        <form action={del} className="mt-4 grid gap-3 rounded-lg border-2 border-red-300 bg-red-50 p-4">
          <input type="hidden" name="id" value={cat.id} />
          <p className="text-sm">
            <strong>Let op, dit kan niet ongedaan worden gemaakt.</strong> Je verwijdert de categorie “{cat.name}”
            {cat.count > 0 ? (
              <>
                {" "}
                <strong>
                  samen met {cat.count} document{cat.count === 1 ? "" : "en"}
                </strong>{" "}
                (de bestanden worden gewist)
              </>
            ) : null}
            . Typ de naam van de categorie om te bevestigen.
          </p>
          <input
            name="confirm"
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            autoComplete="off"
            placeholder={cat.name}
            aria-label="Typ de naam van de categorie om te bevestigen"
            className={inputCls}
          />
          <div className="flex gap-3">
            <button
              disabled={deleting || typed.trim() !== cat.name}
              className="rounded-full bg-red-700 px-6 py-2.5 font-bold text-white transition hover:bg-red-800 disabled:opacity-40"
            >
              {deleting ? "Verwijderen…" : "Definitief verwijderen"}
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirming(false);
                setTyped("");
              }}
              className="rounded-full border border-ink/30 px-6 py-2.5 font-bold"
            >
              Annuleren
            </button>
          </div>
          {note(delState)}
        </form>
      )}
    </li>
  );
}

export default function CategoryManager({ categories }: { categories: Cat[] }) {
  return (
    <div className="grid gap-4">
      <AddCategory />
      <ul className="grid gap-3">
        {categories.map((c) => (
          <Row key={c.id} cat={c} />
        ))}
        {!categories.length && <li className="text-ink/60">Nog geen categorieën.</li>}
      </ul>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { deleteShop, moveShop, toggleShopVisible } from "@/app/admin/actions";
import type { Shop } from "@/lib/shop-types";
import ConfirmButton from "./ConfirmButton";
import ShopForm from "./ShopForm";
import { Card, Pill, primaryBtn, secondaryBtn } from "./ui";

const arrow = "grid size-8 place-items-center rounded-lg border-2 border-ink/20 text-sm font-bold transition hover:border-crust hover:text-crust disabled:opacity-30 disabled:hover:border-ink/20 disabled:hover:text-ink";

function Row({ shop, first, last, busy, onMove }: { shop: Shop; first: boolean; last: boolean; busy: boolean; onMove: (dir: "up" | "down") => void }) {
  const [editing, setEditing] = useState(false);
  const [pending, start] = useTransition();

  return (
    <li className={`rounded-2xl border-2 p-4 ${shop.visible ? "border-ink/10 bg-white" : "border-dashed border-ink/20 bg-ink/5"}`}>
      {editing ? (
        <ShopForm shop={shop} onDone={() => setEditing(false)} />
      ) : (
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col gap-1" role="group" aria-label={`Volgorde van ${shop.name}`}>
            <button type="button" onClick={() => onMove("up")} disabled={first || busy} aria-label={`${shop.name} hoger zetten`} className={arrow}>▲</button>
            <button type="button" onClick={() => onMove("down")} disabled={last || busy} aria-label={`${shop.name} lager zetten`} className={arrow}>▼</button>
          </div>
          <div className="min-w-0 flex-1">
            <p className="flex flex-wrap items-center gap-2 text-lg font-bold">
              {shop.name}
              {!shop.visible && <Pill tone="grey">Verborgen</Pill>}
              {shop.lat == null && <Pill tone="amber">Niet op de kaart</Pill>}
            </p>
            <p className="text-ink/70">
              {shop.street}, {shop.postal_code} {shop.city}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => setEditing(true)} className={secondaryBtn}>
              Wijzigen
            </button>
            <button disabled={pending} onClick={() => start(() => toggleShopVisible(shop.id, !shop.visible))} className={secondaryBtn}>
              {shop.visible ? "Verbergen" : "Tonen"}
            </button>
            <ConfirmButton label="Verwijderen" question={`“${shop.name}” definitief verwijderen?`} confirmLabel="Ja, verwijderen" action={deleteShop.bind(null, shop.id)} />
          </div>
        </div>
      )}
    </li>
  );
}

function Group({ title, intro, shops }: { title: string; intro: string; shops: Shop[] }) {
  const [items, setItems] = useState(shops);
  const [seen, setSeen] = useState(shops);
  if (seen !== shops) {
    // Nieuwe gegevens van de server: neem ze over.
    setSeen(shops);
    setItems(shops);
  }
  const [pending, start] = useTransition();

  const move = (id: string, dir: "up" | "down") => {
    setItems((prev) => {
      const i = prev.findIndex((s) => s.id === id);
      const j = dir === "up" ? i - 1 : i + 1;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
    start(async () => {
      await moveShop(id, dir);
    });
  };

  return (
    <Card title={`${title} (${items.length})`}>
      <p className="-mt-2 mb-5 text-ink/70">{intro}</p>
      <ul className="grid gap-3">
        {items.map((s, i) => (
          <Row key={s.id} shop={s} first={i === 0} last={i === items.length - 1} busy={pending} onMove={(d) => move(s.id, d)} />
        ))}
        {!items.length && <li className="rounded-2xl bg-flour px-6 py-8 text-center text-ink/70">Nog geen winkels in deze lijst.</li>}
      </ul>
    </Card>
  );
}

export default function ShopAdmin({ shops }: { shops: Shop[] }) {
  const [adding, setAdding] = useState(false);
  return (
    <div className="grid gap-8">
      <Card>
        {adding ? (
          <>
            <h2 className="mb-6 font-display text-2xl">Nieuwe winkel toevoegen</h2>
            <ShopForm onDone={() => setAdding(false)} />
          </>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-xl text-lg">Opent er een nieuwe bakkerij? Voeg hem hier toe. Hij staat meteen op de website, op de kaart en in de lijst.</p>
            <button onClick={() => setAdding(true)} className={primaryBtn}>
              + Nieuwe winkel toevoegen
            </button>
          </div>
        )}
      </Card>

      <Group title="Gijbels-winkels" intro="De eigen winkels van Gijbels. Ze staan bovenaan op de winkelpagina." shops={shops.filter((s) => s.kind === "eigen")} />
      <Group title="Andere bakkerijen in de groep" intro="Bakkerijen die bij de groep Gijbels horen." shops={shops.filter((s) => s.kind === "groep")} />
    </div>
  );
}

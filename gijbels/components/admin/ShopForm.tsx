"use client";

import { useActionState, useState } from "react";
import { createLogoUpload, saveShop, type ShopState } from "@/app/admin/actions";
import ShopCard from "@/components/ShopCard";
import type { Shop } from "@/lib/shop-types";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { fieldCls, primaryBtn, secondaryBtn } from "./ui";

const label = "grid gap-1.5 font-bold";
const hint = "font-normal text-ink/60 text-sm";

/** Winkel toevoegen of wijzigen, met meteen een voorbeeld van hoe hij op de website komt. */
export default function ShopForm({ shop, onDone }: { shop?: Shop; onDone?: () => void }) {
  const [state, action, pending] = useActionState<ShopState, FormData>(saveShop, null);
  const [v, setV] = useState({
    name: shop?.name ?? "",
    kind: (shop?.kind ?? "groep") as Shop["kind"],
    street: shop?.street ?? "",
    postal_code: shop?.postal_code ?? "",
    city: shop?.city ?? "",
    phone: shop?.phone ?? "",
    fax: shop?.fax ?? "",
    note: shop?.note ?? "",
    website: shop?.website ?? "",
    webshop_url: shop?.webshop_url ?? "",
    google_url: shop?.google_url ?? "",
    hours: shop?.hours ?? "",
  });
  const [logo, setLogo] = useState(shop?.logo_url ?? "");
  const [logoBusy, setLogoBusy] = useState(false);
  const [logoError, setLogoError] = useState("");
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV((p) => ({ ...p, [k]: e.target.value }));

  async function uploadLogo(file: File | undefined) {
    if (!file) return;
    setLogoBusy(true);
    setLogoError("");
    try {
      const { path, token, publicUrl } = await createLogoUpload(file.name, file.size);
      const { error } = await supabaseBrowser().storage.from("gijbels-shops").uploadToSignedUrl(path, token, file);
      if (error) throw new Error("Het uploaden is mislukt.");
      setLogo(publicUrl);
    } catch (e) {
      setLogoError(e instanceof Error ? e.message : "Het uploaden is mislukt.");
    } finally {
      setLogoBusy(false);
    }
  }

  if (state?.ok && !shop) {
    return (
      <div className="grid gap-4" role="status">
        <p className="rounded-2xl bg-green-100 p-5 text-lg font-bold text-green-900">✅ {state.message}</p>
        {state.warning && <p className="rounded-2xl bg-amber-100 p-5 font-bold text-amber-900">⚠ {state.warning}</p>}
        <div className="flex flex-wrap gap-3">
          <a href="/winkels" target="_blank" rel="noopener noreferrer" className={primaryBtn}>
            Bekijk op de website ↗
          </a>
          <button type="button" onClick={onDone} className={secondaryBtn}>
            Klaar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <form action={action} className="grid gap-5">
        {shop && <input type="hidden" name="id" value={shop.id} />}
        <input type="hidden" name="logo_url" value={logo} />

        <fieldset className="grid gap-2">
          <legend className="font-bold">Soort winkel</legend>
          <div className="flex flex-wrap gap-3">
            {([["eigen", "Gijbels-winkel"], ["groep", "Andere bakkerij in de groep"]] as const).map(([val, text]) => (
              <label key={val} className={`cursor-pointer rounded-full px-5 py-2.5 font-bold ring-2 transition ${v.kind === val ? "bg-blue text-white ring-blue" : "bg-white ring-ink/15 hover:ring-blue"}`}>
                <input type="radio" name="kind" value={val} checked={v.kind === val} onChange={() => setV((p) => ({ ...p, kind: val }))} className="sr-only" />
                {text}
              </label>
            ))}
          </div>
        </fieldset>

        <label className={label}>
          Naam van de winkel *
          <input name="name" required value={v.name} onChange={set("name")} className={fieldCls} placeholder="Bijvoorbeeld: Bakkerij De Gouden Korst" />
        </label>

        <div className="grid gap-5 sm:grid-cols-[2fr_1fr_2fr]">
          <label className={label}>
            Straat en nummer *
            <input name="street" required value={v.street} onChange={set("street")} className={fieldCls} placeholder="Kerkstraat 12" />
          </label>
          <label className={label}>
            Postcode *
            <input name="postal_code" required value={v.postal_code} onChange={set("postal_code")} className={fieldCls} inputMode="numeric" placeholder="2000" />
          </label>
          <label className={label}>
            Gemeente *
            <input name="city" required value={v.city} onChange={set("city")} className={fieldCls} placeholder="Antwerpen" />
          </label>
        </div>
        <p className={hint}>Op basis van dit adres wordt de winkel automatisch op de kaart gezet. Meer hoeft u niet te doen.</p>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className={label}>
            Telefoon <span className={hint}>(optioneel)</span>
            <input name="phone" value={v.phone} onChange={set("phone")} className={fieldCls} placeholder="03 123 45 67" />
          </label>
          <label className={label}>
            Website <span className={hint}>(optioneel)</span>
            <input name="website" value={v.website} onChange={set("website")} className={fieldCls} placeholder="www.mijnbakkerij.be" />
          </label>
        </div>

        <label className={label}>
          Webshop <span className={hint}>(optioneel, als deze bakkerij online verkoopt)</span>
          <input name="webshop_url" value={v.webshop_url} onChange={set("webshop_url")} className={fieldCls} placeholder="www.mijnbakkerij.be/webshop" />
        </label>

        <label className={label}>
          Google-bedrijfsprofiel <span className={hint}>(optioneel, dan verwijst de kaart naar de actuele openingsuren op Google)</span>
          <input name="google_url" value={v.google_url} onChange={set("google_url")} className={fieldCls} placeholder="https://g.page/..." />
        </label>

        <label className={label}>
          Openingsuren <span className={hint}>(één regel per dag of groep van dagen)</span>
          <textarea name="hours" rows={5} value={v.hours} onChange={set("hours")} className={fieldCls} placeholder={"Ma tot Za: 7.00u - 17.45u\nZon en feestdagen: 7.00u - 13.00u\nDinsdag gesloten"} />
        </label>

        <label className={label}>
          Opmerking <span className={hint}>(optioneel, bijvoorbeeld hoe u de winkel vindt)</span>
          <input name="note" value={v.note} onChange={set("note")} className={fieldCls} placeholder="Bereikbaar via de achterkant" />
        </label>

        <div className="grid gap-2">
          <span className="font-bold">
            Logo <span className={hint}>(optioneel, png, jpg of webp)</span>
          </span>
          <div className="flex flex-wrap items-center gap-4">
            {logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt="Gekozen logo" className="h-16 max-w-40 rounded-xl bg-white object-contain p-2 ring-1 ring-ink/10" />
            )}
            <label className={`${secondaryBtn} cursor-pointer`}>
              {logoBusy ? "Uploaden…" : logo ? "Ander logo kiezen" : "Logo kiezen"}
              <input type="file" accept=".png,.jpg,.jpeg,.webp" className="sr-only" disabled={logoBusy} onChange={(e) => uploadLogo(e.target.files?.[0])} />
            </label>
            {logo && (
              <button type="button" onClick={() => setLogo("")} className="font-bold text-red-700 underline">
                Logo weghalen
              </button>
            )}
          </div>
          {logoError && <p role="alert" className="font-bold text-red-700">{logoError}</p>}
        </div>

        {state && !state.ok && <p role="alert" className="rounded-2xl bg-red-100 p-4 font-bold text-red-900">{state.message}</p>}
        {state?.ok && shop && (
          <p role="status" className="rounded-2xl bg-green-100 p-4 font-bold text-green-900">
            ✅ {state.message}
            {state.warning && <span className="mt-2 block text-amber-900">⚠ {state.warning}</span>}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button disabled={pending || logoBusy} className={primaryBtn}>
            {pending ? "Opslaan…" : shop ? "Wijzigingen opslaan" : "Winkel toevoegen"}
          </button>
          {onDone && (
            <button type="button" onClick={onDone} className={secondaryBtn}>
              {shop ? "Sluiten" : "Annuleren"}
            </button>
          )}
        </div>
      </form>

      <aside aria-label="Voorbeeld" className="lg:sticky lg:top-6 lg:self-start">
        <p className="mb-3 font-bold">Zo komt de winkel op de website</p>
        <ShopCard shop={{ ...v, logo_url: logo || null, phone: v.phone || null, fax: v.fax || null, note: v.note || null, website: v.website || null, webshop_url: v.webshop_url || null, google_url: v.google_url || null, hours: v.hours || null }} />
      </aside>
    </div>
  );
}

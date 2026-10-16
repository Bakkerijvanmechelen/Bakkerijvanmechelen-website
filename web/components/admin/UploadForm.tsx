"use client";

import { useRef, useState } from "react";
import { createUpload, registerDocument } from "@/app/admin/actions";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { btnCls, inputCls } from "./ActionForm";

export default function UploadForm({ products }: { products: string[] }) {
  const form = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const file = fd.get("file");
    if (!(file instanceof File) || !file.size) return setMsg({ ok: false, text: "Kies een bestand." });

    setBusy(true);
    setMsg(null);
    try {
      const { path, token } = await createUpload(file.name, file.size);
      const { error } = await supabaseBrowser().storage.from("zas-documents").uploadToSignedUrl(path, token, file);
      if (error) throw new Error("Uploaden mislukt.");
      const res = await registerDocument({
        path,
        fileName: file.name,
        title: String(fd.get("title") ?? ""),
        product: String(fd.get("product") ?? ""),
        description: String(fd.get("description") ?? ""),
        mimeType: file.type,
        size: file.size,
      });
      setMsg({ ok: !!res?.ok, text: res?.message ?? "Klaar." });
      if (res?.ok) form.current?.reset();
    } catch (err) {
      setMsg({ ok: false, text: err instanceof Error ? err.message : "Er ging iets mis." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form ref={form} onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <label className="grid gap-1 text-sm font-bold sm:col-span-2">
        Titel
        <input name="title" required maxLength={160} placeholder="Technische fiche, Pistolet wit" className={inputCls} />
      </label>
      <label className="grid gap-1 text-sm font-bold">
        Product
        <select name="product" required className={inputCls}>
          {products.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm font-bold">
        Bestand (pdf, afbeelding, Word, Excel; max. 50 MB)
        <input name="file" type="file" required accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx" className={inputCls} />
      </label>
      <label className="grid gap-1 text-sm font-bold sm:col-span-2">
        Korte omschrijving (optioneel)
        <input name="description" maxLength={500} className={inputCls} />
      </label>
      {msg && (
        <p role={msg.ok ? "status" : "alert"} className={`text-sm font-bold sm:col-span-2 ${msg.ok ? "text-green-800" : "text-red-700"}`}>
          {msg.text}
        </p>
      )}
      <div className="sm:col-span-2">
        <button disabled={busy} className={btnCls}>
          {busy ? "Uploaden…" : "Uploaden"}
        </button>
      </div>
    </form>
  );
}

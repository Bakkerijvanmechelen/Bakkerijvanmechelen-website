"use client";

import { useRef, useState } from "react";
import { createUpload, registerDocument } from "@/app/admin/actions";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { btnCls, inputCls } from "./ActionForm";

export default function UploadForm({ products }: { products: string[] }) {
  const form = useRef<HTMLFormElement>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const titleFrom = (name: string) =>
    name.replace(/\.[^.]+$/, "").replace(/[_]+/g, " ").replace(/\s+/g, " ").trim();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const files = fd.getAll("file").filter((f): f is File => f instanceof File && f.size > 0);
    if (!files.length) return setMsg({ ok: false, text: "Kies minstens één bestand." });

    const product = String(fd.get("product") ?? "");
    const customTitle = String(fd.get("title") ?? "").trim();
    const description = String(fd.get("description") ?? "");

    setBusy(true);
    setMsg(null);
    const failed: string[] = [];
    const supabase = supabaseBrowser();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setMsg({ ok: true, text: `Uploaden ${i + 1} van ${files.length}: ${file.name}` });
      try {
        const { path, token } = await createUpload(file.name, file.size);
        const { error } = await supabase.storage.from("zas-documents").uploadToSignedUrl(path, token, file);
        if (error) throw new Error("Uploaden mislukt.");
        const res = await registerDocument({
          path,
          fileName: file.name,
          // Eén bestand mag een eigen titel hebben; bij meerdere komt de titel uit de bestandsnaam.
          title: files.length === 1 && customTitle ? customTitle : titleFrom(file.name),
          product,
          description,
          mimeType: file.type,
          size: file.size,
        });
        if (!res?.ok) throw new Error(res?.message ?? "Opslaan mislukt.");
      } catch (err) {
        failed.push(`${file.name} (${err instanceof Error ? err.message : "fout"})`);
      }
    }
    setBusy(false);
    const done = files.length - failed.length;
    setMsg({
      ok: failed.length === 0,
      text: failed.length ? `${done} van ${files.length} geüpload. Mislukt: ${failed.join(", ")}` : `${done} document${done === 1 ? "" : "en"} toegevoegd.`,
    });
    if (done) form.current?.reset();
  }

  return (
    <form ref={form} onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
      <label className="grid gap-1 text-sm font-bold sm:col-span-2">
        Titel (optioneel, alleen bij één bestand; anders wordt de bestandsnaam gebruikt)
        <input name="title" maxLength={160} placeholder="Lang wit brood 800g" className={inputCls} />
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
        Bestanden (pdf, afbeelding, Word, Excel; max. 50 MB per bestand, meerdere tegelijk mogelijk)
        <input name="file" type="file" required multiple accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx" className={inputCls} />
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
          {busy ? "Bezig…" : "Uploaden"}
        </button>
      </div>
    </form>
  );
}

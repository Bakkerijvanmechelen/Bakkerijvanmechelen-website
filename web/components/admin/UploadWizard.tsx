"use client";

import { useRef, useState } from "react";
import { analyzeUploads, confirmUploads, createUpload, discardUploads, type Proposal } from "@/app/admin/actions";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { btnCls, inputCls } from "./ActionForm";

type Cat = { id: string; name: string };
type Row = Proposal & { file: { size: number; type: string }; title2: string; category: string; include: boolean };

const secondaryBtn = "rounded-full border border-ink/30 px-6 py-2.5 font-bold transition hover:border-crust hover:text-crust disabled:opacity-60";

export default function UploadWizard({ categories }: { categories: Cat[] }) {
  const input = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<"pick" | "busy" | "review">("pick");
  const [status, setStatus] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [defaultCat, setDefaultCat] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function stage() {
    const files = Array.from(input.current?.files ?? []);
    if (!files.length) return setMsg({ ok: false, text: "Kies minstens één bestand." });
    setStep("busy");
    setMsg(null);

    const supabase = supabaseBrowser();
    const staged: { path: string; fileName: string; size: number; type: string }[] = [];
    const failed: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      setStatus(`Uploaden ${i + 1} van ${files.length}: ${f.name}`);
      try {
        const { path, token } = await createUpload(f.name, f.size);
        const { error } = await supabase.storage.from("zas-documents").uploadToSignedUrl(path, token, f);
        if (error) throw new Error("uploaden mislukt");
        staged.push({ path, fileName: f.name, size: f.size, type: f.type });
      } catch (e) {
        failed.push(`${f.name} (${e instanceof Error ? e.message : "fout"})`);
      }
    }

    setStatus("Namen en categorieën uitlezen…");
    const proposals = staged.length ? await analyzeUploads(staged.map(({ path, fileName }) => ({ path, fileName }))) : [];
    setRows(
      proposals.map((p) => {
        const s = staged.find((x) => x.path === p.path)!;
        return {
          ...p,
          file: { size: s.size, type: s.type },
          title2: p.title,
          // Categorie uit de pdf; bestaat die nog niet, dan bieden we aan om ze aan te maken.
          category: p.categoryId ?? (p.pdfCategory ? `new:${p.pdfCategory}` : ""),
          include: !p.duplicate,
        };
      }),
    );
    if (failed.length) setMsg({ ok: false, text: `Niet geüpload: ${failed.join(", ")}` });
    setStep(proposals.length ? "review" : "pick");
  }

  const update = (i: number, patch: Partial<Row>) => setRows((r) => r.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const selected = rows.filter((r) => r.include);
  const ready = selected.length > 0 && selected.every((r) => r.title2.trim() && (r.category || defaultCat));

  async function confirm() {
    setStep("busy");
    setStatus("Opslaan…");
    const res = await confirmUploads(
      selected.map((r) => ({
        path: r.path,
        fileName: r.fileName,
        title: r.title2,
        category: r.category || defaultCat,
        mimeType: r.file.type,
        size: r.file.size,
      })),
    );
    const skipped = rows.filter((r) => !r.include).map((r) => r.path);
    if (skipped.length) await discardUploads(skipped);
    setRows([]);
    if (input.current) input.current.value = "";
    setMsg({
      ok: res.errors.length === 0,
      text: res.errors.length
        ? `${res.saved} opgeslagen. Mislukt: ${res.errors.join("; ")}`
        : `${res.saved} document${res.saved === 1 ? "" : "en"} toegevoegd.`,
    });
    setStep("pick");
  }

  async function cancel() {
    setStep("busy");
    setStatus("Annuleren…");
    await discardUploads(rows.map((r) => r.path));
    setRows([]);
    if (input.current) input.current.value = "";
    setMsg({ ok: true, text: "Geannuleerd. Er is niets opgeslagen." });
    setStep("pick");
  }

  if (step === "busy") {
    return (
      <p role="status" className="text-sm font-bold">
        {status}
      </p>
    );
  }

  if (step === "review") {
    const catOptions = (r: Row) => (
      <>
        <option value="">Kies een categorie…</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
        {r.pdfCategory && !r.categoryId && <option value={`new:${r.pdfCategory}`}>+ Nieuwe categorie “{r.pdfCategory}” aanmaken</option>}
      </>
    );
    return (
      <div className="grid gap-4">
        <p className="text-sm text-ink/70">
          Controleer de voorgestelde namen en categorieën. Pas aan wat niet klopt. Er wordt pas iets opgeslagen als je bevestigt.
        </p>
        <label className="grid gap-1 text-sm font-bold sm:max-w-sm">
          Categorie voor bestanden zonder voorstel
          <select value={defaultCat} onChange={(e) => setDefaultCat(e.target.value)} className={inputCls}>
            <option value="">Geen</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>

        <ul className="grid gap-3">
          {rows.map((r, i) => (
            <li key={r.path} className={`rounded-xl border p-4 ${r.include ? "border-ink/15 bg-white" : "border-ink/10 bg-ink/5 opacity-60"}`}>
              <div className="flex items-start justify-between gap-3">
                <p className="text-xs text-ink/60">
                  {r.fileName} ·{" "}
                  {r.source === "pdf" ? "naam uit de pdf" : "naam uit de bestandsnaam"}
                  {r.duplicate && <span className="ml-2 rounded-full bg-amber-200 px-2 py-0.5 font-bold text-amber-900">bestaat al</span>}
                </p>
                <label className="flex shrink-0 items-center gap-2 text-sm font-bold">
                  <input type="checkbox" checked={r.include} onChange={(e) => update(i, { include: e.target.checked })} className="size-4 accent-crust" />
                  Toevoegen
                </label>
              </div>
              <div className="mt-3 grid gap-3 sm:grid-cols-[2fr_1fr]">
                <label className="grid gap-1 text-sm font-bold">
                  Naam
                  <input value={r.title2} onChange={(e) => update(i, { title2: e.target.value })} maxLength={160} className={inputCls} disabled={!r.include} />
                </label>
                <label className="grid gap-1 text-sm font-bold">
                  Categorie
                  <select value={r.category} onChange={(e) => update(i, { category: e.target.value })} className={inputCls} disabled={!r.include}>
                    {catOptions(r)}
                  </select>
                </label>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-3">
          <button onClick={confirm} disabled={!ready} className={btnCls}>
            Bevestigen en opslaan ({selected.length})
          </button>
          <button onClick={cancel} className={secondaryBtn}>
            Annuleren
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <label className="grid gap-1 text-sm font-bold">
        Bestanden (pdf, afbeelding, Word, Excel; max. 50 MB per bestand, meerdere tegelijk mogelijk)
        <input ref={input} type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx" className={inputCls} />
      </label>
      <p className="text-sm text-ink/70">
        Bij productspecificaties in pdf wordt de naam en de categorie automatisch uit het document gehaald. Je kunt ze daarna nog aanpassen.
      </p>
      {msg && (
        <p role={msg.ok ? "status" : "alert"} className={`text-sm font-bold ${msg.ok ? "text-green-800" : "text-red-700"}`}>
          {msg.text}
        </p>
      )}
      <div>
        <button onClick={stage} className={btnCls}>
          Uploaden en controleren
        </button>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { analyzeUploads, confirmUploads, createUpload, discardUploads, type Proposal } from "@/app/admin/actions";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { fieldCls, primaryBtn, secondaryBtn } from "./ui";

type Cat = { id: string; name: string };
type Row = Proposal & { size: number; type: string; title2: string; category: string; include: boolean };
type Step = "pick" | "busy" | "review" | "done";

const STEPS = ["Kies bestanden", "Controleer", "Klaar"];
const stepIndex = (s: Step) => (s === "review" ? 1 : s === "done" ? 2 : 0);

export default function UploadWizard({ categories }: { categories: Cat[] }) {
  const input = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("pick");
  const [picked, setPicked] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState({ text: "", done: 0, total: 0 });
  const [rows, setRows] = useState<Row[]>([]);
  const [defaultCat, setDefaultCat] = useState("");
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [saved, setSaved] = useState(0);

  const pick = (files: FileList | File[] | null) => {
    const list = Array.from(files ?? []);
    setPicked(list);
    setNotice(null);
  };

  async function stage() {
    if (!picked.length) return setNotice({ ok: false, text: "Kies eerst één of meer bestanden." });
    setStep("busy");
    setNotice(null);
    const supabase = supabaseBrowser();
    const staged: { path: string; fileName: string; size: number; type: string }[] = [];
    const failed: string[] = [];

    for (let i = 0; i < picked.length; i++) {
      const f = picked[i];
      setStatus({ text: `Bestand ${i + 1} van ${picked.length} wordt geüpload: ${f.name}`, done: i, total: picked.length });
      try {
        const { path, token } = await createUpload(f.name, f.size);
        const { error } = await supabase.storage.from("zas-documents").uploadToSignedUrl(path, token, f);
        if (error) throw new Error("het uploaden is mislukt");
        staged.push({ path, fileName: f.name, size: f.size, type: f.type });
      } catch (e) {
        failed.push(`${f.name} (${e instanceof Error ? e.message : "onbekende fout"})`);
      }
    }

    setStatus({ text: "De namen en categorieën worden uit de documenten gelezen…", done: picked.length, total: picked.length });
    const proposals = staged.length ? await analyzeUploads(staged.map(({ path, fileName }) => ({ path, fileName }))) : [];
    setRows(
      proposals.map((p) => {
        const s = staged.find((x) => x.path === p.path)!;
        return {
          ...p,
          size: s.size,
          type: s.type,
          title2: p.title,
          category: p.categoryId ?? (p.pdfCategory ? `new:${p.pdfCategory}` : ""),
          include: !p.duplicate,
        };
      }),
    );
    if (failed.length) setNotice({ ok: false, text: `Niet gelukt: ${failed.join(", ")}` });
    setStep(proposals.length ? "review" : "pick");
  }

  const update = (i: number, patch: Partial<Row>) => setRows((r) => r.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const selected = rows.filter((r) => r.include);
  const missingCat = selected.some((r) => !(r.category || defaultCat));
  const missingTitle = selected.some((r) => !r.title2.trim());
  const blocker = !selected.length
    ? "Vink minstens één bestand aan om toe te voegen."
    : missingTitle
      ? "Elk bestand heeft een naam nodig."
      : missingCat
        ? "Kies bij elk bestand een categorie."
        : "";

  function reset() {
    setRows([]);
    setPicked([]);
    if (input.current) input.current.value = "";
  }

  async function confirm() {
    setStep("busy");
    setStatus({ text: "Documenten worden opgeslagen…", done: 0, total: 0 });
    const res = await confirmUploads(
      selected.map((r) => ({ path: r.path, fileName: r.fileName, title: r.title2, category: r.category || defaultCat, mimeType: r.type, size: r.size })),
    );
    const skipped = rows.filter((r) => !r.include).map((r) => r.path);
    if (skipped.length) await discardUploads(skipped);
    reset();
    setSaved(res.saved);
    setNotice(res.errors.length ? { ok: false, text: `Niet gelukt: ${res.errors.join("; ")}` } : null);
    setStep("done");
  }

  async function cancel() {
    setStep("busy");
    setStatus({ text: "Annuleren…", done: 0, total: 0 });
    await discardUploads(rows.map((r) => r.path));
    reset();
    setNotice({ ok: true, text: "Geannuleerd. Er is niets opgeslagen." });
    setStep("pick");
  }

  const current = stepIndex(step === "busy" ? (rows.length ? "review" : "pick") : step);

  return (
    <div>
      <ol className="mb-6 flex flex-wrap gap-x-6 gap-y-2" aria-label="Stappen">
        {STEPS.map((label, i) => (
          <li key={label} className={`flex items-center gap-2 font-bold ${i === current ? "text-ink" : i < current ? "text-green-800" : "text-ink/40"}`} aria-current={i === current ? "step" : undefined}>
            <span className={`grid size-7 place-items-center rounded-full text-sm ${i === current ? "bg-ink text-flour" : i < current ? "bg-green-700 text-white" : "bg-ink/10"}`}>
              {i < current ? "✓" : i + 1}
            </span>
            {label}
          </li>
        ))}
      </ol>

      {notice && (
        <p role={notice.ok ? "status" : "alert"} className={`mb-4 rounded-lg px-4 py-3 font-bold ${notice.ok ? "bg-green-100 text-green-900" : "bg-red-100 text-red-900"}`}>
          {notice.text}
        </p>
      )}

      {step === "busy" && (
        <div role="status" className="rounded-xl bg-flour p-6">
          <p className="font-bold">{status.text}</p>
          {status.total > 0 && (
            <div className="mt-3 h-3 overflow-hidden rounded-full bg-ink/10">
              <div className="h-full rounded-full bg-crust transition-all" style={{ width: `${Math.round((status.done / status.total) * 100)}%` }} />
            </div>
          )}
          <p className="mt-3 text-sm text-ink/60">Even geduld, sluit dit venster niet.</p>
        </div>
      )}

      {step === "pick" && (
        <div className="grid gap-4">
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              pick(e.dataTransfer.files);
            }}
            className={`flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${dragging ? "border-crust bg-crust/10" : "border-ink/30 bg-flour hover:border-crust"}`}
          >
            <span className="text-4xl" aria-hidden>
              📄
            </span>
            <span className="text-xl font-bold">Sleep hier de documenten naartoe</span>
            <span className="text-ink/70">of klik om bestanden te kiezen. Je mag er meerdere tegelijk kiezen.</span>
            <span className="text-sm text-ink/50">pdf, afbeelding, Word of Excel · max. 50 MB per bestand</span>
            <input
              ref={input}
              type="file"
              multiple
              accept=".pdf,.png,.jpg,.jpeg,.webp,.doc,.docx,.xls,.xlsx"
              className="sr-only"
              onChange={(e) => pick(e.target.files)}
            />
          </label>

          {picked.length > 0 && (
            <div>
              <p className="font-bold">
                {picked.length} bestand{picked.length === 1 ? "" : "en"} gekozen:
              </p>
              <ul className="mt-1 max-h-40 overflow-auto text-ink/80">
                {picked.map((f) => (
                  <li key={f.name + f.size}>• {f.name}</li>
                ))}
              </ul>
            </div>
          )}
          <div>
            <button onClick={stage} disabled={!picked.length} className={primaryBtn}>
              Volgende: controleren →
            </button>
            {!picked.length && <p className="mt-2 text-sm text-ink/60">Kies eerst bestanden om verder te gaan.</p>}
          </div>
        </div>
      )}

      {step === "review" && (
        <div className="grid gap-4">
          <p className="rounded-xl bg-sage-light/40 px-4 py-3">
            <strong>Er is nog niets opgeslagen.</strong> Controleer hieronder de naam en de categorie. Staat iets fout, pas het dan gewoon aan. Klik daarna op “Bevestigen”.
          </p>

          <ul className="grid gap-3">
            {rows.map((r, i) => (
              <li key={r.path} className={`rounded-xl border-2 p-4 ${r.include ? "border-ink/15 bg-white" : "border-transparent bg-ink/5 opacity-60"}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="text-sm text-ink/60">
                    {r.fileName}
                    <span className="ml-2">{r.source === "pdf" ? "· naam uit het document gehaald" : "· naam uit de bestandsnaam"}</span>
                    {r.duplicate && <span className="ml-2 rounded-full bg-amber-200 px-2 py-0.5 font-bold text-amber-900">staat er al</span>}
                  </p>
                  <label className="flex items-center gap-2 font-bold">
                    <input type="checkbox" checked={r.include} onChange={(e) => update(i, { include: e.target.checked })} className="size-5 accent-crust" />
                    Toevoegen
                  </label>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-[2fr_1fr]">
                  <label className="grid gap-1 font-bold">
                    Naam
                    <input value={r.title2} onChange={(e) => update(i, { title2: e.target.value })} maxLength={160} className={fieldCls} disabled={!r.include} />
                  </label>
                  <label className="grid gap-1 font-bold">
                    Categorie
                    <select value={r.category} onChange={(e) => update(i, { category: e.target.value })} className={fieldCls} disabled={!r.include}>
                      <option value="">{defaultCat ? "Standaardcategorie (zie hieronder)" : "Kies een categorie…"}</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                      {r.pdfCategory && !r.categoryId && <option value={`new:${r.pdfCategory}`}>+ Nieuwe categorie “{r.pdfCategory}” aanmaken</option>}
                    </select>
                  </label>
                </div>
                {r.duplicate && r.include && <p className="mt-2 text-sm text-amber-900">Let op: er bestaat al een document met deze naam. Vink uit als je het niet dubbel wilt.</p>}
              </li>
            ))}
          </ul>

          {rows.some((r) => !r.category) && (
            <label className="grid gap-1 font-bold sm:max-w-sm">
              Categorie voor bestanden zonder voorstel
              <select value={defaultCat} onChange={(e) => setDefaultCat(e.target.value)} className={fieldCls}>
                <option value="">Geen, ik kies per bestand</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <button onClick={confirm} disabled={!!blocker} className={primaryBtn}>
              ✓ Bevestigen en opslaan ({selected.length})
            </button>
            <button onClick={cancel} className={secondaryBtn}>
              Annuleren
            </button>
            {blocker && <span className="text-sm font-bold text-amber-900">{blocker}</span>}
          </div>
        </div>
      )}

      {step === "done" && (
        <div className="rounded-2xl bg-green-50 p-8 text-center">
          <p className="text-5xl" aria-hidden>
            ✅
          </p>
          <p className="mt-3 font-display text-2xl">
            {saved} document{saved === 1 ? "" : "en"} toegevoegd
          </p>
          <p className="mt-1 text-ink/70">Ze staan nu op de ZAS-pagina.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => {
                setNotice(null);
                setStep("pick");
              }}
              className={primaryBtn}
            >
              Nog documenten toevoegen
            </button>
            <Link href="/ZAS" target="_blank" className={secondaryBtn}>
              Bekijk de ZAS-pagina ↗
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

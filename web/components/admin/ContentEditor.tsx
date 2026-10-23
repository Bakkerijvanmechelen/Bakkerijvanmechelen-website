"use client";

import { useActionState, useState } from "react";
import { createSiteImageUpload, saveContentSection, type ContentState } from "@/app/admin/content-actions";
import type { ContentPage, Field, Section } from "@/lib/cms-schema";
import { supabaseBrowser } from "@/lib/supabase/browser";
import { fieldCls, primaryBtn } from "./ui";

const IMAGE_BUCKET = "vm-site-images";

function TextField({ field, value, onChange }: { field: Field; value: string; onChange: (v: string) => void }) {
  const changed = value !== field.default;
  const name = `f:${field.key}`;
  return (
    <div className="grid gap-1">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <label htmlFor={name} className="font-bold">
          {field.label}
          {changed && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-900">aangepast</span>}
        </label>
        {changed && (
          <button type="button" onClick={() => onChange(field.default)} className="text-sm font-bold text-crust underline">
            Originele tekst terugzetten
          </button>
        )}
      </div>
      {field.type === "textarea" ? (
        <textarea id={name} name={name} value={value} onChange={(e) => onChange(e.target.value)} rows={Math.min(14, Math.max(3, Math.ceil(value.length / 90) + value.split("\n").length))} className={fieldCls} />
      ) : (
        <input id={name} name={name} value={value} onChange={(e) => onChange(e.target.value)} className={fieldCls} />
      )}
      {field.help && <p className="text-sm text-ink/60">{field.help}</p>}
    </div>
  );
}

function ImageField({ field, value, onChange }: { field: Field; value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const changed = value !== field.default;

  async function upload(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const { path, token, publicUrl } = await createSiteImageUpload(file.name, file.size);
      const { error } = await supabaseBrowser().storage.from(IMAGE_BUCKET).uploadToSignedUrl(path, token, file);
      if (error) throw new Error("Het uploaden is mislukt.");
      onChange(publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Het uploaden is mislukt.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-2">
      <p className="font-bold">
        {field.label}
        {changed && <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-900">nieuwe foto</span>}
      </p>
      <input type="hidden" name={`f:${field.key}`} value={value} />
      <div className="flex flex-wrap items-center gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={value} alt="" className="h-28 w-44 rounded-lg bg-ink/5 object-cover ring-1 ring-ink/10" />
        <div className="grid gap-2">
          <label className={`inline-flex cursor-pointer items-center justify-center rounded-full border-2 border-ink/25 px-5 py-2.5 font-bold transition hover:border-crust hover:text-crust ${busy ? "pointer-events-none opacity-50" : ""}`}>
            {busy ? "Bezig met uploaden…" : "Andere foto kiezen"}
            <input type="file" accept=".jpg,.jpeg,.png,.webp" className="sr-only" onChange={(e) => upload(e.target.files?.[0])} />
          </label>
          {changed && (
            <button type="button" onClick={() => onChange(field.default)} className="text-left text-sm font-bold text-crust underline">
              Originele foto terugzetten
            </button>
          )}
        </div>
      </div>
      <p className="text-sm text-ink/60">jpg, png of webp, max. 10 MB. Liefst liggend en minstens 1600 pixels breed.</p>
      {error && <p role="alert" className="text-sm font-bold text-red-700">{error}</p>}
    </div>
  );
}

function SectionForm({ pageId, section, initial }: { pageId: string; section: Section; initial: Record<string, string> }) {
  const [state, action, pending] = useActionState<ContentState, FormData>(saveContentSection, null);
  const [values, setValues] = useState(() => Object.fromEntries(section.fields.map((f) => [f.key, initial[f.key] ?? f.default])));
  const [dirty, setDirty] = useState(false);
  const [seen, setSeen] = useState(state);
  if (state !== seen) {
    setSeen(state);
    if (state?.ok) setDirty(false);
  }
  const set = (key: string) => (v: string) => {
    setValues((old) => ({ ...old, [key]: v }));
    setDirty(true);
  };

  return (
    <form action={action} className="rounded-2xl bg-white p-6 shadow-sm">
      <input type="hidden" name="page" value={pageId} />
      <input type="hidden" name="section" value={section.id} />
      <h2 className="mb-5 font-display text-xl">{section.title}</h2>
      <div className="grid gap-6">
        {section.fields.map((f) =>
          f.type === "image" ? (
            <ImageField key={f.key} field={f} value={values[f.key]} onChange={set(f.key)} />
          ) : (
            <TextField key={f.key} field={f} value={values[f.key]} onChange={set(f.key)} />
          ),
        )}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button disabled={pending} className={primaryBtn}>
          {pending ? "Opslaan…" : "Opslaan"}
        </button>
        {dirty && !pending && <span className="text-sm font-bold text-amber-900">Niet opgeslagen wijzigingen</span>}
        {state && !dirty && (
          <span role={state.ok ? "status" : "alert"} className={`text-sm font-bold ${state.ok ? "text-green-800" : "text-red-700"}`}>
            {state.ok ? "✓ " : ""}
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}

export default function ContentEditor({ page, values }: { page: ContentPage; values: Record<string, string> }) {
  return (
    <div className="grid gap-6">
      {page.sections.map((s) => (
        <SectionForm key={s.id} pageId={page.id} section={s} initial={values} />
      ))}
    </div>
  );
}

"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { reportProblem, type ReportState } from "@/app/ZAS/actions";
import { zasReportTopics } from "@/lib/content";

const field =
  "w-full rounded-xl border border-ink/20 bg-white px-4 py-3 text-base outline-none transition focus:border-crust focus:ring-2 focus:ring-crust/30";

/** Opent het meldformulier vanaf eender waar op de pagina: window.dispatchEvent(new CustomEvent("zas:report", { detail: { article } })) */
export function openReport(article = "") {
  window.dispatchEvent(new CustomEvent("zas:report", { detail: { article } }));
}

export function ReportButton({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <button type="button" onClick={() => openReport()} className={className}>
      {children}
    </button>
  );
}

function ReportForm({ initialArticle, close }: { initialArticle: string; close: () => void }) {
  const [article, setArticle] = useState(initialArticle);
  const [state, action, pending] = useActionState<ReportState, FormData>(reportProblem, null);
  return (
    <ReportBody article={article} setArticle={setArticle} state={state} action={action} pending={pending} close={close} />
  );
}

export default function ReportDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [session, setSession] = useState({ n: 0, article: "" });

  useEffect(() => {
    const open = (e: Event) => {
      setSession((s) => ({ n: s.n + 1, article: (e as CustomEvent<{ article?: string }>).detail?.article ?? "" }));
      dialog.current?.showModal();
    };
    window.addEventListener("zas:report", open);
    return () => window.removeEventListener("zas:report", open);
  }, []);

  const close = () => dialog.current?.close();

  return (
    <>
      <button
        type="button"
        onClick={() => openReport()}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-crust px-5 py-3 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crust"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M12 3 2 21h20z" />
          <path d="M12 10v5M12 18h.01" />
        </svg>
        Probleem melden
      </button>

      <dialog
        ref={dialog}
        onClick={(e) => e.target === dialog.current && close()}
        aria-labelledby="report-title"
        className="m-auto w-[min(92vw,34rem)] rounded-3xl bg-flour p-0 text-ink shadow-2xl backdrop:bg-ink/60 backdrop:backdrop-blur-sm"
      >
        <ReportForm key={session.n} initialArticle={session.article} close={close} />
      </dialog>
    </>
  );
}

function ReportBody({
  article,
  setArticle,
  state,
  action,
  pending,
  close,
}: {
  article: string;
  setArticle: (v: string) => void;
  state: ReportState;
  action: (fd: FormData) => void;
  pending: boolean;
  close: () => void;
}) {
  return (
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="report-title" className="font-display text-2xl">
                Probleem melden
              </h2>
              <p className="mt-1 text-ink/70">Iets niet in orde met een fiche of de pagina? Laat het ons weten, dan lossen we het op.</p>
            </div>
            <button type="button" onClick={close} aria-label="Sluiten" className="grid size-9 shrink-0 place-items-center rounded-full bg-ink/10 text-lg hover:bg-ink/20">
              ✕
            </button>
          </div>

          {state?.ok ? (
            <div className="mt-6 rounded-2xl bg-sage-light/50 p-6 text-center">
              <p className="text-4xl" aria-hidden>
                ✅
              </p>
              <p className="mt-2 text-lg font-bold">{state.message}</p>
              <button type="button" onClick={close} className="mt-5 rounded-full bg-ink px-6 py-2.5 font-bold text-flour hover:bg-crust">
                Sluiten
              </button>
            </div>
          ) : (
            <form action={action} className="mt-6 grid gap-4">
              <label className="grid gap-1 text-sm font-bold">
                Waar gaat uw melding over?
                <select name="topic" required defaultValue="" className={field}>
                  <option value="" disabled>
                    Maak een keuze…
                  </option>
                  {zasReportTopics.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="grid gap-1 text-sm font-bold">
                Over welk artikel? <span className="font-normal text-ink/60">(als van toepassing)</span>
                <input name="article" value={article} onChange={(e) => setArticle(e.target.value)} maxLength={160} className={field} placeholder="Bijvoorbeeld: Lang wit brood 800g" />
              </label>
              <label className="grid gap-1 text-sm font-bold">
                Wat is er mis?
                <textarea name="message" required rows={4} className={field} />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-1 text-sm font-bold">
                  Uw naam
                  <input name="name" required autoComplete="name" className={field} />
                </label>
                <label className="grid gap-1 text-sm font-bold">
                  Uw e-mailadres
                  <input name="email" type="email" required autoComplete="email" className={field} />
                </label>
              </div>
              <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
              {state && !state.ok && (
                <p role="alert" className="rounded-xl bg-red-100 px-4 py-3 text-sm font-bold text-red-900">
                  {state.message}
                </p>
              )}
              <div className="flex flex-wrap gap-3">
                <button disabled={pending} className="rounded-full bg-ink px-7 py-3 font-bold text-flour transition hover:bg-crust disabled:opacity-60">
                  {pending ? "Versturen…" : "Melding versturen"}
                </button>
                <button type="button" onClick={close} className="rounded-full border-2 border-ink/25 px-6 py-3 font-bold hover:border-crust">
                  Annuleren
                </button>
              </div>
            </form>
          )}
        </div>
  );
}

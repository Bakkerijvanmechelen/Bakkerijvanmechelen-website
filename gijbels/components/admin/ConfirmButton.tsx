"use client";

import { useState, useTransition } from "react";
import { dangerBtn, secondaryBtn } from "./ui";

/**
 * Onomkeerbare actie in twee stappen: eerst "Verwijderen", daarna een duidelijke vraag
 * met een rode bevestigingsknop. De eerste klik doet dus nooit iets.
 */
export default function ConfirmButton({
  label,
  question,
  confirmLabel,
  action,
}: {
  label: string;
  question: string;
  confirmLabel: string;
  action: () => Promise<unknown>;
}) {
  const [asking, setAsking] = useState(false);
  const [pending, start] = useTransition();

  if (!asking) {
    return (
      <button onClick={() => setAsking(true)} className="rounded px-1 py-1 font-bold text-red-700 underline hover:text-red-900">
        {label}
      </button>
    );
  }
  return (
    <div role="alertdialog" aria-label={question} className="flex flex-wrap items-center gap-3 rounded-xl border-2 border-red-300 bg-red-50 px-4 py-3">
      <span className="font-bold">{question}</span>
      <button disabled={pending} onClick={() => start(async () => void (await action()))} className={dangerBtn}>
        {pending ? "Bezig…" : confirmLabel}
      </button>
      <button disabled={pending} onClick={() => setAsking(false)} className={secondaryBtn}>
        Nee, behouden
      </button>
    </div>
  );
}

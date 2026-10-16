"use client";

import { useState, useTransition } from "react";
import { deleteDocument } from "@/app/admin/actions";

export default function DeleteDocument({ id, title }: { id: string; title: string }) {
  const [asking, setAsking] = useState(false);
  const [pending, start] = useTransition();

  if (!asking) {
    return (
      <button onClick={() => setAsking(true)} className="text-sm font-bold text-red-700 underline">
        Verwijderen
      </button>
    );
  }
  return (
    <span className="flex flex-wrap items-center gap-3 text-sm">
      <span>“{title}” definitief verwijderen?</span>
      <button
        disabled={pending}
        onClick={() => start(() => deleteDocument(id))}
        className="rounded-full bg-red-700 px-4 py-1.5 font-bold text-white disabled:opacity-50"
      >
        {pending ? "Bezig…" : "Ja, verwijderen"}
      </button>
      <button onClick={() => setAsking(false)} className="font-bold underline">
        Annuleren
      </button>
    </span>
  );
}

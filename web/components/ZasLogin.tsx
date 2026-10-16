"use client";

import { useActionState } from "react";
import { unlock, type ZasState } from "@/app/ZAS/actions";

export default function ZasLogin() {
  const [state, action, pending] = useActionState<ZasState, FormData>(unlock, null);
  return (
    <form action={action} className="mt-8 grid gap-4">
      <label className="grid gap-1 text-sm font-bold">
        Wachtwoord
        <input
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="w-full rounded-lg border border-flour/30 bg-flour px-4 py-3 text-base text-ink outline-none focus:ring-2 focus:ring-sage-light"
        />
      </label>
      {state && (
        <p role="alert" className="text-sm font-bold text-red-300">
          {state.message}
        </p>
      )}
      <button
        disabled={pending}
        className="rounded-full bg-sage-light px-8 py-3 font-bold text-ink transition hover:bg-flour disabled:opacity-60"
      >
        {pending ? "Controleren…" : "Openen"}
      </button>
    </form>
  );
}

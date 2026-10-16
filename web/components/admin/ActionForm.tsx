"use client";

import { useActionState } from "react";
import type { FormState } from "@/app/admin/actions";

export const inputCls =
  "w-full rounded-lg border border-ink/20 bg-white px-4 py-2.5 text-base outline-none transition focus:border-crust focus:ring-2 focus:ring-crust/30";
export const btnCls =
  "rounded-full bg-ink px-6 py-2.5 font-bold text-flour transition hover:bg-crust disabled:opacity-60";

/** Formulier met een server action en een statusmelding. */
export default function ActionForm({
  action,
  children,
  submit,
  className = "grid gap-4",
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  children: React.ReactNode;
  submit: string;
  className?: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  return (
    <form action={formAction} className={className}>
      {children}
      {state && (
        <p role={state.ok ? "status" : "alert"} className={`text-sm font-bold ${state.ok ? "text-green-800" : "text-red-700"}`}>
          {state.message}
        </p>
      )}
      <div>
        <button type="submit" disabled={pending} className={btnCls}>
          {pending ? "Bezig…" : submit}
        </button>
      </div>
    </form>
  );
}

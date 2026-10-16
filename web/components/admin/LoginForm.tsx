"use client";

import { useActionState, useState } from "react";
import { signIn, type FormState } from "@/app/admin/actions";
import { btnCls, inputCls } from "./ActionForm";

export default function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(signIn, null);
  // Gecontroleerd veld: React wist ongecontroleerde velden na een mislukte poging.
  const [email, setEmail] = useState("");
  return (
    <form action={action} className="grid gap-4">
      <label className="grid gap-1 text-sm font-bold">
        E-mailadres
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
        />
      </label>
      <label className="grid gap-1 text-sm font-bold">
        Wachtwoord
        <input name="password" type="password" required autoComplete="current-password" className={inputCls} />
      </label>
      {state && !state.ok && (
        <p role="alert" className="text-sm font-bold text-red-700">
          {state.message}
        </p>
      )}
      <div>
        <button type="submit" disabled={pending} className={btnCls}>
          {pending ? "Bezig…" : "Inloggen"}
        </button>
      </div>
    </form>
  );
}

"use client";

import { useActionState, useState } from "react";
import { signIn, type FormState } from "@/app/admin/actions";
import { fieldCls, primaryBtn } from "./ui";

export default function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(signIn, null);
  // Gecontroleerd veld: React wist ongecontroleerde velden na een mislukte poging.
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);
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
          className={fieldCls}
        />
      </label>
      <label className="grid gap-1 text-sm font-bold">
        Wachtwoord
        <span className="relative">
          <input name="password" type={show ? "text" : "password"} required autoComplete="current-password" className={`${fieldCls} pr-24`} />
          <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-bold underline">
            {show ? "Verberg" : "Toon"}
          </button>
        </span>
      </label>
      {state && !state.ok && (
        <p role="alert" className="text-sm font-bold text-red-700">
          {state.message}
        </p>
      )}
      <div>
        <button type="submit" disabled={pending} className={`${primaryBtn} w-full`}>
          {pending ? "Even geduld…" : "Inloggen"}
        </button>
      </div>
    </form>
  );
}

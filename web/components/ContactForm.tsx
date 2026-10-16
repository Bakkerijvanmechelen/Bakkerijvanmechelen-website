"use client";

import { useActionState } from "react";
import { sendContact, type ContactState } from "@/app/actions";

const field =
  "w-full rounded-lg border border-ink/20 bg-white px-4 py-3 text-base outline-none transition focus:border-crust focus:ring-2 focus:ring-crust/30";

export default function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, null);

  if (state?.ok) {
    return (
      <p role="status" className="rounded-xl bg-sage-light/60 p-6 text-lg">
        {state.message}
      </p>
    );
  }

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <label className="grid gap-1 text-sm font-bold">
        Naam *
        <input name="name" required autoComplete="name" className={field} />
      </label>
      <label className="grid gap-1 text-sm font-bold">
        Bedrijf
        <input name="company" autoComplete="organization" className={field} />
      </label>
      <label className="grid gap-1 text-sm font-bold">
        E-mailadres *
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <label className="grid gap-1 text-sm font-bold">
        Telefoon
        <input name="phone" type="tel" autoComplete="tel" className={field} />
      </label>
      <label className="grid gap-1 text-sm font-bold sm:col-span-2">
        Vraag *
        <textarea name="message" required rows={5} className={field} />
      </label>
      {/* Honeypot */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <label className="flex items-start gap-3 text-sm sm:col-span-2">
        <input name="privacy" type="checkbox" required className="mt-1 size-4 accent-crust" />
        <span>
          Ik bevestig hierbij dat mijn gegevens verwerkt mogen worden zoals beschreven in de{" "}
          <a href="/privacy" className="underline">
            privacyverklaring
          </a>{" "}
          en het{" "}
          <a href="/cookiebeleid" className="underline">
            cookiebeleid
          </a>
          . *
        </span>
      </label>
      {state && !state.ok && (
        <p role="alert" className="text-sm font-bold text-red-700 sm:col-span-2">
          {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ink px-8 py-3 font-bold text-flour transition hover:bg-crust disabled:opacity-60 sm:col-span-2 sm:justify-self-start"
      >
        {pending ? "Verzenden…" : "Verzenden"}
      </button>
    </form>
  );
}

"use client";

import { useActionState } from "react";
import { sendContact, type ContactState } from "@/app/(site)/contact/actions";
import RecaptchaField, { RecaptchaNotice } from "@/components/RecaptchaField";

const field = "w-full rounded-2xl border-0 bg-cream px-4 py-3.5 text-base ring-1 ring-ink/15 outline-none transition focus:bg-white focus:ring-2 focus:ring-blue";

export default function ContactForm() {
  const [state, action, pending] = useActionState<ContactState, FormData>(sendContact, null);

  if (state?.ok) {
    return (
      <div role="status" className="rounded-2xl bg-sage-light/50 p-10 text-center">
        <p className="text-4xl" aria-hidden>
          🥖
        </p>
        <p className="mt-3 font-display text-2xl">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-5 sm:grid-cols-2">
      <label className="grid gap-2 font-medium">
        Voornaam *
        <input name="first" required autoComplete="given-name" className={field} />
      </label>
      <label className="grid gap-2 font-medium">
        Achternaam *
        <input name="last" required autoComplete="family-name" className={field} />
      </label>
      <label className="grid gap-2 font-medium sm:col-span-2">
        E-mail *
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <label className="grid gap-2 font-medium sm:col-span-2">
        Uw bericht *
        <textarea name="message" required rows={6} className={field} />
      </label>
      <label className="flex items-start gap-3 text-sm sm:col-span-2">
        <input name="privacy" type="checkbox" required className="mt-1 size-4 accent-blue" />
        <span>
          Ik bevestig dat mijn gegevens verwerkt mogen worden zoals beschreven in de{" "}
          <a href="/privacy" className="font-bold text-blue underline">
            privacyverklaring
          </a>{" "}
          en het{" "}
          <a href="/cookiebeleid" className="font-bold text-blue underline">
            cookiebeleid
          </a>
          . *
        </span>
      </label>
      <RecaptchaField action="contact" />
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      {state && !state.ok && (
        <p role="alert" className="rounded-2xl bg-red-100 px-4 py-3 font-bold text-red-900 sm:col-span-2">
          {state.message}
        </p>
      )}
      <button disabled={pending} className="rounded-full bg-blue px-8 py-4 text-lg font-bold text-white transition hover:bg-blue-deep disabled:opacity-60 sm:col-span-2 sm:justify-self-start">
        {pending ? "Verzenden…" : "Bericht versturen"}
      </button>
      <RecaptchaNotice className="text-xs text-ink/60 sm:col-span-2" />
    </form>
  );
}

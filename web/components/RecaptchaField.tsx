"use client";

import { useEffect, useRef } from "react";

type Grecaptcha = { ready: (cb: () => void) => void; execute: (key: string, opts: { action: string }) => Promise<string> };
declare global {
  interface Window {
    grecaptcha?: Grecaptcha;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

/**
 * Onzichtbare reCAPTCHA v3 voor een formulier. Het script van Google wordt pas geladen zodra de bezoeker
 * het formulier gebruikt, en het token wordt elke 100 seconden vernieuwd (een token is 2 minuten geldig).
 */
export default function RecaptchaField({ action }: { action: string }) {
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const form = input.current?.form;
    if (!SITE_KEY || !form) return;
    let timer: ReturnType<typeof setInterval> | undefined;
    let started = false;

    const refresh = () =>
      window.grecaptcha?.ready(() => {
        window.grecaptcha!.execute(SITE_KEY, { action }).then((token) => {
          if (input.current) input.current.value = token;
        });
      });

    const start = () => {
      if (started) return;
      started = true;
      if (!document.getElementById("recaptcha-script")) {
        const s = document.createElement("script");
        s.id = "recaptcha-script";
        s.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
        s.async = true;
        s.onload = refresh;
        document.head.appendChild(s);
      } else refresh();
      timer = setInterval(refresh, 100_000);
    };

    form.addEventListener("focusin", start);
    return () => {
      form.removeEventListener("focusin", start);
      if (timer) clearInterval(timer);
    };
  }, [action]);

  if (!SITE_KEY) return null;
  return <input ref={input} type="hidden" name="recaptcha" defaultValue="" />;
}

/** Verplichte vermelding als de reCAPTCHA-badge verborgen wordt. */
export function RecaptchaNotice({ className = "" }: { className?: string }) {
  if (!SITE_KEY) return null;
  return (
    <p className={className}>
      Dit formulier is beveiligd met reCAPTCHA. Het{" "}
      <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">
        privacybeleid
      </a>{" "}
      en de{" "}
      <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">
        servicevoorwaarden
      </a>{" "}
      van Google zijn van toepassing.
    </p>
  );
}

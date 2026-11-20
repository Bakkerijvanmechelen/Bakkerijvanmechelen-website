"use client";

import { useEffect, useState } from "react";
import * as CookieConsent from "vanilla-cookieconsent";

/** true: de kaart laadt pas na toestemming. false: de kaart staat meteen zichtbaar. */
export const MAP_NEEDS_CONSENT = false;

/**
 * Google Maps-kaart zonder API-sleutel, met één speld op het adres.
 * Staat MAP_NEEDS_CONSENT aan, dan laadt de kaart pas na toestemming (categorie "Kaarten") of een klik op "Kaart tonen".
 */
export default function GoogleMap({ address, label }: { address: string; label: string }) {
  const [show, setShow] = useState(!MAP_NEEDS_CONSENT);

  useEffect(() => {
    const sync = () => setShow((s) => s || CookieConsent.acceptedCategory("maps"));
    sync();
    window.addEventListener("cc:onConsent", sync);
    window.addEventListener("cc:onChange", sync);
    return () => {
      window.removeEventListener("cc:onConsent", sync);
      window.removeEventListener("cc:onChange", sync);
    };
  }, []);

  const q = encodeURIComponent(address);
  const box = "relative h-[320px] w-full overflow-hidden rounded-2xl bg-soft shadow-md shadow-ink/10 ring-1 ring-ink/10 md:h-full md:min-h-[360px]";

  if (show)
    return (
      <div className={`${box} flex`}>
        <iframe
          title={`Kaart: ${label}`}
          src={`https://maps.google.com/maps?q=${q}&z=16&output=embed`}
          width="100%"
          height="100%"
          className="block h-full min-h-[320px] w-full border-0 md:min-h-[360px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    );

  return (
    <div className={`${box} grid place-items-center p-6 text-center text-ink`}>
      <div>
        <svg viewBox="0 0 24 24" className="mx-auto size-10 text-brand" fill="currentColor" aria-hidden>
          <path d="M12 2a7 7 0 0 0-7 7c0 5.3 7 13 7 13s7-7.7 7-13a7 7 0 0 0-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
        </svg>
        <p className="mt-3 font-display text-xl text-brand">{label}</p>
        <p className="mt-1 text-ink/70">{address}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <button type="button" onClick={() => setShow(true)} className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-on-brand transition hover:bg-dark">
            Kaart tonen
          </button>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${q}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border-2 border-ink/15 bg-white px-5 py-2 text-sm font-bold transition hover:border-brand hover:text-brand"
          >
            Openen in Google Maps ↗
          </a>
        </div>
        <p className="mx-auto mt-4 max-w-xs text-xs text-ink/60">De kaart komt van Google Maps. Google ontvangt daarbij uw IP-adres.</p>
      </div>
    </div>
  );
}

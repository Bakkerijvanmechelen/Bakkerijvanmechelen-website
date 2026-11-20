"use client";

import "vanilla-cookieconsent/dist/cookieconsent.css";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    gtag?: Gtag;
    dataLayer?: unknown[];
  }
}

/** Geeft de keuze van de bezoeker door aan Google Consent Mode v2 en aan de dataLayer. */
function updateConsent() {
  const analytics = CookieConsent.acceptedCategory("analytics");
  const marketing = CookieConsent.acceptedCategory("marketing");
  const v = (on: boolean) => (on ? "granted" : "denied");
  window.gtag?.("consent", "update", {
    analytics_storage: v(analytics),
    ad_storage: v(marketing),
    ad_user_data: v(marketing),
    ad_personalization: v(marketing),
    personalization_storage: v(marketing),
  });
  window.dataLayer?.push({ event: "cookie_consent_update", consent_analytics: analytics, consent_marketing: marketing });
}

/** Open-source cookiebanner (vanilla-cookieconsent, MIT) met Consent Mode v2. Niet getoond in het beheer. */
export default function CookieBanner() {
  const path = usePathname();
  const hidden = path.startsWith("/admin");

  useEffect(() => {
    if (hidden) return;
    CookieConsent.run({
      cookie: { name: "cc_cookie", expiresAfterDays: 182 },
      revision: 1,
      guiOptions: {
        consentModal: { layout: "box", position: "bottom left", equalWeightButtons: true },
        preferencesModal: { layout: "box", equalWeightButtons: true },
      },
      categories: {
        necessary: { enabled: true, readOnly: true },
        analytics: {},
        marketing: {},
      },
      onFirstConsent: updateConsent,
      onChange: updateConsent,
      language: {
        default: "nl",
        translations: {
          nl: {
            consentModal: {
              title: "Wij respecteren uw privacy",
              description:
                'Deze website gebruikt noodzakelijke cookies om goed te werken. Met uw toestemming gebruiken we ook cookies voor statistieken en marketing. U kiest zelf en kunt uw keuze altijd wijzigen. Meer info in ons <a href="/cookiebeleid">cookiebeleid</a>.',
              acceptAllBtn: "Alles accepteren",
              acceptNecessaryBtn: "Alles weigeren",
              showPreferencesBtn: "Voorkeuren",
            },
            preferencesModal: {
              title: "Cookievoorkeuren",
              acceptAllBtn: "Alles accepteren",
              acceptNecessaryBtn: "Alles weigeren",
              savePreferencesBtn: "Keuze opslaan",
              closeIconLabel: "Sluiten",
              sections: [
                { description: "Kies welke cookies u toestaat. Noodzakelijke cookies staan altijd aan, omdat de website anders niet werkt." },
                {
                  title: "Noodzakelijk",
                  description: "Nodig om de website te laten werken en te beveiligen, bijvoorbeeld om uw cookiekeuze te onthouden en formulieren tegen spam te beschermen.",
                  linkedCategory: "necessary",
                },
                { title: "Statistieken", description: "Helpen ons te begrijpen hoe bezoekers de website gebruiken, zodat we die kunnen verbeteren.", linkedCategory: "analytics" },
                { title: "Marketing", description: "Worden gebruikt om advertenties relevanter te maken en het resultaat ervan te meten.", linkedCategory: "marketing" },
                { title: "Meer informatie", description: 'Lees ons <a href="/cookiebeleid">cookiebeleid</a> en onze <a href="/privacy">privacyverklaring</a>.' },
              ],
            },
          },
        },
      },
    });
  }, [hidden]);

  return null;
}

/** Knop om de cookievoorkeuren opnieuw te openen, bijvoorbeeld in de footer. */
export function CookieSettingsButton({ className = "" }: { className?: string }) {
  return (
    <button type="button" onClick={() => CookieConsent.showPreferences()} className={className}>
      Cookie-instellingen
    </button>
  );
}

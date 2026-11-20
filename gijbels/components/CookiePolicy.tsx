import { CookieSettingsButton } from "@/components/CookieBanner";

type Row = [name: string, purpose: string, provider: string, term: string];

/**
 * Inhoud van het cookiebeleid, gedeeld door alle sites. Elke site geeft aan wat er bij haar van toepassing is.
 */
export default function CookiePolicy({ recaptcha = false, zas = false, map = false, email }: { recaptcha?: boolean; zas?: boolean; map?: boolean; email?: string }) {
  const necessary: Row[] = [
    ["cc_cookie", "Onthoudt uw cookiekeuze, zodat de banner niet bij elk bezoek terugkomt.", "Deze website", "6 maanden"],
    ...(zas ? ([["zas_session", "Onthoudt dat u bent aangemeld op de afgeschermde ZAS-pagina.", "Deze website", "Maximaal 7 dagen"]] as Row[]) : []),
    ["sb-… (aanmeldcookies)", "Houden beheerders ingelogd in het beheergedeelte. Bezoekers krijgen deze cookies niet.", "Deze website (Supabase)", "Sessie / maximaal 1 week"],
    ...(recaptcha ? ([["_GRECAPTCHA", "Beschermt het contactformulier tegen spam en misbruik (reCAPTCHA). Wordt pas geladen als u het formulier gebruikt.", "Google", "6 maanden"]] as Row[]) : []),
  ];

  return (
    <>
      <p>
        Op deze website gebruiken we cookies. Noodzakelijke cookies staan altijd aan, omdat de website anders niet goed werkt. Voor alle andere cookies vragen we eerst uw
        toestemming via de cookiebanner. U kunt uw keuze op elk moment wijzigen.
      </p>
      <p>
        <CookieSettingsButton className="rounded-full bg-ink px-5 py-2.5 text-base font-bold text-white transition hover:opacity-80" />
      </p>

      <h2>Wat is een cookie?</h2>
      <p>Een cookie is een klein tekstbestand dat een website op uw toestel bewaart. Zo kan de website bijvoorbeeld onthouden welke keuze u maakte.</p>

      <h2>Noodzakelijke cookies</h2>
      <p>Deze cookies zijn strikt noodzakelijk voor de werking en beveiliging van de website. Hiervoor is volgens de wet geen toestemming nodig.</p>
      <table>
        <thead>
          <tr>
            <th>Cookie</th>
            <th>Doel</th>
            <th>Van</th>
            <th>Bewaartermijn</th>
          </tr>
        </thead>
        <tbody>
          {necessary.map(([n, p, v, t]) => (
            <tr key={n}>
              <td>{n}</td>
              <td>{p}</td>
              <td>{v}</td>
              <td>{t}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Statistieken en marketing</h2>
      <p>
        Op dit moment gebruiken we geen statistiek- of marketingcookies. Als we die later toevoegen (bijvoorbeeld Google Analytics), worden ze pas geplaatst nadat u daarvoor
        toestemming gaf in de cookiebanner. We gebruiken daarvoor Google Consent Mode v2: zolang u geen toestemming geeft, slaan Google-diensten niets op uw toestel op.
      </p>

      <h2>Externe diensten</h2>
      <p>
        Lettertypes en afbeeldingen worden rechtstreeks vanaf onze eigen website geladen.
        {map && " De kaart gebruikt kaartmateriaal van OpenStreetMap: uw browser maakt daarvoor rechtstreeks verbinding met die dienst, waarbij uw IP-adres wordt gedeeld. Er worden geen cookies geplaatst."}
        {recaptcha && " Het contactformulier is beveiligd met reCAPTCHA van Google."} Wanneer u op een link naar een andere website klikt, gelden de voorwaarden van die website.
      </p>

      <h2>Cookies verwijderen of weigeren</h2>
      <p>Via de knop “Cookie-instellingen” hierboven en onderaan elke pagina wijzigt u uw keuze. U kunt cookies ook verwijderen of blokkeren via de instellingen van uw browser.</p>

      <h2>Vragen?</h2>
      <p>
        {email ? (
          <>
            Mail naar <a href={`mailto:${email}`}>{email}</a>.{" "}
          </>
        ) : (
          <>Neem contact op via de gegevens op de website. </>
        )}
        Hoe wij omgaan met uw persoonsgegevens leest u in onze <a href="/privacy">privacyverklaring</a>.
      </p>
    </>
  );
}

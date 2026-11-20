import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { getContent } from "@/lib/cms";
import { telHref } from "@/lib/shop-types";
import { getSiteShops } from "@/lib/shops";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: `Privacyverklaring | ${site.name}` };

export default async function Privacy() {
  const [shops, c] = await Promise.all([getSiteShops(), getContent()]);
  const email = site.shops.map((_, i) => c[`shop${i + 1}.email`]).find(Boolean);
  const contact = email ? <a href={`mailto:${email}`}>{email}</a> : <>de contactgegevens hierboven</>;

  return (
    <LegalPage title="Privacyverklaring" updated="november 2026">
      <p>
        {site.name} hecht veel belang aan de bescherming van uw persoonsgegevens. In deze verklaring leest u welke gegevens wij verzamelen via deze website, waarom,
        en welke rechten u heeft.
      </p>

      <h2>Wie is verantwoordelijk?</h2>
      {shops.map((s, i) => {
        const k = `shop${i + 1}`;
        return (
          <p key={k}>
            {c[`${k}.label`]}
            {s && (
              <>
                <br />
                {s.street}, {s.postal_code} {s.city}
              </>
            )}
            {c[`${k}.vat`] && (
              <>
                <br />
                Ondernemingsnummer {c[`${k}.vat`]}
              </>
            )}
            {(c[`${k}.email`] || s?.phone) && <br />}
            {c[`${k}.email`] && <a href={`mailto:${c[`${k}.email`]}`}>{c[`${k}.email`]}</a>}
            {c[`${k}.email`] && s?.phone && " · "}
            {s?.phone && <a href={telHref(s.phone)}>{s.phone}</a>}
          </p>
        );
      })}

      <h2>Welke gegevens verwerken wij en waarom?</h2>
      <table>
        <thead>
          <tr>
            <th>Situatie</th>
            <th>Gegevens</th>
            <th>Doel en rechtsgrond</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Bezoek aan de website</td>
            <td>Technische gegevens zoals IP-adres en browsertype in de serverlogs van onze hostingpartner</td>
            <td>Veiligheid en goede werking van de website. Rechtsgrond: gerechtvaardigd belang.</td>
          </tr>
          <tr>
            <td>Kaart (Google Maps)</td>
            <td>IP-adres, dat uw browser deelt met Google om de kaart te laden</td>
            <td>Tonen waar onze winkel ligt. Rechtsgrond: gerechtvaardigd belang.</td>
          </tr>
          <tr>
            <td>U belt of mailt ons</td>
            <td>De gegevens die u zelf meedeelt</td>
            <td>Uw vraag of bestelling behandelen.</td>
          </tr>
          {process.env.NEXT_PUBLIC_GA4_ID && (
            <tr>
              <td>Websitestatistieken</td>
              <td>Gegevens over uw bezoek (bekeken pagina&apos;s, toestel, browser, ongeveer de regio), via Google Analytics</td>
              <td>Begrijpen hoe de website gebruikt wordt en ze verbeteren. Rechtsgrond: uw toestemming via de cookiebanner. Zonder toestemming worden geen cookies geplaatst.</td>
            </tr>
          )}
        </tbody>
      </table>
      <p>
        Deze website heeft geen contactformulier en geen nieuwsbrief. Wij gebruiken uw gegevens niet voor reclame en nemen geen geautomatiseerde beslissingen op
        basis van uw gegevens.
      </p>

      <h2>Met wie delen wij uw gegevens?</h2>
      <p>
        Alleen met partijen die ons helpen de website te laten werken en die in onze opdracht handelen (verwerkers): onze hostingpartner (Vercel) en onze
        databaseleverancier (Supabase). Voor de kaart op de website ontvangt ook Google uw IP-adres. {process.env.NEXT_PUBLIC_GA4_ID && "Als u daarvoor toestemming geeft, verwerkt Google ook websitestatistieken (Google Analytics). "}Wij verkopen uw gegevens nooit aan derden. Als gegevens buiten de Europese Economische Ruimte verwerkt worden, gebeurt dat
        enkel met passende waarborgen, zoals de standaardcontractbepalingen van de Europese Commissie.
      </p>

      <h2>Uw rechten</h2>
      <p>U heeft het recht om uw gegevens in te zien, te laten verbeteren of wissen, de verwerking te laten beperken of u ertegen te verzetten.</p>
      <p>Stuur uw vraag naar {contact}. Wij kunnen u vragen om uw identiteit te bewijzen en antwoorden binnen één maand.</p>

      <h2>Klacht indienen</h2>
      <p>
        Bent u niet tevreden met ons antwoord? Dan kunt u klacht indienen bij de Gegevensbeschermingsautoriteit, Drukpersstraat 35, 1000 Brussel,{" "}
        <a href="mailto:contact@apd-gba.be">contact@apd-gba.be</a>,{" "}
        <a href="https://www.gegevensbeschermingsautoriteit.be" target="_blank" rel="noopener noreferrer">
          www.gegevensbeschermingsautoriteit.be
        </a>
        .
      </p>

      <h2>Cookies</h2>
      <p>
        Lees in ons <a href="/cookiebeleid">cookiebeleid</a> welke cookies wij gebruiken en hoe u uw keuze wijzigt.
      </p>
    </LegalPage>
  );
}

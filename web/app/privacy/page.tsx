import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { companyFrom, getContent } from "@/lib/cms";

export const metadata: Metadata = { title: "Privacyverklaring | Bakkerij Van Mechelen" };

export default async function Privacy() {
  const company = companyFrom(await getContent());
  return (
    <LegalPage title="Privacyverklaring" updated="oktober 2026">
      <p>
        {company.legalName} hecht veel belang aan de bescherming van uw persoonsgegevens. In deze verklaring leest u welke gegevens
        wij verzamelen via deze website, waarom, en welke rechten u heeft.
      </p>

      <h2>Wie is verantwoordelijk?</h2>
      <p>
        {company.legalName}
        <br />
        {company.street}, {company.city}
        <br />
        Ondernemingsnummer {company.vat}
        <br />
        <a href={`mailto:${company.email}`}>{company.email}</a> · <a href={company.phoneHref}>{company.phone}</a>
      </p>

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
            <td>Contactformulier</td>
            <td>Naam, bedrijf (optioneel), e-mailadres, telefoonnummer (optioneel) en uw vraag</td>
            <td>Uw vraag beantwoorden en een offerte of afspraak opvolgen. Rechtsgrond: uw toestemming en onze gerechtvaardigde belangen om vragen van (potentiële) klanten te beantwoorden.</td>
          </tr>
          <tr>
            <td>Afgeschermde ZAS-pagina</td>
            <td>Geen persoonsgegevens van bezoekers, enkel een functionele cookie na het aanmelden</td>
            <td>Technische fiches ter beschikking stellen aan klanten.</td>
          </tr>
          <tr>
            <td>Bezoek aan de website</td>
            <td>Technische gegevens zoals IP-adres en browsertype in de serverlogs van onze hostingpartner</td>
            <td>Veiligheid en goede werking van de website. Rechtsgrond: gerechtvaardigd belang.</td>
          </tr>
        </tbody>
      </table>
      <p>Wij sturen geen nieuwsbrieven en gebruiken uw gegevens niet voor reclame. Wij nemen geen geautomatiseerde beslissingen op basis van uw gegevens.</p>

      <h2>Hoe lang bewaren wij uw gegevens?</h2>
      <p>
        Berichten via het contactformulier bewaren wij zolang nodig om uw vraag af te handelen, en daarna niet langer dan 2 jaar,
        tenzij een langere bewaring wettelijk verplicht is of nodig is voor een lopende klantenrelatie.
      </p>

      <h2>Met wie delen wij uw gegevens?</h2>
      <p>
        Alleen met partijen die ons helpen de website te laten werken en die in onze opdracht handelen (verwerkers): onze
        hostingpartner (Vercel) en onze databaseleverancier (Supabase). Met hen zijn verwerkersafspraken gemaakt. Wij verkopen uw
        gegevens nooit aan derden. Als gegevens buiten de Europese Economische Ruimte verwerkt worden, gebeurt dat enkel met passende
        waarborgen, zoals de standaardcontractbepalingen van de Europese Commissie.
      </p>

      <h2>Uw rechten</h2>
      <p>U heeft het recht om:</p>
      <ul>
        <li>uw gegevens in te zien en een kopie te vragen;</li>
        <li>onjuiste gegevens te laten verbeteren;</li>
        <li>uw gegevens te laten wissen;</li>
        <li>de verwerking te laten beperken of u ertegen te verzetten;</li>
        <li>uw toestemming in te trekken, zonder dat dit de verwerking tot dan onwettig maakt;</li>
        <li>uw gegevens in een gangbaar formaat te ontvangen (overdraagbaarheid).</li>
      </ul>
      <p>
        Stuur uw vraag naar <a href={`mailto:${company.email}`}>{company.email}</a>. Wij kunnen u vragen om uw identiteit te bewijzen en
        antwoorden binnen één maand.
      </p>

      <h2>Klacht indienen</h2>
      <p>
        Bent u niet tevreden met ons antwoord? Dan kunt u klacht indienen bij de Gegevensbeschermingsautoriteit, Drukpersstraat 35,
        1000 Brussel, <a href="mailto:contact@apd-gba.be">contact@apd-gba.be</a>,{" "}
        <a href="https://www.gegevensbeschermingsautoriteit.be" target="_blank" rel="noopener noreferrer">
          www.gegevensbeschermingsautoriteit.be
        </a>
        .
      </p>

      <h2>Cookies</h2>
      <p>
        Lees in ons <a href="/cookiebeleid">cookiebeleid</a> welke functionele cookies wij gebruiken.
      </p>

      <h2>Wijzigingen</h2>
      <p>Wij kunnen deze verklaring aanpassen. De datum bovenaan geeft aan wanneer ze voor het laatst is bijgewerkt.</p>
    </LegalPage>
  );
}

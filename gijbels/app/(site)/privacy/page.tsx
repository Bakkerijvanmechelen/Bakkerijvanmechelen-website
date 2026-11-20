import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacyverklaring | Bakkerij Gijbels" };

export default function Privacy() {
  return (
    <LegalPage title="Privacyverklaring" updated="oktober 2026">
      <p>
        Bakkerij Gijbels NV hecht veel belang aan de bescherming van uw persoonsgegevens. In deze verklaring leest u welke gegevens wij verzamelen via deze website,
        waarom, en welke rechten u heeft.
      </p>

      <h2>Wie is verantwoordelijk?</h2>
      <p>
        Bakkerij Gijbels NV
        <br />
        Kanaaldijk 255, 2900 Schoten
        <br />
        Ondernemingsnummer 0882.251.919
        <br />
        <a href="mailto:info@bakkerijgijbels.be">info@bakkerijgijbels.be</a> · <a href="tel:+3233224421">03 322 44 21</a>
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
            <td>Voornaam, achternaam, e-mailadres en uw bericht</td>
            <td>Uw vraag beantwoorden. Rechtsgrond: uw toestemming en onze gerechtvaardigde belangen om vragen van klanten te beantwoorden.</td>
          </tr>
          <tr>
            <td>Bezoek aan de website</td>
            <td>Technische gegevens zoals IP-adres en browsertype in de serverlogs van onze hostingpartner</td>
            <td>Veiligheid en goede werking van de website. Rechtsgrond: gerechtvaardigd belang.</td>
          </tr>
          <tr>
            <td>Kaart op de winkelpagina</td>
            <td>IP-adres, dat uw browser deelt met OpenStreetMap om het kaartmateriaal te laden</td>
            <td>De kaart tonen. Rechtsgrond: gerechtvaardigd belang.</td>
          </tr>
        </tbody>
      </table>
      <p>Wij sturen geen nieuwsbrieven en gebruiken uw gegevens niet voor reclame. Wij nemen geen geautomatiseerde beslissingen op basis van uw gegevens.</p>

      <h2>Hoe lang bewaren wij uw gegevens?</h2>
      <p>
        Berichten via het contactformulier bewaren wij zolang nodig om uw vraag af te handelen, en daarna niet langer dan 2 jaar, tenzij een langere bewaring
        wettelijk verplicht is of nodig is voor een lopende klantenrelatie.
      </p>

      <h2>Met wie delen wij uw gegevens?</h2>
      <p>
        Alleen met partijen die ons helpen de website te laten werken en die in onze opdracht handelen (verwerkers): onze hostingpartner (Vercel), onze
        databaseleverancier (Supabase) en Google (reCAPTCHA, om het contactformulier tegen spam te beschermen). Met hen zijn verwerkersafspraken gemaakt. Wij verkopen uw gegevens nooit aan derden. Als gegevens buiten de Europese
        Economische Ruimte verwerkt worden, gebeurt dat enkel met passende waarborgen, zoals de standaardcontractbepalingen van de Europese Commissie.
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
        Stuur uw vraag naar <a href="mailto:info@bakkerijgijbels.be">info@bakkerijgijbels.be</a>. Wij kunnen u vragen om uw identiteit te bewijzen en antwoorden
        binnen één maand.
      </p>

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

      <h2>Wijzigingen</h2>
      <p>Wij kunnen deze verklaring aanpassen. De datum bovenaan geeft aan wanneer ze voor het laatst is bijgewerkt.</p>
    </LegalPage>
  );
}

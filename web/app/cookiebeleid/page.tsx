import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { company } from "@/lib/content";

export const metadata: Metadata = { title: "Cookiebeleid | Bakkerij Van Mechelen" };

export default function Cookiebeleid() {
  return (
    <LegalPage title="Cookiebeleid" updated="oktober 2026">
      <p>
        Op deze website gebruiken wij <strong>geen</strong> analytische, advertentie- of trackingcookies. Daarom vragen we ook geen
        toestemming via een cookiebanner. Hieronder leest u welke beperkte, strikt noodzakelijke opslag wel gebruikt wordt.
      </p>

      <h2>Wat is een cookie?</h2>
      <p>
        Een cookie is een klein tekstbestand dat een website op uw toestel bewaart. Zo kan de website u herkennen bij een volgend
        bezoek of onthouden dat u bent ingelogd.
      </p>

      <h2>Welke cookies gebruiken wij?</h2>
      <table>
        <thead>
          <tr>
            <th>Cookie</th>
            <th>Doel</th>
            <th>Bewaartermijn</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>zas_session</td>
            <td>Onthoudt dat u bent ingelogd op de afgeschermde ZAS-pagina, zodat u het wachtwoord niet bij elke pagina opnieuw hoeft in te geven. Alleen geplaatst nadat u zich aanmeldt.</td>
            <td>Maximaal 7 dagen</td>
          </tr>
          <tr>
            <td>sb-… (aanmeldcookies)</td>
            <td>Houden beheerders ingelogd in het beheergedeelte van de website. Bezoekers krijgen deze cookies niet.</td>
            <td>Sessie / maximaal 1 week</td>
          </tr>
        </tbody>
      </table>
      <p>
        Dit zijn functionele cookies die strikt noodzakelijk zijn voor de werking van de dienst die u vraagt. Hiervoor is volgens de
        Belgische wetgeving geen toestemming vereist.
      </p>

      <h2>Externe diensten</h2>
      <p>
        Lettertypes en afbeeldingen worden rechtstreeks vanaf onze eigen website geladen, niet vanaf servers van derden. Onze
        pagina’s op Facebook en Instagram zijn gewone links: pas wanneer u erop klikt, verlaat u onze website en gelden de
        voorwaarden van die platformen.
      </p>

      <h2>Cookies verwijderen of weigeren</h2>
      <p>
        U kunt cookies altijd verwijderen of blokkeren via de instellingen van uw browser. De ZAS-pagina vraagt dan opnieuw om het
        wachtwoord.
      </p>

      <h2>Vragen?</h2>
      <p>
        Mail naar <a href={`mailto:${company.email}`}>{company.email}</a>. Hoe wij omgaan met uw persoonsgegevens leest u in onze{" "}
        <a href="/privacy">privacyverklaring</a>.
      </p>
    </LegalPage>
  );
}

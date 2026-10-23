/**
 * Alle teksten en foto's die via het beheer aanpasbaar zijn, met hun originele inhoud.
 * Een pagina leest ze met getContent(); wat niet in de database staat, valt terug op de waarde hier.
 */
export type FieldType = "text" | "textarea" | "image";
export type Field = { key: string; label: string; type: FieldType; default: string; help?: string };
export type Section = { id: string; title: string; fields: Field[] };
export type ContentPage = { id: string; title: string; href: string; sections: Section[] };

const text = (key: string, label: string, value: string, help?: string): Field => ({ key, label, type: "text", default: value, help });
const area = (key: string, label: string, value: string, help?: string): Field => ({ key, label, type: "textarea", default: value, help });
const image = (key: string, label: string, value: string): Field => ({ key, label, type: "image", default: value });

const products = [
  ["brood", "Brood", "/images/brood-industriele-bakker.jpg", "Onze broden zijn gekend om hun lekkere smaak, maar ook om de lange versheid ervan."],
  ["pistolets", "Pistolets", "/images/pistolets-industriele-bakker.jpg", "Er is een zeer uitgebreid assortiment van broden en pistolets, voor ieder wat wils. Van een lekker chocoladebrood tot een gezond vita haver broodje met extra veel vezels en granen."],
  ["koffiekoeken", "Koffiekoeken", "/images/koffiekoeken-industriele-bakker.jpg", "We zoeken telkens naar nieuwigheden, wat valt er in de smaak bij onze klanten, ook kijken we naar de seizoenen en proberen we daarop in te spelen."],
  ["patisserie", "Pattisserie & vlaaien", "/images/pattiserie-industriele-bakker.jpg", "In ons assortiment van ambachtelijk gebak is veel lekkers te verkrijgen: een lekkere chocoladetaart, luchtige gâteau met slagroom & vers fruit, traditionele éclairs of tompouce. Ook taarten voor speciale gelegenheden zoals huwelijken en verjaardagstaarten kunnen gemaakt worden naar wens."],
];

const services = [
  ["Bakkerswinkels", "Naast onze winkels in eigen beheer, zijn wij ook de vaste leverancier van tal van koude bakkerijen."],
  ["Broodautomaten", "Een broodautomaat laten plaatsen? Kies voor één van onze automaten in eigen beheer of om zelf te gebruiken."],
  ["Evenementen", "Een evenement dat moet voorzien worden van allerhande lekkers? Wij voorzien het lekkerste gebak, verse broodjes of een gepersonaliseerde taart."],
  ["Anderen", "Rust- en verzorgingstehuizen, ziekenhuizen, scholen, bedrijfsrestaurants …"],
];

const quotes = [
  ["Patissier Roeland", "Ik werk hier al 20 jaar, we gebruiken alleen de beste ingrediënten, wat zorgt voor een heerlijke smaaksensatie."],
  ["Bakker Tom", "Ik werk hier al 19 jaar, broden en pistolets maken blijft een passie."],
];

export const productCount = products.length;
export const serviceCount = services.length;
export const quoteCount = quotes.length;

export const schema: ContentPage[] = [
  {
    id: "home",
    title: "Homepagina",
    href: "/",
    sections: [
      {
        id: "hero",
        title: "Bovenaan (grote foto)",
        fields: [
          image("home.hero.image", "Foto", "/images/bakkerij-van-mechelen.jpg"),
          text("home.hero.eyebrow", "Kleine titel boven de kop", "Ambachtelijke bakkerij voor uw zaak"),
          text("home.hero.title", "Kop", "Vakmanschap & traditie"),
          area(
            "home.hero.text",
            "Tekst",
            "Bakkerij Van Mechelen is een ambachtelijke bakkerij die sinds 2003 uw smaakvolle en krokante pistolets bakt, maar ook heerlijke patisserie en vlaaien maakt. Met ingrediënten uit de streek streven wij niet alleen naar de beste kwaliteit, maar zorgen wij er ook voor dat ze voedzaam en gezond zijn. Het geheim tot succes van Bakkerij Van Mechelen zijn onze werknemers, we zijn een bedrijf met een kloppend hart.",
          ),
          text("home.hero.button", "Tekst op de knop", "Contacteer ons"),
        ],
      },
      {
        id: "products",
        title: "Producten: titel",
        fields: [
          text("home.products.title", "Titel", "Producten"),
          area("home.products.intro", "Inleiding", "Onze broden zijn gekend om hun lekkere smaak, maar ook om de lange versheid ervan."),
          text("home.products.link", "Tekst van de link onder elk product", "Contacteer ons"),
        ],
      },
      ...products.map(([, title, img, body], i) => ({
        id: `product-${i + 1}`,
        title: `Product ${i + 1}: ${title}`,
        fields: [
          image(`home.product${i + 1}.image`, "Foto", img),
          text(`home.product${i + 1}.title`, "Titel", title),
          area(`home.product${i + 1}.text`, "Tekst", body),
        ],
      })),
      {
        id: "services",
        title: "Voor wie? (donker blok)",
        fields: [
          image("home.services.image", "Achtergrondfoto", "/images/Camionetten.jpg"),
          text("home.services.title", "Titel", "Voor wie?"),
          ...services.flatMap(([title, body], i) => [
            text(`home.service${i + 1}.title`, `Blok ${i + 1}: titel`, title),
            area(`home.service${i + 1}.text`, `Blok ${i + 1}: tekst`, body),
          ]),
          area("home.services.closing", "Tekst onder de blokken", "Door onze uitgebreide vloot en aangezien wij ons transport in eigen beheer doen, kunnen we naadloos inspelen op de wensen van onze klanten."),
          text("home.services.button", "Tekst op de knop", "Contacteer ons"),
        ],
      },
      {
        id: "about",
        title: "Over ons",
        fields: [
          image("home.about.image", "Foto", "/images/ambachtelijk-brood.jpg"),
          text("home.about.title", "Titel", "Vakmanschap & traditie"),
          area(
            "home.about.text",
            "Tekst",
            "Met meer dan 20 jaar aan ervaring staat Bakkerij Van Mechelen voor lekkere producten die steeds gemaakt worden met hoogwaardige ingrediënten.\n\nEen out-of-the-box vraag? Wij zijn een flexibele partner die graag met jou nadenkt over de beste oplossing, en dat steeds aan scherpe prijsvoorwaarden.",
          ),
          text("home.acs.title", "Groen kader: titel", "ACS gecertificeerd"),
          area(
            "home.acs.text",
            "Groen kader: tekst",
            "ACS staat voor autocontrole systeem. Het certificaat wordt uitgereikt door het FAVV (Federaal Agentschap voor de veiligheid van de voedselketen). Dit wordt pas toegekend na strenge audits die zich toeleggen op hygiëne, HACCP en traceerbaarheid van de geproduceerde en getransporteerde producten. Naast dit certificaat onderleggen we onszelf ook continue strenge zelfcontrole.",
          ),
        ],
      },
      {
        id: "quotes",
        title: "Getuigenissen van medewerkers",
        fields: quotes.flatMap(([name, quote], i) => [
          area(`home.quote${i + 1}.text`, `Citaat ${i + 1}`, quote),
          text(`home.quote${i + 1}.name`, `Citaat ${i + 1}: naam`, name),
        ]),
      },
      {
        id: "contact",
        title: "Contact",
        fields: [text("home.contact.title", "Titel", "Contacteer ons")],
      },
    ],
  },
  {
    id: "zas",
    title: "ZAS-pagina",
    href: "/ZAS",
    sections: [
      {
        id: "zas-login",
        title: "Aanmeldscherm",
        fields: [
          image("zas.image", "Achtergrondfoto (aanmeldscherm en bovenaan)", "/images/brood-industriele-bakker.jpg"),
          text("zas.login.title", "Titel", "ZAS"),
          area("zas.login.text", "Tekst", "Ziekenhuis aan de Stroom. Geef het wachtwoord in om de productinformatie te bekijken."),
        ],
      },
      {
        id: "zas-top",
        title: "Bovenaan na het aanmelden",
        fields: [
          text("zas.eyebrow", "Kleine titel", "ZAS · Ziekenhuis aan de Stroom"),
          text("zas.title", "Kop", "Welkom bij Bakkerij Van Mechelen !"),
          area("zas.text", "Tekst", "Hieronder kan u per artikelgroep zoeken naar het artikel waarvan u graag onze technische fiche wil raadplegen en/of downloaden."),
        ],
      },
    ],
  },
  {
    id: "algemeen",
    title: "Bedrijfsgegevens",
    href: "/#contact",
    sections: [
      {
        id: "company",
        title: "Gegevens in de footer, bij Contact en in de privacyverklaring",
        fields: [
          text("company.legalName", "Bedrijfsnaam", "Bakkerij Van Mechelen B.V."),
          text("company.street", "Straat en nummer", "Kanaaldijk 255"),
          text("company.city", "Postcode en gemeente", "2900 Schoten"),
          text("company.phone", "Telefoon", "03 322 44 21"),
          text("company.email", "E-mailadres", "info@bakkerijgijbels.be"),
          text("company.vat", "Ondernemingsnummer", "0458.839.989"),
          text("company.facebook", "Facebook-pagina (link)", "https://www.facebook.com/profile.php?id=61552104110001"),
          text("company.instagram", "Instagram-pagina (link)", "https://www.instagram.com/bakkerijvanmechelen/"),
        ],
      },
    ],
  },
];

export const fields: Field[] = schema.flatMap((p) => p.sections.flatMap((s) => s.fields));
export const defaults: Record<string, string> = Object.fromEntries(fields.map((f) => [f.key, f.default]));

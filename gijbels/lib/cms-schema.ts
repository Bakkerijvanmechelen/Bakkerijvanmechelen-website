/**
 * Alle teksten en foto's die via het beheer aanpasbaar zijn, met hun originele inhoud.
 * Een pagina leest ze met getContent(); wat niet in de database staat, valt terug op de waarde hier.
 * {aantal} in een tekst wordt op de website vervangen door het actuele aantal winkels.
 */
export type FieldType = "text" | "textarea" | "image";
export type Field = { key: string; label: string; type: FieldType; default: string; help?: string };
export type Section = { id: string; title: string; fields: Field[] };
export type ContentPage = { id: string; title: string; href: string; sections: Section[] };

const text = (key: string, label: string, value: string, help?: string): Field => ({ key, label, type: "text", default: value, help });
const area = (key: string, label: string, value: string, help?: string): Field => ({ key, label, type: "textarea", default: value, help });
const image = (key: string, label: string, value: string): Field => ({ key, label, type: "image", default: value });
const COUNT = "Typ {aantal} waar het aantal winkels moet komen: dat past zich vanzelf aan.";

/** Titel, ondertitel en foto bovenaan een subpagina. */
const hero = (page: string, eyebrow: string, title: string, subtitle: string, img = "/images/hero-bakker.jpg"): Section => ({
  id: `${page}-hero`,
  title: "Bovenaan (foto en titel)",
  fields: [
    image(`${page}.hero.image`, "Foto", img),
    text(`${page}.hero.eyebrow`, "Kleine titel", eyebrow),
    text(`${page}.hero.title`, "Titel", title),
    text(`${page}.hero.subtitle`, "Ondertitel", subtitle),
  ],
});

const homeCards = [
  ["Brood", "/images/cat-brood.jpg", "Krokant gebakken in onze speciale broodovens, in alle vormen en formaten: van meergranen en luchtig wit tot rozijnen- en suikerbrood."],
  ["Pistolets & koffiekoeken", "/images/cat-koffiekoeken.jpg", "De klassiekers van uw bakker, gemaakt volgens uitvoerig verfijnde recepten en met grondstoffen van de hoogste kwaliteit."],
  ["Patisserie", "/images/cat-patisserie.jpg", "Kies uw favoriet in onze koeltoog. Verjaardags- en bruidstaarten bereiden en versieren we tot in de puntjes."],
  ["Vlaaien", "/images/cat-vlaaien.jpg", "Onze royaal gevulde fruitvlaaien worden door onze klanten het meest gesmaakt. Het hele jaar door vers."],
];
const homeBlocks = [
  ["Versheid", "Wat startte als een kleine buurtbakkerij in Berchem, groeide uit tot een bakkerij die de standaard zet als het aankomt op versheid en smaak."],
  ["Ingrediënten", "Voedzame broden bereid met de beste ingrediënten die de natuur ons te bieden heeft, en verrassende recepturen voor gebak die van elke hap een feest maken."],
  ["Met de glimlach", "Onze {aantal} vestigingen in de provincie Antwerpen serveren het lekkerste van een ambachtelijke bakker, door medewerkers die houden van hun vak."],
];
const historySteps = [
  ["Een passie voor het ambacht", "Voor Bakkerij Gijbels begon het allemaal met een passie voor het ambacht. Vanuit onze gezellige bakkerij in de **Driekoningenstraat in Antwerpen**, bouwden we al snel **een sterke naam op** met ons verse gebak, onze krokante broden en overheerlijke patisserie. Mensen stonden elke week weer in de rij om hun favoriete koffiekoek, broodsoort of taart te bemachtigen. Het **succes van onze recepten** was groot. En de vriendelijke aanpak van onze medewerkers werd gesmaakt door onze klanten."],
  ["Volgende stap: groeien én verfijnen", "Al snel werd de bakkerij in Berchem te klein om aan de vraag van onze klanten te voldoen. Daarom weken we uit naar een groter gebouw in Wommelgem – zonder onze eerste vestiging uit het oog te verliezen.\n\nStap voor stap werkten we **samenwerkingen uit met lokale bakkerijen**, die geworteld waren in hun regio. Zij namen de producten van Bakkerij Gijbels op in hun assortiment en bewaarden toch hun **unieke eigenheid**, die zo bekend was in de streek."],
  ["Een familie met smaak", "Inmiddels is Bakkerij Gijbels uitgegroeid tot een vaste waarde in de streek rond Antwerpen. Met {aantal} vestigingen **die elk hun eigen karakter** hebben, brengen we onze overheerlijke broden, smakelijk gebak en onovertroffen taarten tot bij onze klant. Samen vormen we een hechte familie die smaak weer op het menu zet."],
];
const features = [
  ["broden", "/images/assortiment-broden.jpg", "Broden die barsten van de smaak", "Bakkerij Gijbels creëert de **meest smaakvolle broden**, die krokant gebakken worden in onze speciale broodovens. De versheid spat van elke hap. Waar hebt u vandaag zin in? Dankzij Bakkerij Gijbels hebt u een ruime keuze aan broden, in **alle vormen en formaten**.\n\nVoedzame **meergranenbroden**, luchtig wit brood of speciale bereidingen zoals **rozijnenbrood** of **suikerbrood** – ze staan allemaal op het menu. Vakkundig samengesteld en bereid door onze ervaren bakkers. Uw dag is pas compleet met een rijkelijk belegde boterham met brood van Bakkerij Gijbels."],
  ["klassiek", "/images/assortiment-klassiek.jpg", "Zoals alleen uw bakker dat kan", "Natuurlijk geniet u ook van alle **klassieke bakkerijproducten**, zoals pistolets, overheerlijke koffiekoeken, drooggebak en vlaaien. Gemaakt volgens uitvoerig verfijnde recepten, met grondstoffen van de hoogste kwaliteit.\n\nBakkerij Gijbels staat bekend om zijn **uitzonderlijk grote aanbod**. Zo vindt u bij ons worstenbroden en appelbollen – niet enkel op verloren maandag, maar het hele jaar door. En voor de lekkerbekken hebben we op het juiste moment excellente kerstbuchen, speculaas in Sinterklaasvorm en andere **smakelijke verrassingen klaarliggen**."],
  ["patisserie", "/images/assortiment-patisserie.jpg", "Patisserie om lang van te genieten", "Tijd om een speciale gelegenheid te vieren – of gewoon: zin om te genieten? Kies dan uw favoriete **patisserie** in onze koeltoog. Vooral onze royaal gevulde fruitvlaaien worden gesmaakt door onze klanten.\n\nWilt u net dat extraatje serveren aan uw gasten op dat belangrijke feest? Weet dan dat onze bakkers alle **verjaardags- of bruidstaarten** tot in de puntjes bereiden én versieren, precies zoals u dat graag hebt. **Kom vandaag nog langs in één van onze bakkerijen**!"],
];

export const homeCardCount = homeCards.length;
export const homeBlockCount = homeBlocks.length;
export const historyStepCount = historySteps.length;
export const featureIds = features.map((f) => f[0]);
export const galleryCount = 6;

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
          image("home.hero.image", "Foto", "/images/hero-bakker.jpg"),
          text("home.hero.eyebrow", "Kleine titel boven de kop", "Ambachtelijke bakkerij in Antwerpen"),
          text("home.hero.title", "Kop", "Echt bakmanschap"),
          area("home.hero.text", "Tekst", "De bakker met het lekkerste assortiment. Brood dat krokant gebakken wordt in onze eigen ovens, patisserie en vlaaien, in {aantal} vestigingen vlakbij u.", COUNT),
          text("home.hero.button", "Tekst op de knop", "Ontdek onze winkels"),
        ],
      },
      {
        id: "cards",
        title: "Ons assortiment: titel",
        fields: [
          text("home.cards.title", "Titel", "Ons assortiment"),
          area("home.cards.intro", "Inleiding", "U kent het wel: de typische geur van uw lokale bakker. Er gaat niets boven versgebakken brood, gebak, taarten en patisserie."),
          text("home.cards.link", "Tekst van de link onder elke kaart", "Ontdek meer"),
        ],
      },
      ...homeCards.map(([title, img, body], i) => ({
        id: `card-${i + 1}`,
        title: `Kaart ${i + 1}: ${title}`,
        fields: [image(`home.card${i + 1}.image`, "Foto", img), text(`home.card${i + 1}.title`, "Titel", title), area(`home.card${i + 1}.text`, "Tekst", body)],
      })),
      {
        id: "shops",
        title: "Vestigingen (blauw blok)",
        fields: [
          image("home.shops.image", "Achtergrondfoto", "/images/galerij-4.jpg"),
          text("home.shops.title", "Titel na het getal", "vestigingen, dezelfde verrukkelijke kwaliteit", "Het aantal winkels staat er automatisch voor."),
          ...homeBlocks.flatMap(([title, body], i) => [
            text(`home.block${i + 1}.title`, `Blok ${i + 1}: titel`, title),
            area(`home.block${i + 1}.text`, `Blok ${i + 1}: tekst`, body, i === 2 ? COUNT : undefined),
          ]),
          area("home.shops.closing", "Tekst onder de blokken", "Kom langs en proef het zelf. Een overzicht van al onze bakkerijen vindt u bij de winkels."),
          text("home.shops.button", "Tekst op de knop", "Alle winkels bekijken"),
        ],
      },
      {
        id: "about",
        title: "De bakker met het lekkerste assortiment",
        fields: [
          image("home.about.image", "Foto", "/images/assortiment-broden.jpg"),
          text("home.about.title", "Titel", "De bakker met het lekkerste assortiment"),
          area(
            "home.about.text",
            "Tekst",
            "U moest eens weten hoe goed u Bakkerij Gijbels al kent. Waarschijnlijk genoot u al met volle teugen van onze gebakjes, of smeerde u de lekkerste boterham met brood dat krokant gebakken werd in onze ovens.\n\nWie weet werd de taart die u met uw verjaardag zo smakelijk onder uw vrienden verdeelde, bereid door onze gedreven bakkers.",
          ),
          text("home.about.boxTitle", "Lichtblauw kader: titel", "Een begrip in de provincie Antwerpen"),
          area("home.about.boxText", "Lichtblauw kader: tekst", "Onze broden, taarten, patisserie en gebakjes vinden elke dag weer hun weg naar honderden huiskamers, waar ze alle gezellige momenten de juiste smaak geven."),
        ],
      },
    ],
  },
  {
    id: "geschiedenis",
    title: "Geschiedenis",
    href: "/geschiedenis",
    sections: [
      hero("history", "Geschiedenis", "Een rijke geschiedenis", "Een rijkelijk assortiment en een passie voor het ambacht!"),
      ...historySteps.map(([title, body], i) => ({
        id: `step-${i + 1}`,
        title: `Hoofdstuk ${i + 1}`,
        fields: [text(`history.step${i + 1}.title`, "Titel", title), area(`history.step${i + 1}.text`, "Tekst", body, i === 2 ? COUNT : undefined)],
      })),
      {
        id: "history-closing",
        title: "Geel kader onderaan",
        fields: [area("history.closing", "Tekst", "Wilt u zelf proeven van onze unieke service en producten? **Kom dan snel eens langs** in één van onze {aantal} bakkerijen!", `${COUNT} Woorden tussen **sterretjes** worden blauw.`)],
      },
    ],
  },
  {
    id: "assortiment",
    title: "Assortiment",
    href: "/assortiment",
    sections: [
      hero("assortment", "Assortiment", "Ontdek het assortiment van Bakkerij Gijbels", "Geuren en smaken vol pure gezelligheid!", "/images/koffiekoeken.jpg"),
      {
        id: "assortment-intro",
        title: "Inleiding",
        fields: [area("assortment.intro", "Tekst", "U kent het wel: de typische geur van uw lokale bakker, die u tegemoet waait als u nog maar in de buurt komt. Er gaat dan ook niets boven de geur van versgebakken broden, gebak, taarten en patisserie.")],
      },
      ...features.map(([id, img, title, body], i) => ({
        id: `feature-${id}`,
        title: `Blok ${i + 1}: ${title}`,
        fields: [image(`assortment.${id}.image`, "Foto", img), text(`assortment.${id}.title`, "Titel", title), area(`assortment.${id}.text`, "Tekst", body)],
      })),
      {
        id: "gallery",
        title: "Fotogalerij “Uit onze toonbank”",
        fields: [
          text("assortment.gallery.title", "Titel", "Uit onze toonbank"),
          ...Array.from({ length: galleryCount }, (_, i) => image(`assortment.gallery${i + 1}`, `Foto ${i + 1}`, `/images/galerij-${i + 1}.jpg`)),
        ],
      },
    ],
  },
  {
    id: "diensten",
    title: "Diensten",
    href: "/diensten",
    sections: [
      hero("services", "Diensten", "Diensten voor professionals", "Stipte levering van brood en gebak aan bedrijven en voorzieningen!"),
      {
        id: "services-intro",
        title: "Inleiding en “Voor wie?”",
        fields: [
          area(
            "services.intro",
            "Tekst",
            "Bent u voor uw buurtwinkel, superette, bedrijf, zorginstelling, rusthuis of organisatie op zoek naar een bakker die de **hoogste kwaliteit levert tegen goede prijzen?** Neem dan snel contact op met Bakkerij Gijbels om uw vraag te bespreken.\n\nAls ervaren én ambachtelijke bakker brengen we de lekkerste broden, patisserie, gebak en andere **lekkernijen tot aan uw deur**. Onze **stipte service** verzekert u op elk moment van de week van uitmuntende kwaliteitsproducten, altijd vers bereid in onze ateliers.",
          ),
          text("services.forWhom.title", "“Voor wie?”: titel", "Voor wie?"),
          area("services.forWhom.list", "“Voor wie?”: lijst", "Buurtwinkel\nSuperette\nBedrijf\nZorginstelling\nRusthuis\nOrganisatie", "Eén per regel."),
        ],
      },
      {
        id: "services-cards",
        title: "Twee kaarten",
        fields: [
          text("services.card1.eyebrow", "Kaart 1: kleine titel", "Kwaliteit"),
          text("services.card1.title", "Kaart 1: titel", "Volgens de hoogste standaarden"),
          area("services.card1.text", "Kaart 1: tekst", "Voor de **kwaliteit van uw broden en gebak**, nemen we geen enkel risico. We kiezen dan ook voluit voor verse producten, die volgens de hoogste standaarden worden verwerkt, bereid en vervoerd."),
          text("services.card2.eyebrow", "Kaart 2: kleine titel", "Gekeurd"),
          text("services.card2.title", "Kaart 2: titel", "Elk jaar extern gecontroleerd"),
          area("services.card2.text", "Kaart 2: tekst", "Om u die zekerheid te garanderen, laten we onze ateliers en werkwijze elk jaar keuren door een externe firma. Dat verzekert u van overheerlijke producten die zonder uitzondering **voldoen aan de striktste HACCP-standaarden**."),
        ],
      },
      {
        id: "services-cta",
        title: "Geel kader onderaan",
        fields: [
          area("services.cta.text", "Tekst", "Wilt u meer weten over onze service voor bedrijven en professionals?"),
          text("services.cta.button", "Tekst op de knop", "Neem contact met ons op!"),
        ],
      },
    ],
  },
  {
    id: "winkels",
    title: "Winkels",
    href: "/winkels",
    sections: [hero("shops", "Winkels", "Onze winkels", "Bakkerij Gijbels: puur genieten, ook bij u in de buurt!")],
  },
  {
    id: "contact",
    title: "Contact",
    href: "/contact",
    sections: [
      hero("contact", "Contact", "Contacteer ons", "Heeft u vragen? Stuur ons een bericht via onderstaand contactformulier!"),
      {
        id: "contact-boxes",
        title: "Formulier en kaders",
        fields: [
          text("contact.form.title", "Titel boven het formulier", "Stuur ons een bericht"),
          text("contact.visit.title", "Geel kader: titel", "Liever langskomen?"),
          area("contact.visit.text", "Geel kader: tekst", "Bekijk al onze bakkerijen met adres en openingsuren."),
          text("contact.visit.button", "Geel kader: knop", "Naar de winkels"),
        ],
      },
    ],
  },
  {
    id: "algemeen",
    title: "Op elke pagina",
    href: "/",
    sections: [
      {
        id: "cta",
        title: "Blauwe afsluiter “Spring vandaag nog binnen”",
        fields: [
          image("cta.image", "Achtergrondfoto", "/images/galerij-2.jpg"),
          text("cta.title", "Titel", "Spring vandaag nog binnen bij Bakkerij Gijbels!"),
          text("cta.button", "Tekst op de knop", "Ontdek onze winkels"),
        ],
      },
      {
        id: "footer",
        title: "Footer",
        fields: [text("footer.shops", "Regel onder het telefoonnummer", "{aantal} vestigingen in de provincie Antwerpen", COUNT)],
      },
    ],
  },
];

export const fields: Field[] = schema.flatMap((p) => p.sections.flatMap((s) => s.fields));
export const defaults: Record<string, string> = Object.fromEntries(fields.map((f) => [f.key, f.default]));

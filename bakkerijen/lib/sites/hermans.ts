import type { SiteDef } from "./types";

const img = (f: string) => `/sites/hermans/${f}`;

export const hermans: SiteDef = {
  id: "hermans",
  name: "Hermans Bakkerij",
  domain: "hermansbakkerij.be",
  metaTitle: "Bakkerij Hermans in Kasterlee, uw lokale bakker",
  metaDescription: "Bakkerij Hermans in Kasterlee is uw vaste adres voor krokante broden, heerlijke patisserie en superieur gebak. Netjes gepresenteerd met de glimlach. Kom langs!",
  theme: { brand: "#2f4a9c", onBrand: "#ffffff", dark: "#131a33", soft: "#e8ecf7" },
  logo: { src: img("4e68514c.png"), width: 350, height: 44 },
  shopsTitle: "Contacteer ons",
  shops: [{ match: { name: "Hermans Bakkerij", street: "Turnhoutsebaan 16" }, label: "Hermans Bakkerij" }],
  blocks: [
    { type: "hero", image: img("5b1dddcb.jpg"), title: "Dé plek voor echte lekkerbekken", button: "Contacteer ons" },
    {
      type: "intro",
      title: "Bakker in Kasterlee? Bakkerij Hermans verfijnt het vak!",
      text: "Bakkerij Hermans in Kasterlee is een begrip in de streek. De familie Hermans was dan ook **een échte bakkersfamilie**, die de recepten van hun producten over generaties heen verfijnden. En dat proeft u meteen bij elke hap. De familie Hermans staat inmiddels niet meer aan het roer, maar de nieuwe eigenaars houden de **straffe reputatie** van het huis nog elke dag in ere.\n\nOnze bakkerij is een baken van **kwaliteit, versheid en topproducten** in de regio rond Kasterlee. Klanten waarderen onze superieure broden en gebaksoorten – niet alleen voor de dagelijkse maaltijd, maar ook voor speciale gelegenheden.",
    },
    {
      type: "feature",
      title: "Genieten, genieten, genieten",
      text: "De **verrukkelijke gebak- en patisseriesoorten** die u vindt in onze bakkerij in Kasterlee, zijn een wervelwind van smaak en plezier. Of u nu uw dagelijks croissantje meeneemt of een speciaal gebakje, u bent er zeker van dat u een **moment van puur genot** ervaart.\n\nWe bieden u een **ruim en divers aanbod** aan gebak en patisserie. Perfect voor de zondag met de familie, de zoete zonde door de week of dat extraatje op het feest met vrienden. Oh, vergeet zeker onze **unieke Kabouterkoekjes** niet te proeven: een absoluut succes bij onze regelmatige klanten én de toeristen.",
    },
    {
      type: "feature",
      title: "Brood om uw tanden in te zetten",
      text: "Van stevige bruine broden die gemaakt zijn met **granen van de hoogste kwaliteit**, tot luchtig wit brood dat een lekkernij vormt met elk type beleg – bij Bakkerij Hermans wordt u ondergedompeld in een wereld vol overheerlijk brood.\n\nHet assortiment is geweldig. Waar hebt u vandaag zin in: kiest u voor smaak en gezondheid – of voluit voor smaakplezier? Maak uw keuze en geniet van **krokant gebakken, verse broden** van bij uw bakker in Kasterlee. Kom snel langs in onze bakkerij!",
    },
    { type: "band", image: img("5b1dddcb.jpg"), title: "Spring vandaag nog binnen bij Hermans Bakkerij!" },
  ],
};

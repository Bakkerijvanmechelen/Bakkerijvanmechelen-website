import type { SiteDef } from "./types";

const img = (f: string) => `/sites/devers/${f}`;

export const devers: SiteDef = {
  id: "devers",
  name: "Bakkerij Devers",
  domain: "bakkerijdevers.be",
  metaTitle: "Bakkerij Devers in Brasschaat: proeven van kwaliteit",
  metaDescription: "Bakkerij Devers in Brasschaat serveert elke dag de lekkerste broden, patisserie en gebak in een gezellige, vriendelijke sfeer. Bezoek uw bakker!",
  theme: { brand: "#b32d33", onBrand: "#ffffff", dark: "#1c1213", soft: "#f9e9ea" },
  logo: { src: img("785e31b8.png"), width: 160, height: 160 },
  logoWithName: true,
  shopsTitle: "Onze winkel",
  shops: [{ match: { name: "Devers Bakkerij", street: "Bredabaan 1041" }, label: "Bakkerij Devers", email: "devers.bakkerij@gmail.com", vat: "0882.251.919" }],
  blocks: [
    { type: "hero", image: img("829df654.jpg"), title: "Uw bakker die smaak brengt", subtitle: "Uw bakker op de Bredabaan", button: "Kom eens langs!" },
    {
      type: "intro",
      title: "De bakker die Brasschaat op smaak brengt!",
      text: "De bakkerij waar heel Brasschaat met plezier over de vloer komt? Bakkerij Devers! Onze bakkerij eindigt niet aan de deur, maar voorziet de hele straat van onweerstaanbare geuren. En u weet: er gaat niets boven de geur van **versgebakken broden, knapperige koffiekoeken en royale patisserie**.\n\nU merkt het wanneer u nog maar in de buurt komt: bakkerij Devers in Brasschaat is een **ervaren bakker**, die elk product met liefde bereidt en met zorg afwerkt. Het hele assortiment wordt u gepresenteerd door onze **vriendelijke, hulpvaardige medewerkers** die al uw vragen met de glimlach beantwoorden.",
    },
    {
      type: "feature",
      image: img("668e447c.jpg"),
      title: "Boterhammen met een twist",
      text: "Het staat vast: de Belg is én blijft een fervente broodeter. En met de komst van talloze fabrieksbakkerijen, gaat de klant steeds meer terug **op zoek naar de authentieke kwaliteit van de échte lokale bakker**. Die vindt u bij bakkerij Devers in Brasschaat. Onze broden barsten van de smaak en zijn bereid met ingrediënten die uitblinken in **puurheid en kwaliteit**.\n\nZet uw tanden in de krokante korst, versier rijkelijk met het beleg waar u van houdt en geniet van broden die boordevol energie zitten. In onze winkel ontdekt u een **uitgebreid gamma aan dagvers gebakken broden**, van gezond granenbrood tot onweerstaanbaar wit brood – en alles daartussen.",
    },
    { type: "gallery", images: ["7cc6e0b0.jpg", "4a03c384.jpg", "35efe947.jpg", "228bd0d3.jpg"].map(img) },
    {
      type: "feature",
      image: img("4b36f598.jpg"),
      title: "Het adres voor de levensgenieter",
      text: "Nog een feit: de Belg is én blijft een levensgenieter, met een passie voor lekker eten en smaakvolle kwaliteit. Daar sluit ons aanbod aan **patisserie en gebak** dan ook mooi bij aan.\n\nEen **koffiekoek** voor op de middag of een croissantje voor ’s ochtends? Een **taart** voor bij de koffieklets of een speciaal, creatief gebakje voor dat leuke feest? Bij bakkerij Devers in Brasschaat koopt u het gebak en de patisserie waar u écht van houdt. Vers klaargemaakt door uw bakker.\n\n**Kom langs en proef zelf onze unieke bakkerijproducten!**",
    },
    { type: "band", image: img("6aa2f691.jpg"), title: "Kom langs bij Bakkerij Devers" },
  ],
};

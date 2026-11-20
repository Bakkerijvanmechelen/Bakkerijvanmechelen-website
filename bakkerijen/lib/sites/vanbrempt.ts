import type { SiteDef } from "./types";

const img = (f: string) => `/sites/vanbrempt/${f}`;

export const vanbrempt: SiteDef = {
  id: "vanbrempt",
  name: "Bakkerij Van Brempt",
  domain: "bakkerijvanbrempt.be",
  metaTitle: "Van Brempt, bakker in Burcht en Zwijndrecht",
  metaDescription: "Het lekkerste brood van Burcht en Zwijndrecht? Dat koopt u bij bakkerij Van Brempt, dé bakker in uw buurt. Kom zelf proeven: bezoek de bakkerij!",
  theme: { brand: "#a87c17", onBrand: "#ffffff", dark: "#1d1811", soft: "#f6efdd" },
  logo: { src: img("cd4fca23.png"), width: 165, height: 121 },
  shopsTitle: "Onze winkels",
  shops: [
    { match: { name: "Bakkerij van Brempt", street: "Dorpstraat 74" }, label: "Van Brempt Burcht", email: "bakkerijvanbrempt@gmail.com", vat: "BE 0738.875.922" },
    { match: { name: "Bakkerij van Brempt", street: "Statiestraat 84" }, label: "Van Brempt Zwijndrecht", email: "vanbrempt.zwijndrecht@gmail.com", vat: "BE 0827.522.836" },
  ],
  blocks: [
    { type: "hero", image: img("ba92ad40.jpg"), title: "Bakkerij Van Brempt", subtitle: "Brood & gebak sinds 1898", button: "Onze winkels" },
    {
      type: "intro",
      title: "Het lekkerste brood van Burcht en Zwijndrecht!",
      text: "Bakkerij Van Brempt in Burcht en Zwijndrecht is niet meer weg te denken uit het straatbeeld. Onze bakkerij is een icoon van **versheid en kwaliteit – al sinds 1898**. Meer dan 120 jaar vakmanschap komen samen in elk product dat u bij ons vindt. Want onze broden en ons **assortiment aan gebak en patisserie** zijn het resultaat van ervaring en een passie voor het ambacht.",
    },
    {
      type: "feature",
      image: img("0a6292ee.jpg"),
      title: "Gezellige bakker-om-de-hoek!",
      text: "Onze bakkerij is een **vaste waarde** bij de bevolking van Burcht en Zwijndrecht. Als er iets gevierd moet worden, gebeurt dat met onze taarten en ons overheerlijke gebak. Komt de familie eten? Dan geniet iedereen van pistolets die **knapperig werden gebakken** in onze oven. Maar ook voor het ontbijt en de lunch van elke dag, rekenen onze klanten op het **kwaliteitsbrood** uit onze bakkerij.\n\nKortom, de producten van Bakkerij Van Brempt zijn de perfecte basis voor elk onvergetelijk moment. Want puur genieten doet u met **broden, gebak en patisserie** van bij uw bakker.",
    },
    {
      type: "feature",
      image: img("ba7deb7c.jpg"),
      title: "Broden voor het leven?",
      text: "Iedereen is anders en houdt van andere smaken en texturen. Daarom bieden we u een **assortiment aan broodsoorten** aan waar iedereen zijn gading in vindt. Zoet en smakelijk wit brood ligt harmonieus langs de donkere graanvarianten. Fruitbroden worden afgewisseld met lekkere broodjes waar u met plezier van smult.\n\nHet **ruime broodaanbod** geeft u de kans om op elke dag van de week te genieten van een ander soort brood. Zo wordt elke boterham uniek.",
    },
    { type: "gallery", images: [img("e11cea12.jpg"), img("b0de1036.jpg"), img("a6e78936.jpg"), img("8de208be.jpg")] },
    {
      type: "band",
      image: img("f0eeac26.jpg"),
      title: "Lekkerbekken welkom!",
      text: "Ook zoetekauwen slaan hun slag bij bakkerij Van Brempt. Onze koeltoog barst van de overheerlijke gebakjes in alle vormen, kleuren en formaten. En u zet maar wat graag uw tanden in een krokante koffiekoek van bij ons.\n\nZelf ontdekken hoe lekker onze producten zijn? Kom langs!",
      button: "Onze winkels",
    },
  ],
};

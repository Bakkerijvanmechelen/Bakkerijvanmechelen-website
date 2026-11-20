import type { SiteDef } from "./types";

const img = (f: string) => `/sites/vanhecke/${f}`;

export const vanhecke: SiteDef = {
  id: "vanhecke",
  name: "Van Hecke Bakkerij",
  domain: "vanheckebakkerij.be",
  metaTitle: "Van Hecke bakkerij in Deurne",
  metaDescription: "Bakkerij Van Hecke in Deurne is een huis van kwaliteit: een groot aanbod aan broden, gebak en patisserie, vers bereid. Kom vandaag nog langs!",
  theme: { brand: "#a90533", onBrand: "#ffffff", dark: "#1b1012", soft: "#f8e9ed" },
  logo: { src: img("19058950.png"), width: 350, height: 350 },
  logoWithName: true,
  style: { sansHeadings: true, logoSquare: true, heroEmblem: true, introOnBrand: true, plainColumns: true, shopsOnBrand: true },
  shopsTitle: "Contacteer ons",
  shops: [{ match: { name: "Van Hecke Bakkerij", street: "Venneborglaan 106" }, label: "Van Hecke Bakkerij" }],
  blocks: [
    { type: "hero", image: img("3719b15f.jpg"), title: "Een **hart** voor traditie", button: "Contacteer ons" },
    {
      type: "intro",
      title: "Bakkerij Van Hecke: de bakker die houdt van kwaliteit",
      text: "Bakkerij Van Hecke is een **huis van kwaliteit**, dat werd opgestart door Jean-Pierre Van Hecke. Nadat hij het beroep vaarwel zei, kwam de bakkerij in handen van de huidige eigenaars, die met bijzondere **liefde voor het ambacht** de reputatie hoog houden.\n\nBakkerij Van Hecke staat in Antwerpen dan ook bekend om zijn **overheerlijke bakkerijproducten** die elke maaltijd compleet maken. U vindt bij ons een **groot aanbod aan broden, gebak en patisserie,** vers bereid volgens recepten die niemand onberoerd laten.",
    },
    {
      type: "feature",
      title: "Brood dat uw dag kleurt",
      text: "Een perfect bereid brood is de basis van elk lekker ontbijt of elke smaakvolle lunch. Bij bakkerij Van Hecke hebt u een **ontzettend uitgebreide keuze**, met een assortiment dat bulkt van de verschillende broodsoorten.\n\nBij ons vindt u **werkelijk alles** – van luchtig en lekker wit brood tot donkere granenbroden die barsten van de vezels en vitaminen. Zin in iets speciaals? Dan vindt u vast een **heerlijk brood** met noten of fruit dat uw bord naar een hoger niveau tilt.",
    },
    {
      type: "feature",
      title: "Een koffiekoek, altijd een succes",
      text: "Zin in een zoete zonde? De **koffiekoeken, het gebak en de patisserie** van bakkerij Van Hecke zijn altijd een schot in de roos.\n\nVan de typisch **kruimelende croissants en chocoladebroodjes tot rijkelijke rozijnenkoeken en royale crèmekoeken**, het assortiment aan koeken en gebak van onze bakkerij zijn een weldaad voor uw smaakpapillen.\n\n**Tijd voor brood en gebak van uw bakker in Antwerpen? Kom vandaag nog langs!**",
    },
    { type: "band", image: img("771b314f.png"), title: "Spring vandaag nog binnen bij Van Hecke Bakkerij!" },
  ],
};

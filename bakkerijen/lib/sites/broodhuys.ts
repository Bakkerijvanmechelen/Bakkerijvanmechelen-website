import type { SiteDef } from "./types";

const img = (f: string) => `/sites/broodhuys/${f}`;

export const broodhuys: SiteDef = {
  id: "broodhuys",
  name: "’t Broodhuys",
  domain: "bakkerijtbroodhuys.be",
  metaTitle: "'t Broodhuys bakker Edegem (voorheen Payet)",
  metaDescription: "'t Broodhuys in Edegem is de bakker die de lekkerste kwaliteit biedt, de hele week door. De heerlijkste bakker in Edegem? Kom snel langs en maak uw keuze!",
  theme: { brand: "#8a6f55", onBrand: "#ffffff", dark: "#1c1814", soft: "#f3ece4" },
  logo: null,
  tagline: "Brood, patisserie en meer",
  shopsTitle: "Contacteer ons vrijblijvend",
  shops: [{ match: { name: "Bakkerij 't Broodhuys", street: "Hazeschransstraat 31" }, label: "Bakkerij 't Broodhuys" }],
  blocks: [
    { type: "hero", image: img("93bee20b.jpg"), title: "Ons brood, jouw thuysgevoel", subtitle: "Bakker 'T Broodhuys, waar Edegem naartoe gaat om te genieten!", button: "Kom eens langs!" },
    {
      type: "intro",
      title: "Broden, gebak en patisserie",
      text: "Edegem weet waar het moet zijn voor **bakkerijproducten van topkwaliteit**. Bakkerij 't Broodhuys is al jaar en dag een naam als een klok in de regio. Wat ooit opgestart werd door de **Franse bakker-patissier Fabrice Payet**, groeide doorheen de jaren uit tot een kwaliteitsbakkerij waar zowel het dagelijks brood als het uitzonderlijk gebak vlot over de toonbank gaat.\n\nOnze gezellige bakkerij presenteert een ruim en breed **assortiment aan broden, gebak en patisserie**. U wordt ontvangen door onze vriendelijke medewerkers, die u met de glimlach bedienen.",
    },
    {
      type: "feature",
      image: img("5cbf13e6.jpg"),
      title: "",
      text: "Het assortiment aan **typisch Frans gebak en patisserie** doet u meteen wegdromen naar de statige lanen van Parijs of de stranden aan de Côte d’Azur. Toen de bakkerij werd opgericht, lag de volledige focus op dit verfijnde aanbod.\n\nDoorheen de jaren is onze koeltoog echter uitgebreid met een stevig, oer-**Vlaams assortiment aan broden en gebak**. Ware Vlaamse klassiekers die elke huiskamer omtoveren tot een heerlijk eetfestijn.",
    },
    { type: "band", image: img("93bee20b.jpg"), title: "Spring vandaag nog binnen bij bakkerij t Broodhuys!" },
    {
      type: "feature",
      image: img("bfeb6c0f.jpg"),
      title: "",
      text: "De **krokant gebakken broden** die wij elke dag uit de oven halen, zitten boordevol bestanddelen die écht goed voor u zijn. Maar natuurlijk kiest u zelf waar u het meeste zin in heeft: vol bruin brood waar u stevig van kunt genieten, of **luchtige lichte broden** die makkelijk weghappen. Probeer ook zeker **onze broodspecialiteiten** – net dat tikje anders, minstens even smaakvol.\n\nVergeet zeker ook uw **croissant, chocoladebroodje of koffiekoek** niet te selecteren in ons ruime aanbod aan koeken, gebak en patisserie. Van de stevige hap tot verfijnde creaties, bij bakkerij Payet in Edegem vindt u het allemaal.\n\n**Kom vandaag nog langs in onze bakkerij!**",
    },
  ],
};

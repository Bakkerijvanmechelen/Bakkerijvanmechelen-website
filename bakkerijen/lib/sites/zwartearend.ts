import type { SiteDef } from "./types";

const img = (f: string) => `/sites/zwartearend/${f}`;

export const zwartearend: SiteDef = {
  id: "zwartearend",
  name: "Bakkerij De Zwarte Arend",
  domain: "bakkerijdezwartearend.be",
  metaTitle: "Bakkerij De Zwarte Arend in Deurne: uw lokale bakker",
  metaDescription: "Bakkerij De Zwarte Arend in Deurne is uw brenger van gezelligheid. Want onze heerlijke broden, gebak en patisserie brengen elke dag op smaak. Ontdek meer!",
  theme: { brand: "#6b3d1f", onBrand: "#ffffff", dark: "#1f140c", soft: "#f3eae2" },
  logo: { src: img("86235538.png"), width: 500, height: 179 },
  shopsTitle: "Contacteer ons",
  shops: [{ match: { name: "Bakkerij De Zwarte Arend", street: "Koningsarendlaan 2" }, label: "Bakkerij De Zwarte Arend" }],
  blocks: [
    { type: "hero", image: img("dc0f72ed.jpg"), title: "Met zorg bereid", button: "Contacteer ons!" },
    {
      type: "intro",
      title: "Bakkerij De Zwarte Arend, uw bakker in Deurne!",
      text: "Een ambachtelijke **bakkerij** in het hartje van Deurne?\n\nStap eens binnen in onze bakkerij en ontdek het onweerstaanbare assortiment aan **kwaliteitsbroden, smaakvol gebak en lekkere patisserie**. U vindt onze bakkerij op de **hoek van de Schotensesteenweg en de Koningsarendlaan**. Onze gezellige winkel herbergt het lekkerste van wat uw bakker te bieden heeft. Met zorg bereid door uw bakker, volgens de hoogste standaarden gepresenteerd in onze koeltoog..",
    },
    {
      type: "feature",
      image: img("934ea945.jpg"),
      title: "Broodsoorten die iedereen verleiden",
      text: "De Zwarte Arend staat bekend om zijn ontzettend **uitgebreid aanbod aan verschillende broden**. Iedereen vindt hier waar hij van houdt. Een voedzame en overheerlijke lunch met multigranenbrood? Een luchtige boterham met smakelijk wit brood? **U kiest – én geniet** – wij serveren met de glimlach. Onze broden bevatten alles wat u nodig hebt om **vol energie aan uw dag te beginnen**. De beste grondstoffen én evenwichtige recepten zorgen voor een gezonde en krokante smaakbeleving.",
    },
    {
      type: "feature",
      image: img("368446c6.jpg"),
      title: "Elke dag het lekkerste gebak",
      text: "Onze klanten houden het meest van onze **ongedwongen vriendelijkheid**. Bij onze bakkerij in Deurne binnenstappen is dan ook een onmisbare routine voor vele mensen uit de buurt. Maar ook ons uitgebreide én dagelijks verse aanbod aan gebak en patisserie is een publiekstrekker. We hebben een **vast assortiment aan gebak** voor u klaarstaan – **aangevuld met specialiteiten** die passen bij het seizoen of bij gelegenheden. Komt u op maandag langs? Dan kunt u proeven van het **Gebak van de Week**. Een verrassende bereiding die u met plezier mee naar huis neemt.",
    },
    { type: "intro", title: "Proef het zelf: bezoek onze bakkerij en bestel waar ú zin in hebt.", text: "" },
    { type: "gallery", images: ["9c3cc79e.jpg", "533a7092.jpg", "0d24edb4.jpg", "c19adcbc.jpg", "d7c61c2a.jpg"].map(img) },
    { type: "band", image: img("b47fa823.jpg"), title: "Contacteer ons", text: "Of kom langs bij Bakkerij De Zwarte Arend" },
  ],
};

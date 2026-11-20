import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ShopExplorer from "@/components/ShopExplorer";
import { getContent } from "@/lib/cms";
import { getShops } from "@/lib/shops";

export const metadata: Metadata = {
  title: "Ontdek alle bakkerijen van Bakkerij Gijbels",
  description: "Bekijk alle winkels van Bakkerij Gijbels in de provincie Antwerpen, met adres, openingsuren en route.",
};

export default async function Winkels() {
  const [shops, c] = await Promise.all([getShops(), getContent()]);
  return (
    <>
      <PageHero eyebrow={c["shops.hero.eyebrow"]} title={c["shops.hero.title"]} subtitle={c["shops.hero.subtitle"]} image={{ src: c["shops.hero.image"], alt: "" }} />
      <ShopExplorer shops={shops} />
    </>
  );
}

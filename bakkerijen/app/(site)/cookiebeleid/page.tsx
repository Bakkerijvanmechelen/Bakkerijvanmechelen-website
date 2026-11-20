import type { Metadata } from "next";
import CookiePolicy from "@/components/CookiePolicy";
import LegalPage from "@/components/LegalPage";
import { getContent } from "@/lib/cms";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: `Cookiebeleid | ${site.name}` };

export default async function Cookiebeleid() {
  const c = await getContent();
  const email = site.shops.map((_, i) => c[`shop${i + 1}.email`]).find(Boolean);
  return (
    <LegalPage title="Cookiebeleid" updated="november 2026">
      <CookiePolicy googleMaps email={email} />
    </LegalPage>
  );
}

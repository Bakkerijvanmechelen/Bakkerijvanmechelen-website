import type { Metadata } from "next";
import CookiePolicy from "@/components/CookiePolicy";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Cookiebeleid | Bakkerij Van Mechelen" };

export default async function Cookiebeleid() {
  return (
    <LegalPage title="Cookiebeleid" updated="november 2026">
      <CookiePolicy recaptcha zas />
    </LegalPage>
  );
}

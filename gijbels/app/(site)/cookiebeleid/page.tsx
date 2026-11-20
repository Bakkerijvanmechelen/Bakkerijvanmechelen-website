import type { Metadata } from "next";
import CookiePolicy from "@/components/CookiePolicy";
import LegalPage from "@/components/LegalPage";

export const metadata: Metadata = { title: "Cookiebeleid | Bakkerij Gijbels" };

export default function Cookiebeleid() {
  return (
    <LegalPage title="Cookiebeleid" updated="november 2026">
      <CookiePolicy recaptcha map email="info@bakkerijgijbels.be" />
    </LegalPage>
  );
}

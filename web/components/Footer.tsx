import { CookieSettingsButton } from "@/components/CookieBanner";
import SocialIcon from "@/components/SocialIcons";
import { companyFrom, getContent } from "@/lib/cms";
import { getHeadOfficeHours } from "@/lib/head-office";
import Link from "next/link";

export default async function Footer() {
  const [content, hours] = await Promise.all([getContent(), getHeadOfficeHours()]);
  const company = companyFrom(content);
  return (
    <footer className="bg-ink text-flour">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3">
        <address className="not-italic leading-relaxed">
          <p className="font-display text-xl">{company.legalName}</p>
          <p>{company.street}</p>
          <p>{company.city}</p>
          <p className="mt-2">O.N. {company.vat}</p>
          {hours.map((l) => (
            <p key={l} className="mt-2 text-sm text-flour/70">
              {l}
            </p>
          ))}
        </address>
        <p className="leading-relaxed">
          <a href={company.phoneHref} className="hover:text-sage-light">
            {company.phone}
          </a>
          <br />
          <Link href="/#contact" className="hover:text-sage-light">
            Contactformulier
          </Link>
        </p>
        <p className="flex items-start gap-3 sm:justify-end">
          <a href={company.facebook} target="_blank" rel="noopener noreferrer" aria-label="Bakkerij Van Mechelen op Facebook" className="grid size-11 place-items-center rounded-full border border-flour/30 transition hover:border-sage-light hover:text-sage-light">
            <SocialIcon name="facebook" />
          </a>
          <a href={company.instagram} target="_blank" rel="noopener noreferrer" aria-label="Bakkerij Van Mechelen op Instagram" className="grid size-11 place-items-center rounded-full border border-flour/30 transition hover:border-sage-light hover:text-sage-light">
            <SocialIcon name="instagram" />
          </a>
        </p>
      </div>
      <div className="border-t border-flour/15 px-5 py-4 text-center text-sm text-flour/70">
        © 2026 Bakkerij Van Mechelen ·{" "}
        <a href="/privacy" className="underline">
          Privacyverklaring
        </a>{" "}
        ·{" "}
        <a href="/cookiebeleid" className="underline">
          Cookiebeleid
        </a>{" "}
        ·{" "}
        <CookieSettingsButton className="underline" />
      </div>
    </footer>
  );
}

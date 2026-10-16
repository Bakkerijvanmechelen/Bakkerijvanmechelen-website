import SocialIcon from "@/components/SocialIcons";
import { company } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="bg-ink text-flour">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3">
        <address className="not-italic leading-relaxed">
          <p className="font-display text-xl">{company.legalName}</p>
          <p>{company.street}</p>
          <p>{company.city}</p>
          <p className="mt-2">O.N. {company.vat}</p>
        </address>
        <p className="leading-relaxed">
          <a href={company.phoneHref} className="hover:text-sage-light">
            {company.phone}
          </a>
          <br />
          <a href={`mailto:${company.email}`} className="hover:text-sage-light">
            {company.email}
          </a>
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
        </a>
      </div>
    </footer>
  );
}

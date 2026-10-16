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
        <p className="flex gap-5 sm:justify-end">
          <a href={company.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-sage-light">
            Facebook
          </a>
          <a href={company.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-sage-light">
            Instagram
          </a>
        </p>
      </div>
      <div className="border-t border-flour/15 px-5 py-4 text-center text-sm text-flour/70">
        © 2026 Bakkerij Van Mechelen ·{" "}
        <a href="/cookiebeleid" className="underline">
          Cookiebeleid
        </a>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { CookieSettingsButton } from "@/components/CookieBanner";
import { hoursLines, telHref } from "@/lib/shop-types";
import { getContent, withCount } from "@/lib/cms";
import { getShops } from "@/lib/shops";

export default async function SiteFooter() {
  const [shops, c] = await Promise.all([getShops(), getContent()]);
  const main = shops.find((s) => s.kind === "eigen");

  return (
    <footer className="bg-blue-deep text-flour">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-3">
        {main && (
          <address className="not-italic">
            <p className="font-display text-xl">{main.name}</p>
            <p className="mt-2 text-flour/80">
              {main.street}
              <br />
              {main.postal_code} {main.city}
            </p>
            {hoursLines(main.hours)[0] && <p className="mt-2 text-sm text-flour/60">{hoursLines(main.hours)[0]}</p>}
          </address>
        )}
        <div className="text-flour/80">
          {main?.phone && (
            <p>
              <a href={telHref(main.phone)} className="transition hover:text-butter">
                {main.phone}
              </a>
            </p>
          )}
          <p className="mt-2 text-sm text-flour/60">{withCount(c["footer.shops"], shops.length)}</p>
        </div>
        <nav aria-label="Voettekst" className="sm:text-right">
          <ul className="grid gap-1.5 text-flour/80">
            {[["/geschiedenis", "Geschiedenis"], ["/assortiment", "Assortiment"], ["/diensten", "Diensten"], ["/winkels", "Winkels"], ["/contact", "Contact"]].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="transition hover:text-butter">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="border-t border-flour/10 py-5 text-center text-sm text-flour/60">
        © 2026 Bakkerij Gijbels ·{" "}
        <Link href="/privacy" className="underline transition hover:text-butter">
          Privacyverklaring
        </Link>{" "}
        ·{" "}
        <Link href="/cookiebeleid" className="underline transition hover:text-butter">
          Cookiebeleid
        </Link>{" "}
        · <CookieSettingsButton className="underline transition hover:text-butter" />
      </p>
    </footer>
  );
}

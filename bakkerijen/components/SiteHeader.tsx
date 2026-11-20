import Image from "next/image";
import Link from "next/link";
import { getContent } from "@/lib/cms";
import { telHref } from "@/lib/shop-types";
import { getSiteShops } from "@/lib/shops";
import { site } from "@/lib/site";

export default async function SiteHeader() {
  const [shops, c] = await Promise.all([getSiteShops(), getContent()]);
  const many = shops.length > 1;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-2">
        <Link href="/" aria-label={`${site.name}, naar boven`} className="shrink-0">
          {site.logo ? (
            <span className="flex items-center gap-3">
              <Image
                src={site.logo.src}
                alt={site.name}
                width={site.logo.width}
                height={site.logo.height}
                priority
                className={`${site.logo.width > site.logo.height * 4 ? "h-7 w-auto md:h-8" : "h-12 w-auto md:h-14"} ${site.style?.logoSquare ? "bg-brand p-2" : site.logoOnBrand ? "rounded-full bg-brand p-1.5" : ""}`}
              />
              {site.logoWithName && (
                <span className={`hidden text-brand sm:block ${site.style?.logoSquare ? "text-xl font-extrabold uppercase tracking-wide md:text-2xl" : "font-display text-xl"}`}>{site.name}</span>
              )}
            </span>
          ) : (
            <span className="block leading-tight">
              <span className="block font-display text-2xl text-brand">{site.name}</span>
              {site.tagline && <span className="block text-xs font-bold uppercase tracking-[0.2em] text-ink/60">{site.tagline}</span>}
            </span>
          )}
        </Link>

        <ul className="flex flex-wrap items-center justify-end gap-x-6 gap-y-1 text-sm md:text-base">
          {shops.map((s, i) =>
            s?.phone ? (
              <li key={i} className="whitespace-nowrap">
                {many && <span className="mr-2 hidden text-ink/60 sm:inline">{c[`shop${i + 1}.label`].replace(new RegExp(`^${site.name.replace(/^Bakkerij\s+/i, "")}\\s+`, "i"), "")}</span>}
                <a href={telHref(s.phone)} className="font-bold text-brand transition hover:text-ink">
                  {s.phone}
                </a>
              </li>
            ) : null,
          )}
          <li className="hidden md:block">
            <Link href="/#winkels" className="rounded-full bg-brand px-5 py-2 text-sm font-bold text-on-brand transition hover:bg-dark">
              {c["shops.title"]}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

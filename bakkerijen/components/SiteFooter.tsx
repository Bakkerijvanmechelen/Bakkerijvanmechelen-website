import Link from "next/link";
import { CookieSettingsButton } from "@/components/CookieBanner";
import { site } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="bg-dark text-flour">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-8 text-sm text-flour/70">
        <p>© 2026 {site.name}</p>
        <p className="flex flex-wrap gap-x-5 gap-y-1">
          <Link href="/privacy" className="underline transition hover:text-white">
            Privacyverklaring
          </Link>
          <Link href="/cookiebeleid" className="underline transition hover:text-white">
            Cookiebeleid
          </Link>
          <CookieSettingsButton className="underline transition hover:text-white" />
        </p>
      </div>
    </footer>
  );
}

import Image from "next/image";
import Link from "next/link";
import { nav } from "@/lib/content";

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-ink/85 text-flour backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2">
        <Link href="/" aria-label="Bakkerij Van Mechelen, naar boven">
          <Image
            src="/images/Logo-Bakkerij-Van-Mechelen-wit.png"
            alt="Bakkerij Van Mechelen"
            width={52}
            height={56}
            priority
          />
        </Link>
        <nav aria-label="Hoofdmenu">
          <ul className="flex gap-5 text-sm font-bold uppercase tracking-wider sm:gap-8">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={`/${n.href}`} className="transition hover:text-sage-light">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

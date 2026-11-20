"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const nav = [
  { href: "/", label: "Home" },
  { href: "/geschiedenis", label: "Geschiedenis" },
  { href: "/assortiment", label: "Assortiment" },
  { href: "/diensten", label: "Diensten" },
  { href: "/winkels", label: "Winkels" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const close = () => setOpen(false);
  const cls = (href: string) => `nav-link transition hover:text-butter ${path === href ? "text-butter" : ""}`;

  return (
    <header className={`fixed inset-x-0 top-0 z-50 text-white backdrop-blur transition-all duration-300 ${scrolled ? "bg-blue-deep shadow-lg shadow-ink/20" : "bg-blue-deep/80"}`}>
      <div className={`mx-auto flex max-w-6xl items-center justify-between px-5 transition-all duration-300 ${scrolled ? "py-1" : "py-2.5"}`}>
        <Link href="/" onClick={close} aria-label="Bakkerij Gijbels, naar home" className="shrink-0">
          <Image src="/images/logo-wit.png" alt="Gijbels" width={715} height={224} priority className="h-11 w-auto" />
        </Link>

        <nav aria-label="Hoofdmenu" className="hidden md:block">
          <ul className="flex gap-8 text-sm font-bold uppercase tracking-wider">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} aria-current={path === n.href ? "page" : undefined} className={cls(n.href)}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobiel-menu"
          aria-label={open ? "Menu sluiten" : "Menu openen"}
          className="grid size-11 place-items-center rounded-full border border-flour/30 md:hidden"
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      <div aria-hidden className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-butter" style={{ transform: `scaleX(${progress})` }} />
      <nav id="mobiel-menu" aria-label="Menu" hidden={!open} className="border-t border-flour/15 md:hidden">
        <ul className="mx-auto max-w-6xl px-5 py-2">
          {nav.map((n) => (
            <li key={n.href}>
              <Link href={n.href} onClick={close} className={`block py-3 text-lg font-bold uppercase tracking-wider ${cls(n.href)}`}>
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

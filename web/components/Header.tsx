"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { nav } from "@/lib/content";

export default function Header() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-ink/90 text-flour backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-2">
        <Link href="/" onClick={close} aria-label="Bakkerij Van Mechelen, naar home">
          <Image src="/images/Logo-Bakkerij-Van-Mechelen-wit.png" alt="Bakkerij Van Mechelen" width={52} height={56} priority />
        </Link>

        {/* Groot scherm: gewoon menu */}
        <nav aria-label="Hoofdmenu" className="hidden md:block">
          <ul className="flex gap-8 text-sm font-bold uppercase tracking-wider">
            {nav.map((n) => (
              <li key={n.label}>
                <Link href={`/${n.href}`} className="transition hover:text-sage-light">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Klein scherm: uitklapmenu */}
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

      <nav id="mobiel-menu" aria-label="Menu" hidden={!open} className="border-t border-flour/15 md:hidden">
        <ul className="mx-auto max-w-6xl px-5 py-2">
          {nav.map((n) => (
            <li key={n.label}>
              <Link href={`/${n.href}`} onClick={close} className="block py-3 text-lg font-bold uppercase tracking-wider transition hover:text-sage-light">
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

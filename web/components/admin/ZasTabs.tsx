"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/admin/zas", label: "Documenten", exact: true },
  { href: "/admin/zas/categorieen", label: "Categorieën" },
  { href: "/admin/zas/toegang", label: "Wachtwoord" },
];

export default function ZasTabs() {
  const path = usePathname();
  return (
    <nav aria-label="ZAS" className="flex gap-2 overflow-x-auto border-b-2 border-ink/10">
      {tabs.map((t) => {
        const active = t.exact ? path === t.href : path.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={`-mb-0.5 whitespace-nowrap border-b-4 px-5 py-3 text-lg font-bold transition ${
              active ? "border-crust text-ink" : "border-transparent text-ink/60 hover:text-ink"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}

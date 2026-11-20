"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, Svg } from "./ui";

const items = [
  { href: "/admin/teksten", label: "Teksten & foto's", icon: Icon.pencil },
  { href: "/admin/account", label: "Mijn account", icon: Icon.user },
];

export default function AdminNav() {
  const path = usePathname();
  return (
    <nav aria-label="Beheer" className="-mb-px flex gap-1 overflow-x-auto">
      {items.map((it) => {
        const active = path.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-2 whitespace-nowrap border-b-4 px-4 py-4 font-bold transition ${active ? "border-brand text-flour" : "border-transparent text-flour/70 hover:text-flour"}`}
          >
            <Svg>{it.icon}</Svg>
            {it.label}
          </Link>
        );
      })}
    </nav>
  );
}

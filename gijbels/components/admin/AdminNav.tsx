"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, Svg } from "./ui";

const items = [
  { href: "/admin", label: "Berichten", icon: Icon.mail, exact: true, badge: true },
  { href: "/admin/winkels", label: "Winkels", icon: Icon.store },
  { href: "/admin/teksten", label: "Teksten & foto's", icon: Icon.pencil },
  { href: "/admin/account", label: "Mijn account", icon: Icon.user },
];

export default function AdminNav({ unread }: { unread: number }) {
  const path = usePathname();
  return (
    <nav aria-label="Beheer" className="-mb-px flex gap-1 overflow-x-auto">
      {items.map((it) => {
        const active = it.exact ? path === it.href : path.startsWith(it.href);
        return (
          <Link
            key={it.href}
            href={it.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-2 whitespace-nowrap border-b-4 px-4 py-4 font-bold transition ${active ? "border-sage-light text-flour" : "border-transparent text-flour/70 hover:text-flour"}`}
          >
            <Svg>{it.icon}</Svg>
            {it.label}
            {it.badge && unread > 0 && (
              <span className="rounded-full bg-crust px-2 py-0.5 text-xs text-white" aria-label={`${unread} nieuwe`}>
                {unread}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

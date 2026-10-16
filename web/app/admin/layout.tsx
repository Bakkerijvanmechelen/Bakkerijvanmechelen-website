import type { Metadata } from "next";
import Link from "next/link";
import { getAdmin } from "@/lib/admin-auth";
import { signOut } from "./actions";

// Deze routes lezen de sessie en kunnen niet vooraf worden opgebouwd.
export const instant = false;

export const metadata: Metadata = {
  title: "Beheer | Bakkerij Van Mechelen",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const user = await getAdmin();
  return (
    <div className="min-h-screen bg-flour">
      {user && (
        <header className="bg-ink text-flour">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-5 py-3">
            <nav className="flex gap-5 text-sm font-bold uppercase tracking-wider">
              <Link href="/admin" className="hover:text-sage-light">Inzendingen</Link>
              <Link href="/admin/zas" className="hover:text-sage-light">ZAS</Link>
              <Link href="/admin/account" className="hover:text-sage-light">Account</Link>
            </nav>
            <form action={signOut} className="flex items-center gap-4 text-sm">
              <span className="hidden text-flour/70 sm:inline">{user.email}</span>
              <button className="underline hover:text-sage-light">Uitloggen</button>
            </form>
          </div>
        </header>
      )}
      <main className="mx-auto max-w-5xl px-5 py-10">{children}</main>
    </div>
  );
}

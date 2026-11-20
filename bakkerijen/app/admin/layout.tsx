import type { Metadata } from "next";
import AdminNav from "@/components/admin/AdminNav";
import { getAdmin } from "@/lib/admin-auth";
import { site } from "@/lib/site";
import { signOut } from "./actions";

// Deze routes lezen de sessie en kunnen niet vooraf worden opgebouwd.
export const instant = false;

export const metadata: Metadata = {
  title: `Beheer | ${site.name}`,
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const user = await getAdmin();

  return (
    <div className="min-h-screen bg-flour font-sans">
      {user && (
        <header className="bg-dark text-white">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 pt-3">
            <p className="font-display text-lg">Beheer · {site.name}</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
              <a href="/" target="_blank" rel="noopener noreferrer" className="underline">
                Bekijk de website ↗
              </a>
              <span className="hidden text-white/70 sm:inline">{user.email}</span>
              <form action={signOut}>
                <button className="rounded-full border border-white/40 px-4 py-1.5 font-bold hover:bg-white hover:text-ink">Uitloggen</button>
              </form>
            </div>
          </div>
          <div className="mx-auto max-w-5xl px-5">
            <AdminNav />
          </div>
        </header>
      )}
      <main className="mx-auto max-w-5xl px-5 py-10">{children}</main>
    </div>
  );
}

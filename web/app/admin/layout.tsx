import type { Metadata } from "next";
import AdminNav from "@/components/admin/AdminNav";
import { getAdmin } from "@/lib/admin-auth";
import { adminClient } from "@/lib/supabase/admin";
import { signOut } from "./actions";

// Deze routes lezen de sessie en kunnen niet vooraf worden opgebouwd.
export const instant = false;

export const metadata: Metadata = {
  title: "Beheer | Bakkerij Van Mechelen",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const user = await getAdmin();
  const unread = user
    ? ((await adminClient().from("contact_requests").select("id", { count: "exact", head: true }).eq("handled", false)).count ?? 0)
    : 0;

  return (
    <div className="min-h-screen bg-flour">
      {user && (
        <header className="bg-ink text-flour">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 pt-3">
            <p className="font-display text-lg">Beheer · Bakkerij Van Mechelen</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
              <a href="/" target="_blank" rel="noopener noreferrer" className="underline hover:text-sage-light">
                Bekijk de website ↗
              </a>
              <span className="hidden text-flour/60 sm:inline">{user.email}</span>
              <form action={signOut}>
                <button className="rounded-full border border-flour/40 px-4 py-1.5 font-bold hover:bg-flour hover:text-ink">Uitloggen</button>
              </form>
            </div>
          </div>
          <div className="mx-auto max-w-5xl px-5">
            <AdminNav unread={unread} />
          </div>
        </header>
      )}
      <main className="mx-auto max-w-5xl px-5 py-10">{children}</main>
    </div>
  );
}

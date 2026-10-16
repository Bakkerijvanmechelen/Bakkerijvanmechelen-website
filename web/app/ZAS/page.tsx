import type { Metadata } from "next";
import Image from "next/image";
import ZasCatalog from "@/components/ZasCatalog";
import ZasLogin from "@/components/ZasLogin";
import { adminClient } from "@/lib/supabase/admin";
import { isZasUnlocked } from "@/lib/zas-auth";
import { getCategories } from "@/lib/zas-data";
import { lock } from "./actions";

// Deze routes lezen de sessie en kunnen niet vooraf worden opgebouwd.
export const instant = false;

export const metadata: Metadata = {
  title: "ZAS | Bakkerij Van Mechelen",
  robots: { index: false, follow: false },
};

export default async function Zas() {
  if (!(await isZasUnlocked())) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-5 text-flour">
        <Image src="/images/brood-industriele-bakker.jpg" alt="" fill priority sizes="100vw" className="hero-zoom object-cover opacity-30" />
        <div className="fade-up relative w-full max-w-sm rounded-2xl border border-flour/20 bg-ink/80 p-8 backdrop-blur">
          <Image src="/images/Logo-Bakkerij-Van-Mechelen-wit.png" alt="Bakkerij Van Mechelen" width={64} height={68} />
          <h1 className="mt-6 font-display text-3xl">ZAS</h1>
          <p className="mt-2 text-flour/80">Ziekenhuis aan de Stroom. Geef het wachtwoord in om de productinformatie te bekijken.</p>
          <ZasLogin />
        </div>
      </main>
    );
  }

  const supabase = adminClient();
  const [{ data: docs }, categories] = await Promise.all([
    supabase.from("zas_documents").select("*").order("title"),
    getCategories(),
  ]);

  const items = await Promise.all(
    (docs ?? []).map(async (d) => {
      const [view, dl] = await Promise.all([
        supabase.storage.from("zas-documents").createSignedUrl(d.file_path, 3600),
        supabase.storage.from("zas-documents").createSignedUrl(d.file_path, 3600, { download: d.file_name }),
      ]);
      return { ...d, viewUrl: view.data?.signedUrl, downloadUrl: dl.data?.signedUrl };
    }),
  );

  const groups = categories.map((c) => ({
    product: c.name,
    docs: items.filter((d) => d.category_id === c.id),
  }));

  return (
    <>
      <header className="relative overflow-hidden bg-ink text-flour">
        <Image src="/images/brood-industriele-bakker.jpg" alt="" fill priority sizes="100vw" className="hero-zoom object-cover opacity-30" />
        <div className="relative mx-auto flex max-w-6xl items-start justify-between gap-6 px-5 pb-16 pt-8">
          <div>
            <Image src="/images/Logo-Bakkerij-Van-Mechelen-wit.png" alt="Bakkerij Van Mechelen" width={64} height={68} />
            <p className="fade-up mt-10 text-sm font-bold uppercase tracking-[0.3em] text-sage-light">ZAS · Ziekenhuis aan de Stroom</p>
            <h1 className="fade-up mt-3 font-display text-5xl sm:text-6xl" style={{ animationDelay: "120ms" }}>
              Welkom bij Bakkerij Van Mechelen !
            </h1>
            <p className="fade-up mt-4 max-w-xl text-lg text-flour/90" style={{ animationDelay: "240ms" }}>
              Hieronder kan u per artikelgroep zoeken naar het artikel waarvan u graag onze technische fiche wil raadplegen en/of downloaden.
            </p>
          </div>
          <form action={lock}>
            <button className="text-sm underline hover:text-sage-light">Afmelden</button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-16">
        <ZasCatalog groups={groups} />
      </main>
    </>
  );
}

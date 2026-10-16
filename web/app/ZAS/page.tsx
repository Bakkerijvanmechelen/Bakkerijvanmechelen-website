import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
          <Link href="/" className="mt-5 inline-block text-sm text-flour/70 underline underline-offset-4 hover:text-sage-light">
            ← Terug naar home
          </Link>
        </div>
      </main>
    );
  }

  const supabase = adminClient();
  const [{ data: docs }, categories] = await Promise.all([
    supabase.from("zas_documents").select("*").order("title"),
    getCategories(),
  ]);

  const items = docs ?? [];

  const groups = categories.map((c) => ({
    product: c.name,
    docs: items.filter((d) => d.category_id === c.id),
  }));

  const totalDocs = items.length;

  return (
    <>
      <header className="relative overflow-hidden bg-ink text-flour">
        <Image src="/images/brood-industriele-bakker.jpg" alt="" fill priority sizes="100vw" className="hero-zoom object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-transparent to-ink" />
        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-6 sm:pb-28">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" aria-label="Bakkerij Van Mechelen, naar home">
              <Image src="/images/Logo-Bakkerij-Van-Mechelen-wit.png" alt="Bakkerij Van Mechelen" width={56} height={60} />
            </Link>
            <nav aria-label="ZAS" className="flex items-center gap-2 text-sm sm:gap-3">
              <Link href="/" className="rounded-full px-3 py-2 font-bold transition hover:bg-flour/15">Home</Link>
              <form action={lock}>
                <button className="rounded-full px-3 py-2 underline decoration-flour/40 underline-offset-4 hover:text-sage-light">Afmelden</button>
              </form>
            </nav>
          </div>

          <p className="fade-up mt-14 inline-block rounded-full bg-flour/15 px-4 py-1.5 text-sm font-bold uppercase tracking-[0.2em] text-sage-light backdrop-blur">ZAS · Ziekenhuis aan de Stroom</p>
          <h1 className="fade-up mt-5 max-w-3xl font-display text-4xl leading-tight sm:text-6xl" style={{ animationDelay: "120ms" }}>
            Welkom bij Bakkerij Van Mechelen !
          </h1>
          <p className="fade-up mt-5 max-w-2xl text-lg leading-relaxed text-flour/85" style={{ animationDelay: "240ms" }}>
            Hieronder kan u per artikelgroep zoeken naar het artikel waarvan u graag onze technische fiche wil raadplegen en/of downloaden.
          </p>
          <p className="fade-up mt-6 text-flour/70" style={{ animationDelay: "340ms" }}>
            {totalDocs} technische fiche{totalDocs === 1 ? "" : "s"} · {categories.length} artikelgroepen
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-28">
        <ZasCatalog groups={groups} />
      </main>
    </>
  );
}

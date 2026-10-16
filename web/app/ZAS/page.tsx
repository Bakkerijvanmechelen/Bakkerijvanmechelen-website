import type { Metadata } from "next";
import Image from "next/image";
import ZasLogin from "@/components/ZasLogin";
import Reveal from "@/components/Reveal";
import { zasProducts } from "@/lib/content";
import { adminClient } from "@/lib/supabase/admin";
import { isZasUnlocked } from "@/lib/zas-auth";
import { lock } from "./actions";

// Deze routes lezen de sessie en kunnen niet vooraf worden opgebouwd.
export const instant = false;

export const metadata: Metadata = {
  title: "ZAS | Bakkerij Van Mechelen",
  robots: { index: false, follow: false },
};

const size = (b: number | null) => (b == null ? "" : b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);
const ext = (name: string) => name.split(".").pop()?.toUpperCase() ?? "";

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
  const { data: docs } = await supabase.from("zas_documents").select("*").order("title");

  const items = await Promise.all(
    (docs ?? []).map(async (d) => {
      const [view, dl] = await Promise.all([
        supabase.storage.from("zas-documents").createSignedUrl(d.file_path, 3600),
        supabase.storage.from("zas-documents").createSignedUrl(d.file_path, 3600, { download: d.file_name }),
      ]);
      return { ...d, viewUrl: view.data?.signedUrl, downloadUrl: dl.data?.signedUrl };
    }),
  );

  const groups = zasProducts
    .map((product) => ({ product, docs: items.filter((d) => d.product === product) }))
    .filter((g) => g.docs.length);

  return (
    <>
      <header className="relative overflow-hidden bg-ink text-flour">
        <Image src="/images/brood-industriele-bakker.jpg" alt="" fill priority sizes="100vw" className="hero-zoom object-cover opacity-30" />
        <div className="relative mx-auto flex max-w-5xl items-start justify-between gap-6 px-5 pb-16 pt-8">
          <div>
            <Image src="/images/Logo-Bakkerij-Van-Mechelen-wit.png" alt="Bakkerij Van Mechelen" width={64} height={68} />
            <p className="fade-up mt-10 text-sm font-bold uppercase tracking-[0.3em] text-sage-light">Ziekenhuis aan de Stroom</p>
            <h1 className="fade-up mt-3 font-display text-5xl sm:text-6xl" style={{ animationDelay: "120ms" }}>
              Productinformatie
            </h1>
            <p className="fade-up mt-4 max-w-xl text-lg text-flour/90" style={{ animationDelay: "240ms" }}>
              Technische fiches en documentatie van onze producten, op één plaats.
            </p>
          </div>
          <form action={lock}>
            <button className="text-sm underline hover:text-sage-light">Afmelden</button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-16">
        {groups.length === 0 && (
          <p className="rounded-xl bg-white p-8 text-center text-ink/70">Er zijn nog geen documenten beschikbaar.</p>
        )}
        {groups.map((g) => (
          <section key={g.product} className="mb-14">
            <Reveal>
              <h2 className="font-display text-3xl">{g.product}</h2>
            </Reveal>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {g.docs.map((d, i) => (
                <Reveal as="li" key={d.id} delay={i * 80} className="rounded-xl bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="flex items-start gap-4">
                    <span className="rounded-md bg-ink px-2 py-1 text-xs font-bold text-flour">{ext(d.file_name)}</span>
                    <div>
                      <h3 className="font-bold">{d.title}</h3>
                      {d.description && <p className="mt-1 text-sm text-ink/70">{d.description}</p>}
                      <p className="mt-1 text-xs text-ink/50">{size(d.size_bytes)}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-5 text-sm font-bold">
                    {d.viewUrl && (
                      <a href={d.viewUrl} target="_blank" rel="noopener noreferrer" className="text-crust underline">
                        Bekijken
                      </a>
                    )}
                    {d.downloadUrl && (
                      <a href={d.downloadUrl} className="text-crust underline">
                        Downloaden
                      </a>
                    )}
                  </div>
                </Reveal>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </>
  );
}

import Link from "next/link";
import { Card, Pill, PageHeader, primaryBtn, secondaryBtn } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { adminClient } from "@/lib/supabase/admin";
import { getZasPasswordInfo } from "@/lib/zas-auth";

const count = async (table: string, handled?: boolean) => {
  let q = adminClient().from(table).select("id", { count: "exact", head: true });
  if (handled !== undefined) q = q.eq("handled", handled);
  return (await q).count ?? 0;
};

export default async function Overzicht() {
  await requireAdmin();
  const [unread, docs, cats, pw] = await Promise.all([
    count("contact_requests", false),
    count("zas_documents"),
    count("zas_categories"),
    getZasPasswordInfo(),
  ]);

  return (
    <>
      <PageHeader title="Welkom terug" intro="Hier zie je in één oogopslag wat er aandacht nodig heeft. Kies een kaart om verder te gaan." />

      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <p className="text-sm font-bold uppercase tracking-wider text-ink/60">Berichten van de website</p>
          <p className="mt-2 font-display text-4xl">{unread}</p>
          <p className="mt-1 text-lg">{unread === 0 ? "Geen nieuwe berichten. Alles is afgehandeld." : unread === 1 ? "nieuw bericht wacht op een antwoord" : "nieuwe berichten wachten op een antwoord"}</p>
          <div className="mt-5">
            <Link href="/admin/berichten" className={unread ? primaryBtn : secondaryBtn}>
              {unread ? "Berichten bekijken" : "Alle berichten bekijken"}
            </Link>
          </div>
        </Card>

        <Card>
          <p className="text-sm font-bold uppercase tracking-wider text-ink/60">Technische fiches voor ZAS</p>
          <p className="mt-2 font-display text-4xl">{docs}</p>
          <p className="mt-1 text-lg">
            {docs === 1 ? "document" : "documenten"} in {cats} {cats === 1 ? "categorie" : "categorieën"}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/admin/zas" className={primaryBtn}>
              Documenten toevoegen
            </Link>
            <a href="/ZAS" target="_blank" rel="noopener noreferrer" className={secondaryBtn}>
              ZAS-pagina bekijken ↗
            </a>
          </div>
        </Card>

        <Card className="md:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-ink/60">Toegang tot de ZAS-pagina</p>
              <p className="mt-2 flex flex-wrap items-center gap-3 text-lg">
                {pw.isSet ? <Pill tone="green">Beveiligd met wachtwoord</Pill> : <Pill tone="red">Nog geen wachtwoord</Pill>}
                <span className="text-ink/70">
                  {pw.isSet
                    ? "Alleen wie het wachtwoord kent, kan de fiches zien."
                    : "Zolang er geen wachtwoord is ingesteld, kan niemand de pagina openen."}
                </span>
              </p>
            </div>
            <Link href="/admin/zas/toegang" className={pw.isSet ? secondaryBtn : primaryBtn}>
              {pw.isSet ? "Wachtwoord beheren" : "Wachtwoord instellen"}
            </Link>
          </div>
        </Card>
      </div>

      <Card title="Snel aan de slag" className="mt-8">
        <ol className="grid gap-4 sm:grid-cols-3">
          <li>
            <p className="font-bold">Een technische fiche toevoegen</p>
            <p className="mt-1 text-ink/70">Ga naar ZAS, sleep de pdf in het vak, controleer de naam en klik op bevestigen. De naam wordt automatisch uit de pdf gehaald.</p>
          </li>
          <li>
            <p className="font-bold">Een bericht beantwoorden</p>
            <p className="mt-1 text-ink/70">Open Berichten, klik op “Beantwoorden” en je mailprogramma opent. Daarna markeer je het bericht als afgehandeld.</p>
          </li>
          <li>
            <p className="font-bold">Per ongeluk iets gedaan?</p>
            <p className="mt-1 text-ink/70">Verwijderen vraagt altijd eerst om bevestiging. Namen en categorieën kun je op elk moment aanpassen.</p>
          </li>
        </ol>
      </Card>
    </>
  );
}

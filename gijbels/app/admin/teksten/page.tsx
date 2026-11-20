import Link from "next/link";
import ContentEditor from "@/components/admin/ContentEditor";
import { Help, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { CONTENT_TABLE } from "@/lib/cms";
import { defaults, schema } from "@/lib/cms-schema";
import { adminClient } from "@/lib/supabase/admin";

export default async function Teksten({ searchParams }: PageProps<"/admin/teksten">) {
  await requireAdmin();
  const { pagina } = await searchParams;
  const page = schema.find((p) => p.id === pagina) ?? schema[0];

  // Altijd vers uit de database, zodat het beheer meteen toont wat er is opgeslagen.
  const { data } = await adminClient().from(CONTENT_TABLE).select("key,value");
  const values: Record<string, string> = { ...defaults };
  for (const r of data ?? []) if (r.key in defaults) values[r.key] = r.value;

  return (
    <>
      <PageHeader title="Teksten & foto's" intro="Pas hier de teksten en foto's van de website aan. Kies eerst de pagina, wijzig wat je wilt en klik bij dat blok op Opslaan.">
        <Help title="Tips bij het schrijven">
          <p>• Een lege regel tussen twee stukken tekst maakt een nieuwe alinea.</p>
          <p>• Zet een woord tussen twee sterretjes om het vet te maken: **zo**.</p>
          <p>• Maak je een veld helemaal leeg, dan komt de originele tekst terug. Je kunt ook altijd op “Originele tekst terugzetten” klikken.</p>
          <p>• Typ {"{aantal}"} waar het aantal winkels moet komen. Dat getal past zich vanzelf aan als er winkels bijkomen.</p>
          <p>• Na het opslaan staat de wijziging meteen op de website.</p>
        </Help>
      </PageHeader>

      <nav aria-label="Pagina's" className="mb-8 flex flex-wrap gap-2">
        {schema.map((p) => (
          <Link
            key={p.id}
            href={`/admin/teksten?pagina=${p.id}`}
            aria-current={p.id === page.id ? "page" : undefined}
            className={`rounded-full px-5 py-2.5 font-bold transition ${p.id === page.id ? "bg-blue text-white" : "bg-white text-ink shadow-sm hover:bg-blue-soft"}`}
          >
            {p.title}
          </Link>
        ))}
        <Link href={page.href} target="_blank" className="ml-auto self-center text-sm font-bold underline">
          Bekijk “{page.title}” op de website ↗
        </Link>
      </nav>

      <ContentEditor key={page.id} page={page} values={values} />
    </>
  );
}

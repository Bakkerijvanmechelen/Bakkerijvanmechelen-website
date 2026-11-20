import Link from "next/link";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { Card, Help, PageHeader, Pill, primaryBtn, secondaryBtn } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { adminClient } from "@/lib/supabase/admin";
import { deleteRequest, markAllHandled, toggleHandled } from "./actions";

const fmt = new Intl.DateTimeFormat("nl-BE", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Brussels" });
const tabs = [
  { key: "nieuw", label: "Nieuw" },
  { key: "klaar", label: "Afgehandeld" },
  { key: "alle", label: "Alle" },
] as const;

export default async function Berichten({ searchParams }: PageProps<"/admin">) {
  await requireAdmin();
  const sp = await searchParams;
  const tab = tabs.find((t) => t.key === sp.tab)?.key ?? "nieuw";

  const { data: all } = await adminClient().from("gijbels_contact_requests").select("*").order("created_at", { ascending: false }).limit(500);
  const rows = all ?? [];
  const counts = { nieuw: rows.filter((r) => !r.handled).length, klaar: rows.filter((r) => r.handled).length, alle: rows.length };
  const shown = rows.filter((r) => (tab === "alle" ? true : tab === "nieuw" ? !r.handled : r.handled));

  return (
    <>
      <PageHeader title="Berichten" intro="Dit zijn de vragen die bezoekers via het contactformulier op de website hebben gestuurd.">
        <Help>
          <p>1. Klik op <strong>Beantwoorden</strong>: je mailprogramma opent met het adres al ingevuld.</p>
          <p>2. Klik daarna op <strong>Afgehandeld</strong>. Het bericht verdwijnt uit “Nieuw”, maar blijft bewaard onder “Afgehandeld”.</p>
          <p>Verwijderen is definitief en vraagt daarom altijd om bevestiging.</p>
        </Help>
      </PageHeader>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div role="tablist" className="flex gap-2">
          {tabs.map((t) => (
            <Link
              key={t.key}
              href={`/admin?tab=${t.key}`}
              role="tab"
              aria-selected={tab === t.key}
              className={`rounded-full px-5 py-2 font-bold transition ${tab === t.key ? "bg-ink text-flour" : "bg-white hover:bg-ink/10"}`}
            >
              {t.label} <span className="opacity-70">({counts[t.key]})</span>
            </Link>
          ))}
        </div>
        {tab === "nieuw" && counts.nieuw > 1 && (
          <ConfirmButton
            label="Alles als afgehandeld markeren"
            question={`Alle ${counts.nieuw} nieuwe berichten als afgehandeld markeren?`}
            confirmLabel="Ja, alles afhandelen"
            action={markAllHandled}
          />
        )}
      </div>

      <ul className="grid gap-4">
        {shown.map((r) => (
          <li key={r.id}>
            <Card className={r.handled ? "opacity-75" : "border-l-8 border-blue"}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-xl font-bold">
                  {r.first_name} {r.last_name}
                </p>
                <div className="text-right">
                  {r.handled ? <Pill tone="grey">Afgehandeld</Pill> : <Pill tone="amber">Nieuw</Pill>}
                  <p className="mt-1 text-sm text-ink/60">{fmt.format(new Date(r.created_at))}</p>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap rounded-xl bg-flour p-4 text-lg leading-relaxed">{r.message}</p>
              <p className="mt-4">
                <a className="font-bold underline" href={`mailto:${r.email}`}>{r.email}</a>
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <a
                  className={primaryBtn}
                  href={`mailto:${r.email}?subject=${encodeURIComponent("Uw vraag aan Bakkerij Gijbels")}&body=${encodeURIComponent(`Beste ${r.first_name},\n\n\n\n--\nBakkerij Gijbels`)}`}
                >
                  Beantwoorden
                </a>
                <form action={toggleHandled.bind(null, r.id, !r.handled)}>
                  <button className={secondaryBtn}>{r.handled ? "Terug naar nieuw" : "✓ Afgehandeld"}</button>
                </form>
                <ConfirmButton label="Verwijderen" question="Dit bericht definitief verwijderen?" confirmLabel="Ja, verwijderen" action={deleteRequest.bind(null, r.id)} />
              </div>
            </Card>
          </li>
        ))}
        {shown.length === 0 && (
          <li>
            <Card className="py-12 text-center">
              <p className="font-display text-2xl">{tab === "nieuw" ? "Alles is afgehandeld 🎉" : "Hier staat niets."}</p>
              <p className="mt-2 text-ink/70">{tab === "nieuw" ? "Er zijn geen nieuwe berichten. Nieuwe vragen verschijnen hier vanzelf." : "Er zijn geen berichten in deze lijst."}</p>
            </Card>
          </li>
        )}
      </ul>
    </>
  );
}

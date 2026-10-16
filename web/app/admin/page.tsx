import { requireAdmin } from "@/lib/admin-auth";
import { adminClient } from "@/lib/supabase/admin";
import { deleteRequest, toggleHandled } from "./actions";

const fmt = new Intl.DateTimeFormat("nl-BE", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Brussels" });

export default async function Inzendingen() {
  await requireAdmin();
  const { data: rows, error } = await adminClient()
    .from("contact_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  const open = rows?.filter((r) => !r.handled).length ?? 0;

  return (
    <>
      <h1 className="font-display text-3xl">Inzendingen</h1>
      <p className="mt-1 text-ink/70">
        {error ? "Laden mislukt." : `${rows?.length ?? 0} totaal, ${open} nog te behandelen.`}
      </p>

      <ul className="mt-8 grid gap-4">
        {rows?.map((r) => (
          <li key={r.id} className={`rounded-xl bg-white p-5 shadow-sm ${r.handled ? "opacity-60" : ""}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-lg font-bold">
                {r.name}
                {r.company ? <span className="font-normal text-ink/70"> · {r.company}</span> : null}
              </p>
              <time className="text-sm text-ink/60" dateTime={r.created_at}>
                {fmt.format(new Date(r.created_at))}
              </time>
            </div>
            <p className="mt-1 text-sm">
              <a className="underline" href={`mailto:${r.email}`}>{r.email}</a>
              {r.phone ? <> · <a className="underline" href={`tel:${r.phone}`}>{r.phone}</a></> : null}
              {r.newsletter ? <span className="ml-2 rounded-full bg-sage-light px-2 py-0.5 text-xs font-bold">nieuwsbrief</span> : null}
            </p>
            <p className="mt-3 whitespace-pre-wrap leading-relaxed">{r.message}</p>
            <div className="mt-4 flex gap-4 text-sm font-bold">
              <form action={toggleHandled.bind(null, r.id, !r.handled)}>
                <button className="text-crust underline">{r.handled ? "Opnieuw openen" : "Markeer als behandeld"}</button>
              </form>
              <form action={deleteRequest.bind(null, r.id)}>
                <button className="text-red-700 underline">Verwijderen</button>
              </form>
            </div>
          </li>
        ))}
        {!rows?.length && !error && <li className="rounded-xl bg-white p-8 text-center text-ink/60">Nog geen inzendingen.</li>}
      </ul>
    </>
  );
}

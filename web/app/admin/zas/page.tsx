import ActionForm, { inputCls } from "@/components/admin/ActionForm";
import UploadForm from "@/components/admin/UploadForm";
import { requireAdmin } from "@/lib/admin-auth";
import { zasProducts } from "@/lib/content";
import { adminClient } from "@/lib/supabase/admin";
import { getStoredHash } from "@/lib/zas-auth";
import { changeZasPassword, deleteDocument } from "../actions";

const size = (b: number | null) => (b == null ? "" : b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

export default async function ZasAdmin() {
  await requireAdmin();
  const [{ data: docs }, hash] = await Promise.all([
    adminClient().from("zas_documents").select("*").order("product").order("title"),
    getStoredHash(),
  ]);

  return (
    <>
      <h1 className="font-display text-3xl">ZAS</h1>
      <p className="mt-1 text-ink/70">
        Beheer de beveiligde pagina <a className="underline" href="/ZAS" target="_blank">/ZAS</a> voor Ziekenhuis aan de Stroom.
      </p>

      <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="font-display text-xl">Wachtwoord</h2>
        <p className="mt-1 text-sm text-ink/70">
          {hash
            ? "Er is een wachtwoord ingesteld. Een nieuw wachtwoord meldt iedereen die al was ingelogd af."
            : "Er is nog geen wachtwoord ingesteld. Zolang dat zo is, kan niemand de pagina openen."}
        </p>
        <div className="mt-4 max-w-md">
          <ActionForm action={changeZasPassword} submit={hash ? "Wachtwoord wijzigen" : "Wachtwoord instellen"}>
            <label className="grid gap-1 text-sm font-bold">
              Nieuw ZAS-wachtwoord (min. 8 tekens)
              <input name="password" type="text" required minLength={8} autoComplete="off" className={inputCls} />
            </label>
          </ActionForm>
        </div>
      </section>

      <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="font-display text-xl">Document toevoegen</h2>
        <div className="mt-4">
          <UploadForm products={zasProducts} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl">Documenten ({docs?.length ?? 0})</h2>
        <ul className="mt-4 grid gap-3">
          {docs?.map((d) => (
            <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm">
              <div>
                <p className="font-bold">{d.title}</p>
                <p className="text-sm text-ink/60">
                  {d.product} · {d.file_name} · {size(d.size_bytes)}
                </p>
              </div>
              <form action={deleteDocument.bind(null, d.id)}>
                <button className="text-sm font-bold text-red-700 underline">Verwijderen</button>
              </form>
            </li>
          ))}
          {!docs?.length && <li className="rounded-xl bg-white p-6 text-center text-ink/60">Nog geen documenten.</li>}
        </ul>
      </section>
    </>
  );
}

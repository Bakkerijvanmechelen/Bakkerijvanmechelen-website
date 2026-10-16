import ActionForm, { inputCls } from "@/components/admin/ActionForm";
import CategoryManager from "@/components/admin/CategoryManager";
import DeleteDocument from "@/components/admin/DeleteDocument";
import UploadWizard from "@/components/admin/UploadWizard";
import { requireAdmin } from "@/lib/admin-auth";
import { adminClient } from "@/lib/supabase/admin";
import { getStoredHash } from "@/lib/zas-auth";
import { getCategories } from "@/lib/zas-data";
import { changeZasPassword } from "../actions";

const size = (b: number | null) => (b == null ? "" : b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

export default async function ZasAdmin() {
  await requireAdmin();
  const [{ data: docs }, hash, categories] = await Promise.all([
    adminClient().from("zas_documents").select("*").order("title"),
    getStoredHash(),
    getCategories(),
  ]);
  const withCount = categories.map((c) => ({ ...c, count: docs?.filter((d) => d.category_id === c.id).length ?? 0 }));

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

      <section className="mt-8">
        <h2 className="font-display text-xl">Categorieën</h2>
        <p className="mt-1 text-sm text-ink/70">
          Zo staan ze op de ZAS-pagina, in alfabetische volgorde. Zet er een nummer voor (01, 02, …) om de volgorde te bepalen.
        </p>
        <div className="mt-4">
          <CategoryManager categories={withCount} />
        </div>
      </section>

      <section className="mt-8 rounded-xl bg-white p-6 shadow-sm">
        <h2 className="font-display text-xl">Documenten toevoegen</h2>
        <div className="mt-4">
          <UploadWizard categories={categories} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl">Documenten ({docs?.length ?? 0})</h2>
        {categories.map((c) => {
          const list = docs?.filter((d) => d.category_id === c.id) ?? [];
          if (!list.length) return null;
          return (
            <div key={c.id} className="mt-5">
              <h3 className="font-bold uppercase tracking-wide text-ink/70">{c.name}</h3>
              <ul className="mt-2 grid gap-2">
                {list.map((d) => (
                  <li key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-4 shadow-sm">
                    <div>
                      <p className="font-bold">{d.title}</p>
                      <p className="text-sm text-ink/60">
                        {d.file_name} · {size(d.size_bytes)}
                      </p>
                    </div>
                    <DeleteDocument id={d.id} title={d.title} />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        {!docs?.length && <p className="mt-4 rounded-xl bg-white p-6 text-center text-ink/60">Nog geen documenten.</p>}
      </section>
    </>
  );
}

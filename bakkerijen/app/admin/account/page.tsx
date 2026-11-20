import ActionForm, { inputCls } from "@/components/admin/ActionForm";
import { Card, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin-auth";
import { changeOwnPassword } from "../actions";

export default async function Account() {
  const user = await requireAdmin();
  return (
    <>
      <PageHeader title="Mijn account" intro="Hier wijzig je het wachtwoord waarmee je inlogt op dit beheer." />
      <Card title="Wachtwoord wijzigen" className="max-w-xl">
        <p className="mb-5 text-ink/70">
          Je bent ingelogd als <strong>{user.email}</strong>.
        </p>
        <ActionForm action={changeOwnPassword} submit="Wachtwoord wijzigen">
          <label className="grid gap-1 font-bold">
            Nieuw wachtwoord <span className="font-normal text-ink/60">(minstens 12 tekens)</span>
            <input name="password" type="password" required minLength={12} autoComplete="new-password" className={inputCls} />
          </label>
          <label className="grid gap-1 font-bold">
            Typ het nog eens
            <input name="repeat" type="password" required minLength={12} autoComplete="new-password" className={inputCls} />
          </label>
        </ActionForm>
      </Card>
    </>
  );
}

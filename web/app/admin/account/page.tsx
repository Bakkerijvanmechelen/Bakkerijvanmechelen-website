import ActionForm, { inputCls } from "@/components/admin/ActionForm";
import { requireAdmin } from "@/lib/admin-auth";
import { changeOwnPassword } from "../actions";

export default async function Account() {
  const user = await requireAdmin();
  return (
    <div className="max-w-md">
      <h1 className="font-display text-3xl">Account</h1>
      <p className="mt-1 text-ink/70">Ingelogd als {user.email}</p>
      <h2 className="mt-8 font-display text-xl">Wachtwoord wijzigen</h2>
      <div className="mt-4">
        <ActionForm action={changeOwnPassword} submit="Wijzigen">
          <label className="grid gap-1 text-sm font-bold">
            Nieuw wachtwoord (min. 12 tekens)
            <input name="password" type="password" required minLength={12} autoComplete="new-password" className={inputCls} />
          </label>
          <label className="grid gap-1 text-sm font-bold">
            Herhaal wachtwoord
            <input name="repeat" type="password" required minLength={12} autoComplete="new-password" className={inputCls} />
          </label>
        </ActionForm>
      </div>
    </div>
  );
}

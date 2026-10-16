import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

/** Geeft de gebruiker terug als die is ingelogd én de rol 'admin' heeft, anders null. */
export async function getAdmin() {
  await connection(); // altijd op aanvraagtijd, nooit vooraf opgebouwd
  const supabase = await supabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.app_metadata?.role !== "admin") return null;
  return user;
}

/** Gebruik in elke admin-pagina en in élke server action. */
export async function requireAdmin() {
  const user = await getAdmin();
  if (!user) redirect("/admin/login");
  return user;
}

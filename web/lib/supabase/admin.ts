import "server-only";
import { createClient } from "@supabase/supabase-js";

/** Service-role client: omzeilt RLS. Alleen op de server gebruiken, nooit naar de browser sturen. */
export function adminClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY ontbreken");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

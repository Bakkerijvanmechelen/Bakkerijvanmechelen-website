import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { adminClient } from "@/lib/supabase/admin";
import { site } from "@/lib/site";
import type { Shop } from "@/lib/shop-types";

/**
 * De winkels van deze bakkerij. Adres, telefoon, openingsuren en kaartpositie komen uit de winkellijst
 * van Bakkerij Gijbels, zodat ze maar op één plek beheerd worden.
 */
export async function getSiteShops(): Promise<(Shop | null)[]> {
  "use cache";
  cacheTag("shops");
  cacheLife("hours");
  const { data, error } = await adminClient().from("gijbels_shops").select("*");
  if (error || !data) throw new Error(`Winkels ophalen mislukt: ${error?.message ?? "geen data"}`);
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  return site.shops.map(
    (s) => (data as Shop[]).find((d) => norm(d.name) === norm(s.match.name) && norm(d.street).startsWith(norm(s.match.street))) ?? null,
  );
}

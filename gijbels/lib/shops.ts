import { cacheLife, cacheTag } from "next/cache";
import { adminClient } from "@/lib/supabase/admin";
import type { Shop } from "@/lib/shop-types";

/** Zichtbare winkels voor de website: Gijbels-winkels eerst. Wordt bewaard en ververst zodra het beheer iets wijzigt. */
export async function getShops(): Promise<Shop[]> {
  "use cache";
  cacheTag("shops");
  cacheLife("hours");
  const { data, error } = await adminClient().from("gijbels_shops").select("*").eq("visible", true).order("position");
  // Een fout mag nooit als "geen winkels" in de cache belanden.
  if (error || !data) throw new Error(`Winkels ophalen mislukt: ${error?.message ?? "geen gegevens"}`);
  const shops = data as Shop[];
  return [...shops.filter((s) => s.kind === "eigen"), ...shops.filter((s) => s.kind === "groep")];
}

export async function getShopCount() {
  return (await getShops()).length;
}

/** Alle winkels, ook de verborgen, voor het beheer. */
export async function getAllShops(): Promise<Shop[]> {
  const { data, error } = await adminClient().from("gijbels_shops").select("*").order("position");
  if (error || !data) throw new Error(`Winkels ophalen mislukt: ${error?.message ?? "geen gegevens"}`);
  return data as Shop[];
}

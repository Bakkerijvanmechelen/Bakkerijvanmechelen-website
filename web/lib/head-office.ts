import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { adminClient } from "@/lib/supabase/admin";

/**
 * Openingsuren van het hoofdkantoor (Kanaaldijk 255), zoals ze in het beheer van Bakkerij Gijbels onder Winkels staan.
 * Zo worden ze maar op één plek bijgehouden. Wijzigingen verschijnen hier binnen het uur.
 */
export async function getHeadOfficeHours(): Promise<string[]> {
  "use cache";
  cacheTag("shops");
  cacheLife("hours");
  const { data } = await adminClient().from("gijbels_shops").select("hours").eq("is_hq", true).limit(1).maybeSingle();
  return ((data?.hours as string | null) ?? "")
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim().replace(/\s+([,:;])/g, "$1").replace(/(\d{1,2}(?:[.:]\d{2})?)\s*u\b/gi, "$1u").replace(/(\d{1,2}(?:[.:]\d{2})?u)\s*[-–—]\s*(\d{1,2}(?:[.:]\d{2})?u)/gi, "$1\u00A0–\u00A0$2"))
    .filter(Boolean);
}

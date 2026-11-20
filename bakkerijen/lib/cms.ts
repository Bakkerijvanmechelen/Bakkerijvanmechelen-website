import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { adminClient } from "@/lib/supabase/admin";
import { defaultsFor } from "@/lib/cms-schema";
import { site } from "@/lib/site";

export const CONTENT_TABLE = "bakery_content";
export const IMAGE_BUCKET = "bakery-site-images";

export type Content = Record<string, string>;

/** Alle teksten en foto's van deze site: wat in het beheer werd aangepast, aangevuld met de originele inhoud. */
export async function getContent(): Promise<Content> {
  "use cache";
  cacheTag("content");
  cacheLife("hours");
  const defaults = defaultsFor(site);
  const { data, error } = await adminClient().from(CONTENT_TABLE).select("key,value").eq("site", site.id);
  if (error || !data) throw new Error(`Teksten ophalen mislukt: ${error?.message ?? "geen data"}`);
  const out: Content = { ...defaults };
  for (const row of data) if (row.key in defaults) out[row.key] = row.value;
  return out;
}

import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { adminClient } from "@/lib/supabase/admin";
import { defaults } from "@/lib/cms-schema";

export const CONTENT_TABLE = "gijbels_content";
export const IMAGE_BUCKET = "gijbels-site-images";

export type Content = Record<string, string>;

/** Alle teksten en foto's: wat in het beheer werd aangepast, aangevuld met de originele inhoud. */
export async function getContent(): Promise<Content> {
  "use cache";
  cacheTag("content");
  cacheLife("hours");
  const { data, error } = await adminClient().from(CONTENT_TABLE).select("key,value");
  if (error || !data) throw new Error(`Teksten ophalen mislukt: ${error?.message ?? "geen data"}`);
  const out: Content = { ...defaults };
  for (const row of data) if (row.key in defaults && row.value) out[row.key] = row.value;
  return out;
}

/** Vervangt {aantal} in een tekst door het actuele aantal winkels. */
export const withCount = (text: string, n: number) => text.replaceAll("{aantal}", String(n));

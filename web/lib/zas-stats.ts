import "server-only";
import { adminClient } from "@/lib/supabase/admin";

export type DownloadStat = { thisMonth: number; thisYear: number };

/**
 * Hoe vaak elke technische fiche geopend of gedownload werd, deze maand en dit jaar (Belgische tijd).
 * Telt bezoekers van de ZAS-pagina, niet het bekijken in het beheer.
 */
export async function getDownloadStats(): Promise<Map<string, DownloadStat>> {
  const { data, error } = await adminClient().rpc("zas_download_stats");
  if (error) console.error("Downloadstatistiek ophalen mislukt", error.code);
  const out = new Map<string, DownloadStat>();
  for (const r of (data ?? []) as { document_id: string; this_month: number; this_year: number }[]) {
    out.set(r.document_id, { thisMonth: Number(r.this_month), thisYear: Number(r.this_year) });
  }
  return out;
}

import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { adminClient } from "@/lib/supabase/admin";
import { defaults } from "@/lib/cms-schema";

export const CONTENT_TABLE = "vm_content";
export const IMAGE_BUCKET = "vm-site-images";

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

/** Bedrijfsgegevens, met een telefoonlink die uit het nummer wordt afgeleid. */
export function companyFrom(c: Content) {
  const digits = c["company.phone"].replace(/[^\d+]/g, "");
  return {
    legalName: c["company.legalName"],
    street: c["company.street"],
    city: c["company.city"],
    phone: c["company.phone"],
    phoneHref: `tel:${digits.startsWith("0") ? `+32${digits.slice(1)}` : digits}`,
    email: c["company.email"],
    vat: c["company.vat"],
    facebook: c["company.facebook"],
    instagram: c["company.instagram"],
  };
}

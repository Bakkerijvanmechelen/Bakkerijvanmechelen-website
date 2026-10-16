import "server-only";
import { adminClient } from "@/lib/supabase/admin";

export type Category = { id: string; name: string };

export async function getCategories(): Promise<Category[]> {
  const { data } = await adminClient().from("zas_categories").select("id,name").order("name");
  return data ?? [];
}

/** Vergelijkt categorienamen los van nummers, hoofdletters en accenten: "01 Brood" == "brood". */
export function normCategory(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/^\s*\d+[\s.\-)]*/, "")
    .trim();
}

/** "Wit-brood_ontkorst-400g.pdf" -> "Wit brood ontkorst 400g" */
export function titleFromFileName(name: string) {
  return name
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

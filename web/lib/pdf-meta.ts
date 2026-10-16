import "server-only";
import { extractText, getDocumentProxy } from "unpdf";

/**
 * Leest uit een productspecificatie-pdf de productnaam en categorie.
 * Zoekt naar "Productspecificatie: <naam> Categorie: <categorie>".
 */
export async function readSpec(bytes: Uint8Array): Promise<{ title: string | null; category: string | null }> {
  const pdf = await getDocumentProxy(bytes);
  const { text } = await extractText(pdf, { mergePages: true });
  const flat = text.replace(/\s+/g, " ");
  return {
    title: flat.match(/Productspecificatie:\s*(.+?)\s+Categorie:/i)?.[1]?.trim() || null,
    category: flat.match(/Categorie:\s*(.+?)\s+(?:INGREDI[ËE]NTEN|Allergenen|Voedingswaarde)/i)?.[1]?.trim() || null,
  };
}

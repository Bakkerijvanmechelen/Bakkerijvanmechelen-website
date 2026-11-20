"use server";

import crypto from "node:crypto";
import { revalidatePath, updateTag } from "next/cache";
import { requireAdmin } from "@/lib/admin-auth";
import { CONTENT_TABLE, IMAGE_BUCKET } from "@/lib/cms";
import { schema } from "@/lib/cms-schema";
import { adminClient } from "@/lib/supabase/admin";

export type ContentState = { ok: boolean; message: string } | null;

const IMAGE_EXT = ["jpg", "jpeg", "png", "webp"];
const MAX_IMAGE = 10 * 1024 * 1024;

/** Slaat één blok teksten/foto's op. Leeg of gelijk aan het origineel = terug naar de originele inhoud. */
export async function saveContentSection(_prev: ContentState, formData: FormData): Promise<ContentState> {
  await requireAdmin();
  const pageId = String(formData.get("page") ?? "");
  const sectionId = String(formData.get("section") ?? "");
  const section = schema.find((p) => p.id === pageId)?.sections.find((s) => s.id === sectionId);
  if (!section) return { ok: false, message: "Onbekend blok. Herlaad de pagina en probeer opnieuw." };

  const supabase = adminClient();
  const upserts: { key: string; value: string; updated_at: string }[] = [];
  const resets: string[] = [];
  for (const f of section.fields) {
    const raw = formData.get(`f:${f.key}`);
    if (typeof raw !== "string") continue;
    const value = raw.replace(/\r\n/g, "\n").trim().slice(0, f.type === "textarea" ? 5000 : 500);
    if (f.type === "image" && value && !value.startsWith("/images/") && !value.includes(`/storage/v1/object/public/${IMAGE_BUCKET}/`)) {
      return { ok: false, message: `${f.label}: ongeldige foto. Kies de foto opnieuw.` };
    }
    if (!value || value === f.default) resets.push(f.key);
    else upserts.push({ key: f.key, value, updated_at: new Date().toISOString() });
  }

  if (upserts.length) {
    const { error } = await supabase.from(CONTENT_TABLE).upsert(upserts);
    if (error) return { ok: false, message: "Opslaan is mislukt. Probeer het opnieuw." };
  }
  if (resets.length) await supabase.from(CONTENT_TABLE).delete().in("key", resets);

  await cleanupImages();
  updateTag("content");
  revalidatePath("/", "layout");
  return { ok: true, message: "Opgeslagen. De website is bijgewerkt." };
}

/** Geeft een eenmalige upload-url voor een nieuwe foto. */
export async function createSiteImageUpload(fileName: string, size: number) {
  await requireAdmin();
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (!IMAGE_EXT.includes(ext)) throw new Error("Kies een foto in jpg, png of webp.");
  if (!(size > 0) || size > MAX_IMAGE) throw new Error("De foto is te groot (max. 10 MB).");
  const path = `${crypto.randomUUID()}/foto.${ext === "jpeg" ? "jpg" : ext}`;
  const supabase = adminClient();
  const { data, error } = await supabase.storage.from(IMAGE_BUCKET).createSignedUploadUrl(path);
  if (error || !data) throw new Error("Upload voorbereiden mislukt.");
  const publicUrl = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path).data.publicUrl;
  return { path, token: data.token, publicUrl };
}

/** Ruimt foto's op die niet (meer) gebruikt worden en ouder zijn dan een dag. */
async function cleanupImages() {
  const supabase = adminClient();
  const [{ data: rows }, { data: folders }] = await Promise.all([
    supabase.from(CONTENT_TABLE).select("value"),
    supabase.storage.from(IMAGE_BUCKET).list("", { limit: 1000 }),
  ]);
  const used = (rows ?? []).map((r) => r.value as string).join("\n");
  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const stale: string[] = [];
  for (const folder of folders ?? []) {
    if (used.includes(`/${IMAGE_BUCKET}/${folder.name}/`)) continue;
    const { data: files } = await supabase.storage.from(IMAGE_BUCKET).list(folder.name);
    for (const f of files ?? []) {
      const created = f.created_at ? Date.parse(f.created_at) : 0;
      if (created && created < dayAgo) stale.push(`${folder.name}/${f.name}`);
    }
  }
  if (stale.length) await supabase.storage.from(IMAGE_BUCKET).remove(stale);
}

"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { readSpec } from "@/lib/pdf-meta";
import { adminClient } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { setZasPassword } from "@/lib/zas-auth";
import { getCategories, normCategory, titleFromFileName } from "@/lib/zas-data";

export type FormState = { ok: boolean; message: string } | null;

const BUCKET = "zas-documents";
const MAX_BYTES = 50 * 1024 * 1024;
const ALLOWED_EXT = ["pdf", "png", "jpg", "jpeg", "webp", "doc", "docx", "xls", "xlsx"];

/* ---------- Inloggen ---------- */

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { ok: false, message: "Vul e-mailadres en wachtwoord in." };

  const supabase = await supabaseServer();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) return { ok: false, message: "Onjuiste inloggegevens." };
  if (data.user.app_metadata?.role !== "admin") {
    await supabase.auth.signOut();
    return { ok: false, message: "Dit account heeft geen toegang tot het beheer." };
  }
  redirect("/admin");
}

export async function signOut() {
  const supabase = await supabaseServer();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function changeOwnPassword(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const password = String(formData.get("password") ?? "");
  const repeat = String(formData.get("repeat") ?? "");
  if (password.length < 12) return { ok: false, message: "Gebruik minstens 12 tekens." };
  if (password !== repeat) return { ok: false, message: "De wachtwoorden komen niet overeen." };
  const supabase = await supabaseServer();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { ok: false, message: "Wijzigen mislukt. Probeer opnieuw." };
  return { ok: true, message: "Wachtwoord gewijzigd." };
}

/* ---------- Inzendingen ---------- */

export async function toggleHandled(id: string, handled: boolean) {
  await requireAdmin();
  await adminClient().from("contact_requests").update({ handled }).eq("id", id);
  revalidatePath("/admin", "layout");
}

export async function markAllHandled() {
  await requireAdmin();
  await adminClient().from("contact_requests").update({ handled: true }).eq("handled", false);
  revalidatePath("/admin", "layout");
}

export async function deleteRequest(id: string) {
  await requireAdmin();
  await adminClient().from("contact_requests").delete().eq("id", id);
  revalidatePath("/admin", "layout");
}

/* ---------- ZAS ---------- */

export async function saveZasPassword(password: string): Promise<FormState> {
  await requireAdmin();
  if (password.trim().length < 8) return { ok: false, message: "Gebruik minstens 8 tekens." };
  await setZasPassword(password.trim());
  revalidatePath("/admin", "layout");
  return { ok: true, message: "Het wachtwoord is opgeslagen." };
}

const cleanName = (name: string) =>
  name
    .normalize("NFKD")
    .replace(/[^\w.\- ]+/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 120) || "bestand";

/** Bestanden die door de browser zijn geüpload hebben altijd de vorm "<uuid>/<naam>". */
const stagedPath = (p: string) => /^[0-9a-f-]{36}\/[^/]+$/i.test(p);

/* ---------- Categorieën ---------- */

function categoryName(raw: FormDataEntryValue | null) {
  return String(raw ?? "").trim().replace(/\s+/g, " ").slice(0, 60);
}

export async function createCategory(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const name = categoryName(formData.get("name"));
  if (!name) return { ok: false, message: "Geef de categorie een naam." };
  const supabase = adminClient();
  const { data: last } = await supabase.from("zas_categories").select("position").order("position", { ascending: false }).limit(1).maybeSingle();
  const { error } = await supabase.from("zas_categories").insert({ name, position: (last?.position ?? 0) + 1 });
  if (error) return { ok: false, message: error.code === "23505" ? "Die categorie bestaat al." : "Toevoegen mislukt." };
  revalidatePath("/admin", "layout");
  revalidatePath("/ZAS");
  return { ok: true, message: `Categorie “${name}” toegevoegd.` };
}

export async function renameCategory(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = categoryName(formData.get("name"));
  if (!name) return { ok: false, message: "Geef de categorie een naam." };
  const { error } = await adminClient().from("zas_categories").update({ name }).eq("id", id);
  if (error) return { ok: false, message: error.code === "23505" ? "Die naam bestaat al." : "Hernoemen mislukt." };
  revalidatePath("/admin", "layout");
  revalidatePath("/ZAS");
  return { ok: true, message: "Opgeslagen." };
}

/** Zet een categorie één plaats hoger of lager op de ZAS-pagina. */
export async function moveCategory(id: string, dir: "up" | "down") {
  await requireAdmin();
  const supabase = adminClient();
  const { data: cats } = await supabase.from("zas_categories").select("id").order("position").order("name");
  if (!cats) return;
  const i = cats.findIndex((c) => c.id === id);
  const j = dir === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= cats.length) return;
  const order = cats.map((c) => c.id);
  [order[i], order[j]] = [order[j], order[i]];
  await Promise.all(order.map((cid, k) => supabase.from("zas_categories").update({ position: k + 1 }).eq("id", cid)));
  revalidatePath("/admin", "layout");
  revalidatePath("/ZAS");
}

/**
 * Verwijdert een categorie met al haar documenten. De naam moet exact worden overgetikt:
 * dat wordt hier op de server gecontroleerd, niet alleen in de browser.
 */
export async function deleteCategory(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const typed = String(formData.get("confirm") ?? "").trim();
  const supabase = adminClient();

  const { data: cat } = await supabase.from("zas_categories").select("name").eq("id", id).maybeSingle();
  if (!cat) return { ok: false, message: "Categorie niet gevonden." };
  if (typed !== cat.name) return { ok: false, message: "De naam komt niet overeen. Er is niets verwijderd." };

  const { data: docs } = await supabase.from("zas_documents").select("id,file_path").eq("category_id", id);
  if (docs?.length) {
    await supabase.storage.from(BUCKET).remove(docs.map((d) => d.file_path));
    await supabase.from("zas_documents").delete().eq("category_id", id);
  }
  const { error } = await supabase.from("zas_categories").delete().eq("id", id);
  if (error) return { ok: false, message: "Verwijderen mislukt." };

  revalidatePath("/admin", "layout");
  revalidatePath("/ZAS");
  return { ok: true, message: `Categorie “${cat.name}” verwijderd.` };
}

/* ---------- Documenten ---------- */

/** Stap 1: de browser krijgt een eenmalige upload-url, zodat grote bestanden niet via de server hoeven. */
export async function createUpload(fileName: string, size: number) {
  await requireAdmin();
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_EXT.includes(ext)) throw new Error(`Bestandstype .${ext} is niet toegestaan.`);
  if (!(size > 0) || size > MAX_BYTES) throw new Error("Bestand is te groot (max. 50 MB).");

  const path = `${crypto.randomUUID()}/${cleanName(fileName)}`;
  const { data, error } = await adminClient().storage.from(BUCKET).createSignedUploadUrl(path);
  if (error || !data) throw new Error("Upload voorbereiden mislukt.");
  return { path, token: data.token };
}

export type Proposal = {
  path: string;
  fileName: string;
  title: string;
  source: "pdf" | "bestandsnaam";
  pdfCategory: string | null;
  categoryId: string | null;
  duplicate: boolean;
};

/** Stap 2: leest uit elke geüploade pdf de productnaam en categorie en doet een voorstel. */
export async function analyzeUploads(items: { path: string; fileName: string }[]): Promise<Proposal[]> {
  await requireAdmin();
  const supabase = adminClient();
  const [cats, { data: existing }] = await Promise.all([
    getCategories(),
    supabase.from("zas_documents").select("title,category_id"),
  ]);

  const out: Proposal[] = [];
  for (const it of items) {
    if (!stagedPath(it.path)) continue;
    let title = titleFromFileName(it.fileName);
    let source: Proposal["source"] = "bestandsnaam";
    let pdfCategory: string | null = null;

    if (/\.pdf$/i.test(it.fileName)) {
      try {
        const { data } = await supabase.storage.from(BUCKET).download(it.path);
        if (data) {
          const meta = await readSpec(new Uint8Array(await data.arrayBuffer()));
          if (meta.title) {
            title = meta.title;
            source = "pdf";
          }
          pdfCategory = meta.category;
        }
      } catch {
        // Onleesbare pdf: we vallen terug op de bestandsnaam.
      }
    }

    const match = pdfCategory ? cats.find((c) => normCategory(c.name) === normCategory(pdfCategory!)) : undefined;
    const duplicate = !!existing?.some(
      (d) => d.category_id === match?.id && d.title.toLowerCase() === title.toLowerCase(),
    );
    out.push({ path: it.path, fileName: it.fileName, title, source, pdfCategory, categoryId: match?.id ?? null, duplicate });
  }
  return out;
}

export type Confirmed = {
  path: string;
  fileName: string;
  title: string;
  /** Een bestaande categorie-id, of "new:<naam>" om er meteen een aan te maken. */
  category: string;
  mimeType: string;
  size: number;
};

/** Stap 3: pas na bevestiging krijgen de documenten hun naam en categorie. */
export async function confirmUploads(rows: Confirmed[]): Promise<{ saved: number; errors: string[] }> {
  await requireAdmin();
  const supabase = adminClient();
  const cats = await getCategories();
  const errors: string[] = [];
  let saved = 0;

  const categoryFor = async (value: string) => {
    if (!value.startsWith("new:")) return cats.find((c) => c.id === value)?.id ?? null;
    const name = categoryName(value.slice(4));
    if (!name) return null;
    const known = cats.find((c) => normCategory(c.name) === normCategory(name));
    if (known) return known.id;
    const { data: last } = await supabase.from("zas_categories").select("position").order("position", { ascending: false }).limit(1).maybeSingle();
    const { data } = await supabase.from("zas_categories").insert({ name, position: (last?.position ?? 0) + 1 }).select("id,name").single();
    if (data) cats.push(data);
    return data?.id ?? null;
  };

  for (const r of rows) {
    const title = r.title.trim().slice(0, 160);
    if (!stagedPath(r.path) || !title) {
      errors.push(`${r.fileName}: titel ontbreekt`);
      continue;
    }
    const categoryId = await categoryFor(r.category);
    if (!categoryId) {
      errors.push(`${r.fileName}: kies een categorie`);
      continue;
    }
    const folder = r.path.split("/")[0];
    const { data: listed } = await supabase.storage.from(BUCKET).list(folder);
    if (!listed?.some((f) => `${folder}/${f.name}` === r.path)) {
      errors.push(`${r.fileName}: bestand niet aangekomen`);
      continue;
    }
    const { error } = await supabase.from("zas_documents").insert({
      title,
      category_id: categoryId,
      file_path: r.path,
      file_name: r.fileName,
      mime_type: r.mimeType || null,
      size_bytes: r.size,
    });
    if (error) errors.push(`${r.fileName}: opslaan mislukt`);
    else saved++;
  }

  revalidatePath("/admin", "layout");
  revalidatePath("/ZAS");
  return { saved, errors };
}

/** Gooit bestanden weg die geüpload zijn maar niet bevestigd werden. */
export async function discardUploads(paths: string[]) {
  await requireAdmin();
  const supabase = adminClient();
  const valid = paths.filter(stagedPath);
  if (!valid.length) return;
  const { data: used } = await supabase.from("zas_documents").select("file_path").in("file_path", valid);
  const usedSet = new Set(used?.map((u) => u.file_path));
  const toRemove = valid.filter((p) => !usedSet.has(p));
  if (toRemove.length) await supabase.storage.from(BUCKET).remove(toRemove);
}

export async function updateDocument(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim().slice(0, 160);
  const categoryId = String(formData.get("category") ?? "");
  if (!title) return { ok: false, message: "De naam mag niet leeg zijn." };
  const { error } = await adminClient().from("zas_documents").update({ title, category_id: categoryId }).eq("id", id);
  if (error) return { ok: false, message: "Opslaan mislukt." };
  revalidatePath("/admin", "layout");
  revalidatePath("/ZAS");
  return { ok: true, message: "Opgeslagen." };
}

export async function deleteDocument(id: string) {
  await requireAdmin();
  const supabase = adminClient();
  const { data } = await supabase.from("zas_documents").select("file_path").eq("id", id).maybeSingle();
  if (data) await supabase.storage.from(BUCKET).remove([data.file_path]);
  await supabase.from("zas_documents").delete().eq("id", id);
  revalidatePath("/admin", "layout");
  revalidatePath("/ZAS");
}

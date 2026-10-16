"use server";

import crypto from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { zasProducts } from "@/lib/content";
import { adminClient } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";
import { setZasPassword } from "@/lib/zas-auth";

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
  revalidatePath("/admin");
}

export async function deleteRequest(id: string) {
  await requireAdmin();
  await adminClient().from("contact_requests").delete().eq("id", id);
  revalidatePath("/admin");
}

/* ---------- ZAS ---------- */

export async function changeZasPassword(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) return { ok: false, message: "Gebruik minstens 8 tekens." };
  await setZasPassword(password);
  revalidatePath("/admin/zas");
  return { ok: true, message: "ZAS-wachtwoord opgeslagen. Bestaande sessies zijn afgemeld." };
}

const cleanName = (name: string) =>
  name
    .normalize("NFKD")
    .replace(/[^\w.\- ]+/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 120) || "bestand";

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

/** Stap 2: na de upload wordt het bestand aan een product gekoppeld. */
export async function registerDocument(input: {
  path: string;
  fileName: string;
  title: string;
  product: string;
  description: string;
  mimeType: string;
  size: number;
}): Promise<FormState> {
  await requireAdmin();
  const title = input.title.trim().slice(0, 160);
  if (!title) return { ok: false, message: "Geef het document een titel." };
  if (!zasProducts.includes(input.product)) return { ok: false, message: "Onbekend product." };

  const supabase = adminClient();
  const folder = input.path.split("/")[0];
  const { data: listed } = await supabase.storage.from(BUCKET).list(folder);
  if (!listed?.some((f) => `${folder}/${f.name}` === input.path)) {
    return { ok: false, message: "Het bestand is niet aangekomen. Probeer opnieuw." };
  }

  const { error } = await supabase.from("zas_documents").insert({
    title,
    product: input.product,
    description: input.description.trim().slice(0, 500) || null,
    file_path: input.path,
    file_name: input.fileName,
    mime_type: input.mimeType || null,
    size_bytes: input.size,
  });
  if (error) return { ok: false, message: "Opslaan mislukt." };
  revalidatePath("/admin/zas");
  revalidatePath("/ZAS");
  return { ok: true, message: "Document toegevoegd." };
}

export async function deleteDocument(id: string) {
  await requireAdmin();
  const supabase = adminClient();
  const { data } = await supabase.from("zas_documents").select("file_path").eq("id", id).maybeSingle();
  if (data) await supabase.storage.from(BUCKET).remove([data.file_path]);
  await supabase.from("zas_documents").delete().eq("id", id);
  revalidatePath("/admin/zas");
  revalidatePath("/ZAS");
}

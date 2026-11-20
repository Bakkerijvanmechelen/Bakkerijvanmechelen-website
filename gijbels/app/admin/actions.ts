"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { adminClient } from "@/lib/supabase/admin";
import { supabaseServer } from "@/lib/supabase/server";

export type FormState = { ok: boolean; message: string } | null;

const TABLE = "gijbels_contact_requests";

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

export async function toggleHandled(id: string, handled: boolean) {
  await requireAdmin();
  await adminClient().from(TABLE).update({ handled }).eq("id", id);
  revalidatePath("/admin", "layout");
}

export async function markAllHandled() {
  await requireAdmin();
  await adminClient().from(TABLE).update({ handled: true }).eq("handled", false);
  revalidatePath("/admin", "layout");
}

export async function deleteRequest(id: string) {
  await requireAdmin();
  await adminClient().from(TABLE).delete().eq("id", id);
  revalidatePath("/admin", "layout");
}

/* ---------- Winkels ---------- */

import crypto from "node:crypto";
import { updateTag } from "next/cache";
import { geocode } from "@/lib/geocode";

export type ShopState = { ok: boolean; message: string; warning?: string } | null;

const SHOPS = "gijbels_shops";
const LOGO_BUCKET = "gijbels-shops";

const text = (v: FormDataEntryValue | null, max: number) => (typeof v === "string" ? v.trim() : "").slice(0, max);
const orNull = (s: string) => (s ? s : null);

function refreshShops() {
  updateTag("shops");
  revalidatePath("/admin", "layout");
  revalidatePath("/winkels");
}

/** Winkel toevoegen of wijzigen. Het adres wordt automatisch op de kaart gezet. */
export async function saveShop(_prev: ShopState, formData: FormData): Promise<ShopState> {
  await requireAdmin();
  const id = text(formData.get("id"), 40);
  const name = text(formData.get("name"), 120);
  const kind = formData.get("kind") === "eigen" ? "eigen" : "groep";
  const street = text(formData.get("street"), 160);
  const postal = text(formData.get("postal_code"), 12);
  const city = text(formData.get("city"), 80);
  if (!name) return { ok: false, message: "Geef de winkel een naam." };
  if (!street || !postal || !city) return { ok: false, message: "Vul straat en nummer, postcode en gemeente in." };

  const row = {
    name,
    kind,
    street,
    postal_code: postal,
    city,
    phone: orNull(text(formData.get("phone"), 40)),
    fax: orNull(text(formData.get("fax"), 40)),
    note: orNull(text(formData.get("note"), 200)),
    website: orNull(text(formData.get("website"), 200)),
    webshop_url: orNull(text(formData.get("webshop_url"), 300)),
    google_url: orNull(text(formData.get("google_url"), 500)),
    hours: orNull(
      text(formData.get("hours"), 1200)
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .join("\n"),
    ),
    logo_url: orNull(text(formData.get("logo_url"), 400)),
  };

  const supabase = adminClient();
  let previous: { street: string; postal_code: string; city: string; lat: number | null } | null = null;
  if (id) {
    const { data } = await supabase.from(SHOPS).select("street,postal_code,city,lat").eq("id", id).maybeSingle();
    previous = data;
  }

  // Alleen opnieuw zoeken op de kaart als het adres is veranderd of nog niet gevonden werd.
  const addressChanged = !previous || previous.street !== street || previous.postal_code !== postal || previous.city !== city || previous.lat == null;
  let coords: { lat: number; lng: number } | null = null;
  if (addressChanged) coords = await geocode(street, postal, city);

  if (id) {
    const { error } = await supabase
      .from(SHOPS)
      .update({ ...row, ...(addressChanged ? { lat: coords?.lat ?? null, lng: coords?.lng ?? null } : {}) })
      .eq("id", id);
    if (error) return { ok: false, message: "Opslaan mislukt. Probeer het opnieuw." };
  } else {
    const { data: last } = await supabase.from(SHOPS).select("position").eq("kind", kind).order("position", { ascending: false }).limit(1).maybeSingle();
    const { error } = await supabase.from(SHOPS).insert({ ...row, lat: coords?.lat ?? null, lng: coords?.lng ?? null, position: (last?.position ?? 0) + 1 });
    if (error) return { ok: false, message: "Opslaan mislukt. Probeer het opnieuw." };
  }

  refreshShops();
  const onMap = addressChanged ? !!coords : true;
  return {
    ok: true,
    message: id ? "De wijzigingen zijn opgeslagen." : `“${name}” is toegevoegd en staat nu op de website.`,
    warning: onMap ? undefined : "We vonden dit adres niet op de kaart. De winkel staat wel in de lijst, maar nog niet op de kaart. Controleer straat, nummer en postcode.",
  };
}

export async function toggleShopVisible(id: string, visible: boolean) {
  await requireAdmin();
  await adminClient().from(SHOPS).update({ visible }).eq("id", id);
  refreshShops();
}

/** Zet een winkel één plaats hoger of lager binnen zijn eigen lijst. */
export async function moveShop(id: string, dir: "up" | "down") {
  await requireAdmin();
  const supabase = adminClient();
  const { data: me } = await supabase.from(SHOPS).select("kind").eq("id", id).maybeSingle();
  if (!me) return;
  const { data: list } = await supabase.from(SHOPS).select("id").eq("kind", me.kind).order("position");
  if (!list) return;
  const i = list.findIndex((s) => s.id === id);
  const j = dir === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= list.length) return;
  const order = list.map((s) => s.id);
  [order[i], order[j]] = [order[j], order[i]];
  await Promise.all(order.map((sid, k) => supabase.from(SHOPS).update({ position: k + 1 }).eq("id", sid)));
  refreshShops();
}

export async function deleteShop(id: string) {
  await requireAdmin();
  const supabase = adminClient();
  const { data } = await supabase.from(SHOPS).select("logo_url").eq("id", id).maybeSingle();
  const marker = `/${LOGO_BUCKET}/`;
  if (data?.logo_url?.includes(marker)) {
    await supabase.storage.from(LOGO_BUCKET).remove([decodeURIComponent(data.logo_url.split(marker)[1])]);
  }
  await supabase.from(SHOPS).delete().eq("id", id);
  refreshShops();
}

/** Een logo uploaden gaat rechtstreeks van de browser naar de opslag. */
export async function createLogoUpload(fileName: string, size: number) {
  await requireAdmin();
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (!["png", "jpg", "jpeg", "webp"].includes(ext)) throw new Error("Gebruik een png-, jpg- of webp-afbeelding.");
  if (!(size > 0) || size > 5 * 1024 * 1024) throw new Error("De afbeelding is te groot (max. 5 MB).");
  const path = `${crypto.randomUUID()}.${ext}`;
  const supabase = adminClient();
  const { data, error } = await supabase.storage.from(LOGO_BUCKET).createSignedUploadUrl(path);
  if (error || !data) throw new Error("Upload voorbereiden mislukt.");
  return { path, token: data.token, publicUrl: supabase.storage.from(LOGO_BUCKET).getPublicUrl(path).data.publicUrl };
}

import "server-only";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { adminClient } from "@/lib/supabase/admin";

const COOKIE = "zas_session";
const SETTING = "zas_password_hash";
const SESSION_MS = 1000 * 60 * 60 * 24 * 7; // 7 dagen

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

function verifyPassword(password: string, stored: string) {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = crypto.scryptSync(password, Buffer.from(saltHex, "hex"), expected.length);
  return crypto.timingSafeEqual(actual, expected);
}

export async function getStoredHash() {
  const { data } = await adminClient().from("site_settings").select("value").eq("key", SETTING).maybeSingle();
  return data?.value ?? null;
}

export async function setZasPassword(password: string) {
  const { error } = await adminClient()
    .from("site_settings")
    .upsert({ key: SETTING, value: hashPassword(password), updated_at: new Date().toISOString() });
  if (error) throw new Error("Wachtwoord opslaan mislukt");
}

function sign(payload: string, hash: string) {
  const secret = process.env.ZAS_COOKIE_SECRET;
  if (!secret) throw new Error("ZAS_COOKIE_SECRET ontbreekt");
  return crypto.createHmac("sha256", secret).update(`${payload}:${hash}`).digest("hex");
}

/** Controleert het wachtwoord en zet bij succes een ondertekende cookie. */
export async function unlockZas(password: string) {
  const stored = await getStoredHash();
  // Vertraging tegen het uitproberen van wachtwoorden.
  await new Promise((r) => setTimeout(r, 800));
  if (!stored || !verifyPassword(password, stored)) return false;
  const exp = String(Date.now() + SESSION_MS);
  const store = await cookies();
  store.set(COOKIE, `${exp}.${sign(exp, stored)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MS / 1000,
  });
  return true;
}

export async function lockZas() {
  (await cookies()).delete(COOKIE);
}

/** Als het wachtwoord wijzigt, vervallen alle bestaande sessies automatisch (de hash zit in de handtekening). */
export async function isZasUnlocked() {
  await connection();
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  const stored = await getStoredHash();
  if (!stored) return false;
  const expected = Buffer.from(sign(exp, stored), "hex");
  const actual = Buffer.from(sig, "hex");
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

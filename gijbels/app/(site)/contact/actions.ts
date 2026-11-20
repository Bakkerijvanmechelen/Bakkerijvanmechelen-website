"use server";

import { verifyRecaptcha } from "@/lib/recaptcha";
import { adminClient } from "@/lib/supabase/admin";

export type ContactState = { ok: boolean; message: string } | null;

const clean = (v: FormDataEntryValue | null, max: number) => (typeof v === "string" ? v.trim() : "").slice(0, max);

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {
  if (clean(formData.get("website"), 50)) return { ok: true, message: "Bedankt!" }; // honeypot

  const first = clean(formData.get("first"), 80);
  const last = clean(formData.get("last"), 80);
  const email = clean(formData.get("email"), 200);
  const message = clean(formData.get("message"), 3000);
  const privacy = formData.get("privacy") === "on";

  if (!first || !last || !message || !/^\S+@\S+\.\S+$/.test(email)) {
    return { ok: false, message: "Vul alle velden in en geef een geldig e-mailadres op." };
  }

  if (!privacy) return { ok: false, message: "Bevestig de privacyverklaring om te verzenden." };
  if (!(await verifyRecaptcha(clean(formData.get("recaptcha"), 4000), "contact"))) {
    return { ok: false, message: "De spamcontrole is mislukt. Wacht even en probeer opnieuw." };
  }

  const { error } = await adminClient()
    .from("gijbels_contact_requests")
    .insert({ first_name: first, last_name: last, email, message });
  if (error) {
    console.error("Contact opslaan mislukt", error.code);
    return { ok: false, message: "Verzenden is mislukt. Probeer het later opnieuw." };
  }
  return { ok: true, message: "Bedankt voor uw bericht! We nemen zo snel mogelijk contact met u op." };
}

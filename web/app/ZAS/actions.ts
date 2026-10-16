"use server";

import { redirect } from "next/navigation";
import { zasReportTopics } from "@/lib/content";
import { adminClient } from "@/lib/supabase/admin";
import { isZasUnlocked, lockZas, unlockZas } from "@/lib/zas-auth";

export type ZasState = { message: string } | null;

export async function unlock(_prev: ZasState, formData: FormData): Promise<ZasState> {
  const password = String(formData.get("password") ?? "");
  if (!password) return { message: "Geef het wachtwoord in." };
  if (!(await unlockZas(password))) return { message: "Onjuist wachtwoord." };
  redirect("/ZAS");
}

export async function lock() {
  await lockZas();
  redirect("/ZAS");
}

export type ReportState = { ok: boolean; message: string } | null;


const clean = (v: FormDataEntryValue | null, max: number) => (typeof v === "string" ? v.trim() : "").slice(0, max);

/** Een probleem melden. Alleen mogelijk voor wie op de ZAS-pagina is ingelogd. */
export async function reportProblem(_prev: ReportState, formData: FormData): Promise<ReportState> {
  if (!(await isZasUnlocked())) return { ok: false, message: "Uw sessie is verlopen. Meld u opnieuw aan en probeer opnieuw." };
  if (clean(formData.get("website"), 50)) return { ok: true, message: "Bedankt!" }; // honeypot

  const topic = clean(formData.get("topic"), 80);
  const article = clean(formData.get("article"), 160);
  const name = clean(formData.get("name"), 120);
  const email = clean(formData.get("email"), 200);
  const message = clean(formData.get("message"), 3000);

  if (!zasReportTopics.includes(topic)) return { ok: false, message: "Kies waar uw melding over gaat." };
  if (!name) return { ok: false, message: "Vul uw naam in, zodat we u kunnen helpen." };
  if (!/^\S+@\S+\.\S+$/.test(email)) return { ok: false, message: "Vul een geldig e-mailadres in, zodat we u kunnen antwoorden." };
  if (message.length < 5) return { ok: false, message: "Beschrijf kort wat er mis is." };

  const { error } = await adminClient()
    .from("contact_requests")
    .insert({
      name,
      company: "ZAS (Ziekenhuis aan de Stroom)",
      email,
      message: article ? `Betreft: ${article}\n\n${message}` : message,
      source: "zas",
      topic,
    });
  if (error) return { ok: false, message: "Versturen is mislukt. Probeer het later opnieuw." };
  return { ok: true, message: "Bedankt voor uw melding. We bekijken ze zo snel mogelijk en nemen contact met u op." };
}

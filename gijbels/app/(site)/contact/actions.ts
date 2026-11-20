"use server";

import { mailHtml, mailText, sendMail } from "@/lib/mail";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { checkSpam } from "@/lib/spam";
import { SITE_URL } from "@/lib/site-url";
import { adminClient } from "@/lib/supabase/admin";

export type ContactState = { ok: boolean; message: string } | null;

const clean = (v: FormDataEntryValue | null, max: number) => (typeof v === "string" ? v.trim() : "").slice(0, max);

export async function sendContact(_prev: ContactState, formData: FormData): Promise<ContactState> {

  const first = clean(formData.get("first"), 80);
  const last = clean(formData.get("last"), 80);
  const email = clean(formData.get("email"), 200);
  const message = clean(formData.get("message"), 3000);
  const privacy = formData.get("privacy") === "on";

  if (!first || !last || !message || !/^\S+@\S+\.\S+$/.test(email)) {
    return { ok: false, message: "Vul alle velden in en geef een geldig e-mailadres op." };
  }

  if (!privacy) return { ok: false, message: "Bevestig de privacyverklaring om te verzenden." };
  // Bots krijgen een gewone bedankmelding, zodat ze niet merken dat ze tegengehouden worden.
  const spam = checkSpam(formData, first, last, message);
  if (spam === "bot") return { ok: true, message: "Bedankt voor uw bericht! We nemen zo snel mogelijk contact met u op." };
  if (spam === "links") return { ok: false, message: "Laat links en webadressen weg uit uw bericht, dan kunnen we het verzenden." };
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
  await mailContact({ name: `${first} ${last}`, email, message });
  return { ok: true, message: "Bedankt voor uw bericht! We nemen zo snel mogelijk contact met u op." };
}

/** Melding naar de bakkerij en bevestiging naar de klant. Een mislukte mail houdt het bericht niet tegen: het staat al in het beheer. */
async function mailContact(m: { name: string; email: string; message: string }) {
  const brand = "#263f8f";
  const site = "Bakkerij Gijbels";
  // Alle meldingen gaan naar de centrale mailbox; de klant antwoordt ook naar daar.
  const bakery = process.env.MAIL_TO || "info@bakkerijgijbels.be";
  const rows: [string, string][] = [
    ["Naam", m.name],
    ["E-mail", m.email],
  ];
  const notify = { title: "Nieuw bericht via de website", intro: "Er kwam een nieuwe vraag binnen via het contactformulier. Antwoord gewoon op deze mail om de klant te mailen.", rows, message: m.message, button: { label: "Bekijk in het beheer", href: `${SITE_URL}/admin` } };
  const confirm = { title: "Bedankt voor uw bericht", intro: `Beste ${m.name}, we hebben uw bericht goed ontvangen en nemen zo snel mogelijk contact met u op. Hieronder vindt u een kopie.`, rows: [] as [string, string][], message: m.message };
  await Promise.all([
    sendMail({ to: bakery, replyTo: m.email, subject: `Nieuw bericht van ${m.name} via de website`, html: mailHtml({ brand, site, ...notify }), text: mailText(notify) }),
    sendMail({ to: m.email, replyTo: bakery, subject: `Bedankt voor uw bericht aan ${site}`, html: mailHtml({ brand, site, ...confirm }), text: mailText(confirm) }),
  ]);
}

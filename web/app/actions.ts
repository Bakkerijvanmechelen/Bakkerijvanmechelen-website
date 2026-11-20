"use server";

import { mailHtml, mailText, sendMail } from "@/lib/mail";
import { verifyRecaptcha } from "@/lib/recaptcha";
import { checkSpam } from "@/lib/spam";
import { SITE_URL } from "@/lib/site-url";

export type ContactState = { ok: boolean; message: string } | null;

const clean = (v: FormDataEntryValue | null, max: number) =>
  (typeof v === "string" ? v.trim() : "").slice(0, max);

export async function sendContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {

  const name = clean(formData.get("name"), 120);
  const company = clean(formData.get("company"), 120);
  const email = clean(formData.get("email"), 200);
  const phone = clean(formData.get("phone"), 40);
  const message = clean(formData.get("message"), 3000);
  const privacy = formData.get("privacy") === "on";

  if (!name || !message || !/^\S+@\S+\.\S+$/.test(email)) {
    return { ok: false, message: "Vul naam, een geldig e-mailadres en uw vraag in." };
  }
  if (!privacy) {
    return { ok: false, message: "Bevestig de privacyverklaring om te verzenden." };
  }
  // Bots krijgen een gewone bedankmelding, zodat ze niet merken dat ze tegengehouden worden.
  const spam = checkSpam(formData, name, company, message);
  if (spam === "bot") return { ok: true, message: "Bedankt! We nemen snel contact met u op." };
  if (spam === "links") return { ok: false, message: "Laat links en webadressen weg uit uw bericht, dan kunnen we het verzenden." };
  if (!(await verifyRecaptcha(clean(formData.get("recaptcha"), 4000), "contact"))) {
    return { ok: false, message: "De spamcontrole is mislukt. Wacht even en probeer opnieuw, of mail ons." };
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY ontbreken");
    return { ok: false, message: "Het formulier is tijdelijk niet beschikbaar. Mail ons gerust." };
  }

  const res = await fetch(`${url}/rest/v1/contact_requests`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ name, company, email, phone, message }),
  });

  if (!res.ok) {
    console.error("Supabase insert mislukt", res.status);
    return { ok: false, message: "Verzenden is mislukt. Probeer later opnieuw of mail ons." };
  }
  await mailContact({ name, company, email, phone, message });
  return { ok: true, message: "Bedankt! We nemen snel contact met u op." };
}

/** Melding naar de bakkerij en bevestiging naar de klant. Een mislukte mail houdt het bericht niet tegen: het staat al in het beheer. */
async function mailContact(m: { name: string; company: string; email: string; phone: string; message: string }) {
  const brand = "#1b1511";
  const site = "Bakkerij Van Mechelen";
  // Alle meldingen gaan naar de centrale mailbox; de klant antwoordt ook naar daar.
  const bakery = process.env.MAIL_TO || "info@bakkerijgijbels.be";
  const to = bakery;
  const rows: [string, string][] = [
    ["Naam", m.name],
    ["Bedrijf", m.company],
    ["E-mail", m.email],
    ["Telefoon", m.phone],
  ];
  const notify = { title: "Nieuw bericht via de website", intro: "Er kwam een nieuwe vraag binnen via het contactformulier. Antwoord gewoon op deze mail om de klant te mailen.", rows, message: m.message, button: { label: "Bekijk in het beheer", href: `${SITE_URL}/admin/berichten` } };
  const confirm = { title: "Bedankt voor uw bericht", intro: `Beste ${m.name}, we hebben uw vraag goed ontvangen en nemen snel contact met u op. Hieronder vindt u een kopie van uw bericht.`, rows: [] as [string, string][], message: m.message };
  await Promise.all([
    sendMail({ to, replyTo: m.email, subject: `Nieuw bericht van ${m.name} via de website`, html: mailHtml({ brand, site, ...notify }), text: mailText(notify) }),
    sendMail({ to: m.email, replyTo: bakery, subject: `Bedankt voor uw bericht aan ${site}`, html: mailHtml({ brand, site, ...confirm }), text: mailText(confirm) }),
  ]);
}

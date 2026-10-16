"use server";

export type ContactState = { ok: boolean; message: string } | null;

const clean = (v: FormDataEntryValue | null, max: number) =>
  (typeof v === "string" ? v.trim() : "").slice(0, max);

export async function sendContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  // Honeypot: bots vullen dit verborgen veld in.
  if (clean(formData.get("website"), 100)) return { ok: true, message: "Bedankt!" };

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
  return { ok: true, message: "Bedankt! We nemen snel contact met u op." };
}

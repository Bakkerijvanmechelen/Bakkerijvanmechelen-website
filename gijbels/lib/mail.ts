import "server-only";

/**
 * E-mail versturen via Resend (https://resend.com), zonder extra pakket.
 * Zolang RESEND_API_KEY en MAIL_FROM niet ingesteld zijn, wordt er niets verstuurd en werkt alles verder zoals voorheen.
 */
export type Mail = { to: string | string[]; subject: string; html: string; text: string; replyTo?: string };

export const mailEnabled = () => !!process.env.RESEND_API_KEY && !!process.env.MAIL_FROM;

export async function sendMail(m: Mail): Promise<boolean> {
  if (!mailEnabled()) {
    console.warn("E-mail staat uit: RESEND_API_KEY of MAIL_FROM ontbreekt");
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.MAIL_FROM, to: m.to, subject: m.subject, html: m.html, text: m.text, reply_to: m.replyTo }),
      cache: "no-store",
    });
    if (!res.ok) console.error("E-mail versturen mislukt", res.status, (await res.text().catch(() => "")).slice(0, 300));
    return res.ok;
  } catch (e) {
    console.error("E-mail versturen mislukt", e);
    return false;
  }
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Eenvoudige, overal goed leesbare e-mail in de huisstijl. */
export function mailHtml({ brand, site, title, intro, rows, message, button }: { brand: string; site: string; title: string; intro: string; rows: [string, string][]; message: string; button?: { label: string; href: string } }) {
  const tr = rows
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:6px 12px 6px 0;color:#6b6157;white-space:nowrap;vertical-align:top">${esc(k)}</td><td style="padding:6px 0;color:#1d1a17">${esc(v)}</td></tr>`)
    .join("");
  return `<!doctype html><html lang="nl"><body style="margin:0;background:#f6f1e8;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f1e8;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden">
<tr><td style="background:${brand};color:#ffffff;padding:18px 24px;font-size:18px;font-weight:bold">${esc(site)}</td></tr>
<tr><td style="padding:24px">
<h1 style="margin:0 0 8px;font-size:20px;color:#1d1a17">${esc(title)}</h1>
<p style="margin:0 0 16px;color:#3d352d;line-height:1.5">${esc(intro)}</p>
<table role="presentation" cellpadding="0" cellspacing="0" style="font-size:14px;line-height:1.4">${tr}</table>
<div style="margin:16px 0 0;padding:14px 16px;background:#f6f1e8;border-radius:8px;color:#1d1a17;line-height:1.5;white-space:pre-wrap">${esc(message)}</div>
${button ? `<p style="margin:20px 0 0"><a href="${esc(button.href)}" style="display:inline-block;background:${brand};color:#ffffff;text-decoration:none;font-weight:bold;padding:10px 18px;border-radius:999px">${esc(button.label)}</a></p>` : ""}
</td></tr></table></td></tr></table></body></html>`;
}

export function mailText({ title, intro, rows, message, button }: { title: string; intro: string; rows: [string, string][]; message: string; button?: { label: string; href: string } }) {
  return [title, "", intro, "", ...rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`), "", message, ...(button ? ["", `${button.label}: ${button.href}`] : [])].join("\n");
}

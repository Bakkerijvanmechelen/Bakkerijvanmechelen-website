import "server-only";

/** Minimale tijd (ms) tussen het openen van het formulier en verzenden. Bots vullen alles in één keer in. */
const MIN_FILL_MS = 4000;

/** Links en webadressen in het bericht: typisch voor reclame- en spamberichten. E-mailadressen tellen niet mee. */
const LINK = /(https?:\/\/|www\.)|\b[a-z0-9-]+\.(com|net|org|io|co|biz|info|xyz|online|site|top|shop|store|app|ru|cn|click|link|pro)\b/i;

export type SpamVerdict = "ok" | "bot" | "links";

export function checkSpam(formData: FormData, ...texts: string[]): SpamVerdict {
  // Honeypot: verborgen veld dat alleen bots invullen.
  if (String(formData.get("website") ?? "").trim()) return "bot";
  // Tijdsval: het formulier moet minstens enkele seconden open gestaan hebben.
  const started = Number(formData.get("t"));
  if (!started || Date.now() - started < MIN_FILL_MS || Date.now() - started > 1000 * 60 * 60 * 12) return "bot";
  const text = texts.join(" ").replace(/\S+@\S+/g, " ");
  if (LINK.test(text)) return "links";
  return "ok";
}

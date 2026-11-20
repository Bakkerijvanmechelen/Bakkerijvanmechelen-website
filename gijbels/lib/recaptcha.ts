import "server-only";

/**
 * Controleert een reCAPTCHA v3-token bij Google. Zolang RECAPTCHA_SECRET_KEY niet ingesteld is,
 * staat de controle uit en werkt het formulier zoals voorheen.
 */
/** Strenge drempel: 1.0 is zeker een mens, 0.0 zeker een bot. Google raadt 0.5 aan; wij eisen meer. */
const MIN_SCORE = 0.7;

export async function verifyRecaptcha(token: string, action: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    console.warn("reCAPTCHA staat uit: RECAPTCHA_SECRET_KEY ontbreekt");
    return true;
  }
  if (!token) return false;
  try {
    const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      body: new URLSearchParams({ secret, response: token }),
      cache: "no-store",
    });
    const data = (await res.json()) as { success?: boolean; score?: number; action?: string };
    return !!data.success && data.action === action && (data.score ?? 0) >= MIN_SCORE;
  } catch {
    return false;
  }
}

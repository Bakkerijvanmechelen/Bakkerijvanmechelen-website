import "server-only";

/**
 * Controleert een reCAPTCHA v3-token bij Google. Zolang RECAPTCHA_SECRET_KEY niet ingesteld is,
 * staat de controle uit en werkt het formulier zoals voorheen.
 */
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
    return !!data.success && data.action === action && (data.score ?? 0) >= 0.5;
  } catch {
    return false;
  }
}

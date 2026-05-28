// Verificación server-side de reCAPTCHA v3 (score-based, invisible).
export async function verifyCaptcha(token: string | null): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return true; // sin configurar (dev) → no bloquea
  if (!token) return false;

  let data: { success?: boolean; score?: number; action?: string } = {};
  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
    });
    data = await res.json();
  } catch {
    return false;
  }

  // v3 devuelve un score 0.0–1.0; 0.5 es el umbral recomendado por Google.
  return data.success === true && (data.score ?? 0) >= 0.5;
}

// Moderación de imágenes con Sightengine (nudez + gore) antes de publicarlas.
type Verdict = { ok: boolean; reason?: string };

const NUDITY_THRESHOLD = 0.5;
const GORE_THRESHOLD = 0.5;

export async function moderateImage(file: File): Promise<Verdict> {
  const apiUser = process.env.SIGHTENGINE_API_USER;
  const apiSecret = process.env.SIGHTENGINE_API_SECRET;
  // Sin credenciales (dev / no configurado): no bloquea.
  if (!apiUser || !apiSecret) return { ok: true };

  const form = new FormData();
  form.append('media', file);
  form.append('models', 'nudity-2.1,gore-2.0');
  form.append('api_user', apiUser);
  form.append('api_secret', apiSecret);

  let data: {
    status?: string;
    nudity?: { sexual_activity?: number; sexual_display?: number; erotica?: number };
    gore?: { prob?: number };
  };
  try {
    const res = await fetch('https://api.sightengine.com/1.0/check.json', { method: 'POST', body: form });
    data = await res.json();
  } catch {
    // Fail-closed: si no podemos verificar, no publicamos la imagen.
    return { ok: false, reason: 'no se pudo verificar la imagen' };
  }
  if (data?.status !== 'success') return { ok: false, reason: 'no se pudo verificar la imagen' };

  const n = data.nudity ?? {};
  const sexual = Math.max(n.sexual_activity ?? 0, n.sexual_display ?? 0, n.erotica ?? 0);
  const gore = data.gore?.prob ?? 0;

  if (sexual >= NUDITY_THRESHOLD) return { ok: false, reason: 'contenido sexual explícito' };
  if (gore >= GORE_THRESHOLD) return { ok: false, reason: 'contenido gore o violento' };
  return { ok: true };
}

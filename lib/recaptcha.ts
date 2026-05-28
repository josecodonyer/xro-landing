'use client';

// Cliente reCAPTCHA v3. El script se carga con <RecaptchaScript /> en el form.
export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

interface Grecaptcha {
  ready: (cb: () => void) => void;
  execute: (siteKey: string, opts: { action: string }) => Promise<string>;
}

export async function executeRecaptcha(action: string): Promise<string> {
  const key = RECAPTCHA_SITE_KEY;
  const grecaptcha = (window as unknown as { grecaptcha?: Grecaptcha }).grecaptcha;
  if (!key || !grecaptcha?.execute) return '';
  await new Promise<void>((resolve) => grecaptcha.ready(resolve));
  try {
    return await grecaptcha.execute(key, { action });
  } catch {
    return '';
  }
}

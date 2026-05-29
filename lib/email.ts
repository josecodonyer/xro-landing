import { Resend } from 'resend';

let _resend: Resend | null = null;
function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set');
  _resend ??= new Resend(key);
  return _resend;
}

const FROM = 'xRO Server <noreply@xro-server.es>';
const REPLY_TO = 'jose.codoner@onestic.com';

type Template = {
  subject: string;
  heading: string;
  intro: string;
  footer: string;
};

function render(t: Template, code: string) {
  const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${t.heading}</title>
</head>
<body style="margin:0;padding:24px;background:#f5f4f1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#1e1e22">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden">
    <tr><td style="padding:32px">
      <h1 style="margin:0 0 8px;font-size:20px;font-weight:600">${t.heading}</h1>
      <p style="margin:0 0 24px;color:#666;font-size:15px;line-height:1.5">${t.intro}</p>
      <div style="font-size:36px;font-weight:700;letter-spacing:10px;text-align:center;padding:20px;background:#f5f4f1;border-radius:8px;color:#1e1e22">${code}</div>
      <p style="margin:24px 0 0;color:#999;font-size:13px;line-height:1.5">${t.footer}</p>
    </td></tr>
    <tr><td style="padding:16px 32px;background:#fafafa;color:#999;font-size:12px;text-align:center">
      xRO Server · Ragnarok Online · <a href="https://www.xro-server.es" style="color:#999">xro-server.es</a>
    </td></tr>
  </table>
</body>
</html>`;

  const text = `${t.heading}

${t.intro}

  ${code}

${t.footer}

—
xRO Server · Ragnarok Online
https://www.xro-server.es`;

  return { html, text };
}

async function send(to: string, t: Template, code: string) {
  const { html, text } = render(t, code);
  const { error } = await getResend().emails.send({
    from: FROM,
    replyTo: REPLY_TO,
    to,
    subject: t.subject,
    html,
    text,
  });
  if (error) {
    console.error('Resend error', { to, subject: t.subject, error });
    throw new Error(error.message ?? 'resend_failed');
  }
}

export async function sendVerificationCode(to: string, code: string) {
  await send(to, {
    subject: `[xRO] Tu código de verificación: ${code}`,
    heading: 'Verifica tu cuenta en xRO',
    intro: 'Introduce este código en la web para activar tu cuenta:',
    footer: 'Caduca en 15 minutos. Si no solicitaste esto, ignora este email.',
  }, code);
}

export async function sendPasswordResetCode(to: string, code: string) {
  await send(to, {
    subject: `[xRO] Código para cambiar contraseña: ${code}`,
    heading: 'Cambio de contraseña — xRO',
    intro: 'Tu código para cambiar la contraseña:',
    footer: 'Caduca en 15 minutos. Si no lo pediste tú, ignora este email.',
  }, code);
}

export async function sendPasswordRecoveryCode(to: string, code: string) {
  await send(to, {
    subject: `[xRO] Código para recuperar tu contraseña: ${code}`,
    heading: 'Recuperar contraseña — xRO',
    intro: 'Has solicitado restablecer tu contraseña. Introduce este código en la web para elegir una nueva:',
    footer: 'Caduca en 15 minutos. Si no fuiste tú, ignora este email: tu contraseña no cambiará.',
  }, code);
}

export async function sendEmailChangeCode(to: string, code: string) {
  await send(to, {
    subject: `[xRO] Código para cambiar email: ${code}`,
    heading: 'Cambio de email — xRO',
    intro: 'Tu código para confirmar el cambio de email:',
    footer: 'Caduca en 15 minutos.',
  }, code);
}

export function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

import { Resend } from 'resend';

let _resend: Resend | null = null;
function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set');
  _resend ??= new Resend(key);
  return _resend;
}
const FROM = 'xRO <noreply@xro-server.es>';

async function send(to: string, subject: string, html: string) {
  const { error } = await getResend().emails.send({ from: FROM, to, subject, html });
  if (error) {
    console.error('Resend error', { to, subject, error });
    throw new Error(error.message ?? 'resend_failed');
  }
}

function codeBlock(intro: string, code: string, footer: string) {
  return `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
      <p style="color:#666;margin:0 0 24px">${intro}</p>
      <div style="font-size:40px;font-weight:700;letter-spacing:12px;text-align:center;padding:24px;background:#f5f4f1;border-radius:8px">${code}</div>
      <p style="color:#999;font-size:13px;margin-top:24px">${footer}</p>
    </div>
  `;
}

export async function sendVerificationCode(to: string, code: string) {
  await send(
    to,
    `[xRO] Tu código de verificación: ${code}`,
    `<h2 style="font-family:sans-serif;max-width:480px;margin:32px auto 0;padding:0 32px">Verifica tu cuenta en xRO</h2>` +
    codeBlock(
      'Introduce este código en la web para activar tu cuenta:',
      code,
      'Caduca en 15 minutos. Si no solicitaste esto, ignora este email.'
    )
  );
}

export async function sendPasswordResetCode(to: string, code: string) {
  await send(
    to,
    `[xRO] Código para cambiar contraseña: ${code}`,
    `<h2 style="font-family:sans-serif;max-width:480px;margin:32px auto 0;padding:0 32px">Cambio de contraseña — xRO</h2>` +
    codeBlock(
      'Tu código para cambiar la contraseña:',
      code,
      'Caduca en 15 minutos. Si no lo pediste tú, ignora este email.'
    )
  );
}

export async function sendEmailChangeCode(to: string, code: string) {
  await send(
    to,
    `[xRO] Código para cambiar email: ${code}`,
    `<h2 style="font-family:sans-serif;max-width:480px;margin:32px auto 0;padding:0 32px">Cambio de email — xRO</h2>` +
    codeBlock(
      'Tu código para confirmar el cambio de email:',
      code,
      'Caduca en 15 minutos.'
    )
  );
}

export function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

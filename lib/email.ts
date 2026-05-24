import { Resend } from 'resend';

let _resend: Resend | null = null;
function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY is not set');
  _resend ??= new Resend(key);
  return _resend;
}
const FROM = 'xRO <noreply@xro-server.es>';

export async function sendVerificationCode(to: string, code: string) {
  await getResend().emails.send({
    from:    FROM,
    to,
    subject: `[xRO] Tu código de verificación: ${code}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
        <h2 style="margin:0 0 8px">Verifica tu cuenta en xRO</h2>
        <p style="color:#666;margin:0 0 24px">Introduce este código en la web para activar tu cuenta:</p>
        <div style="font-size:40px;font-weight:700;letter-spacing:12px;text-align:center;padding:24px;background:#f5f4f1;border-radius:8px">${code}</div>
        <p style="color:#999;font-size:13px;margin-top:24px">Caduca en 15 minutos. Si no solicitaste esto, ignora este email.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetCode(to: string, code: string) {
  await getResend().emails.send({
    from:    FROM,
    to,
    subject: `[xRO] Código para cambiar contraseña: ${code}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
        <h2 style="margin:0 0 8px">Cambio de contraseña — xRO</h2>
        <p style="color:#666;margin:0 0 24px">Tu código para cambiar la contraseña:</p>
        <div style="font-size:40px;font-weight:700;letter-spacing:12px;text-align:center;padding:24px;background:#f5f4f1;border-radius:8px">${code}</div>
        <p style="color:#999;font-size:13px;margin-top:24px">Caduca en 15 minutos. Si no lo pediste tú, ignora este email.</p>
      </div>
    `,
  });
}

export async function sendEmailChangeCode(to: string, code: string) {
  await getResend().emails.send({
    from:    FROM,
    to,
    subject: `[xRO] Código para cambiar email: ${code}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
        <h2 style="margin:0 0 8px">Cambio de email — xRO</h2>
        <p style="color:#666;margin:0 0 24px">Tu código para confirmar el cambio de email:</p>
        <div style="font-size:40px;font-weight:700;letter-spacing:12px;text-align:center;padding:24px;background:#f5f4f1;border-radius:8px">${code}</div>
        <p style="color:#999;font-size:13px;margin-top:24px">Caduca en 15 minutos.</p>
      </div>
    `,
  });
}

export function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

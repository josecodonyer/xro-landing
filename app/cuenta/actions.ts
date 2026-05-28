'use server';

import { redirect } from 'next/navigation';
import * as api from '@/lib/api';
import { getSession } from '@/lib/session';
import { md5 } from '@/lib/password';
import { generateCode, sendVerificationCode, sendPasswordResetCode, sendEmailChangeCode } from '@/lib/email';
import { verifyCaptcha } from '@/lib/captcha';

function expiry(minutes: number) {
  return new Date(Date.now() + minutes * 60 * 1000)
    .toISOString().slice(0, 19).replace('T', ' ');
}

// ── Registro ──────────────────────────────────────────────────────────────────

export async function registerAction(_: unknown, fd: FormData) {
  const userid = (fd.get('userid') as string).trim();
  const email  = (fd.get('email')  as string).trim().toLowerCase();
  const pass   = fd.get('password') as string;
  const sex    = (fd.get('sex') as string) === 'F' ? 'F' : 'M';

  const captchaToken = fd.get('h-captcha-response') as string | null;
  const captchaOk = await verifyCaptcha(captchaToken);
  if (!captchaOk) return { error: 'Verificación CAPTCHA fallida. Inténtalo de nuevo.' };

  if (!userid || !email || !pass) return { error: 'Rellena todos los campos.' };
  if (userid.length < 4 || userid.length > 23) return { error: 'El usuario debe tener entre 4 y 23 caracteres.' };
  if (pass.length < 6) return { error: 'La contraseña debe tener al menos 6 caracteres.' };

  const code = generateCode();
  const res = await api.registerPending({
    userid, email, user_pass: md5(pass), sex, code, expires_at: expiry(15),
  });
  if (!res.ok) {
    if (res.error === 'already_registered') return { error: 'Ese usuario o email ya está registrado.' };
    return { error: 'No se pudo iniciar el registro. Inténtalo de nuevo.' };
  }

  try {
    await sendVerificationCode(email, code);
  } catch {
    return { error: 'No se pudo enviar el email. Inténtalo de nuevo.' };
  }

  return { success: true, email };
}

// ── Verificar código de registro ──────────────────────────────────────────────

export async function verifyRegistrationAction(_: unknown, fd: FormData) {
  const email = (fd.get('email') as string).trim().toLowerCase();
  const code  = (fd.get('code')  as string).trim();

  const res = await api.registerVerify({ email, code });
  if (!res.ok) {
    if (res.error === 'expired') return { error: 'El código ha caducado. Regístrate de nuevo.' };
    return { error: 'Código incorrecto o expirado.' };
  }

  return { success: true };
}

// ── Login ─────────────────────────────────────────────────────────────────────

export async function loginAction(_: unknown, fd: FormData) {
  const userid = (fd.get('userid') as string).trim();
  const pass   = fd.get('password') as string;

  const res = await api.login({ userid, user_pass: md5(pass) });
  if (!res.ok) return { error: 'Usuario o contraseña incorrectos.' };

  const session = await getSession();
  session.accountId = res.data.account_id;
  session.userid    = res.data.userid;
  session.email     = res.data.email;
  await session.save();

  redirect('/cuenta');
}

// ── Logout ────────────────────────────────────────────────────────────────────

export async function logoutAction() {
  const session = await getSession();
  session.destroy();
  redirect('/cuenta/login');
}

// ── Cambio de contraseña (solicitar código) ───────────────────────────────────

export async function requestPasswordChangeAction(_: unknown, fd: FormData) {
  const session = await getSession();
  if (!session.accountId) return { error: 'No autenticado.' };

  const currentPass = fd.get('current_password') as string;
  const newPass     = fd.get('new_password') as string;

  if (newPass.length < 6) return { error: 'La nueva contraseña debe tener al menos 6 caracteres.' };

  const code = generateCode();
  const res = await api.passwordRequest({
    account_id: session.accountId,
    current_pass: md5(currentPass),
    code,
    expires_at: expiry(15),
  });
  if (!res.ok) {
    if (res.error === 'invalid_current_password') return { error: 'La contraseña actual es incorrecta.' };
    return { error: 'No se pudo iniciar el cambio.' };
  }

  try {
    await sendPasswordResetCode(session.email!, code);
  } catch {
    return { error: 'No se pudo enviar el email.' };
  }

  return { success: true, newPass };
}

export async function confirmPasswordChangeAction(_: unknown, fd: FormData) {
  const session = await getSession();
  if (!session.accountId) return { error: 'No autenticado.' };

  const code    = (fd.get('code') as string).trim();
  const newPass = fd.get('new_password') as string;

  const res = await api.passwordConfirm({
    account_id: session.accountId,
    code,
    new_pass: md5(newPass),
  });
  if (!res.ok) {
    if (res.error === 'expired') return { error: 'El código ha caducado.' };
    return { error: 'Código incorrecto.' };
  }

  return { success: true };
}

// ── Cambio de email (solicitar código) ────────────────────────────────────────

export async function requestEmailChangeAction(_: unknown, fd: FormData) {
  const session = await getSession();
  if (!session.accountId) return { error: 'No autenticado.' };

  const newEmail = (fd.get('new_email') as string).trim().toLowerCase();
  if (!newEmail.includes('@')) return { error: 'Email inválido.' };

  const code = generateCode();
  const res = await api.emailRequest({
    account_id: session.accountId,
    new_email: newEmail,
    code,
    expires_at: expiry(15),
  });
  if (!res.ok) {
    if (res.error === 'email_in_use') return { error: 'Ese email ya está en uso.' };
    return { error: 'No se pudo iniciar el cambio.' };
  }

  try {
    await sendEmailChangeCode(newEmail, code);
  } catch {
    return { error: 'No se pudo enviar el email.' };
  }

  return { success: true };
}

export async function confirmEmailChangeAction(_: unknown, fd: FormData) {
  const session = await getSession();
  if (!session.accountId) return { error: 'No autenticado.' };

  const code = (fd.get('code') as string).trim();

  const res = await api.emailConfirm({
    account_id: session.accountId,
    code,
  });
  if (!res.ok) {
    if (res.error === 'expired') return { error: 'El código ha caducado.' };
    return { error: 'Código incorrecto.' };
  }

  session.email = res.data.new_email;
  await session.save();

  return { success: true };
}

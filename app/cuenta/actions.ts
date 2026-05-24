'use server';

import { redirect } from 'next/navigation';
import { query } from '@/lib/db';
import { getSession } from '@/lib/session';
import { md5 } from '@/lib/password';
import { generateCode, sendVerificationCode, sendPasswordResetCode, sendEmailChangeCode } from '@/lib/email';

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

  if (!userid || !email || !pass) return { error: 'Rellena todos los campos.' };
  if (userid.length < 4 || userid.length > 23) return { error: 'El usuario debe tener entre 4 y 23 caracteres.' };
  if (pass.length < 6) return { error: 'La contraseña debe tener al menos 6 caracteres.' };

  // Comprobar que no exista ya en login ni en pending
  const [existing] = await query<{ c: number }>(
    'SELECT COUNT(*) as c FROM login WHERE userid=? OR email=?', [userid, email]
  );
  if (existing.c > 0) return { error: 'Ese usuario o email ya está registrado.' };

  const [pending] = await query<{ c: number }>(
    'SELECT COUNT(*) as c FROM xro_pending_accounts WHERE userid=? OR email=?', [userid, email]
  );
  if (pending.c > 0) {
    await query('DELETE FROM xro_pending_accounts WHERE userid=? OR email=?', [userid, email]);
  }

  const code = generateCode();
  await query(
    `INSERT INTO xro_pending_accounts (userid, email, user_pass, sex, code, expires_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userid, email, md5(pass), sex, code, expiry(15)]
  );

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

  const [row] = await query<{ userid: string; user_pass: string; sex: string; expires_at: string }>(
    'SELECT userid, user_pass, sex, expires_at FROM xro_pending_accounts WHERE email=? AND code=?',
    [email, code]
  );

  if (!row) return { error: 'Código incorrecto o expirado.' };
  if (new Date(row.expires_at) < new Date()) {
    await query('DELETE FROM xro_pending_accounts WHERE email=?', [email]);
    return { error: 'El código ha caducado. Regístrate de nuevo.' };
  }

  // Crear cuenta en rAthena
  await query(
    `INSERT INTO login (userid, user_pass, sex, email, group_id, state)
     VALUES (?, ?, ?, ?, 0, 0)`,
    [row.userid, row.user_pass, row.sex, email]
  );
  await query('DELETE FROM xro_pending_accounts WHERE email=?', [email]);

  return { success: true };
}

// ── Login ─────────────────────────────────────────────────────────────────────

export async function loginAction(_: unknown, fd: FormData) {
  const userid = (fd.get('userid') as string).trim();
  const pass   = fd.get('password') as string;

  const [row] = await query<{ account_id: number; userid: string; email: string; user_pass: string }>(
    'SELECT account_id, userid, email, user_pass FROM login WHERE userid=? AND state=0',
    [userid]
  );

  if (!row || row.user_pass !== md5(pass)) {
    return { error: 'Usuario o contraseña incorrectos.' };
  }

  const session = await getSession();
  session.accountId = row.account_id;
  session.userid    = row.userid;
  session.email     = row.email;
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

  const [row] = await query<{ user_pass: string }>(
    'SELECT user_pass FROM login WHERE account_id=?', [session.accountId]
  );
  if (!row || row.user_pass !== md5(currentPass)) return { error: 'La contraseña actual es incorrecta.' };

  const code = generateCode();
  await query('DELETE FROM xro_email_tokens WHERE account_id=? AND type="password_reset"', [session.accountId]);
  await query(
    `INSERT INTO xro_email_tokens (account_id, type, token, expires_at)
     VALUES (?, 'password_reset', ?, ?)`,
    [session.accountId, code, expiry(15)]
  );

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

  const [row] = await query<{ expires_at: string }>(
    `SELECT expires_at FROM xro_email_tokens
     WHERE account_id=? AND type='password_reset' AND token=?`,
    [session.accountId, code]
  );

  if (!row) return { error: 'Código incorrecto.' };
  if (new Date(row.expires_at) < new Date()) return { error: 'El código ha caducado.' };

  await query('UPDATE login SET user_pass=? WHERE account_id=?', [md5(newPass), session.accountId]);
  await query('DELETE FROM xro_email_tokens WHERE account_id=? AND type="password_reset"', [session.accountId]);

  return { success: true };
}

// ── Cambio de email (solicitar código) ────────────────────────────────────────

export async function requestEmailChangeAction(_: unknown, fd: FormData) {
  const session = await getSession();
  if (!session.accountId) return { error: 'No autenticado.' };

  const newEmail = (fd.get('new_email') as string).trim().toLowerCase();
  if (!newEmail.includes('@')) return { error: 'Email inválido.' };

  const [existing] = await query<{ c: number }>(
    'SELECT COUNT(*) as c FROM login WHERE email=?', [newEmail]
  );
  if (existing.c > 0) return { error: 'Ese email ya está en uso.' };

  const code = generateCode();
  await query('DELETE FROM xro_email_tokens WHERE account_id=? AND type="email_change"', [session.accountId]);
  await query(
    `INSERT INTO xro_email_tokens (account_id, type, token, new_email, expires_at)
     VALUES (?, 'email_change', ?, ?, ?)`,
    [session.accountId, code, newEmail, expiry(15)]
  );

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

  const [row] = await query<{ new_email: string; expires_at: string }>(
    `SELECT new_email, expires_at FROM xro_email_tokens
     WHERE account_id=? AND type='email_change' AND token=?`,
    [session.accountId, code]
  );

  if (!row) return { error: 'Código incorrecto.' };
  if (new Date(row.expires_at) < new Date()) return { error: 'El código ha caducado.' };

  await query('UPDATE login SET email=? WHERE account_id=?', [row.new_email, session.accountId]);
  await query('DELETE FROM xro_email_tokens WHERE account_id=? AND type="email_change"', [session.accountId]);

  session.email = row.new_email;
  await session.save();

  return { success: true };
}

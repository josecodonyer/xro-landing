'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { requestPasswordChangeAction, confirmPasswordChangeAction } from '../actions';
import styles from '../cuenta.module.css';

export default function CambiarPasswordPage() {
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [newPass, setNewPass] = useState('');

  const [reqState, reqAction, reqPending] = useActionState(requestPasswordChangeAction, null);
  const [confState, confAction, confPending] = useActionState(confirmPasswordChangeAction, null);

  if (reqState?.success && step === 'form') {
    setNewPass(reqState.newPass!);
    setStep('verify');
  }

  if (confState?.success) {
    return (
      <div className={styles.shell}>
        <div className={styles.card}>
          <div className={styles.heading}>
            <h1 className={styles.title}>Contraseña cambiada.</h1>
            <p className={styles.subtitle}>Usa la nueva contraseña la próxima vez que entres al juego.</p>
          </div>
          <Link href="/cuenta" className={styles.btnPrimary}>Volver al panel</Link>
        </div>
      </div>
    );
  }

  if (step === 'verify') {
    return (
      <div className={styles.shell}>
        <div className={styles.card}>
          <div className={styles.heading}>
            <h1 className={styles.title}>Verifica el cambio.</h1>
            <p className={styles.subtitle}>Hemos enviado un código a tu email para confirmar el cambio.</p>
          </div>
          <form action={confAction} className={styles.form}>
            <input type="hidden" name="new_password" value={newPass} />
            <div className={styles.field}>
              <label className={styles.label}>Código de verificación</label>
              <input name="code" type="text" inputMode="numeric" maxLength={6} placeholder="000000"
                className={`${styles.input} ${styles.codeInput}`} autoFocus required />
            </div>
            {confState?.error && <div className={styles.error}>{confState.error}</div>}
            <button type="submit" className={styles.btnPrimary} disabled={confPending}>
              {confPending ? 'Confirmando…' : 'Confirmar cambio'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <div className={styles.card}>
        <div className={styles.heading}>
          <h1 className={styles.title}>Cambiar contraseña.</h1>
          <p className={styles.subtitle}>Te enviaremos un código a tu email para confirmar.</p>
        </div>
        <form action={reqAction} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="current_password">Contraseña actual</label>
            <input id="current_password" name="current_password" type="password" className={styles.input} placeholder="••••••••" required />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="new_password">Nueva contraseña</label>
            <input id="new_password" name="new_password" type="password" className={styles.input} placeholder="Mínimo 6 caracteres" required />
          </div>
          {reqState?.error && <div className={styles.error}>{reqState.error}</div>}
          <button type="submit" className={styles.btnPrimary} disabled={reqPending}>
            {reqPending ? 'Enviando código…' : 'Continuar'}
          </button>
        </form>
        <Link href="/cuenta" className={styles.btnGhost}>Cancelar</Link>
      </div>
    </div>
  );
}

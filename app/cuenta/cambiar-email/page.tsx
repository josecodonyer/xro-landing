'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { requestEmailChangeAction, confirmEmailChangeAction } from '../actions';
import styles from '../cuenta.module.css';

export default function CambiarEmailPage() {
  const [step, setStep] = useState<'form' | 'verify'>('form');

  const [reqState, reqAction, reqPending] = useActionState(requestEmailChangeAction, null);
  const [confState, confAction, confPending] = useActionState(confirmEmailChangeAction, null);

  if (reqState?.success && step === 'form') setStep('verify');

  if (confState?.success) {
    return (
      <div className={styles.shell}>
        <div className={styles.card}>
          <div className={styles.heading}>
            <h1 className={styles.title}>Email actualizado.</h1>
            <p className={styles.subtitle}>Tu nuevo email ya está activo en la cuenta.</p>
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
            <h1 className={styles.title}>Verifica el nuevo email.</h1>
            <p className={styles.subtitle}>Hemos enviado un código al nuevo email para confirmar el cambio.</p>
          </div>
          <form action={confAction} className={styles.form}>
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
          <h1 className={styles.title}>Cambiar email.</h1>
          <p className={styles.subtitle}>Enviaremos un código al nuevo email para confirmar.</p>
        </div>
        <form action={reqAction} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="new_email">Nuevo email</label>
            <input id="new_email" name="new_email" type="email" className={styles.input} placeholder="nuevo@email.com" required autoFocus />
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

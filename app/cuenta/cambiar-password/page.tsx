'use client';

import { useActionState, useState, useEffect } from 'react';
import Link from 'next/link';
import { requestPasswordChangeAction, confirmPasswordChangeAction } from '../actions';
import { Field, TextInput, SubmitButton, FormError } from '../../components/FormControls';
import styles from '../cuenta.module.css';

export default function CambiarPasswordPage() {
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [newPass, setNewPass] = useState('');

  const [reqState, reqAction, reqPending] = useActionState(requestPasswordChangeAction, null);
  const [confState, confAction, confPending] = useActionState(confirmPasswordChangeAction, null);

  useEffect(() => {
    if (reqState?.success && step === 'form') {
      setNewPass(reqState.newPass!);
      setStep('verify');
    }
  }, [reqState, step]);

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
            <Field label="Código de verificación">
              <TextInput name="code" type="text" inputMode="numeric" maxLength={6} placeholder="000000"
                className={styles.codeInput} autoFocus required />
            </Field>
            <FormError>{confState?.error}</FormError>
            <SubmitButton pending={confPending} pendingLabel="Confirmando…">Confirmar cambio</SubmitButton>
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
          <Field label="Contraseña actual" htmlFor="current_password">
            <TextInput id="current_password" name="current_password" type="password" placeholder="••••••••" required />
          </Field>
          <Field label="Nueva contraseña" htmlFor="new_password">
            <TextInput id="new_password" name="new_password" type="password" placeholder="Mínimo 6 caracteres" required />
          </Field>
          <FormError>{reqState?.error}</FormError>
          <SubmitButton pending={reqPending} pendingLabel="Enviando código…">Continuar</SubmitButton>
        </form>
        <Link href="/cuenta" className={styles.btnGhost}>Cancelar</Link>
      </div>
    </div>
  );
}

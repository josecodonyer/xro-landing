'use client';

import { useActionState, useState, useEffect } from 'react';
import Link from 'next/link';
import { requestEmailChangeAction, confirmEmailChangeAction } from '../actions';
import { Field, TextInput, SubmitButton, FormError } from '../../components/FormControls';
import styles from '../cuenta.module.css';

export default function CambiarEmailPage() {
  const [step, setStep] = useState<'form' | 'verify'>('form');

  const [reqState, reqAction, reqPending] = useActionState(requestEmailChangeAction, null);
  const [confState, confAction, confPending] = useActionState(confirmEmailChangeAction, null);

  useEffect(() => {
    if (reqState?.success && step === 'form') setStep('verify');
  }, [reqState, step]);

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
          <h1 className={styles.title}>Cambiar email.</h1>
          <p className={styles.subtitle}>Enviaremos un código al nuevo email para confirmar.</p>
        </div>
        <form action={reqAction} className={styles.form}>
          <Field label="Nuevo email" htmlFor="new_email">
            <TextInput id="new_email" name="new_email" type="email" placeholder="nuevo@email.com" required autoFocus />
          </Field>
          <FormError>{reqState?.error}</FormError>
          <SubmitButton pending={reqPending} pendingLabel="Enviando código…">Continuar</SubmitButton>
        </form>
        <Link href="/cuenta" className={styles.btnGhost}>Cancelar</Link>
      </div>
    </div>
  );
}

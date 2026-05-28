'use client';

import { useActionState, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { registerAction, verifyRegistrationAction } from '../actions';
import { executeRecaptcha, RECAPTCHA_SITE_KEY } from '@/lib/recaptcha';
import XroLogo from '../../components/XroLogo';
import { Field, TextInput, SubmitButton, FormError, CaptchaNote } from '../../components/FormControls';
import styles from '../cuenta.module.css';

export default function RegistroPage() {
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingPass, setPendingPass] = useState('');
  const [sex, setSex] = useState<'M' | 'F'>('M');

  const [regState, regAction, regPending] = useActionState(registerAction, null);
  const [verState, verAction, verPending] = useActionState(verifyRegistrationAction, null);
  const router = useRouter();

  // Si ya hay sesión, no tiene sentido registrarse → al panel.
  useEffect(() => {
    fetch('/api/me').then(r => r.json()).then(d => { if (d.loggedIn) router.replace('/cuenta'); }).catch(() => {});
  }, [router]);

  useEffect(() => {
    if (regState?.success && step === 'form') {
      setPendingEmail(regState.email!);
      setStep('verify');
    }
  }, [regState, step]);

  if (verState?.success) {
    return (
      <div className={styles.shell}>
        <div className={styles.card}>
          <div className={styles.cardTop}>
            <Link href="/" className={styles.backLink}>← Volver</Link>
            <Link href="/" className={styles.logo}><XroLogo size={18} /><span className={styles.logoRo}>RO</span></Link>
          </div>
          <div className={styles.heading}>
            <h1 className={styles.title}>Cuenta creada.</h1>
            <p className={styles.subtitle}>Ya puedes iniciar sesión y conectarte al servidor.</p>
          </div>
          <Link href="/cuenta/login" className={styles.btnPrimary}>Iniciar sesión</Link>
        </div>
      </div>
    );
  }

  if (step === 'verify') {
    return (
      <div className={styles.shell}>
        <div className={styles.card}>
          <div className={styles.cardTop}>
            <Link href="/" className={styles.backLink}>← Volver</Link>
            <Link href="/" className={styles.logo}><XroLogo size={18} /><span className={styles.logoRo}>RO</span></Link>
          </div>
          <div className={styles.heading}>
            <h1 className={styles.title}>Verifica tu email.</h1>
            <p className={styles.subtitle}>Hemos enviado un código de 6 dígitos a <strong>{pendingEmail}</strong>.</p>
          </div>
          <form action={verAction} className={styles.form}>
            <input type="hidden" name="email" value={pendingEmail} />
            <input type="hidden" name="new_pass" value={pendingPass} />
            <Field label="Código">
              <TextInput
                name="code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                className={styles.codeInput}
                autoFocus
                required
              />
            </Field>
            <FormError>{verState?.error}</FormError>
            <SubmitButton pending={verPending} pendingLabel="Verificando…">Activar cuenta</SubmitButton>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <div className={styles.card}>
        <Link href="/" className={styles.backLink}>← Volver</Link>
        <Link href="/" className={styles.logo}><XroLogo size={18} /><span className={styles.logoRo}>RO</span></Link>
        <div className={styles.heading}>
          <h1 className={styles.title}>Crear cuenta.</h1>
          <p className={styles.subtitle}>El usuario y contraseña son los que usarás para entrar al juego.</p>
        </div>
        {RECAPTCHA_SITE_KEY && (
          <Script
            src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
            strategy="lazyOnload"
          />
        )}
        <form action={async (fd) => {
          fd.set('sex', sex);
          const token = await executeRecaptcha('register');
          if (token) fd.set('captcha-token', token);
          regAction(fd);
        }} className={styles.form}>
          <Field label="Usuario (en el juego)" htmlFor="userid">
            <TextInput id="userid" name="userid" type="text" placeholder="Ej: Yinx" required autoFocus />
          </Field>
          <Field label="Email" htmlFor="email">
            <TextInput id="email" name="email" type="email" placeholder="tu@email.com" required
              onChange={e => setPendingEmail(e.target.value)} />
          </Field>
          <Field label="Contraseña" htmlFor="password">
            <TextInput id="password" name="password" type="password" placeholder="Mínimo 6 caracteres" required
              onChange={e => setPendingPass(e.target.value)} />
          </Field>
          <Field label="Sexo del personaje">
            <div className={styles.sexRow}>
              <button type="button" className={`${styles.sexBtn} ${sex === 'M' ? styles.sexBtnActive : ''}`} onClick={() => setSex('M')}>Masculino</button>
              <button type="button" className={`${styles.sexBtn} ${sex === 'F' ? styles.sexBtnActive : ''}`} onClick={() => setSex('F')}>Femenino</button>
            </div>
          </Field>
          <FormError>{regState?.error}</FormError>
          <SubmitButton pending={regPending} pendingLabel="Enviando…">Crear cuenta</SubmitButton>
        </form>
        <p className={styles.footerNote}>¿Ya tienes cuenta? <Link href="/cuenta/login">Inicia sesión</Link></p>
        <CaptchaNote>
          Protegido por reCAPTCHA · Google{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacidad</a>{' '}
          y <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Términos</a>.
        </CaptchaNote>
      </div>
    </div>
  );
}

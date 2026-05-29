'use client';

import { useActionState, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Script from 'next/script';
import { requestPasswordResetAction, confirmPasswordResetAction } from '../actions';
import { executeRecaptcha, RECAPTCHA_SITE_KEY } from '@/lib/recaptcha';
import XroLogo from '../../components/XroLogo';
import { Field, TextInput, SubmitButton, FormError, CaptchaNote } from '../../components/FormControls';
import styles from '../cuenta.module.css';

export default function RecuperarPage() {
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [userid, setUserid] = useState('');
  const [emailHint, setEmailHint] = useState('');

  const [reqState, reqAction, reqPending] = useActionState(requestPasswordResetAction, null);
  const [confState, confAction, confPending] = useActionState(confirmPasswordResetAction, null);
  const router = useRouter();

  // Si ya hay sesión, no tiene sentido recuperar la contraseña → al panel.
  useEffect(() => {
    fetch('/api/me').then(r => r.json()).then(d => { if (d.loggedIn) router.replace('/cuenta'); }).catch(() => {});
  }, [router]);

  useEffect(() => {
    if (reqState?.success && step === 'form') {
      setUserid(reqState.userid!);
      setEmailHint(reqState.emailHint!);
      setStep('verify');
    }
  }, [reqState, step]);

  if (confState?.success) {
    return (
      <div className={styles.shell}>
        <div className={styles.card}>
          <div className={styles.cardTop}>
            <Link href="/cuenta/login" className={styles.backLink}>← Volver</Link>
            <Link href="/" className={styles.logo}><XroLogo size={18} /><span className={styles.logoRo}>RO</span></Link>
          </div>
          <div className={styles.heading}>
            <h1 className={styles.title}>Contraseña restablecida.</h1>
            <p className={styles.subtitle}>Ya puedes iniciar sesión con tu nueva contraseña.</p>
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
            <Link href="/cuenta/login" className={styles.backLink}>← Volver</Link>
            <Link href="/" className={styles.logo}><XroLogo size={18} /><span className={styles.logoRo}>RO</span></Link>
          </div>
          <div className={styles.heading}>
            <h1 className={styles.title}>Revisa tu email.</h1>
            <p className={styles.subtitle}>
              Hemos enviado un código de 6 dígitos a <strong>{emailHint}</strong>, el email registrado en tu cuenta.
              Escríbelo junto a tu nueva contraseña.
            </p>
          </div>
          <form action={confAction} className={styles.form}>
            <input type="hidden" name="userid" value={userid} />
            <Field label="Código">
              <TextInput name="code" type="text" inputMode="numeric" maxLength={6} placeholder="000000"
                className={styles.codeInput} autoFocus required />
            </Field>
            <Field label="Nueva contraseña" htmlFor="new_password">
              <TextInput id="new_password" name="new_password" type="password" placeholder="Mínimo 6 caracteres" required />
            </Field>
            <FormError>{confState?.error}</FormError>
            <SubmitButton pending={confPending} pendingLabel="Restableciendo…">Cambiar contraseña</SubmitButton>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <div className={styles.card}>
        <div className={styles.cardTop}>
          <Link href="/cuenta/login" className={styles.backLink}>← Volver</Link>
          <Link href="/" className={styles.logo}><XroLogo size={18} /><span className={styles.logoRo}>RO</span></Link>
        </div>
        <div className={styles.heading}>
          <h1 className={styles.title}>Recuperar acceso.</h1>
          <p className={styles.subtitle}>
            Escribe tu usuario del juego. Te diremos a qué email registrado enviamos el código para
            restablecer tu contraseña.
          </p>
        </div>
        {RECAPTCHA_SITE_KEY && (
          <Script
            src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
            strategy="lazyOnload"
          />
        )}
        <form action={async (fd) => {
          const token = await executeRecaptcha('password_reset');
          if (token) fd.set('captcha-token', token);
          reqAction(fd);
        }} className={styles.form}>
          <Field label="Usuario" htmlFor="userid">
            <TextInput id="userid" name="userid" type="text" placeholder="Tu usuario en el juego" required autoFocus />
          </Field>
          <FormError>{reqState?.error}</FormError>
          <SubmitButton pending={reqPending} pendingLabel="Enviando código…">Continuar</SubmitButton>
        </form>
        <p className={styles.footerNote}>¿Te acuerdas de tu contraseña? <Link href="/cuenta/login">Inicia sesión</Link></p>
        <CaptchaNote>
          Protegido por reCAPTCHA · Google{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Privacidad</a>{' '}
          y <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Términos</a>.
        </CaptchaNote>
      </div>
    </div>
  );
}

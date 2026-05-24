'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { registerAction, verifyRegistrationAction } from '../actions';
import styles from '../cuenta.module.css';

const SVG_LOGO = (
  <svg width="18" height="18" viewBox="0 0 600 600" fill="none" aria-hidden>
    <g transform="matrix(1.250966,1.250966,-1.250966,1.250966,195.474028,-418.223501)">
      <path d="M272.867,300.283L143.742,300.283C143.585,300.283 143.459,300.156 143.459,300L143.459,190.579C143.459,190.423 143.585,190.296 143.742,190.296L272.867,190.296L272.867,61.171C272.867,61.015 272.993,60.888 273.149,60.888L382.571,60.888C382.727,60.888 382.853,61.015 382.853,61.171L382.853,190.296L511.978,190.296C512.135,190.296 512.261,190.423 512.261,190.579L512.261,300C512.261,300.156 512.135,300.283 511.978,300.283L382.853,300.283L382.853,429.408C382.853,429.564 382.727,429.69 382.571,429.69L273.149,429.69C272.993,429.69 272.867,429.564 272.867,429.408L272.867,300.283Z" fill="currentColor"/>
    </g>
  </svg>
);

export default function RegistroPage() {
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingPass, setPendingPass] = useState('');
  const [sex, setSex] = useState<'M' | 'F'>('M');

  const [regState, regAction, regPending] = useActionState(registerAction, null);
  const [verState, verAction, verPending] = useActionState(verifyRegistrationAction, null);

  if (regState?.success && step === 'form') {
    setPendingEmail(regState.email!);
    setStep('verify');
  }

  if (verState?.success) {
    return (
      <div className={styles.shell}>
        <div className={styles.card}>
          <Link href="/" className={styles.backLink}>← Volver</Link>
          <Link href="/" className={styles.logo}>{SVG_LOGO}<span className={styles.logoRo}>RO</span></Link>
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
          <Link href="/" className={styles.backLink}>← Volver</Link>
          <Link href="/" className={styles.logo}>{SVG_LOGO}<span className={styles.logoRo}>RO</span></Link>
          <div className={styles.heading}>
            <h1 className={styles.title}>Verifica tu email.</h1>
            <p className={styles.subtitle}>Hemos enviado un código de 6 dígitos a <strong>{pendingEmail}</strong>.</p>
          </div>
          <form action={verAction} className={styles.form}>
            <input type="hidden" name="email" value={pendingEmail} />
            <input type="hidden" name="new_pass" value={pendingPass} />
            <div className={styles.field}>
              <label className={styles.label}>Código</label>
              <input
                name="code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                className={`${styles.input} ${styles.codeInput}`}
                autoFocus
                required
              />
            </div>
            {verState?.error && <div className={styles.error}>{verState.error}</div>}
            <button type="submit" className={styles.btnPrimary} disabled={verPending}>
              {verPending ? 'Verificando…' : 'Activar cuenta'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.shell}>
      <div className={styles.card}>
        <Link href="/" className={styles.backLink}>← Volver</Link>
        <Link href="/" className={styles.logo}>{SVG_LOGO}<span className={styles.logoRo}>RO</span></Link>
        <div className={styles.heading}>
          <h1 className={styles.title}>Crear cuenta.</h1>
          <p className={styles.subtitle}>El usuario y contraseña son los que usarás para entrar al juego.</p>
        </div>
        <form action={(fd) => {
          fd.set('sex', sex);
          regAction(fd);
        }} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="userid">Usuario (en el juego)</label>
            <input id="userid" name="userid" type="text" className={styles.input} placeholder="Ej: Yinx" required autoFocus />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">Email</label>
            <input id="email" name="email" type="email" className={styles.input} placeholder="tu@email.com" required
              onChange={e => setPendingEmail(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password" className={styles.input} placeholder="Mínimo 6 caracteres" required
              onChange={e => setPendingPass(e.target.value)} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Sexo del personaje</label>
            <div className={styles.sexRow}>
              <button type="button" className={`${styles.sexBtn} ${sex === 'M' ? styles.sexBtnActive : ''}`} onClick={() => setSex('M')}>Masculino</button>
              <button type="button" className={`${styles.sexBtn} ${sex === 'F' ? styles.sexBtnActive : ''}`} onClick={() => setSex('F')}>Femenino</button>
            </div>
          </div>
          {regState?.error && <div className={styles.error}>{regState.error}</div>}
          <button type="submit" className={styles.btnPrimary} disabled={regPending}>
            {regPending ? 'Enviando…' : 'Crear cuenta'}
          </button>
        </form>
        <p className={styles.footerNote}>¿Ya tienes cuenta? <Link href="/cuenta/login">Inicia sesión</Link></p>
      </div>
    </div>
  );
}

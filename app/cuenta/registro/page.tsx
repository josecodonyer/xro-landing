'use client';

import { useActionState, useState, useEffect } from 'react';
import Link from 'next/link';
import { registerAction, verifyRegistrationAction } from '../actions';
import XroLogo from '../../components/XroLogo';
import styles from '../cuenta.module.css';

export default function RegistroPage() {
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [pendingEmail, setPendingEmail] = useState('');
  const [pendingPass, setPendingPass] = useState('');
  const [sex, setSex] = useState<'M' | 'F'>('M');

  const [regState, regAction, regPending] = useActionState(registerAction, null);
  const [verState, verAction, verPending] = useActionState(verifyRegistrationAction, null);

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
          <Link href="/" className={styles.backLink}>← Volver</Link>
          <Link href="/" className={styles.logo}><XroLogo size={18} /><span className={styles.logoRo}>RO</span></Link>
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
          <Link href="/" className={styles.logo}><XroLogo size={18} /><span className={styles.logoRo}>RO</span></Link>
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
        <Link href="/" className={styles.logo}><XroLogo size={18} /><span className={styles.logoRo}>RO</span></Link>
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

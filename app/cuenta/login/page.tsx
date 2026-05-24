'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { loginAction } from '../actions';
import styles from '../cuenta.module.css';

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <div className={styles.shell}>
      <div className={styles.card}>
        <Link href="/" className={styles.logo}>
          <svg width="18" height="18" viewBox="0 0 600 600" fill="none" aria-hidden>
            <g transform="matrix(1.250966,1.250966,-1.250966,1.250966,195.474028,-418.223501)">
              <path d="M272.867,300.283L143.742,300.283C143.585,300.283 143.459,300.156 143.459,300L143.459,190.579C143.459,190.423 143.585,190.296 143.742,190.296L272.867,190.296L272.867,61.171C272.867,61.015 272.993,60.888 273.149,60.888L382.571,60.888C382.727,60.888 382.853,61.015 382.853,61.171L382.853,190.296L511.978,190.296C512.135,190.296 512.261,190.423 512.261,190.579L512.261,300C512.261,300.156 512.135,300.283 511.978,300.283L382.853,300.283L382.853,429.408C382.853,429.564 382.727,429.69 382.571,429.69L273.149,429.69C272.993,429.69 272.867,429.564 272.867,429.408L272.867,300.283Z" fill="currentColor"/>
            </g>
          </svg>
          <span className={styles.logoRo}>RO</span>
        </Link>
        <div className={styles.heading}>
          <h1 className={styles.title}>Iniciar sesión.</h1>
          <p className={styles.subtitle}>Accede con tu usuario del juego.</p>
        </div>
        <form action={action} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="userid">Usuario</label>
            <input id="userid" name="userid" type="text" className={styles.input} placeholder="Tu usuario en el juego" required autoFocus />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="password">Contraseña</label>
            <input id="password" name="password" type="password" className={styles.input} placeholder="••••••••" required />
          </div>
          {state?.error && <div className={styles.error}>{state.error}</div>}
          <button type="submit" className={styles.btnPrimary} disabled={pending}>
            {pending ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
        <p className={styles.footerNote}>¿No tienes cuenta? <Link href="/cuenta/registro">Regístrate</Link></p>
      </div>
    </div>
  );
}

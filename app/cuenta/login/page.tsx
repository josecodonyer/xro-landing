'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { loginAction } from '../actions';
import XroLogo from '../../components/XroLogo';
import styles from '../cuenta.module.css';

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, null);

  return (
    <div className={styles.shell}>
      <div className={styles.card}>
        <Link href="/" className={styles.logo}>
          <XroLogo size={18} />
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

'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginAction } from '../actions';
import XroLogo from '../../components/XroLogo';
import { Field, TextInput, SubmitButton, FormError } from '../../components/FormControls';
import styles from '../cuenta.module.css';

export default function LoginPage() {
  const [state, action, pending] = useActionState(loginAction, null);
  const router = useRouter();

  // Si ya hay sesión, no tiene sentido ver el login → al panel.
  useEffect(() => {
    fetch('/api/me').then(r => r.json()).then(d => { if (d.loggedIn) router.replace('/cuenta'); }).catch(() => {});
  }, [router]);

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
          <Field label="Usuario" htmlFor="userid">
            <TextInput id="userid" name="userid" type="text" placeholder="Tu usuario en el juego" required autoFocus />
          </Field>
          <Field label="Contraseña" htmlFor="password">
            <TextInput id="password" name="password" type="password" placeholder="••••••••" required />
          </Field>
          <FormError>{state?.error}</FormError>
          <SubmitButton pending={pending} pendingLabel="Entrando…">Entrar</SubmitButton>
        </form>
        <p className={styles.footerNote}>¿No tienes cuenta? <Link href="/cuenta/registro">Regístrate</Link></p>
      </div>
    </div>
  );
}

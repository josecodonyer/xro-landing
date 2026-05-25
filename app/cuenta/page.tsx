import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { charactersGet } from '@/lib/api';
import { logoutAction } from './actions';
import XroLogo from '../components/XroLogo';
import styles from './cuenta.module.css';

export default async function CuentaPage() {
  const session = await getSession();
  if (!session.accountId) redirect('/cuenta/login');

  const res = await charactersGet({ account_id: session.accountId });
  const chars = res.ok ? res.data.characters : [];

  return (
    <div className={styles.shell}>
      <div className={`${styles.card} ${styles.cardWide}`}>
        <div>
          <Link href="/" className={styles.backLink}>← Volver</Link>
          <Link href="/" className={styles.logo}>
            <XroLogo size={18} />
            <span className={styles.logoRo}>RO</span>
          </Link>
          <div className={styles.heading} style={{ marginTop: 16 }}>
            <h1 className={styles.title}>Hola, <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{session.userid}</em>.</h1>
            <p className={styles.subtitle}>{session.email}</p>
          </div>
        </div>

        <hr className={styles.divider} />

        {chars.length > 0 && (
          <div>
            <p className={styles.label} style={{ marginBottom: 12 }}>Personajes</p>
            <div className={styles.dashGrid}>
              {chars.map(c => (
                <div key={c.name} className={styles.dashTile}>
                  <span className={styles.dashTileLabel}>Lv {c.base_level}</span>
                  <span className={styles.dashTileValue}>{c.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={styles.dashGrid}>
          <Link href="/cuenta/cambiar-password" className={styles.btnGhost}>
            Cambiar contraseña
          </Link>
          <Link href="/cuenta/cambiar-email" className={styles.btnGhost}>
            Cambiar email
          </Link>
        </div>

        <form action={logoutAction}>
          <button type="submit" className={styles.btnGhost} style={{ marginTop: 4 }}>
            Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  );
}

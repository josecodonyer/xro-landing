import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { query } from '@/lib/db';
import { logoutAction } from './actions';
import styles from './cuenta.module.css';

interface CharRow { name: string; class: number; base_level: number; }

export default async function CuentaPage() {
  const session = await getSession();
  if (!session.accountId) redirect('/cuenta/login');

  const chars = await query<CharRow>(
    'SELECT name, class, base_level FROM `char` WHERE account_id=? ORDER BY char_id LIMIT 9',
    [session.accountId]
  );

  return (
    <div className={styles.shell}>
      <div className={`${styles.card} ${styles.cardWide}`}>
        <div>
          <Link href="/" className={styles.logo}>
            <svg width="18" height="18" viewBox="0 0 600 600" fill="none" aria-hidden>
              <g transform="matrix(1.250966,1.250966,-1.250966,1.250966,195.474028,-418.223501)">
                <path d="M272.867,300.283L143.742,300.283C143.585,300.283 143.459,300.156 143.459,300L143.459,190.579C143.459,190.423 143.585,190.296 143.742,190.296L272.867,190.296L272.867,61.171C272.867,61.015 272.993,60.888 273.149,60.888L382.571,60.888C382.727,60.888 382.853,61.015 382.853,61.171L382.853,190.296L511.978,190.296C512.135,190.296 512.261,190.423 512.261,190.579L512.261,300C512.261,300.156 512.135,300.283 511.978,300.283L382.853,300.283L382.853,429.408C382.853,429.564 382.727,429.69 382.571,429.69L273.149,429.69C272.993,429.69 272.867,429.564 272.867,429.408L272.867,300.283Z" fill="currentColor"/>
              </g>
            </svg>
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

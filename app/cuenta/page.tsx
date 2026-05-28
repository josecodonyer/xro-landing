import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { charactersGet } from '@/lib/api';
import { isAdmin } from '@/lib/admin';
import { getUserAvatar } from '@/lib/avatar';
import { logoutAction } from './actions';
import XroLogo from '../components/XroLogo';
import CharCard from './CharCard';
import AvatarPicker from './AvatarPicker';
import styles from './cuenta.module.css';

export default async function CuentaPage() {
  const session = await getSession();
  if (!session.accountId) redirect('/cuenta/login');

  const [res, admin, avatar] = await Promise.all([
    charactersGet({ account_id: session.accountId }),
    isAdmin(session.userid!).catch(() => false),
    getUserAvatar(session.userid!).catch(() => null),
  ]);
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

          <div className={styles.profileHeader}>
            <AvatarPicker
              chars={chars}
              currentCharName={avatar?.charName ?? null}
            />
            <div className={styles.heading} style={{ marginTop: 0 }}>
              <h1 className={styles.title}>
                Hola, <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{session.userid}</em>.
              </h1>
              <p className={styles.subtitle}>{session.email}</p>
              {admin && (
                <Link href="/admin" className={styles.adminBadge}>
                  ⚙ Panel Admin
                </Link>
              )}
            </div>
          </div>
        </div>

        <hr className={styles.divider} />

        {chars.length > 0 && (
          <div>
            <p className={styles.label} style={{ marginBottom: 12 }}>Personajes</p>
            <div className={styles.charGrid}>
              {chars.map(c => <CharCard key={c.name} c={c} />)}
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
          <Link href="/soporte" className={styles.btnGhost}>
            Mis tickets
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

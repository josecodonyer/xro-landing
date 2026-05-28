import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { db } from '@/lib/db';
import XroLogo from '../components/XroLogo';
import styles from './soporte.module.css';

const CATEGORY_LABELS: Record<string, string> = {
  BUG: 'Bug',
  SUGGESTION: 'Sugerencia',
  SUPPORT: 'Soporte',
};

const STATUS_LABELS: Record<string, string> = {
  OPEN: 'Abierto',
  IN_PROGRESS: 'En Progreso',
  RESOLVED: 'Resuelto',
  CLOSED: 'Cerrado',
};

export default async function SoportePage() {
  const session = await getSession();
  if (!session.accountId || !session.userid) redirect('/cuenta/login');

  const tickets = await db.ticket.findMany({
    where: { userId: session.userid },
    orderBy: { createdAt: 'desc' },
    include: { replies: true },
  });

  return (
    <main className={styles.shell}>
      <div className={`${styles.card} ${styles.cardWide}`}>
        <Link href="/" className={styles.logo}>
          <XroLogo size={18} />
          <span className={styles.logoRo}>RO</span>
        </Link>

        <div className={styles.header}>
          <div className={styles.pageHeader}>
            <h1 className={styles.title}>Mis tickets</h1>
            <p className={styles.subtitle}>Reporta bugs, sugerencias o solicita soporte.</p>
          </div>
          <Link href="/soporte/nuevo" className={styles.btnPrimary}>
            + Nuevo ticket
          </Link>
        </div>

        {tickets.length === 0 ? (
          <div className={styles.empty}>
            <p>No tienes tickets abiertos todavía.</p>
            <Link href="/soporte/nuevo" className={styles.btnGhost}>Crear primer ticket</Link>
          </div>
        ) : (
          <div className={styles.ticketList}>
            {tickets.map(ticket => (
              <Link key={ticket.id} href={`/soporte/${ticket.id}`} className={styles.ticketRow}>
                <div className={styles.ticketMain}>
                  <span className={`${styles.categoryBadge} ${styles[`cat${ticket.category}`]}`}>
                    {CATEGORY_LABELS[ticket.category] ?? ticket.category}
                  </span>
                  <span className={styles.ticketTitle}>{ticket.title}</span>
                </div>
                <div className={styles.ticketMeta}>
                  <span className={`${styles.statusBadge} ${styles[`st${ticket.status}`]}`}>
                    {STATUS_LABELS[ticket.status] ?? ticket.status}
                  </span>
                  <span className={styles.ticketReplies}>
                    {ticket.replies.length} resp.
                  </span>
                  <span className={styles.ticketDate}>
                    {new Date(ticket.createdAt).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

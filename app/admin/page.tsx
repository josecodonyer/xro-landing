import Link from 'next/link';
import { db } from '@/lib/db';
import KanbanBoard from './KanbanBoard';
import styles from './admin.module.css';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const tickets = await db.ticket.findMany({
    orderBy: { createdAt: 'desc' },
    include: { replies: true },
  });

  const totalOpen = tickets.filter(t => t.status === 'OPEN').length;

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <Link href="/" className={styles.brand}>xRO</Link>
          <span className={styles.topbarSep}>/</span>
          <span className={styles.topbarSection}>Panel Admin</span>
        </div>
        <div className={styles.topbarRight}>
          {totalOpen > 0 && (
            <span className={styles.openBadge}>{totalOpen} abiertos</span>
          )}
          <Link href="/" className={styles.topbarLink}>← Volver al sitio</Link>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Tickets de soporte</h1>
          <p className={styles.pageSubtitle}>
            Arrastra las tarjetas entre columnas para cambiar su estado.
          </p>
        </div>
        <KanbanBoard initialTickets={tickets} />
      </div>
    </main>
  );
}

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import AdminReplyForm from './AdminReplyForm';
import StatusSelector from './StatusSelector';
import styles from '../admin.module.css';

const CATEGORY_LABELS: Record<string, string> = {
  BUG: '🐛 Bug',
  SUGGESTION: '💡 Sugerencia',
  SUPPORT: '🛟 Soporte',
};

const STATUS_LABELS: Record<string, string> = {
  OPEN: 'Abierto',
  IN_PROGRESS: 'En Progreso',
  RESOLVED: 'Resuelto',
  CLOSED: 'Cerrado',
};

export const dynamic = 'force-dynamic';

export default async function AdminTicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticketId = parseInt(id, 10);
  if (isNaN(ticketId)) notFound();

  const ticket = await db.ticket.findUnique({
    where: { id: ticketId },
    include: {
      replies: { orderBy: { createdAt: 'asc' } },
      attachments: true,
    },
  });

  if (!ticket) notFound();

  return (
    <main className={styles.shell}>
      <div className={styles.topbar}>
        <div className={styles.topbarLeft}>
          <Link href="/" className={styles.brand}>xRO</Link>
          <span className={styles.topbarSep}>/</span>
          <Link href="/admin" className={styles.topbarLink}>Panel Admin</Link>
          <span className={styles.topbarSep}>/</span>
          <span className={styles.topbarSection}>Ticket #{ticket.id}</span>
        </div>
        <div className={styles.topbarRight}>
          <Link href="/admin" className={styles.topbarLink}>← Volver al panel</Link>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.ticketDetailLayout}>
          <div className={styles.ticketDetailMain}>
            <div className={styles.detailHeader}>
              <span className={styles.detailCategory}>
                {CATEGORY_LABELS[ticket.category] ?? ticket.category}
              </span>
              <h1 className={styles.detailTitle}>{ticket.title}</h1>
              <p className={styles.detailMeta}>
                Por <strong>{ticket.userId}</strong> · {ticket.userEmail} ·{' '}
                {new Date(ticket.createdAt).toLocaleString('es-ES')}
              </p>
            </div>

            <div className={styles.messageCard}>
              <div className={styles.messageHeader}>
                <strong>{ticket.userId}</strong>
                <span className={styles.messageTime}>
                  {new Date(ticket.createdAt).toLocaleString('es-ES')}
                </span>
              </div>
              <p className={styles.messageBody}>{ticket.message}</p>

              {ticket.attachments.length > 0 && (
                <div className={styles.attachmentGrid}>
                  {ticket.attachments.map(att => (
                    <a
                      key={att.id}
                      href={`/api/uploads/${att.storedAs}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={`/api/uploads/${att.storedAs}`}
                        alt={att.filename}
                        className={styles.attachmentThumb}
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>

            {ticket.replies.map(reply => (
              <div
                key={reply.id}
                className={`${styles.messageCard} ${reply.isAdmin ? styles.messageCardAdmin : ''}`}
              >
                <div className={styles.messageHeader}>
                  <strong>{reply.isAdmin ? `⚙ ${reply.userId} (Staff)` : reply.userId}</strong>
                  <span className={styles.messageTime}>
                    {new Date(reply.createdAt).toLocaleString('es-ES')}
                  </span>
                </div>
                <p className={styles.messageBody}>{reply.message}</p>
              </div>
            ))}

            <div className={styles.replySection}>
              <h3 className={styles.replySectionTitle}>Responder como staff</h3>
              <AdminReplyForm ticketId={ticket.id} />
            </div>
          </div>

          <div className={styles.ticketDetailSidebar}>
            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Estado</h3>
              <StatusSelector ticketId={ticket.id} current={ticket.status} />
            </div>

            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Detalles</h3>
              <dl className={styles.detailsList}>
                <dt>ID</dt><dd>#{ticket.id}</dd>
                <dt>Usuario</dt><dd>{ticket.userId}</dd>
                <dt>Email</dt><dd>{ticket.userEmail}</dd>
                <dt>Categoría</dt><dd>{CATEGORY_LABELS[ticket.category] ?? ticket.category}</dd>
                <dt>Estado</dt><dd>{STATUS_LABELS[ticket.status] ?? ticket.status}</dd>
                <dt>Adjuntos</dt><dd>{ticket.attachments.length}</dd>
                <dt>Respuestas</dt><dd>{ticket.replies.length}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

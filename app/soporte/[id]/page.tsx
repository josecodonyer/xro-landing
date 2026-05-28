import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { db } from '@/lib/db';
import Topbar from '../../components/Topbar';
import MessageAvatar from '../../components/MessageAvatar';
import ReplyForm from './ReplyForm';
import styles from '../soporte.module.css';

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

async function getCharClass(userId: string): Promise<number | null> {
  const profile = await db.userProfile.findUnique({ where: { userId } });
  return profile?.avatarCharClass ?? null;
}

export default async function TicketDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await getSession();
  if (!session.accountId || !session.userid) redirect('/cuenta/login');

  const ticketId = parseInt(id, 10);
  if (isNaN(ticketId)) notFound();

  const ticket = await db.ticket.findUnique({
    where: { id: ticketId },
    include: {
      replies: { orderBy: { createdAt: 'asc' } },
      attachments: true,
    },
  });

  if (!ticket || ticket.userId !== session.userid) notFound();

  const ownerClass = await getCharClass(ticket.userId);
  const canReply = ticket.status !== 'CLOSED';

  return (
    <>
      <Topbar active="soporte" />
      <main className={styles.shell}>
        <div className={styles.containerNarrow}>
          <Link href="/soporte" className={styles.backLink}>← Mis tickets</Link>

          <div className={styles.ticketDetail}>
            <div className={styles.ticketDetailHeader}>
              <div className={styles.ticketDetailMeta}>
                <span className={`${styles.categoryBadge} ${styles[`cat${ticket.category}`]}`}>
                  {CATEGORY_LABELS[ticket.category] ?? ticket.category}
                </span>
                <span className={`${styles.statusBadge} ${styles[`st${ticket.status}`]}`}>
                  {STATUS_LABELS[ticket.status] ?? ticket.status}
                </span>
              </div>
              <h1 className={styles.ticketDetailTitle}>{ticket.title}</h1>
              <p className={styles.ticketDetailDate}>
                Abierto el {new Date(ticket.createdAt).toLocaleString('es-ES')}
              </p>
            </div>

            <div className={styles.messageCard}>
              <div className={styles.messageAuthor}>
                <MessageAvatar userId={ticket.userId} charClass={ownerClass} size={34} />
                <span className={styles.messageAuthorName}>{ticket.userId}</span>
                <span className={styles.messageDate}>
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
                      className={styles.attachmentLink}
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
                <div className={styles.messageAuthor}>
                  <MessageAvatar
                    userId={reply.userId}
                    isAdmin={reply.isAdmin}
                    charClass={reply.isAdmin ? null : ownerClass}
                    size={34}
                  />
                  <span className={styles.messageAuthorName}>
                    {reply.isAdmin ? 'Soporte' : reply.userId}
                  </span>
                  {reply.isAdmin && <span className={styles.adminBadge}>Staff</span>}
                  <span className={styles.messageDate}>
                    {new Date(reply.createdAt).toLocaleString('es-ES')}
                  </span>
                </div>
                <p className={styles.messageBody}>{reply.message}</p>
              </div>
            ))}

            {canReply && (
              <div className={styles.replySection}>
                <h3 className={styles.replySectionTitle}>Tu respuesta</h3>
                <ReplyForm ticketId={ticket.id} />
              </div>
            )}

            {ticket.status === 'CLOSED' && (
              <div className={styles.closedNotice}>
                Este ticket está cerrado.
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

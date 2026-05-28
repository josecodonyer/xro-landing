import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import MessageAvatar from '../../components/MessageAvatar';
import AdminReplyForm from './AdminReplyForm';
import RepliesList from './RepliesList';
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

async function getAvatarInfo(userId: string) {
  const p = await db.userProfile.findUnique({ where: { userId } });
  return { charClass: p?.avatarCharClass ?? null, hairColor: p?.avatarHairColor ?? null };
}

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

  const { charClass: ownerClass, hairColor: ownerHairColor } = await getAvatarInfo(ticket.userId);

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
                <MessageAvatar userId={ticket.userId} charClass={ownerClass} hairColor={ownerHairColor} size={34} />
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
                      href={att.storedAs}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src={att.storedAs}
                        alt={att.filename}
                        className={styles.attachmentThumb}
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>

            <RepliesList
              replies={ticket.replies}
              ownerClass={ownerClass}
              ownerHairColor={ownerHairColor}
            />

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
              <div className={styles.sidebarUserInfo}>
                <MessageAvatar userId={ticket.userId} charClass={ownerClass} hairColor={ownerHairColor} size={44} />
                <div>
                  <div className={styles.sidebarUserName}>{ticket.userId}</div>
                  <div className={styles.sidebarUserEmail}>{ticket.userEmail}</div>
                </div>
              </div>
            </div>

            <div className={styles.sidebarCard}>
              <h3 className={styles.sidebarTitle}>Detalles</h3>
              <dl className={styles.detailsList}>
                <dt>ID</dt><dd>#{ticket.id}</dd>
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

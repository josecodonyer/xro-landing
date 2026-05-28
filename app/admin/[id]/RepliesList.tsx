'use client';

import { useState } from 'react';
import MessageAvatar from '../../components/MessageAvatar';
import styles from '../admin.module.css';

type Reply = {
  id: number;
  userId: string;
  isAdmin: boolean;
  message: string;
  createdAt: string | Date;
};

const PER_PAGE = 8;

export default function RepliesList({
  replies,
  ownerClass,
  ownerHairColor,
}: {
  replies: Reply[];
  ownerClass: number | null;
  ownerHairColor: number | null;
}) {
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(replies.length / PER_PAGE));
  const current = Math.min(page, totalPages - 1);
  const start = current * PER_PAGE;
  const visible = replies.slice(start, start + PER_PAGE);

  return (
    <>
      {visible.map(reply => (
        <div
          key={reply.id}
          className={`${styles.messageCard} ${reply.isAdmin ? styles.messageCardAdmin : ''}`}
        >
          <div className={styles.messageHeader}>
            <MessageAvatar
              userId={reply.userId}
              isAdmin={reply.isAdmin}
              charClass={reply.isAdmin ? null : ownerClass}
              hairColor={reply.isAdmin ? null : ownerHairColor}
              size={34}
            />
            <strong>
              {reply.isAdmin ? `${reply.userId} (Staff)` : reply.userId}
            </strong>
            <span className={styles.messageTime}>
              {new Date(reply.createdAt).toLocaleString('es-ES')}
            </span>
          </div>
          <p className={styles.messageBody}>{reply.message}</p>
        </div>
      ))}

      {totalPages > 1 && (
        <nav className={styles.pagination} aria-label="Paginación de respuestas">
          <button
            type="button"
            className={styles.pageBtn}
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={current === 0}
          >
            ← Anterior
          </button>
          <div className={styles.pageNumbers}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.pageNum} ${i === current ? styles.pageNumActive : ''}`}
                onClick={() => setPage(i)}
                aria-current={i === current ? 'page' : undefined}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            type="button"
            className={styles.pageBtn}
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={current >= totalPages - 1}
          >
            Siguiente →
          </button>
        </nav>
      )}
    </>
  );
}

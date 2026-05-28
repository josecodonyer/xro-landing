'use client';

import { useTransition } from 'react';
import { updateTicketStatusAction } from '../actions';
import styles from '../admin.module.css';

const STATUSES = [
  { id: 'OPEN',        label: 'Abierto' },
  { id: 'IN_PROGRESS', label: 'En Progreso' },
  { id: 'RESOLVED',    label: 'Resuelto' },
  { id: 'CLOSED',      label: 'Cerrado' },
];

export default function StatusSelector({ ticketId, current }: { ticketId: number; current: string }) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value;
    startTransition(() => {
      updateTicketStatusAction(ticketId, newStatus);
    });
  }

  return (
    <div className={styles.statusSelectorWrap}>
      <label className={styles.statusSelectorLabel}>Estado</label>
      <select
        className={styles.statusSelector}
        value={current}
        onChange={handleChange}
        disabled={isPending}
      >
        {STATUSES.map(s => (
          <option key={s.id} value={s.id}>{s.label}</option>
        ))}
      </select>
      {isPending && <span className={styles.statusPending}>Guardando…</span>}
    </div>
  );
}

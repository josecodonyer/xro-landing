'use client';

import { useActionState, useRef } from 'react';
import { adminReplyAction } from '../actions';
import styles from '../admin.module.css';

export default function AdminReplyForm({ ticketId }: { ticketId: number }) {
  const [state, action, pending] = useActionState(adminReplyAction, null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleAction(fd: FormData) {
    await action(fd);
    formRef.current?.reset();
  }

  return (
    <form ref={formRef} action={handleAction} className={styles.replyForm}>
      <input type="hidden" name="ticketId" value={ticketId} />
      <textarea
        name="message"
        className={styles.textarea}
        placeholder="Respuesta del staff…"
        required
        minLength={2}
        rows={4}
      />
      {state?.error && <div className={styles.error}>{state.error}</div>}
      {state?.success && <div className={styles.successMsg}>Respuesta enviada.</div>}
      <button type="submit" className={styles.btnPrimary} disabled={pending}>
        {pending ? 'Enviando…' : '⚙ Responder como staff'}
      </button>
    </form>
  );
}

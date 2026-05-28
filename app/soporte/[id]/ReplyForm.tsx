'use client';

import { useActionState, useRef } from 'react';
import { addReplyAction } from '../actions';
import styles from '../soporte.module.css';

export default function ReplyForm({ ticketId }: { ticketId: number }) {
  const [state, action, pending] = useActionState(addReplyAction, null);
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
        className={`${styles.input} ${styles.textarea}`}
        placeholder="Escribe tu respuesta…"
        required
        minLength={2}
        rows={4}
      />
      {state?.error && <div className={styles.error}>{state.error}</div>}
      {state?.success && <div className={styles.success}>Respuesta enviada.</div>}
      <button type="submit" className={styles.btnPrimary} disabled={pending}>
        {pending ? 'Enviando…' : 'Responder'}
      </button>
    </form>
  );
}

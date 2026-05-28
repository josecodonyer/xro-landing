'use client';

import { useActionState, useRef } from 'react';
import { addReplyAction } from '../actions';
import { TextArea, SubmitButton, FormError, FormSuccess } from '../../components/FormControls';
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
      <TextArea
        name="message"
        placeholder="Escribe tu respuesta…"
        required
        minLength={2}
        rows={4}
      />
      <FormError>{state?.error}</FormError>
      <FormSuccess>{state?.success && 'Respuesta enviada.'}</FormSuccess>
      <SubmitButton pending={pending} pendingLabel="Enviando…">Responder</SubmitButton>
    </form>
  );
}

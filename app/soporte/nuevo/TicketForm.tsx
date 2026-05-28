'use client';

import { useActionState, useState, useEffect } from 'react';
import Script from 'next/script';
import { createTicketAction } from '../actions';
import { executeRecaptcha, RECAPTCHA_SITE_KEY } from '@/lib/recaptcha';
import { Field, TextInput, TextArea, Select, SubmitButton, FormError, CaptchaNote } from '../../components/FormControls';
import styles from '../soporte.module.css';

export default function TicketForm() {
  const [state, action, pending] = useActionState(createTicketAction, null);
  const [previews, setPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // "submitting" cubre desde el clic (incluido el tiempo del reCAPTCHA) hasta el
  // redirect o el error, para que el botón muestre carga de inmediato.
  useEffect(() => { if (state) setSubmitting(false); }, [state]);
  const busy = submitting || pending;

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setPreviews(files.map(f => URL.createObjectURL(f)));
  }

  async function handleSubmit(fd: FormData) {
    setSubmitting(true);
    const token = await executeRecaptcha('ticket');
    if (token) fd.set('captcha-token', token);
    action(fd);
  }

  return (
    <form action={handleSubmit} className={styles.form}>
      {RECAPTCHA_SITE_KEY && (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
          strategy="lazyOnload"
        />
      )}

      <Field label="Título" htmlFor="title">
        <TextInput
          id="title"
          name="title"
          type="text"
          placeholder="Describe brevemente el problema"
          required
          minLength={5}
          maxLength={120}
          autoFocus
        />
      </Field>

      <Field label="Categoría" htmlFor="category">
        <Select id="category" name="category" required>
          <option value="BUG">🐛 Bug</option>
          <option value="SUGGESTION">💡 Sugerencia</option>
          <option value="SUPPORT">🛟 Soporte</option>
        </Select>
      </Field>

      <Field label="Descripción" htmlFor="message">
        <TextArea
          id="message"
          name="message"
          placeholder="Describe el problema o sugerencia con el mayor detalle posible (mínimo 20 caracteres)"
          required
          minLength={20}
          rows={6}
        />
      </Field>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="attachments">Capturas (opcional)</label>
        <input
          id="attachments"
          name="attachments"
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          multiple
          className={styles.fileInput}
          onChange={handleFiles}
        />
        <p className={styles.fieldHint}>Máx. 3 imágenes · 5 MB cada una · JPG, PNG, GIF, WebP</p>
        {previews.length > 0 && (
          <div className={styles.imagePreviews}>
            {previews.map((url, i) => (
              <img key={i} src={url} alt={`Captura ${i + 1}`} className={styles.imagePreview} />
            ))}
          </div>
        )}
      </div>

      <FormError>{state?.error}</FormError>

      <SubmitButton pending={busy} pendingLabel="Enviando…">Abrir ticket</SubmitButton>

      <CaptchaNote>
        Protegido por reCAPTCHA. Se aplican la{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Política de privacidad</a>{' '}
        y los{' '}
        <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Términos</a>{' '}
        de Google.
      </CaptchaNote>
    </form>
  );
}

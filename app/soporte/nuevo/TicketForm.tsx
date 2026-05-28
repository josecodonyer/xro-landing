'use client';

import { useActionState, useRef, useState } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { createTicketAction } from '../actions';
import styles from '../soporte.module.css';

const SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ?? '10000000-ffff-ffff-ffff-000000000001';

export default function TicketForm() {
  const [state, action, pending] = useActionState(createTicketAction, null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const urls = files.map(f => URL.createObjectURL(f));
    setPreviews(urls);
  }

  return (
    <form
      action={(fd) => {
        if (captchaToken) fd.set('h-captcha-response', captchaToken);
        action(fd);
      }}
      className={styles.form}
    >
      <div className={styles.field}>
        <label className={styles.label} htmlFor="title">Título</label>
        <input
          id="title"
          name="title"
          type="text"
          className={styles.input}
          placeholder="Describe brevemente el problema"
          required
          minLength={5}
          maxLength={120}
          autoFocus
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="category">Categoría</label>
        <select id="category" name="category" className={styles.input} required>
          <option value="BUG">🐛 Bug</option>
          <option value="SUGGESTION">💡 Sugerencia</option>
          <option value="SUPPORT">🛟 Soporte</option>
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="message">Descripción</label>
        <textarea
          id="message"
          name="message"
          className={`${styles.input} ${styles.textarea}`}
          placeholder="Describe el problema o sugerencia con el mayor detalle posible (mínimo 20 caracteres)"
          required
          minLength={20}
          rows={6}
        />
      </div>

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

      <div className={styles.captchaWrap}>
        <HCaptcha
          ref={captchaRef}
          sitekey={SITE_KEY}
          onVerify={setCaptchaToken}
          onExpire={() => setCaptchaToken(null)}
          theme="dark"
        />
      </div>

      {state?.error && <div className={styles.error}>{state.error}</div>}

      <button type="submit" className={styles.btnPrimary} disabled={pending}>
        {pending ? 'Enviando…' : 'Abrir ticket'}
      </button>
    </form>
  );
}

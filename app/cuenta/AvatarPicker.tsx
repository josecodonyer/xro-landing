'use client';

import { useState, useTransition } from 'react';
import { selectAvatarImageAction } from './actions';
import { PRESET_AVATARS, avatarSrc } from '@/lib/preset-avatars';
import styles from './cuenta.module.css';

export default function AvatarPicker({ currentImage }: { currentImage: string | null }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(currentImage);
  const [isPending, startTransition] = useTransition();

  function handleSelect(id: string) {
    setSelected(id);
    startTransition(async () => {
      await selectAvatarImageAction(id);
      setOpen(false);
    });
  }

  const currentSrc = avatarSrc(selected);

  return (
    <>
      <button
        type="button"
        className={styles.avatarBtn}
        onClick={() => setOpen(true)}
        aria-label="Cambiar avatar"
      >
        {currentSrc ? (
          <img src={currentSrc} alt="Avatar" className={styles.avatarImg} />
        ) : (
          <div className={styles.avatarEmpty}>
            <span className={styles.avatarPlus}>+</span>
          </div>
        )}
        <span className={styles.avatarEditBadge}>✎</span>
      </button>

      {open && (
        <div className={styles.modalBackdrop} onClick={() => setOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Elige tu avatar</h2>
              <button className={styles.modalClose} onClick={() => setOpen(false)} aria-label="Cerrar">✕</button>
            </div>
            <p className={styles.modalSubtitle}>Elige una de las ilustraciones de clase.</p>

            <div className={styles.avatarGrid}>
              {PRESET_AVATARS.map(av => (
                <button
                  key={av.id}
                  type="button"
                  className={`${styles.avatarOption} ${selected === av.id ? styles.avatarOptionActive : ''}`}
                  onClick={() => handleSelect(av.id)}
                  disabled={isPending}
                  title={av.label}
                  aria-label={av.label}
                >
                  <img src={`/avatars/${av.id}.png`} alt={av.label} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { avatarSrc } from '@/lib/preset-avatars';
import styles from './Topbar.module.css';

type Me = { loggedIn: boolean; userid?: string; avatarImage?: string | null };

export default function UserAvatar() {
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    fetch('/api/me').then(r => r.json()).then(setMe).catch(() => setMe({ loggedIn: false }));
  }, []);

  if (me === null) return null;
  if (!me.loggedIn) {
    return <a href="/cuenta/registro" className="btn-header-cta">Register</a>;
  }

  const src = avatarSrc(me.avatarImage);

  return (
    <a href="/cuenta" className={styles.userAvatarBtn} aria-label="Mi cuenta">
      {src ? (
        <img
          src={src}
          alt=""
          style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover', objectPosition: 'center 8%', display: 'block', flexShrink: 0 }}
        />
      ) : (
        <div className={styles.avatarFallback} style={{ width: 28, height: 28 }}>
          <span style={{ fontSize: 11, fontWeight: 700 }}>{(me.userid ?? '?')[0].toUpperCase()}</span>
        </div>
      )}
      <span className={styles.userAvatarName}>Mi cuenta</span>
    </a>
  );
}

'use client';

import { useEffect, useState } from 'react';
import CharAvatar from './CharAvatar';
import styles from './Topbar.module.css';

type Me = {
  loggedIn: boolean;
  userid?: string;
  avatar?: {
    spriteUrl: string; hairColor: string;
    charClass: number; charSex: string; charName: string;
  } | null;
};

export default function UserAvatar() {
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    fetch('/api/me').then(r => r.json()).then(setMe).catch(() => setMe({ loggedIn: false }));
  }, []);

  // Mientras carga el estado de sesión no mostramos nada (evita parpadeo).
  if (me === null) return null;

  // Sin sesión → CTA de registro.
  if (!me.loggedIn) {
    return <a href="/cuenta/registro" className="btn-header-cta">Register</a>;
  }

  return (
    <a href="/cuenta" className={styles.userAvatarBtn} aria-label="Mi cuenta">
      <CharAvatar
        size={28}
        spriteUrl={me.avatar?.spriteUrl ?? null}
        charClass={me.avatar?.charClass ?? null}
        hairColor={me.avatar?.hairColor ?? null}
        fallback={(me.userid ?? '?')[0].toUpperCase()}
        bg="rgba(10,10,12,0.12)"
        alt="Mi cuenta"
      />
      <span className={styles.userAvatarName}>Mi cuenta</span>
    </a>
  );
}

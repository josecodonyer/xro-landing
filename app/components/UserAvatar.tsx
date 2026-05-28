'use client';

import { useEffect, useState } from 'react';
import styles from './Topbar.module.css';

type Me = {
  loggedIn: boolean;
  userid?: string;
  avatar?: { spriteUrl: string; charClass: number; charSex: string; charName: string } | null;
};

function AvatarCircle({ spriteUrl, size = 28 }: { spriteUrl: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={styles.avatarFallback} style={{ width: size, height: size }}>
        <span style={{ fontSize: size * 0.38, fontWeight: 700 }}>✦</span>
      </div>
    );
  }
  return (
    <img
      src={spriteUrl}
      alt="avatar"
      width={size}
      height={size}
      className={styles.avatarImg}
      style={{ imageRendering: 'pixelated' }}
      onError={() => setFailed(true)}
    />
  );
}

export default function UserAvatar() {
  const [me, setMe] = useState<Me | null>(null);

  useEffect(() => {
    fetch('/api/me').then(r => r.json()).then(setMe).catch(() => {});
  }, []);

  if (!me?.loggedIn) return null;

  return (
    <a href="/cuenta" className={styles.userAvatarBtn} aria-label="Mi cuenta">
      {me.avatar ? (
        <AvatarCircle spriteUrl={me.avatar.spriteUrl} size={28} />
      ) : (
        <div className={styles.avatarFallback} style={{ width: 28, height: 28 }}>
          <span style={{ fontSize: 11, fontWeight: 700 }}>
            {(me.userid ?? '?')[0].toUpperCase()}
          </span>
        </div>
      )}
      <span className={styles.userAvatarName}>{me.userid}</span>
    </a>
  );
}

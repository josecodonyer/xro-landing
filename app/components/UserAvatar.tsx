'use client';

import { useEffect, useState } from 'react';
import styles from './Topbar.module.css';

type Me = {
  loggedIn: boolean;
  userid?: string;
  avatar?: {
    spriteUrl: string; hairColor: string;
    charClass: number; charSex: string; charName: string;
  } | null;
};

function AvatarCircle({ spriteUrl, hairColor, size = 28 }: { spriteUrl: string; hairColor: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      {!failed ? (
        <img
          src={spriteUrl}
          alt="avatar"
          width={size}
          height={size}
          className={styles.avatarImg}
          style={{ imageRendering: 'pixelated' }}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className={styles.avatarFallback} style={{ width: size, height: size }}>
          <span style={{ fontSize: size * 0.38, fontWeight: 700 }}>✦</span>
        </div>
      )}
      <span style={{
        position: 'absolute', bottom: 0, right: 0,
        width: size * 0.3, height: size * 0.3,
        borderRadius: '50%', background: hairColor,
        border: '1.5px solid rgba(250,250,247,0.9)',
      }} />
    </div>
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
        <AvatarCircle spriteUrl={me.avatar.spriteUrl} hairColor={me.avatar.hairColor} size={28} />
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

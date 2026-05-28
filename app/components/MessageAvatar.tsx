'use client';

import { useState } from 'react';
import { hairColorHex } from '@/lib/avatar-shared';

const JOB_COLORS: Record<number, string> = {
  0: '#9ca3af', 1: '#ef4444', 2: '#818cf8', 3: '#4ade80', 4: '#fbbf24',
  5: '#fb923c', 6: '#a78bfa', 7: '#ef4444', 8: '#fbbf24', 9: '#818cf8',
  10: '#fb923c', 11: '#4ade80', 12: '#a78bfa', 14: '#ef4444', 15: '#fbbf24',
  4008: '#dc2626', 4009: '#d97706', 4010: '#6366f1', 4054: '#dc2626',
  4055: '#6366f1', 4056: '#16a34a', 4057: '#d97706', 4066: '#dc2626',
  4252: '#991b1b', 4253: '#9a3412', 4254: '#581c87', 4255: '#3730a3',
  4256: '#92400e', 4257: '#14532d',
};

type AvatarProps = {
  charClass?: number | null;
  hairColor?: number | null;
  isAdmin?: boolean;
  userId: string;
  size?: number;
};

export default function MessageAvatar({ charClass, hairColor, isAdmin, userId, size = 36 }: AvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);

  const jobColor = charClass ? (JOB_COLORS[charClass] ?? '#6b7280') : '#6b7280';
  const bg = isAdmin ? '#14161a' : jobColor;
  const hair = hairColor != null ? hairColorHex(hairColor) : null;
  const initial = isAdmin ? '⚙' : userId[0]?.toUpperCase() ?? '?';

  if (charClass && !imgFailed && !isAdmin) {
    return (
      <div style={{
        width: size, height: size, borderRadius: '50%',
        background: bg, overflow: 'hidden', position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <img
          src={`https://static.divine-pride.net/images/jobs/png/${charClass}.png`}
          alt={userId}
          width={size}
          height={size}
          style={{ objectFit: 'contain', imageRendering: 'pixelated' }}
          onError={() => setImgFailed(true)}
        />
        {hair && (
          <span style={{
            position: 'absolute', bottom: 1, right: 1,
            width: size * 0.24, height: size * 0.24,
            borderRadius: '50%', background: hair,
            border: '1.5px solid rgba(255,255,255,0.7)',
          }} />
        )}
      </div>
    );
  }

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
      color: '#fff', fontSize: isAdmin ? size * 0.4 : size * 0.38,
      fontWeight: 700, fontFamily: 'monospace',
    }}>
      {initial}
      {hair && !isAdmin && (
        <span style={{
          position: 'absolute', bottom: 1, right: 1,
          width: size * 0.24, height: size * 0.24,
          borderRadius: '50%', background: hair,
          border: '1.5px solid rgba(255,255,255,0.7)',
        }} />
      )}
    </div>
  );
}

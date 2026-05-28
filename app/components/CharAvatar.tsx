'use client';

import { useState } from 'react';
import { hairColorHex, jobSpriteUrl } from '@/lib/avatar-shared';

// Color de fondo del círculo según la clase del personaje.
const JOB_COLORS: Record<number, string> = {
  0: '#9ca3af', 1: '#ef4444', 2: '#818cf8', 3: '#4ade80', 4: '#fbbf24',
  5: '#fb923c', 6: '#a78bfa', 7: '#ef4444', 8: '#fbbf24', 9: '#818cf8',
  10: '#fb923c', 11: '#4ade80', 12: '#a78bfa', 14: '#ef4444', 15: '#fbbf24',
  4008: '#dc2626', 4009: '#d97706', 4010: '#6366f1', 4054: '#dc2626',
  4055: '#6366f1', 4056: '#16a34a', 4057: '#d97706', 4066: '#dc2626',
  4252: '#991b1b', 4253: '#9a3412', 4254: '#581c87', 4255: '#3730a3',
  4256: '#92400e', 4257: '#14532d',
};

export function jobColor(charClass?: number | null): string {
  return charClass != null ? (JOB_COLORS[charClass] ?? '#6b7280') : '#6b7280';
}

/**
 * Avatar circular del personaje, reutilizable en header, panel, picker y mensajes.
 * Renderiza el sprite (de `spriteUrl` o, en su defecto, el icono de clase),
 * con fallback de texto y un punto con el color de pelo.
 */
export default function CharAvatar({
  charClass = null,
  hairColor = null,
  spriteUrl,
  size = 36,
  bg,
  fallback = '✦',
  alt = 'avatar',
}: {
  charClass?: number | null;
  /** Índice de paleta (number) o color hex ya resuelto (string). */
  hairColor?: number | string | null;
  /** URL de sprite explícita; si falta, se usa el icono de la clase. */
  spriteUrl?: string | null;
  size?: number;
  /** Color de fondo del círculo (por defecto, color de la clase). */
  bg?: string;
  /** Texto a mostrar si no hay/falla la imagen. */
  fallback?: string;
  alt?: string;
}) {
  const [failed, setFailed] = useState(false);

  const src = spriteUrl ?? (charClass != null ? jobSpriteUrl(charClass) : null);
  const background = bg ?? jobColor(charClass);
  const hair = hairColor == null
    ? null
    : (typeof hairColor === 'string' ? hairColor : hairColorHex(hairColor));

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background, overflow: 'hidden', position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {src && !failed ? (
        <img
          src={src}
          alt={alt}
          width={size}
          height={size}
          style={{ objectFit: 'contain', imageRendering: 'pixelated' }}
          onError={() => setFailed(true)}
        />
      ) : (
        <span style={{ color: '#fff', fontSize: size * 0.4, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
          {fallback}
        </span>
      )}
      {hair && (
        <span style={{
          position: 'absolute', bottom: 1, right: 1,
          width: size * 0.24, height: size * 0.24,
          borderRadius: '50%', background: hair,
          border: '1.5px solid rgba(255,255,255,0.75)',
        }} />
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import styles from './CopyNavi.module.css';

export default function CopyNavi({ map, x, y, compact }: { map: string; x?: number; y?: number; compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  const cmd = x !== undefined && y !== undefined ? `/navi ${map} ${x}/${y}` : `/navi ${map}`;
  const label = compact ? null : x !== undefined && y !== undefined ? `(${x}, ${y})` : map;

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(cmd).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <button
      className={`${styles.btn} ${copied ? styles.copied : ''}`}
      onClick={handleClick}
      title={`Copiar: ${cmd}`}
    >
      {copied ? '✓' : '📋'}{label && <span className={styles.coords}>{label}</span>}
    </button>
  );
}

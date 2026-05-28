'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={shell}>
      <div style={card}>
        <span style={glyph}>✕</span>
        <h1 style={title}>Algo ha fallado</h1>
        <p style={text}>
          Ha ocurrido un error inesperado al cargar esta página. Puedes reintentar
          o volver al inicio.
        </p>
        {error.digest && <code style={digest}>ref: {error.digest}</code>}
        <div style={actions}>
          <button onClick={reset} style={btnPrimary}>Reintentar</button>
          <Link href="/" style={btnGhost}>Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}

const shell: React.CSSProperties = {
  minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: 'var(--bg)', color: 'var(--fg)', padding: 24, fontFamily: 'var(--font-sans)',
};
const card: React.CSSProperties = {
  maxWidth: 420, width: '100%', textAlign: 'center',
  background: 'var(--bg-elev-1)', border: '1px solid var(--border)', borderRadius: 'var(--r-lg, 12px)',
  padding: '40px 32px',
};
const glyph: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: 48, height: 48, borderRadius: '50%', marginBottom: 16,
  background: 'var(--crimson-500)', color: 'var(--black)', fontSize: 22, fontWeight: 700,
};
const title: React.CSSProperties = { margin: '0 0 8px', fontSize: 22, fontWeight: 600 };
const text: React.CSSProperties = { margin: '0 0 16px', color: 'var(--fg-dim)', fontSize: 15, lineHeight: 1.5 };
const digest: React.CSSProperties = {
  display: 'inline-block', marginBottom: 20, fontSize: 12, color: 'var(--fg-muted)',
  fontFamily: 'var(--font-mono)',
};
const actions: React.CSSProperties = { display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' };
const btnPrimary: React.CSSProperties = {
  padding: '10px 18px', borderRadius: 'var(--r-sm, 6px)', border: 'none', cursor: 'pointer',
  background: 'var(--accent)', color: 'var(--accent-ink)', fontWeight: 600, fontSize: 14,
};
const btnGhost: React.CSSProperties = {
  padding: '10px 18px', borderRadius: 'var(--r-sm, 6px)', cursor: 'pointer',
  border: '1px solid var(--border-strong)', color: 'var(--fg)', fontWeight: 600, fontSize: 14,
  textDecoration: 'none', display: 'inline-block',
};

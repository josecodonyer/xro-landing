import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={shell}>
      <div style={card}>
        <span style={code404}>404</span>
        <h1 style={title}>Página no encontrada</h1>
        <p style={text}>
          La página que buscas no existe o se ha movido.
        </p>
        <Link href="/" style={btnPrimary}>Volver al inicio</Link>
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
const code404: React.CSSProperties = {
  display: 'block', fontSize: 56, fontWeight: 700, color: 'var(--accent)',
  fontFamily: 'var(--font-mono)', lineHeight: 1, marginBottom: 8,
};
const title: React.CSSProperties = { margin: '0 0 8px', fontSize: 22, fontWeight: 600 };
const text: React.CSSProperties = { margin: '0 0 20px', color: 'var(--fg-dim)', fontSize: 15, lineHeight: 1.5 };
const btnPrimary: React.CSSProperties = {
  padding: '10px 18px', borderRadius: 'var(--r-sm, 6px)',
  background: 'var(--accent)', color: 'var(--accent-ink)', fontWeight: 600, fontSize: 14,
  textDecoration: 'none', display: 'inline-block',
};

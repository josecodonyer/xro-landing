'use client';

// Captura errores que ocurren en el propio root layout. Debe renderizar <html>/<body>.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="es">
      <body style={{ margin: 0 }}>
        <div style={{
          minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#1e1e22', color: '#f5f4f1', padding: 24,
          fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif', textAlign: 'center',
        }}>
          <div style={{ maxWidth: 420 }}>
            <h1 style={{ fontSize: 22, fontWeight: 600, margin: '0 0 8px' }}>Algo ha fallado</h1>
            <p style={{ color: 'rgba(245,244,241,0.65)', fontSize: 15, lineHeight: 1.5, margin: '0 0 20px' }}>
              Ha ocurrido un error inesperado. Inténtalo de nuevo.
            </p>
            {error.digest && (
              <code style={{ display: 'block', marginBottom: 20, fontSize: 12, color: 'rgba(245,244,241,0.4)' }}>
                ref: {error.digest}
              </code>
            )}
            <button onClick={reset} style={{
              padding: '10px 18px', borderRadius: 6, border: 'none', cursor: 'pointer',
              background: '#e6c574', color: '#2b1f08', fontWeight: 600, fontSize: 14,
            }}>
              Reintentar
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

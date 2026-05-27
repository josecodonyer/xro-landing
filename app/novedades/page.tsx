import type { CSSProperties } from 'react';
import styles from './novedades.module.css';
import { RELEASES, KIND_META, type EntryKind } from './releases';

const LAUNCHER_URL = 'https://pub-b154b0d855ee4f81847a01ba870dcc90.r2.dev/xro-launcher.exe';

function fmtDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

function KindIcon({ kind }: { kind: EntryKind }) {
  switch (kind) {
    case 'novedad':
      return (
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M7 1.5 L8.6 5.4 L12.5 7 L8.6 8.6 L7 12.5 L5.4 8.6 L1.5 7 L5.4 5.4 Z"
            stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      );
    case 'mejora':
      return (
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M2 9.5 L5.5 6 L8 8.5 L12 4 M12 4 H9 M12 4 V7"
            stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'calidad-de-vida':
      return (
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
          <circle cx="7" cy="7" r="5.2" stroke="currentColor" strokeWidth="1.2" />
          <path d="M4.5 7.2 L6.3 9 L9.6 5.2" stroke="currentColor" strokeWidth="1.3"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'correccion':
      return (
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
          <path d="M8.5 2.5 L11.5 5.5 L6 11 H3 V8 Z" stroke="currentColor" strokeWidth="1.2"
            strokeLinejoin="round" />
          <path d="M7.5 3.5 L10.5 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
  }
}

export default function Novedades() {
  return (
    <>
      <main className={styles.main}>
        <header className={styles.head}>
          <div className="eyebrow-line">Notas de parche · xRO Renewal</div>
          <h1 className={styles.h1}>Novedades</h1>
          <p className={styles.lede}>
            Todo lo que va cambiando en el servidor, parche a parche. Actualiza tu cliente desde el
            launcher para tener siempre la última versión.
          </p>
        </header>

        <div className={styles.timeline}>
          {RELEASES.map((rel, idx) => (
            <article key={rel.slug} id={rel.slug} className={styles.release}>
              <div className={styles.releaseMeta}>
                <span className={styles.releaseDate}>{fmtDate(rel.date)}</span>
                <span className={styles.releaseVersion}>{rel.version}</span>
                {idx === 0 && <span className={styles.releaseLatest}>Última</span>}
              </div>

              <div className={styles.releaseBody}>
                <h2 className={styles.releaseTitle}>{rel.title}</h2>
                <p className={styles.releaseSummary}>{rel.summary}</p>

                <div className={styles.entries}>
                  {rel.entries.map((entry, i) => {
                    const meta = KIND_META[entry.kind];
                    return (
                      <section
                        key={i}
                        className={styles.entry}
                        style={{ '--kind-color': meta.color } as CSSProperties}
                      >
                        <div className={styles.entryHead}>
                          <span className={styles.entryBadge}>
                            <KindIcon kind={entry.kind} />
                            {meta.label}
                          </span>
                          <h3 className={styles.entryTitle}>{entry.title}</h3>
                        </div>
                        {entry.lead && <p className={styles.entryLead}>{entry.lead}</p>}
                        <ul className={styles.entryList}>
                          {entry.bullets.map((b, j) => (
                            <li key={j}>{b}</li>
                          ))}
                        </ul>
                      </section>
                    );
                  })}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA de descarga */}
        <section className={styles.cta}>
          <div className={styles.ctaText}>
            <h2 className={styles.ctaH2}>¿Aún no estás dentro?</h2>
            <p className={styles.ctaP}>
              Descarga el launcher y el cliente se actualiza solo. En minutos estás en Prontera con
              todos estos cambios aplicados.
            </p>
          </div>
          <div className={styles.ctaActions}>
            <a href={LAUNCHER_URL} className={styles.ctaBtn}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M7 1 V 9 M3.5 6 L7 9.5 L10.5 6 M2 11 H 12 V 12.5 H 2 Z"
                  stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Descargar launcher
            </a>
            <a href="/cuenta/registro" className={styles.ctaBtnAlt}>Crear cuenta</a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-inner" style={{ justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--fg-faint)', fontSize: '13px' }}>
            Notas de parche de xRO · Renewal x10 · 4th Jobs
          </span>
          <a href="/" style={{ color: 'var(--fg-muted)', fontSize: '13px' }}>← Inicio</a>
        </div>
      </footer>
    </>
  );
}

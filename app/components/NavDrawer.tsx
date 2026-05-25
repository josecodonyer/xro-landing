'use client';

import { useState, useEffect } from 'react';
import styles from './NavDrawer.module.css';

interface NavItem { href: string; label: string; }

export default function NavDrawer({ items, cta }: { items: NavItem[]; cta: NavItem }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <button
        className={styles.hamburger}
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        aria-expanded={open}
      >
        <span /><span /><span />
      </button>

      {open && (
        <>
          <div className={styles.backdrop} onClick={() => setOpen(false)} aria-hidden="true" />
          <div className={styles.drawer} role="dialog" aria-modal={true} aria-label="Navegación">
            <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Cerrar menú">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <nav className={styles.drawerNav}>
              {items.map(item => (
                <a key={item.href} href={item.href} className={styles.drawerLink} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              ))}
            </nav>
            <a href={cta.href} className={styles.drawerCta} onClick={() => setOpen(false)}>
              {cta.label}
            </a>
          </div>
        </>
      )}
    </>
  );
}

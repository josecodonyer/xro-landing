'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './NavDrawer.module.css';
import XroLogo from './XroLogo';

interface NavItem { href: string; label: string; }

export default function NavDrawer({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    fetch('/api/me').then(r => r.json()).then(d => setLoggedIn(!!d.loggedIn)).catch(() => setLoggedIn(false));
  }, []);

  const account: NavItem = loggedIn
    ? { href: '/cuenta', label: 'Mi cuenta' }
    : { href: '/cuenta/registro', label: 'Register' };

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

      {mounted && open && createPortal(
        <>
          <div className={styles.backdrop} onClick={() => setOpen(false)} aria-hidden="true" />
          <div className={styles.drawer} role="dialog" aria-modal={true} aria-label="Navegación">
            <div className={styles.drawerHead}>
              <a href="/" className={styles.drawerLogo} onClick={() => setOpen(false)}>
                <XroLogo size={20} />
                <span className={styles.drawerLogoText}>RO</span>
              </a>
              <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Cerrar menú">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <nav className={styles.drawerNav}>
              {items.map(item => (
                <a key={item.href} href={item.href} className={styles.drawerLink} onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              ))}
            </nav>

            <div className={styles.drawerFooter}>
              <a href={account.href} className={styles.drawerCta} onClick={() => setOpen(false)}>
                {account.label}
              </a>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

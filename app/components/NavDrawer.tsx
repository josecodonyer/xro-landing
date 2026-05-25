'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './NavDrawer.module.css';

interface NavItem { href: string; label: string; }

const LOGO_SVG = (
  <svg width="20" height="20" viewBox="0 0 600 600" fill="none" aria-hidden="true">
    <g transform="matrix(1.250966,1.250966,-1.250966,1.250966,195.474028,-418.223501)">
      <path d="M272.867,300.283L143.742,300.283C143.585,300.283 143.459,300.156 143.459,300L143.459,190.579C143.459,190.423 143.585,190.296 143.742,190.296L272.867,190.296L272.867,61.171C272.867,61.015 272.993,60.888 273.149,60.888L382.571,60.888C382.727,60.888 382.853,61.015 382.853,61.171L382.853,190.296L511.978,190.296C512.135,190.296 512.261,190.423 512.261,190.579L512.261,300C512.261,300.156 512.135,300.283 511.978,300.283L382.853,300.283L382.853,429.408C382.853,429.564 382.727,429.69 382.571,429.69L273.149,429.69C272.993,429.69 272.867,429.564 272.867,429.408L272.867,300.283Z" fill="currentColor" />
    </g>
  </svg>
);

export default function NavDrawer({ items, cta }: { items: NavItem[]; cta: NavItem }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

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
                {LOGO_SVG}
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
              <a href={cta.href} className={styles.drawerCta} onClick={() => setOpen(false)}>
                {cta.label}
              </a>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

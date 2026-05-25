'use client';

import styles from './Topbar.module.css';
import WikiSearch from './WikiSearch';
import NavDrawer from './NavDrawer';
import XroLogo from './XroLogo';

type Page = 'home' | 'exp' | 'wiki' | 'account';

export default function Topbar({ active, subtitle }: { active?: Page; subtitle?: string }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <NavDrawer
          items={[
            { href: '/', label: 'Inicio' },
            { href: '/exp', label: 'EXP Scaler' },
            { href: '/wiki', label: 'Wiki' },
          ]}
          cta={{ href: '/cuenta/registro', label: 'Crear cuenta' }}
        />
        <a href="/" className={styles.brand} aria-label="xRO">
          <XroLogo size={22} />
          <span className={styles.brandRo}>RO</span>
        </a>
        {subtitle && (
          <>
            <span className="divider-v" />
            <span className="mono-sub">{subtitle}</span>
          </>
        )}
      </div>
      {active === 'wiki' && (
        <div className={styles.searchCenter}>
          <WikiSearch />
        </div>
      )}
      <nav className="topbar-right nav">
        <a href="/" className={active === 'home' ? styles.navActive : ''}>Inicio</a>
        <a href="/exp" className={active === 'exp' ? styles.navActive : ''}>EXP Scaler</a>
        <a href="/wiki" className={active === 'wiki' ? styles.navActive : ''}>Wiki</a>
        <a href="/cuenta/registro" className="btn-header-cta">Crear cuenta</a>
      </nav>
    </header>
  );
}

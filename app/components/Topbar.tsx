'use client';

import styles from './Topbar.module.css';
import WikiSearch from './WikiSearch';
import NavDrawer from './NavDrawer';

const XRO_LOGO = (
  <svg width="22" height="22" viewBox="0 0 600 600" fill="none" aria-hidden>
    <g transform="matrix(1.250966,1.250966,-1.250966,1.250966,195.474028,-418.223501)">
      <path d="M272.867,300.283L143.742,300.283C143.585,300.283 143.459,300.156 143.459,300L143.459,190.579C143.459,190.423 143.585,190.296 143.742,190.296L272.867,190.296L272.867,61.171C272.867,61.015 272.993,60.888 273.149,60.888L382.571,60.888C382.727,60.888 382.853,61.015 382.853,61.171L382.853,190.296L511.978,190.296C512.135,190.296 512.261,190.423 512.261,190.579L512.261,300C512.261,300.156 512.135,300.283 511.978,300.283L382.853,300.283L382.853,429.408C382.853,429.564 382.727,429.69 382.571,429.69L273.149,429.69C272.993,429.69 272.867,429.564 272.867,429.408L272.867,300.283Z" fill="currentColor"/>
    </g>
  </svg>
);

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
          {XRO_LOGO}
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

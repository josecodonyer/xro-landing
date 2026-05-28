'use client';

import styles from './Topbar.module.css';
import WikiSearch from './WikiSearch';
import NavDrawer from './NavDrawer';
import XroLogo from './XroLogo';
import UserAvatar from './UserAvatar';

type Page = 'home' | 'exp' | 'wiki' | 'novedades' | 'soporte';

export interface NavItem { href: string; label: string; }

const DEFAULT_ITEMS: NavItem[] = [
  { href: '/', label: 'Inicio' },
  { href: '/novedades', label: 'Novedades' },
  { href: '/exp', label: 'EXP Scaler' },
  { href: '/wiki', label: 'Wiki' },
  { href: '/soporte', label: 'Soporte' },
];

export default function Topbar({
  active,
  subtitle,
  items = DEFAULT_ITEMS,
  statusPill,
  cta,
}: {
  active?: Page;
  subtitle?: string;
  /** Enlaces de navegación (desktop + drawer). Por defecto, las páginas internas. */
  items?: NavItem[];
  /** Pill de estado del servidor (solo la home lo pasa). */
  statusPill?: React.ReactNode;
  /** CTA adicional antes del avatar (p. ej. "▶ Descargar" en la home). */
  cta?: NavItem;
}) {
  const activeHref = active === 'home' ? '/' : active ? `/${active}` : null;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <NavDrawer items={items} />
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
        {statusPill}
      </div>
      {active === 'wiki' && (
        <div className={styles.searchCenter}>
          <WikiSearch />
        </div>
      )}
      <nav className="topbar-right nav">
        {items.map(item => (
          <a
            key={item.href}
            href={item.href}
            className={item.href === activeHref ? styles.navActive : ''}
          >
            {item.label}
          </a>
        ))}
        {cta && <a href={cta.href} className="btn-header-cta">{cta.label}</a>}
        <UserAvatar />
      </nav>
    </header>
  );
}

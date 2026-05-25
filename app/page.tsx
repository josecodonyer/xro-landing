'use client';

import { useServerStatus } from './components/ServerStatus';
import NavDrawer from './components/NavDrawer';
import XroLogo from './components/XroLogo';
import styles from "./landing.module.css";

const LAUNCHER_URL = 'https://pub-b154b0d855ee4f81847a01ba870dcc90.r2.dev/xro-launcher.exe';

function DownloadSvg() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M7 1 V 9 M3.5 6 L7 9.5 L10.5 6 M2 11 H 12 V 12.5 H 2 Z"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DownloadBlock() {
  return (
    <div className={styles.downloadBlock}>
      <a href={LAUNCHER_URL} className={styles.downloadMain}>
        <DownloadSvg />
        Descargar launcher
      </a>
      <a href="/cuenta/registro" className={styles.downloadAlt}>Crear cuenta</a>
    </div>
  );
}

export default function Home() {
  const status = useServerStatus();

  return (
    <>
      {/* ── Top bar flotante ── */}
      <header className="topbar">
        <div className="topbar-left">
          <NavDrawer
            items={[
              { href: '#rates', label: 'Rates' },
              { href: '#features', label: 'Servidor' },
              { href: '/exp', label: 'EXP Scaler' },
              { href: '/wiki', label: 'Wiki' },
            ]}
            cta={{ href: '#descargar', label: '▶ Descargar' }}
          />
          <a href="/" className={styles.brandLogo} aria-label="xRO">
            <XroLogo size={22} />
            <span className={styles.brandRo}>RO</span>
          </a>
          <span className="divider-v" />
          <span className="mono-sub">Renewal · x10 · 4th Jobs</span>
          <span className="status-pill">
            <span className="dot" />
            <span className="strong">{status.online ? 'Online' : 'Offline'}</span>
            {status.players !== null && (
              <>
                <span className="sep">·</span>
                <span>{status.players} jugadores</span>
              </>
            )}
          </span>
        </div>
        <nav className="topbar-right nav">
          <a href="#rates">Rates</a>
          <a href="#features">Servidor</a>
          <a href="/exp">EXP Scaler</a>
          <a href="/wiki">Wiki</a>
          <a href="#descargar" className="btn-header-cta">▶ Descargar</a>
        </nav>
      </header>

      {/* ── HERO — full viewport, vídeo de fondo ── */}
      <section className={styles.heroFull}>
        <video
          className={styles.heroBgVideo}
          autoPlay muted loop playsInline
        >
          <source src="/video/hero-bg.mp4" type="video/mp4" />
        </video>

        <div className={styles.heroOverlay} aria-hidden />

        <div className={styles.heroContent}>
          <div className="eyebrow-line">Renewal x10 · 4th Jobs · EU</div>
          <h1 className={styles.heroH1}>
            Ragnarok Online<br /><em>Renewal fresh</em>.
          </h1>
          <p className={styles.heroLede}>
            Renewal x10. 4th jobs. Sin pay-to-win.
          </p>
          <div className={styles.heroActions}>
            <DownloadBlock />
          </div>
        </div>

        {/* KPI bar — bottom right */}
        <div className={styles.heroKpisBar}>
          <div className={styles.heroKpiItem}>
            <span className={styles.kpiK}>Estado</span>
            <span className={styles.kpiV}>
              <span className={styles.kpiDot} />
              {status.online ? 'Online' : 'Offline'}
            </span>
          </div>
          <span className={styles.heroKpiSep} />
          <div className={styles.heroKpiItem}>
            <span className={styles.kpiK}>Jugadores</span>
            <span className={styles.kpiV}>{status.players ?? '—'}</span>
          </div>
          <span className={styles.heroKpiSep} />
          <div className={styles.heroKpiItem}>
            <span className={styles.kpiK}>Episodio</span>
            <span className={styles.kpiV}>4th Jobs</span>
          </div>
          <span className={styles.heroKpiSep} />
          <div className={styles.heroKpiItem}>
            <span className={styles.kpiK}>Región</span>
            <span className={styles.kpiV}>EU</span>
          </div>
        </div>
      </section>

      {/* ── Secciones dentro del shell ── */}
      <main className={styles.shell}>

        {/* ── RATES ── */}
        <section className={styles.ratesRow} id="rates">
          <div className={styles.ratesHead}>
            <div>
              <span className={styles.ratesLabel}>Rates oficiales</span>
            </div>
            <h2 className={styles.ratesH2}>
              Cinco números. <em>Cero sorpresas.</em>
            </h2>
          </div>
          <div className={styles.ratesDisplay}>
            <div className={`${styles.rateTile} ${styles.rateTileFirst}`}>
              <div className={styles.rateTileTop}><span>Experiencia</span><span className={styles.rateTileOrd}>01</span></div>
              <div className={styles.rateBig}><span className={styles.rateX}>×</span>10</div>
              <p className={styles.rateDesc}>Base &amp; Job, igual para todas las clases.</p>
            </div>
            <div className={styles.rateTile}>
              <div className={styles.rateTileTop}><span>Items</span><span className={styles.rateTileOrd}>02</span></div>
              <div className={styles.rateBig}><span className={styles.rateX}>×</span>8</div>
              <p className={styles.rateDesc}>Loot común y consumibles.</p>
            </div>
            <div className={styles.rateTile}>
              <div className={styles.rateTileTop}><span>Equipo</span><span className={styles.rateTileOrd}>03</span></div>
              <div className={styles.rateBig}><span className={styles.rateX}>×</span>2</div>
              <p className={styles.rateDesc}>Armas y armaduras de mob.</p>
            </div>
            <div className={styles.rateTile}>
              <div className={styles.rateTileTop}><span>Cartas</span><span className={styles.rateTileOrd}>04</span></div>
              <div className={styles.rateBig}><span className={styles.rateX}>×</span>2</div>
              <p className={styles.rateDesc}>Drop universal de cards.</p>
            </div>
            <div className={styles.rateTile}>
              <div className={styles.rateTileTop}><span>MVP</span><span className={styles.rateTileOrd}>05</span></div>
              <div className={styles.rateBig}><span className={styles.rateX}>×</span>1</div>
              <p className={styles.rateDesc}>Cards de MVP sin modificar.</p>
            </div>
          </div>
        </section>

      </main>

      {/* ── FEATURE BANNERS — full width ── */}
      <section className={styles.bannerSection} id="features">
        <div className={styles.banner}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className={styles.bannerImg}>
            <img src="/art/illust-adventurers.jpg" alt="Aventureros en Ragnarok Online" />
          </div>
          <div className={styles.bannerBody}>
            <div className="eyebrow-line">El servidor</div>
            <h3 className={styles.bannerH3}>Renewal cuidado, <em>sin pay-to-win</em>.</h3>
            <ul className={styles.bannerList}>
              <li><strong>4th Jobs</strong> disponibles. Todas las clases hasta la cuarta promoción.</li>
              <li>La tienda de cash solo vende cosméticos. Sin ventajas de pago.</li>
              <li>Cliente kRO actualizado — Ragexe 2025-07-16. Sin modificaciones de gameplay.</li>
            </ul>
          </div>
        </div>
        <div className={`${styles.banner} ${styles.bannerFlip}`}>
          <div className={styles.bannerBody}>
            <div className="eyebrow-line">Contenido</div>
            <h3 className={styles.bannerH3}>WoE · instancias · <em>eventos cada semana</em>.</h3>
            <ul className={styles.bannerList}>
              <li>War of Emperium FE + TE con horario fijo. Castillos activos cada semana.</li>
              <li>Instancias: Endless Tower, Nydhogg&apos;s Nest, Orc&apos;s Memory, Sealed Shrine.</li>
              <li>Eventos rotativos: Devil Square, MVP Ladder, Disguise Event.</li>
            </ul>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className={styles.bannerImg}>
            <img src="/art/illust-pecopeco.webp" alt="Monturas Pecopeco en Ragnarok Online" />
          </div>
        </div>
      </section>

      {/* ── DISCORD — full width ── */}
      <section className={styles.discordFull} id="discord">
        <div className={styles.discordInner}>
          <div className={styles.discordMark}>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M19.6 4.4A18 18 0 0 0 15 3l-.2.4a16 16 0 0 0-5.6 0L9 3a18 18 0 0 0-4.6 1.4C1.7 8.5 1 12.5 1.3 16.4a18 18 0 0 0 5.5 2.8l1.1-1.6a12 12 0 0 1-1.8-.9l.4-.3a12.8 12.8 0 0 0 11 0l.4.3a12 12 0 0 1-1.8.9l1.1 1.6a18 18 0 0 0 5.5-2.8c.4-4.5-.6-8.5-3-12zM8.5 14c-1 0-1.8-1-1.8-2s.8-2 1.8-2 1.8 1 1.8 2-.8 2-1.8 2zm7 0c-1 0-1.8-1-1.8-2s.8-2 1.8-2 1.8 1 1.8 2-.8 2-1.8 2z" />
            </svg>
          </div>
          <div className={styles.discordBody}>
            <h3 className={styles.discordH3}>Únete a <em>nuestra comunidad</em>.</h3>
            <p className={styles.discordP}>Soporte, party-finder, anuncios de parche y comunidad en español — todo en un solo servidor de Discord.</p>
          </div>
          <div className={styles.discordActions}>
            <a href="https://discord.gg/xro" className={styles.btnDiscord}>
              Entrar a Discord
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M3 7 H11 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA — imagen de fondo full width ── */}
      <section className={styles.bottomCta} id="descargar">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.bottomCtaImg} src="/art/illust-landscape.png" alt="" aria-hidden />
        <div className={styles.bottomCtaOverlay} aria-hidden />
        <div className={styles.bottomCtaContent}>
          <h2 className={styles.bottomCtaH2}>Empieza hoy. <em>En diez minutos estás en Prontera.</em></h2>
          <div className={styles.bottomCtaActions}>
            <p className={styles.bottomCtaP}>
              Descarga el launcher, crea tu cuenta y en minutos estás jugando. El cliente se actualiza solo.
            </p>
            <DownloadBlock />
            <span className="mono-sub">
              Windows 10 / 11 · Cliente 2025-07-16 · SHA256 verificado
            </span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <a href="/" className={styles.footerBrand} aria-label="xRO">
              <XroLogo size={22} />
              <span className={styles.footerBrandRo}>RO</span>
            </a>
            <p style={{ color: "var(--fg-faint)", fontSize: "14px", lineHeight: "1.7", marginTop: "16px", maxWidth: "320px" }}>
              Servidor privado de Ragnarok Online para la comunidad hispana.
              Sin afiliación oficial con Gravity Co., Ltd.
            </p>
          </div>
          <div>
            <h5>Juego</h5>
            <ul>
              <li><a href="#descargar">Descargar launcher</a></li>
              <li><a href="/cuenta#registro">Crear cuenta</a></li>
              <li><a href="#rates">Rates &amp; servidor</a></li>
            </ul>
          </div>
          <div>
            <h5>Cuenta</h5>
            <ul>
              <li><a href="/cuenta#login">Iniciar sesión</a></li>
              <li><a href="/cuenta">Mi panel</a></li>
              <li><a href="/cuenta#personajes">Mis personajes</a></li>
            </ul>
          </div>
          <div>
            <h5>Comunidad</h5>
            <ul>
              <li><a href="https://discord.gg/xro">Discord</a></li>
              <li><a href="#">Wiki</a></li>
              <li><a href="#">Reportar bug</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 xRO · Hecho por jugadores, para jugadores.</span>
          <span className="mono-sub">Renewal x10 · 4th Jobs · Cliente 2025-07-16</span>
        </div>
      </footer>
    </>
  );
}

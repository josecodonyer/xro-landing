import type { Metadata } from 'next';
import Link from 'next/link';
import mobFullRaw from '../../../../public/mob_full.json';
import mobFull2Raw from '../../../../public/mob_full2.json';
import mobDetailRaw from '../../../../public/mob_detail.json';
import Topbar from '../../../components/Topbar';
import SafeImg from '../../../components/SafeImg';
import CopyNavi from '../../../components/CopyNavi';
import styles from './mob.module.css';

type MobLite = { Id: number; AegisName: string; Name: string; Level: number; Element: string; ElementLevel: number };
type MobFull = {
  id: number; aegis: string; name: string; level: number; hp: number;
  baseExp: number; jobExp: number; attack: number; attack2: number;
  defense: number; magicDefense: number;
  str: number; agi: number; vit: number; int: number; dex: number; luk: number;
  attackRange: number; size: string; race: string;
  element: string; elementLevel: number;
  walkSpeed: number; attackDelay: number;
  modes: string[];
};
type AttrFix = Record<string, Record<string, Record<string, number>>>;
type Drop = { id: number; aegis: string; name: string; type: string; rate: number; basePct: number; pct: number };
type SpawnMap = { map: string; count: number };
type MobDetail = { drops: Drop[]; maps: SpawnMap[] };

const mobLiteList = mobFullRaw as unknown as MobLite[];
const mob2Data    = mobFull2Raw as unknown as { attr_fix: AttrFix; mobs: Record<string, MobFull> };
const mobDetail   = mobDetailRaw as unknown as Record<string, MobDetail>;

const ELEMENTS = ['Neutral','Water','Earth','Fire','Wind','Poison','Holy','Dark','Ghost','Undead'] as const;
const ELEMENT_COLORS: Record<string, string> = {
  Water:'#7aa7ff', Fire:'#f37b6a', Wind:'#9ce8c1', Earth:'#e6c574',
  Holy:'#f6e0a8', Dark:'#a78bfa', Ghost:'#cbd5e1', Undead:'#94a3b8',
  Neutral:'#8b8b9a', Poison:'#86efac',
};
const RATE_COLOR = (pct: number) =>
  pct >= 50 ? 'var(--jade-400)' : pct >= 5 ? 'var(--amber-400)' : 'var(--fg-muted)';

export async function generateStaticParams() {
  return mobLiteList.map(m => ({ id: String(m.Id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const mob = mob2Data.mobs[id];
  if (!mob) return { title: 'Monster Not Found — xRO Wiki' };
  return {
    title: `${mob.name} — xRO Wiki`,
    description: `Stats, drops, debilidades y spawn de ${mob.name} (ID ${mob.id}) en xRO.`,
  };
}

function formatMapName(raw: string) {
  return raw.split(',')[0].replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}
function groupMaps(maps: SpawnMap[]) {
  const acc: Record<string, number> = {};
  for (const { map, count } of maps) {
    const key = map.split(',')[0];
    acc[key] = (acc[key] ?? 0) + count;
  }
  return Object.entries(acc).map(([map, count]) => ({ map, count })).sort((a, b) => b.count - a.count);
}

function getElemPct(attrFix: AttrFix, level: number, attacker: string, defender: string): number {
  return attrFix[String(level)]?.[attacker]?.[defender] ?? 100;
}

function elemPctColor(pct: number): string {
  if (pct === 0)   return '#4b5563';
  if (pct >= 175)  return '#ef4444';
  if (pct >= 125)  return '#f97316';
  if (pct >= 100)  return '#d1d5db';
  if (pct >= 75)   return '#60a5fa';
  return '#3b82f6';
}

function formatMode(mode: string): string {
  const map: Record<string, string> = {
    CanMove: 'Se mueve', CanAttack: 'Ataca', Aggressive: 'Agresivo',
    Assist: 'Asiste aliados', CastSensorIdle: 'Detecta magia',
    CastSensorChase: 'Persigue por magia', Looter: 'Saquea items',
    Detector: 'Detecta ocultos', ChangeChase: 'Cambia objetivo',
    ChangeTargetMelee: 'Cambia objetivo cuerpo a cuerpo',
    ChangeTargetChase: 'Cambia objetivo en persecución',
    TargetWeak: 'Ataca al más débil', NoRandomWalk: 'Sin paseo aleatorio',
    NoCast: 'No usa skills', Plant: 'Planta (1 de daño)',
    Boss: 'Boss', Mvp: 'MVP',
  };
  return map[mode] ?? mode;
}

export default async function MobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const mob = mob2Data.mobs[id];

  if (!mob) {
    return (
      <div className={styles.notFound}>
        <p>Monster #{id} no encontrado.</p>
        <Link href="/wiki">← Volver a la wiki</Link>
      </div>
    );
  }

  const detail    = mobDetail[id];
  const drops     = detail?.drops ?? [];
  const maps      = groupMaps(detail?.maps ?? []);
  const spriteUrl = `https://static.divine-pride.net/images/mobs/png/${mob.id}.png`;
  const elemColor = ELEMENT_COLORS[mob.element] ?? 'var(--fg-muted)';
  const attrFix   = mob2Data.attr_fix;

  // ASPD: lower attackDelay = faster. Show as attacks/min
  const attacksPerMin = mob.attackDelay > 0 ? Math.round(60000 / mob.attackDelay * 10) / 10 : 0;

  return (
    <>
      <Topbar active="wiki" subtitle="Wiki" />

      <main className={styles.main}>
        <nav className={styles.breadcrumb}>
          <Link href="/">Inicio</Link><span>/</span>
          <Link href="/wiki">Wiki</Link><span>/</span>
          <Link href="/wiki?tab=mobs">Monsters</Link><span>/</span>
          <span>{mob.name}</span>
        </nav>

        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroSprite}>
            <SafeImg src={spriteUrl} alt={mob.name} width={120} height={120} />
            <Link href={`/exp?search=${encodeURIComponent(mob.name)}`} className={styles.spriteExpLink}>
              EXP Scaler ↗
            </Link>
          </div>
          <div className={styles.heroInfo}>
            <div className={styles.heroMeta}>
              <span className={styles.heroId}>#{mob.id}</span>
              <span className={styles.heroAegis}>{mob.aegis}</span>
            </div>
            <h1 className={styles.heroName}>{mob.name}</h1>
            <div className={styles.heroBadges}>
              <span className={styles.badge} style={{ color: elemColor, borderColor: elemColor + '44' }}>
                {mob.element} {mob.elementLevel}
              </span>
              <span className={styles.badge}>{mob.race}</span>
              <span className={styles.badge}>{mob.size}</span>
              <span className={styles.badge}>Lv {mob.level}</span>
              {mob.modes.includes('Aggressive') && <span className={styles.badgeRed}>Agresivo</span>}
              {mob.modes.includes('Boss') && <span className={styles.badgeAmber}>Boss</span>}
              {mob.modes.includes('Mvp') && <span className={styles.badgeAmber}>MVP</span>}
            </div>
          </div>
          <div className={styles.heroExp}>
            <div className={styles.expItem}>
              <span className={styles.expLabel}>Base EXP</span>
              <span className={styles.expValue} style={{ color: 'var(--cobalt-500)' }}>
                {(mob.baseExp * 10).toLocaleString()}
              </span>
              <span className={styles.expBase}>{mob.baseExp.toLocaleString()} base</span>
            </div>
            <div className={styles.expItem}>
              <span className={styles.expLabel}>Job EXP</span>
              <span className={styles.expValue} style={{ color: 'var(--jade-500)' }}>
                {(mob.jobExp * 10).toLocaleString()}
              </span>
              <span className={styles.expBase}>{mob.jobExp.toLocaleString()} base</span>
            </div>
          </div>
        </section>

        {/* Stats + Drops row */}
        <div className={styles.grid}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Stats</h2>
            <div className={styles.statGrid}>
              {[
                { label: 'HP',    val: mob.hp.toLocaleString(),   fill: Math.min(mob.hp / 500000 * 100, 100), color: 'var(--crimson-500)' },
                { label: 'ATK',   val: `${mob.attack}–${mob.attack2}`, fill: Math.min(mob.attack2 / 5000 * 100, 100), color: 'var(--amber-400)' },
                { label: 'DEF',   val: String(mob.defense),  fill: Math.min(mob.defense / 100 * 100, 100), color: 'var(--cobalt-500)' },
                { label: 'MDEF',  val: String(mob.magicDefense), fill: Math.min(mob.magicDefense / 100 * 100, 100), color: 'var(--cobalt-500)' },
              ].map(({ label, val, fill, color }) => (
                <div key={label} className={styles.statRow}>
                  <span className={styles.statLabel}>{label}</span>
                  <span className={styles.statBar}><span className={styles.statFill} style={{ width: `${fill}%`, background: color }} /></span>
                  <span className={styles.statVal}>{val}</span>
                </div>
              ))}
            </div>
            <div className={styles.attrGrid}>
              {(['str','agi','vit','int','dex','luk'] as const).map(attr => (
                <div key={attr} className={styles.attrItem}>
                  <span className={styles.attrLabel}>{attr.toUpperCase()}</span>
                  <span className={styles.attrVal}>{mob[attr]}</span>
                </div>
              ))}
            </div>
            <div className={styles.miscGrid}>
              <div className={styles.miscItem}>
                <span className={styles.miscLabel}>Rango ataque</span>
                <span className={styles.miscVal}>{mob.attackRange}</span>
              </div>
              <div className={styles.miscItem}>
                <span className={styles.miscLabel}>Vel. movimiento</span>
                <span className={styles.miscVal}>{mob.walkSpeed}</span>
              </div>
              <div className={styles.miscItem}>
                <span className={styles.miscLabel}>ASPD</span>
                <span className={styles.miscVal}>{attacksPerMin}/min</span>
              </div>
            </div>
            {mob.modes.length > 0 && (
              <div className={styles.modesWrap}>
                <span className={styles.modesLabel}>Comportamiento</span>
                <div className={styles.modesList}>
                  {mob.modes.map(mode => (
                    <span key={mode} className={styles.modeChip}>{formatMode(mode)}</span>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Drops */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>
              Drops
              <span className={styles.cardHint}>rate ×server</span>
            </h2>
            {drops.length === 0 ? (
              <p className={styles.empty}>Sin drops registrados.</p>
            ) : (
              <ul className={styles.dropList}>
                {drops.map((drop, i) => (
                  <li key={`${drop.id}-${i}`} className={styles.dropItem}>
                    <div className={styles.dropIcon}>
                      <SafeImg src={`https://static.divine-pride.net/images/items/item/${drop.id}.png`} alt={drop.name} width={24} height={24} />
                    </div>
                    <Link href={`/wiki/item/${drop.id}`} className={styles.dropName}>{drop.name}</Link>
                    <span className={styles.dropType}>{drop.type}</span>
                    <div className={styles.dropRates}>
                      <span style={{ color: RATE_COLOR(drop.pct), fontWeight: 700, fontSize: '13px' }}>
                        {drop.pct >= 100 ? '100%' : drop.pct.toFixed(2) + '%'}
                      </span>
                      {drop.pct !== drop.basePct && (
                        <span className={styles.dropBase}>{drop.basePct.toFixed(2)}%</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Elemental weaknesses */}
        <section className={styles.card} style={{ marginTop: '8px' }}>
          <h2 className={styles.cardTitle}>
            Debilidades elementales
            <span className={styles.cardHint}>daño recibido por elemento del atacante</span>
          </h2>
          <div className={styles.elemGrid}>
            {ELEMENTS.map(attacker => {
              const pct = getElemPct(attrFix, mob.elementLevel, attacker, mob.element);
              return (
                <div key={attacker} className={styles.elemCell} style={{ borderColor: pct > 100 ? '#ef444433' : pct < 100 ? '#3b82f633' : 'var(--border)' }}>
                  <span className={styles.elemName} style={{ color: ELEMENT_COLORS[attacker] ?? 'var(--fg-muted)' }}>{attacker}</span>
                  <span className={styles.elemPct} style={{ color: elemPctColor(pct) }}>
                    {pct === 0 ? 'Inmune' : `${pct}%`}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Spawn maps */}
        <section className={styles.card} style={{ marginTop: '8px' }}>
          <h2 className={styles.cardTitle}>
            Mapas de Spawn
            <span className={styles.cardHint}>{maps.reduce((s, m) => s + m.count, 0)} mobs en total</span>
          </h2>
          {maps.length === 0 ? (
            <p className={styles.empty}>Sin spawns registrados.</p>
          ) : (
            <div className={styles.mapGrid}>
              {maps.map(({ map, count }) => (
                <div key={map} className={styles.mapCard}>
                  <Link href={`/wiki/map/${map}`} className={styles.mapCardLink}>
                    <SafeImg
                      src={`https://www.divine-pride.net/img/map/original/${map}`}
                      alt={map} width={80} height={80} className={styles.mapThumb}
                    />
                    <div className={styles.mapCardInfo}>
                      <span className={styles.mapName}>{formatMapName(map)}</span>
                      <span className={styles.mapCount}>×{count}</span>
                    </div>
                  </Link>
                  <CopyNavi map={map} compact />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}

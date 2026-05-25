import type { Metadata } from 'next';
import Link from 'next/link';
import mapIndexRaw from '../../../../public/map_index.json';
import npcSpritesRaw from '../../../../public/npc_sprites.json';
import SafeImg from '../../../components/SafeImg';
import CopyNavi from '../../../components/CopyNavi';
import styles from './map.module.css';

type MobEntry  = { id: number; name: string; level: number; element: string; elementLevel: number; count: number };
type NpcEntry  = { name: string; x: number; y: number };
type MapData   = { mobs: MobEntry[]; npcs: NpcEntry[] };
type NpcSprite = { id: number; url: string };

const mapIndex   = mapIndexRaw   as unknown as Record<string, MapData>;
const npcSprites = npcSpritesRaw as unknown as Record<string, NpcSprite>;

export async function generateStaticParams() {
  return Object.keys(mapIndex).map(name => ({ name }));
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;
  return { title: `${formatMapName(name)} — xRO Wiki`, description: `Mobs, NPCs y spawns en ${name}.` };
}

function formatMapName(raw: string) {
  return raw.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

const ELEMENT_COLORS: Record<string, string> = {
  Water:'#7aa7ff', Fire:'#f37b6a', Wind:'#9ce8c1', Earth:'#e6c574',
  Holy:'#f6e0a8', Dark:'#a78bfa', Ghost:'#cbd5e1', Undead:'#94a3b8',
  Neutral:'#8b8b9a', Poison:'#86efac',
};

export default async function MapPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const data = mapIndex[name];

  if (!data) {
    return (
      <div className={styles.notFound}>
        <p>Mapa &ldquo;{name}&rdquo; no encontrado.</p>
        <Link href="/wiki">← Volver a la wiki</Link>
      </div>
    );
  }

  const totalMobs = data.mobs.reduce((s, m) => s + m.count, 0);
  const minimapUrl = `https://www.divine-pride.net/img/map/original/${name}`;

  return (
    <main className={styles.main}>
        <nav className={styles.breadcrumb}>
          <Link href="/">Inicio</Link><span>/</span>
          <Link href="/wiki">Wiki</Link><span>/</span>
          <Link href="/wiki?tab=maps">Mapas</Link><span>/</span>
          <span>{formatMapName(name)}</span>
        </nav>

        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroMap}>
            <SafeImg src={minimapUrl} alt={name} width={200} height={200} className={styles.minimap} />
          </div>
          <div className={styles.heroInfo}>
            <div className={styles.heroMeta}>
              <span className={styles.heroId}>{name}</span>
              <CopyNavi map={name} />
            </div>
            <h1 className={styles.heroName}>{formatMapName(name)}</h1>
            <div className={styles.heroBadges}>
              <span className={styles.badge}>{data.mobs.length} tipos de mob</span>
              <span className={styles.badge}>{totalMobs} spawns totales</span>
              {data.npcs.length > 0 && <span className={styles.badge}>{data.npcs.length} NPCs</span>}
            </div>
          </div>
        </section>

        <div className={styles.grid}>
          {/* Mobs */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>
              Monstruos
              <span className={styles.cardHint}>{totalMobs} spawns</span>
            </h2>
            {data.mobs.length === 0 ? (
              <p className={styles.empty}>No hay monstruos registrados.</p>
            ) : (
              <ul className={styles.mobList}>
                {data.mobs.map(mob => (
                  <li key={mob.id}>
                    <Link href={`/wiki/mob/${mob.id}`} className={styles.mobRow}>
                      <SafeImg
                        src={`https://static.divine-pride.net/images/mobs/png/${mob.id}.png`}
                        alt={mob.name} width={36} height={36} className={styles.mobSprite}
                      />
                      <span className={styles.mobName}>{mob.name}</span>
                      <span className={styles.mobLv}>Lv {mob.level}</span>
                      <span className={styles.mobElem} style={{ color: ELEMENT_COLORS[mob.element] ?? 'var(--fg-faint)' }}>
                        {mob.element}
                      </span>
                      <span className={styles.mobCount}>×{mob.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* NPCs */}
          <section className={styles.card}>
            <h2 className={styles.cardTitle}>
              NPCs
              <span className={styles.cardHint}>{data.npcs.length} en este mapa</span>
            </h2>
            {data.npcs.length === 0 ? (
              <p className={styles.empty}>No hay NPCs registrados.</p>
            ) : (
              <ul className={styles.npcList}>
                {data.npcs.map((npc, i) => (
                  <li key={i} className={styles.npcRow}>
                    <div className={styles.npcIcon}>
                      {npcSprites[npc.name] ? (
                        <SafeImg
                          src={npcSprites[npc.name].url}
                          alt={npc.name}
                          width={28} height={28}
                          className={styles.npcSprite}
                        />
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3"/>
                          <path d="M2.5 14c0-3.038 2.462-5.5 5.5-5.5s5.5 2.462 5.5 5.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                        </svg>
                      )}
                    </div>
                    <div className={styles.npcInfo}>
                      <Link href={`/wiki/npc/${encodeURIComponent(npc.name)}`} className={styles.npcName}>
                        {npc.name}
                      </Link>
                      <CopyNavi map={name} x={npc.x} y={npc.y} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>
  );
}

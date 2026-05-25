import type { Metadata } from 'next';
import Link from 'next/link';
import wikiRaw from '../../../../public/wiki_data.json';
import mobFullRaw from '../../../../public/mob_full.json';
import mobDetailRaw from '../../../../public/mob_detail.json';
import SafeImg from '../../../components/SafeImg';
import CopyNavi from '../../../components/CopyNavi';
import { fetchDPItem, formatLocation, formatJobs } from '../../../../lib/divine-pride';
import styles from './item.module.css';

type ItemData = { id: number; aegis: string; name: string; type: string; subtype: string; weight: number; buy: number; sell: number; slots: number };
type ShopEntry = { npc: string; map: string; x: number; y: number; price: number };
type Mob = { Id: number; Name: string; AegisName: string; Level: number; Element: string; ElementLevel: number };
type Drop = { id: number; name: string; basePct: number; pct: number };
type MobDetail = { drops: Drop[] };

const wikiData  = wikiRaw     as unknown as { items: Record<string, ItemData>; shops: Record<string, ShopEntry[]> };
const mobFull   = mobFullRaw  as unknown as Mob[];
const mobDetail = mobDetailRaw as unknown as Record<string, MobDetail>;

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = wikiData.items[id];
  if (!item) return { title: 'Item Not Found — xRO Wiki' };
  return {
    title: `${item.name} — xRO Wiki`,
    description: `${item.name} (ID ${item.id}) en xRO — descripción, stats, drops y NPCs.`,
  };
}

function formatMapName(raw: string): string {
  return raw.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

const RATE_COLOR = (pct: number) =>
  pct >= 50 ? 'var(--jade-400)' : pct >= 5 ? 'var(--amber-400)' : 'var(--fg-muted)';

const WPN_LEVEL_LABEL: Record<number, string> = { 1: 'I', 2: 'II', 3: 'III', 4: 'IV', 5: 'V' };

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = wikiData.items[id];

  if (!item) {
    return (
      <div className={styles.notFound}>
        <p>Item #{id} no encontrado.</p>
        <Link href="/wiki">← Volver a la wiki</Link>
      </div>
    );
  }

  const shops: ShopEntry[] = wikiData.shops[id] ?? [];

  const droppedBy = mobFull
    .filter(mob => mobDetail[String(mob.Id)]?.drops.some(drop => drop.id === item.id))
    .map(mob => {
      const drop = mobDetail[String(mob.Id)]!.drops.find(d => d.id === item.id)!;
      return { mob, basePct: drop.basePct, pct: drop.pct };
    })
    .sort((a, b) => b.pct - a.pct);

  // Fetch rich data from divine-pride (cached 24h; null when API unavailable)
  const dp = await fetchDPItem(id);

  const iconUrl = `https://static.divine-pride.net/images/items/item/${item.id}.png`;

  const isEquip = ['Weapon', 'Armor', 'ShadowGear'].includes(item.type);
  const isWeapon = item.type === 'Weapon';

  /* Filter out "stat lines" that DP duplicates from the description array so we
     only render actual flavor / effect text */
  const rawDesc: string[] = dp?.identifiedDescription ?? [];
  const descLines = rawDesc.filter(l => l.trim().length > 0);

  return (
    <main className={styles.main}>
      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <Link href="/">Inicio</Link>
        <span>/</span>
        <Link href="/wiki">Wiki</Link>
        <span>/</span>
        <Link href="/wiki?tab=items">Items</Link>
        <span>/</span>
        <span>{item.name}</span>
      </nav>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroIcon}>
          <SafeImg src={iconUrl} alt={item.name} width={48} height={48} />
        </div>
        <div className={styles.heroInfo}>
          <div className={styles.heroMeta}>
            <span className={styles.heroId}>#{item.id}</span>
            <span className={styles.heroAegis}>{item.aegis}</span>
          </div>
          <h1 className={styles.heroName}>{item.name}</h1>
          <div className={styles.heroBadges}>
            <span className={styles.badge}>{item.type}{item.subtype ? ` · ${item.subtype}` : ''}</span>
            {item.slots > 0 && <span className={styles.badge}>{item.slots} slot{item.slots > 1 ? 's' : ''}</span>}
            {dp?.refineable && <span className={styles.badge}>Refineable</span>}
            {isWeapon && (dp?.WeaponLevel ?? 0) > 0 && (
              <span className={styles.badge}>Lv arma {WPN_LEVEL_LABEL[dp!.WeaponLevel] ?? dp!.WeaponLevel}</span>
            )}
            {dp?.element && <span className={styles.badgeElement}>{dp.element}</span>}
          </div>
        </div>

        {/* Right column: prices + equip stats */}
        <div className={styles.heroPrices}>
          {isWeapon && (dp?.attack ?? 0) > 0 && (
            <div className={styles.priceItem}>
              <span className={styles.priceLabel}>ATK</span>
              <span className={styles.priceVal}>{dp!.attack}</span>
            </div>
          )}
          {isWeapon && (dp?.magic_attack ?? 0) > 0 && (
            <div className={styles.priceItem}>
              <span className={styles.priceLabel}>MATK</span>
              <span className={styles.priceVal}>{dp!.magic_attack}</span>
            </div>
          )}
          {isEquip && (dp?.defense ?? 0) > 0 && (
            <div className={styles.priceItem}>
              <span className={styles.priceLabel}>DEF</span>
              <span className={styles.priceVal}>{dp!.defense}</span>
            </div>
          )}
          {(dp?.requiredLevel ?? 0) > 0 && (
            <div className={styles.priceItem}>
              <span className={styles.priceLabel}>Lv mín</span>
              <span className={styles.priceVal}>{dp!.requiredLevel}</span>
            </div>
          )}
          <div className={styles.priceItem}>
            <span className={styles.priceLabel}>Comprar</span>
            <span className={styles.priceVal}>{item.buy > 0 ? item.buy.toLocaleString() + ' z' : '—'}</span>
          </div>
          <div className={styles.priceItem}>
            <span className={styles.priceLabel}>Vender</span>
            <span className={styles.priceVal}>{item.sell > 0 ? item.sell.toLocaleString() + ' z' : '—'}</span>
          </div>
          <div className={styles.priceItem}>
            <span className={styles.priceLabel}>Peso</span>
            <span className={styles.priceVal}>{(item.weight / 10).toFixed(1)}</span>
          </div>
        </div>
      </section>

      {/* Equip info bar (location + jobs) */}
      {dp && isEquip && (
        <div className={styles.equipBar}>
          {dp.location && Object.values(dp.location).some(Boolean) && (
            <div className={styles.equipBarItem}>
              <span className={styles.equipBarLabel}>Ranura</span>
              <span className={styles.equipBarVal}>{formatLocation(dp.location)}</span>
            </div>
          )}
          {dp.jobs && Object.keys(dp.jobs).length > 0 && (
            <div className={styles.equipBarItem}>
              <span className={styles.equipBarLabel}>Clases</span>
              <span className={styles.equipBarVal}>{formatJobs(dp.jobs)}</span>
            </div>
          )}
        </div>
      )}

      {/* Description card — full width, above the grid */}
      {descLines.length > 0 && (
        <section className={styles.descCard}>
          <h2 className={styles.descTitle}>Descripción</h2>
          <div className={styles.descLines}>
            {descLines.map((line, i) => (
              <p key={i} className={styles.descLine}>{line}</p>
            ))}
          </div>
        </section>
      )}

      <div className={styles.grid}>
        {/* Drops from */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>
            Obtenido de
            <span className={styles.cardHint}>{droppedBy.length} monstruos</span>
          </h2>
          {droppedBy.length === 0 ? (
            <p className={styles.empty}>No dropea de ningún monstruo.</p>
          ) : (
            <ul className={styles.mobList}>
              {droppedBy.map(({ mob, basePct, pct }) => (
                <li key={mob.Id}>
                  <Link href={`/wiki/mob/${mob.Id}`} className={styles.mobRow}>
                    <SafeImg
                      src={`https://static.divine-pride.net/images/mobs/png/${mob.Id}.png`}
                      alt={mob.Name} width={32} height={32}
                      className={styles.mobRowSprite}
                    />
                    <span className={styles.mobRowName}>{mob.Name}</span>
                    <span className={styles.mobRowLv}>Lv {mob.Level}</span>
                    <div className={styles.dropRates}>
                      <span style={{ color: RATE_COLOR(pct), fontWeight: 700, fontSize: '13px' }}>
                        {pct >= 100 ? '100%' : pct.toFixed(2) + '%'}
                      </span>
                      {pct !== basePct && (
                        <span className={styles.dropBase}>{basePct.toFixed(2)}%</span>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* NPC shops */}
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>
            Tiendas NPC
            <span className={styles.cardHint}>{shops.length > 0 ? `${shops.length} NPCs` : 'no disponible'}</span>
          </h2>
          {shops.length === 0 ? (
            <p className={styles.empty}>No se vende en tiendas NPC.</p>
          ) : (
            <ul className={styles.shopList}>
              {shops.map((shop, i) => (
                <li key={i} className={styles.shopRow}>
                  <div className={styles.shopNpc}>
                    <Link href={`/wiki/npc/${encodeURIComponent(shop.npc)}`} className={styles.shopNpcName}>
                      {shop.npc}
                    </Link>
                    <div className={styles.shopNpcMapRow}>
                      <Link href={`/wiki/map/${shop.map}`} className={styles.shopNpcMap}>
                        {formatMapName(shop.map)}
                      </Link>
                      <CopyNavi map={shop.map} x={shop.x} y={shop.y} />
                    </div>
                  </div>
                  <span className={styles.shopPrice}>{shop.price.toLocaleString()} z</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

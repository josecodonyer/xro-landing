import type { Metadata } from 'next';
import Link from 'next/link';
import wikiRaw from '../../../../public/wiki_data.json';
import mobFullRaw from '../../../../public/mob_full.json';
import mobDetailRaw from '../../../../public/mob_detail.json';
import Topbar from '../../../components/Topbar';
import SafeImg from '../../../components/SafeImg';
import CopyNavi from '../../../components/CopyNavi';
import styles from './item.module.css';

type ItemData = { id: number; aegis: string; name: string; type: string; subtype: string; weight: number; buy: number; sell: number; slots: number };
type ShopEntry = { npc: string; map: string; x: number; y: number; price: number };
type Mob = { Id: number; Name: string; AegisName: string; Level: number; Element: string; ElementLevel: number };
type Drop = { id: number; name: string; basePct: number; pct: number };
type MobDetail = { drops: Drop[] };

const wikiData = wikiRaw as unknown as { items: Record<string, ItemData>; shops: Record<string, ShopEntry[]> };
const mobFull  = mobFullRaw  as unknown as Mob[];
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
    description: `${item.name} (ID ${item.id}) en xRO — drops, NPCs y precio.`,
  };
}

function formatMapName(raw: string): string {
  return raw.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

const RATE_COLOR = (pct: number) =>
  pct >= 50 ? 'var(--jade-400)' : pct >= 5 ? 'var(--amber-400)' : 'var(--fg-muted)';

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

  // Build drop sources: which mobs drop this item
  const droppedBy = mobFull
    .filter(mob => {
      const d = mobDetail[String(mob.Id)];
      return d?.drops.some(drop => drop.id === item.id);
    })
    .map(mob => {
      const d = mobDetail[String(mob.Id)]!;
      const drop = d.drops.find(drop => drop.id === item.id)!;
      return { mob, basePct: drop.basePct, pct: drop.pct };
    })
    .sort((a, b) => b.pct - a.pct);

  const iconUrl = `https://static.divine-pride.net/images/items/item/${item.id}.png`;

  return (
    <>
      <Topbar active="wiki" subtitle="Wiki" />

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
            </div>
          </div>
          <div className={styles.heroPrices}>
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
    </>
  );
}

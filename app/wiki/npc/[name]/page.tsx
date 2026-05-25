import type { Metadata } from 'next';
import Link from 'next/link';
import wikiRaw from '../../../../public/wiki_data.json';
import npcSpritesRaw from '../../../../public/npc_sprites.json';
import SafeImg from '../../../components/SafeImg';
import CopyNavi from '../../../components/CopyNavi';
import styles from './npc.module.css';

type ItemData  = { id: number; name: string; type: string };
type ShopEntry = { npc: string; map: string; x: number; y: number; price: number };

const wikiData   = wikiRaw       as unknown as { items: Record<string, ItemData>; shops: Record<string, ShopEntry[]> };
const npcSprites = npcSpritesRaw as unknown as Record<string, { id: number; url: string }>;

function formatMapName(raw: string) {
  return raw.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// Build npc -> unique items sold (deduplicated by itemId)
function getNpcShop(npcName: string): { itemId: string; item: ItemData; price: number }[] {
  const seen = new Map<string, { itemId: string; item: ItemData; price: number }>();
  for (const [itemId, shops] of Object.entries(wikiData.shops)) {
    for (const shop of shops) {
      if (shop.npc === npcName && !seen.has(itemId)) {
        seen.set(itemId, { itemId, item: wikiData.items[itemId], price: shop.price });
      }
    }
  }
  return Array.from(seen.values());
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ name: string }> }): Promise<Metadata> {
  const { name } = await params;
  const decoded = decodeURIComponent(name);
  return { title: `${decoded} — xRO Wiki`, description: `NPC ${decoded} — tienda y ubicación.` };
}

export default async function NpcPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const npcName = decodeURIComponent(name);
  const shopItems = getNpcShop(npcName);

  if (shopItems.length === 0) {
    return (
      <div className={styles.notFound}>
        <p>NPC &ldquo;{npcName}&rdquo; no encontrado.</p>
        <Link href="/wiki">← Volver a la wiki</Link>
      </div>
    );
  }

  // All unique locations for this NPC
  const locationMap = new Map<string, { map: string; x: number; y: number }>();
  for (const shops of Object.values(wikiData.shops)) {
    for (const shop of shops) {
      if (shop.npc === npcName) {
        const key = `${shop.map}-${shop.x}-${shop.y}`;
        if (!locationMap.has(key)) locationMap.set(key, { map: shop.map, x: shop.x, y: shop.y });
      }
    }
  }
  const locations = Array.from(locationMap.values());

  return (
    <main className={styles.main}>
        <nav className={styles.breadcrumb}>
          <Link href="/">Inicio</Link><span>/</span>
          <Link href="/wiki">Wiki</Link><span>/</span>
          <span>NPCs</span><span>/</span>
          <span>{npcName}</span>
        </nav>

        <section className={styles.hero}>
          <div className={styles.heroIcon}>
            {npcSprites[npcName] ? (
              <SafeImg
                src={npcSprites[npcName].url}
                alt={npcName}
                width={52} height={52}
                className={styles.heroSprite}
              />
            ) : (
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                <circle cx="14" cy="9" r="4.5" stroke="currentColor" strokeWidth="1.6"/>
                <path d="M4 26c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            )}
          </div>
          <div className={styles.heroInfo}>
            <h1 className={styles.heroName}>{npcName}</h1>
            <div className={styles.heroBadges}>
              <span className={styles.badge}>NPC · Tienda</span>
              <span className={styles.badge}>{shopItems.length} items</span>
            </div>
            <div className={styles.heroLocations}>
              {locations.map((loc, i) => (
                <div key={i} className={styles.locChip}>
                  <Link href={`/wiki/map/${loc.map}`} className={styles.locChipLink}>
                    <SafeImg
                      src={`https://www.divine-pride.net/img/map/original/${loc.map}`}
                      alt={loc.map} width={36} height={36} className={styles.locMapThumb}
                    />
                    <div className={styles.locText}>
                      <span className={styles.locMapName}>{formatMapName(loc.map)}</span>
                    </div>
                  </Link>
                  <CopyNavi map={loc.map} x={loc.x} y={loc.y} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <h2 className={styles.cardTitle}>
            Vende
            <span className={styles.cardHint}>{shopItems.length} items</span>
          </h2>
          <div className={styles.shopGrid}>
            {shopItems.map(({ itemId, item, price }) => (
              <Link key={itemId} href={`/wiki/item/${itemId}`} className={styles.shopItem}>
                <SafeImg
                  src={`https://static.divine-pride.net/images/items/item/${itemId}.png`}
                  alt={item?.name ?? itemId} width={32} height={32}
                  className={styles.itemIcon}
                />
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{item?.name ?? `Item #${itemId}`}</span>
                  <span className={styles.itemType}>{item?.type}</span>
                </div>
                <span className={styles.itemPrice}>{price > 0 ? price.toLocaleString() + ' z' : '—'}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
  );
}

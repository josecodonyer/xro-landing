'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Topbar from '../components/Topbar';
import mobFullRaw from '../../public/mob_full.json';
import wikiRaw from '../../public/wiki_data.json';
import styles from './wiki.module.css';

type Mob  = { Id: number; Name: string; AegisName: string; Level: number; Race: string; Element: string; ElementLevel: number; Size: string };
type Item = { id: number; aegis: string; name: string; type: string; subtype: string };

const mobs  = (mobFullRaw  as unknown as Mob[]);
const items = Object.values((wikiRaw as unknown as { items: Record<string, Item> }).items);

const ELEMENT_COLORS: Record<string, string> = {
  Water:'#7aa7ff', Fire:'#f37b6a', Wind:'#9ce8c1', Earth:'#e6c574',
  Holy:'#f6e0a8', Dark:'#a78bfa', Ghost:'#cbd5e1', Undead:'#94a3b8',
  Neutral:'#8b8b9a', Poison:'#86efac',
};

type Category = { label: string; icon: string; type: string; subtype?: string };
const CATEGORIES: Category[] = [
  { label: 'Dagas',        icon: '🗡️', type: 'Weapon', subtype: 'Dagger' },
  { label: 'Espadas 1M',   icon: '⚔️', type: 'Weapon', subtype: '1hSword' },
  { label: 'Espadas 2M',   icon: '🔰', type: 'Weapon', subtype: '2hSword' },
  { label: 'Lanzas',       icon: '🪃', type: 'Weapon', subtype: '1hSpear' },
  { label: 'Hachas',       icon: '🪓', type: 'Weapon', subtype: '2hAxe' },
  { label: 'Mazas',        icon: '🔨', type: 'Weapon', subtype: 'Mace' },
  { label: 'Bastones',     icon: '🪄', type: 'Weapon', subtype: 'Staff' },
  { label: 'Arcos',        icon: '🏹', type: 'Weapon', subtype: 'Bow' },
  { label: 'Katars',       icon: '✂️', type: 'Weapon', subtype: 'Katar' },
  { label: 'Libros',       icon: '📖', type: 'Weapon', subtype: 'Book' },
  { label: 'Látigos',      icon: '🌀', type: 'Weapon', subtype: 'Whip' },
  { label: 'Instrumentos', icon: '🎵', type: 'Weapon', subtype: 'Musical' },
  { label: 'Knuckles',     icon: '👊', type: 'Weapon', subtype: 'Knuckle' },
  { label: 'Huuma',        icon: '⚡', type: 'Weapon', subtype: 'Huuma' },
  { label: 'Armaduras',    icon: '🛡️', type: 'Armor' },
  { label: 'Shadow Gear',  icon: '🌑', type: 'ShadowGear' },
  { label: 'Cartas',       icon: '🃏', type: 'Card' },
  { label: 'Consumibles',  icon: '🧪', type: 'Healing' },
  { label: 'Munición',     icon: '🎯', type: 'Ammo' },
  { label: 'Misc',         icon: '📦', type: 'Etc' },
];

const WEAPON_CATS = CATEGORIES.filter(c => c.type === 'Weapon');
const ARMOR_CATS  = CATEGORIES.filter(c => c.type === 'Armor' || c.type === 'ShadowGear');

type TabType = 'mobs' | 'weapons' | 'armor' | 'cards' | 'consumibles' | 'items';

const VALID_TABS: TabType[] = ['mobs', 'weapons', 'armor', 'cards', 'consumibles', 'items'];

function tabItemFilter(t: TabType): ((i: Item) => boolean) | null {
  if (t === 'weapons')     return i => i.type === 'Weapon';
  if (t === 'armor')       return i => i.type === 'Armor' || i.type === 'ShadowGear';
  if (t === 'cards')       return i => i.type === 'Card';
  if (t === 'consumibles') return i => ['Healing','Usable','DelayConsume','Delayconsume'].includes(i.type);
  return null;
}

function WikiIndexInner() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const rawTab = searchParams.get('tab') as TabType | null;
  const [tab, setTab] = useState<TabType>(VALID_TABS.includes(rawTab as TabType) ? (rawTab as TabType) : 'mobs');

  useEffect(() => {
    const t = searchParams.get('tab') as TabType | null;
    if (t && VALID_TABS.includes(t)) setTab(t);
    const q = searchParams.get('q');
    if (q) { setQuery(q); if (t === 'mobs' || !t) setTab('items'); }
  }, [searchParams]);

  const mobResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return mobs.slice(0, 40);
    return mobs.filter(m => m.Name.toLowerCase().includes(q) || m.AegisName.toLowerCase().includes(q)).slice(0, 60);
  }, [query]);

  const itemResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    const tf = tabItemFilter(tab);
    let list = tf ? items.filter(tf) : items;
    if (activeCategory) {
      list = list.filter(i => {
        if (i.type !== activeCategory.type && !(activeCategory.type === 'Healing' && (i.type === 'Usable' || i.type === 'DelayConsume' || i.type === 'Delayconsume'))) return false;
        if (activeCategory.subtype && i.subtype !== activeCategory.subtype) return false;
        return true;
      });
    }
    if (!q) return list.slice(0, 60);
    return list.filter(i => i.name.toLowerCase().includes(q) || i.aegis.toLowerCase().includes(q)).slice(0, 60);
  }, [query, activeCategory, tab]);

  const hasQuery = query.trim().length > 0;
  const isItemTab = tab !== 'mobs';

  const visibleCategories = tab === 'weapons' ? WEAPON_CATS
    : tab === 'armor' ? ARMOR_CATS
    : tab === 'items' ? CATEGORIES
    : [];

  function handleCategory(cat: Category) {
    setActiveCategory(prev => prev?.label === cat.label ? null : cat);
    if (cat.type === 'Weapon') setTab('weapons');
    else if (cat.type === 'Armor' || cat.type === 'ShadowGear') setTab('armor');
    else setTab('items');
    setQuery('');
  }

  return (
    <>
      <Topbar active="wiki" />

      <main className={styles.main}>
        {/* Hero search */}
        <section className={styles.heroSearch}>
          <div className="eyebrow-line">Base de datos del servidor</div>
          <h1 className={styles.heroTitle}>xRO Wiki</h1>
          <p className={styles.heroSub}>Monstruos, items y mapas — datos directos de la BD del servidor.</p>
          <div className={styles.searchWrap}>
            <svg className={styles.searchIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M10 10 L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Buscar monstruo, item, mapa…"
              value={query}
              onChange={e => { setQuery(e.target.value); setActiveCategory(null); }}
              autoFocus
            />
            {query && (
              <button className={styles.searchClear} onClick={() => setQuery('')}>×</button>
            )}
          </div>
          {!hasQuery && (
            <div className={styles.statsRow}>
              <span className={styles.statChip}><strong>{mobs.length.toLocaleString()}</strong> monstruos</span>
              <span className={styles.statChip}><strong>{items.length.toLocaleString()}</strong> items</span>
            </div>
          )}
        </section>

        {/* Tabs */}
        <div className={styles.tabs}>
          <button className={`${styles.tab} ${tab === 'mobs' ? styles.tabActive : ''}`} onClick={() => { setTab('mobs'); setActiveCategory(null); }}>
            Monstruos {hasQuery && <span className={styles.tabCount}>{mobResults.length}</span>}
          </button>
          <button className={`${styles.tab} ${tab === 'weapons' ? styles.tabActive : ''}`} onClick={() => { setTab('weapons'); setActiveCategory(null); }}>
            Armas {tab === 'weapons' && <span className={styles.tabCount}>{itemResults.length}</span>}
          </button>
          <button className={`${styles.tab} ${tab === 'armor' ? styles.tabActive : ''}`} onClick={() => { setTab('armor'); setActiveCategory(null); }}>
            Armaduras {tab === 'armor' && <span className={styles.tabCount}>{itemResults.length}</span>}
          </button>
          <button className={`${styles.tab} ${tab === 'cards' ? styles.tabActive : ''}`} onClick={() => { setTab('cards'); setActiveCategory(null); }}>
            Cartas {tab === 'cards' && <span className={styles.tabCount}>{itemResults.length}</span>}
          </button>
          <button className={`${styles.tab} ${tab === 'consumibles' ? styles.tabActive : ''}`} onClick={() => { setTab('consumibles'); setActiveCategory(null); }}>
            Consumibles {tab === 'consumibles' && <span className={styles.tabCount}>{itemResults.length}</span>}
          </button>
          <button className={`${styles.tab} ${tab === 'items' ? styles.tabActive : ''}`} onClick={() => { setTab('items'); setActiveCategory(null); }}>
            Todos {tab === 'items' && (hasQuery || activeCategory) && <span className={styles.tabCount}>{itemResults.length}</span>}
          </button>
        </div>

        {/* Category chips (weapons/armor subtypes + all-items browse) */}
        {!hasQuery && visibleCategories.length > 0 && (
          <div className={styles.categorySection}>
            <div className={styles.categoryGrid}>
              {visibleCategories.map(cat => (
                <button
                  key={cat.label}
                  className={`${styles.categoryChip} ${activeCategory?.label === cat.label ? styles.categoryChipActive : ''}`}
                  onClick={() => handleCategory(cat)}
                >
                  <span className={styles.categoryIcon}>{cat.icon}</span>
                  <span className={styles.categoryName}>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mob grid */}
        {tab === 'mobs' && (
          <div className={styles.mobGrid}>
            {mobResults.map(mob => (
              <Link key={mob.Id} href={`/wiki/mob/${mob.Id}`} className={styles.mobCard}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://static.divine-pride.net/images/mobs/png/${mob.Id}.png`}
                  alt={mob.Name}
                  className={styles.mobSprite}
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <div className={styles.mobCardInfo}>
                  <span className={styles.mobCardName}>{mob.Name}</span>
                  <span className={styles.mobCardMeta}>
                    Lv {mob.Level}
                    <span style={{ color: ELEMENT_COLORS[mob.Element] ?? 'var(--fg-faint)' }}> · {mob.Element}</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Item grid */}
        {isItemTab && (
          <>
            {activeCategory && (
              <div className={styles.activeFilter}>
                <span>{activeCategory.icon} {activeCategory.label}</span>
                <button onClick={() => setActiveCategory(null)}>×</button>
              </div>
            )}
            <div className={styles.itemGrid}>
              {itemResults.map(item => (
                <Link key={item.id} href={`/wiki/item/${item.id}`} className={styles.itemCard}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://static.divine-pride.net/images/items/item/${item.id}.png`}
                    alt={item.name}
                    className={styles.itemIcon}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                  <div className={styles.itemCardInfo}>
                    <span className={styles.itemCardName}>{item.name}</span>
                    <span className={styles.itemCardType}>{item.type}{item.subtype ? ` · ${item.subtype}` : ''}</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {hasQuery && mobResults.length === 0 && itemResults.length === 0 && (
          <p className={styles.noResults}>No se encontraron resultados para &ldquo;{query}&rdquo;</p>
        )}
      </main>
    </>
  );
}

export default function WikiIndex() {
  return (
    <Suspense>
      <WikiIndexInner />
    </Suspense>
  );
}

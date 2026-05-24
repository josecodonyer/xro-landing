'use client';

import { useState, useMemo, useCallback, Fragment } from 'react';
import styles from './exp.module.css';
import Topbar from '../components/Topbar';
import mobRaw from '../../public/mob_full.json';
import mobDetailRaw from '../../public/mob_detail.json';

type Mob = {
  Id: number;
  AegisName: string;
  Name: string;
  Level: number;
  Hp: number;
  BaseExp: number;
  JobExp: number;
  Defense: number;
  MagicDefense: number;
  Agi: number;
  Dex: number;
  Race: string;
  Element: string;
  ElementLevel: number;
  Size: string;
};

type Drop = { id: number; aegis: string; name: string; type: string; rate: number; basePct: number; pct: number };
type SpawnMap = { map: string; count: number };
type MobDetail = { drops: Drop[]; maps: SpawnMap[] };

const mobDetail = mobDetailRaw as unknown as Record<string, MobDetail>;

const PENALTY_TABLE: Record<number, number> = {
  16: 40, 15: 115, 14: 120, 13: 125, 12: 130, 11: 135,
  10: 140, 9: 135, 8: 130, 7: 125, 6: 120, 5: 115,
  4: 110, 3: 105,
};

function getPenalty(diff: number): number {
  if (diff >= 16) return 40;
  if (diff >= 15) return PENALTY_TABLE[15];
  if (diff >= 3)  return PENALTY_TABLE[diff] ?? 100;
  if (diff >= -5) return 100;
  if (diff >= -10) return 95;
  if (diff >= -15) return 90;
  if (diff >= -20) return 85;
  if (diff >= -25) return 60;
  if (diff >= -30) return 35;
  return 10;
}

const RACES = ['Formless','Undead','Brute','Plant','Insect','Fish','Demon','DemiHuman','Angel','Dragon'];
const ELEMENTS = ['Neutral','Water','Earth','Fire','Wind','Poison','Holy','Shadow','Ghost','Undead'];
const SIZES = ['Small','Medium','Large'];

type SortKey = 'Name' | 'Level' | 'BaseExp' | 'JobExp' | 'TotalExp' | 'Hp' | 'Diff';
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 50;

function MobAccordion({ mob, rate, playerLv }: {
  mob: Mob; rate: number; playerLv: number;
}) {
  const detail = mobDetail[String(mob.Id)];
  const diff = mob.Level - playerLv;
  const pen = getPenalty(diff) / 100;
  const baseScaled = Math.round(mob.BaseExp * pen * rate);
  const jobScaled  = Math.round(mob.JobExp  * pen * rate);

  const spriteUrl = `https://static.divine-pride.net/images/mobs/png/${mob.Id}.png`;
  const itemIconUrl = (id: number) => `https://static.divine-pride.net/images/items/item/${id}.png`;

  return (
    <tr className={styles.accordionRow}>
      <td colSpan={13} className={styles.accordionCell}>
        <div className={styles.accordionInner}>

          {/* Sprite + stats */}
          <div className={styles.accSprite}>
            <a href={`/wiki/mob/${mob.Id}`} title={`Ver ${mob.Name} en la wiki`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={spriteUrl}
                alt={mob.Name}
                className={styles.spriteImg}
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </a>
          </div>

          <div className={styles.accStats}>
            <div className={styles.accSectionTitle}>Stats</div>
            <div className={styles.statGrid}>
              <span className={styles.statLabel}>HP</span>
              <span className={styles.statVal}>{mob.Hp.toLocaleString('es-ES')}</span>
              <span className={styles.statLabel}>Base EXP</span>
              <span className={`${styles.statVal} ${styles.statBase}`}>{baseScaled.toLocaleString('es-ES')}</span>
              <span className={styles.statLabel}>Job EXP</span>
              <span className={`${styles.statVal} ${styles.statJob}`}>{jobScaled.toLocaleString('es-ES')}</span>
              <span className={styles.statLabel}>DEF / MDEF</span>
              <span className={styles.statVal}>{mob.Defense} / {mob.MagicDefense}</span>
              <span className={styles.statLabel}>Agi / Dex</span>
              <span className={styles.statVal}>{mob.Agi} / {mob.Dex}</span>
            </div>
          </div>

          <div className={styles.accMaps}>
            <div className={styles.accSectionTitle}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
                <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.4"/>
                <circle cx="6" cy="6" r="1.5" fill="currentColor"/>
              </svg>
              Mapas de spawn
              <span className={styles.accSectionHint}>mobs en mapa</span>
            </div>
            {detail?.maps?.length ? (
              <div className={styles.mapList}>
                {detail.maps.slice(0, 10).map(({ map, count }) => (
                  <div key={map} className={styles.mapItem}>
                    <span className={styles.mapName}>{map}</span>
                    <span className={styles.mapCount}>×{count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.accEmpty}>Sin spawn natural conocido</p>
            )}
          </div>

          <div className={styles.accDrops}>
            <div className={styles.accSectionTitle}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden>
                <path d="M6 1.5L8.5 5.5H3.5L6 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/>
                <rect x="2.5" y="7" width="7" height="3.5" rx="1" stroke="currentColor" strokeWidth="1.2"/>
              </svg>
              Drops
              <span className={styles.accSectionHint}>rate ×server</span>
            </div>
            {detail?.drops?.length ? (
              <div className={styles.dropList}>
                {detail.drops.map((drop, i) => (
                  <div key={`${drop.id}-${i}`} className={styles.dropItem}>
                    <div className={styles.dropIcon}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={itemIconUrl(drop.id)}
                        alt={drop.name}
                        width={24} height={24}
                        onError={e => {
                          const el = e.target as HTMLImageElement;
                          el.style.display = 'none';
                          el.parentElement!.classList.add(styles.dropIconMissing);
                        }}
                      />
                    </div>
                    <span className={styles.dropName}>{drop.name}</span>
                    <span className={styles.dropRateWrap}>
                      <span className={`${styles.dropRate} ${drop.pct >= 50 ? styles.dropRateHigh : drop.pct >= 5 ? styles.dropRateMed : ''}`}>
                        {drop.pct >= 100 ? '100%' : drop.pct.toFixed(2) + '%'}
                      </span>
                      {drop.pct !== drop.basePct && (
                        <span className={styles.dropRateBase}>{drop.basePct.toFixed(2)}%</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.accEmpty}>Sin drops registrados</p>
            )}
          </div>

        </div>
      </td>
    </tr>
  );
}

export default function ExpScaler() {
  const [playerLv, setPlayerLv] = useState(() => {
    if (typeof window === 'undefined') return 1;
    return parseInt(localStorage.getItem('xro_exp_lv') ?? '1') || 1;
  });
  const [playerLvInput, setPlayerLvInput] = useState<string>(String(playerLv));
  const [range, setRange] = useState(() => {
    if (typeof window === 'undefined') return 10;
    return parseInt(localStorage.getItem('xro_exp_range') ?? '10') || 10;
  });
  const [rate, setRate] = useState(() => {
    if (typeof window === 'undefined') return 10;
    return parseFloat(localStorage.getItem('xro_exp_rate') ?? '10') || 10;
  });
  const [search, setSearch] = useState('');
  const [races, setRaces] = useState<Set<string>>(new Set());
  const [elements, setElements] = useState<Set<string>>(new Set());
  const [sizes, setSizes] = useState<Set<string>>(new Set());
  const [sortKey, setSortKey] = useState<SortKey>('TotalExp');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(0);
  const [selectedMob, setSelectedMob] = useState<Mob | null>(null);

  const RANGES = [
    { label: 'Bonus (>100%)',   value: -101 },
    { label: '100%+',           value: -100 },
    { label: '95%+',            value: -95  },
    { label: '90%+',            value: -90  },
    { label: '85%+',            value: -85  },
    { label: '±5 niveles',      value: 5    },
    { label: '±10 niveles',     value: 10   },
    { label: '±15 niveles',     value: 15   },
    { label: 'Todos',           value: 999  },
  ];

  const mobs = (mobRaw as Mob[]).filter(m => m.Hp < 1 || m.BaseExp / m.Hp < 1000);

  const toggleSet = useCallback(
    (set: Set<string>, val: string, setter: (s: Set<string>) => void) => {
      const next = new Set(set);
      next.has(val) ? next.delete(val) : next.add(val);
      setter(next);
      setPage(0);
    },
    []
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = mobs.filter(m => {
      const diff = m.Level - playerLv;
      if (range === 999) {
        // show all
      } else if (range < 0) {
        const minPenalty = Math.abs(range);
        const pen = getPenalty(diff);
        if (range === -101 && pen <= 100) return false;
        if (range !== -101 && pen < minPenalty) return false;
      } else {
        if (diff < -range || diff > range) return false;
      }
      if (q && !m.Name.toLowerCase().includes(q) && !m.AegisName.toLowerCase().includes(q) && !String(m.Id).includes(q)) return false;
      if (races.size > 0 && !races.has(m.Race)) return false;
      if (elements.size > 0 && !elements.has(m.Element)) return false;
      if (sizes.size > 0 && !sizes.has(m.Size)) return false;
      return true;
    });

    list.sort((a, b) => {
      const diffA = a.Level - playerLv;
      const diffB = b.Level - playerLv;
      const penA = getPenalty(diffA) / 100;
      const penB = getPenalty(diffB) / 100;

      if (sortKey === 'Name') {
        const cmp = a.Name.localeCompare(b.Name);
        return sortDir === 'asc' ? cmp : -cmp;
      }
      let av: number, bv: number;
      if (sortKey === 'TotalExp') {
        av = (a.BaseExp + a.JobExp) * penA;
        bv = (b.BaseExp + b.JobExp) * penB;
      } else if (sortKey === 'BaseExp') {
        av = a.BaseExp * penA; bv = b.BaseExp * penB;
      } else if (sortKey === 'JobExp') {
        av = a.JobExp * penA; bv = b.JobExp * penB;
      } else if (sortKey === 'Diff') {
        av = diffA; bv = diffB;
      } else {
        av = a[sortKey] as number; bv = b[sortKey] as number;
      }
      return sortDir === 'asc' ? av - bv : bv - av;
    });

    return list;
  }, [mobs, search, races, elements, sizes, sortKey, sortDir, playerLv, range]);

  const pageData = useMemo(
    () => filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE),
    [filtered, page]
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortKey(key); setSortDir('desc'); }
    setPage(0);
  };

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (k !== sortKey) return <span className={styles.sortNone}>↕</span>;
    return <span className={styles.sortActive}>{sortDir === 'desc' ? '↓' : '↑'}</span>;
  };

  const penaltyBadge = (diff: number) => {
    const p = getPenalty(diff);
    if (p > 100) return <span className={styles.badgeBonus}>+{p - 100}%</span>;
    if (p < 100) return <span className={styles.badgePenalty}>−{100 - p}%</span>;
    return <span className={styles.badgeNeutral}>100%</span>;
  };

  return (
    <>
      <Topbar active="exp" subtitle="EXP Scaler" />

      <main className={styles.main}>
        <div className={styles.head}>
          <div className="eyebrow-line">Herramientas · xRO Renewal</div>
          <h1 className={styles.h1}>EXP Scaler</h1>
          <p className={styles.lede}>
            Mete tu nivel y ve qué mobs te dan más EXP real, ya con la penalización de nivel y el ×{rate} del server aplicados.
          </p>
        </div>

        {/* ── Controls panel ── */}
        <div className={styles.controlsPanel}>
          <div className={styles.controlCell}>
            <span className={styles.controlLabel}>Tu nivel</span>
            <div className={styles.lvRow}>
              <button className={styles.lvBtn} onClick={() => { setPlayerLv(l => { const v = Math.max(1, l - 1); localStorage.setItem('xro_exp_lv', String(v)); setPlayerLvInput(String(v)); return v; }); setPage(0); }}>−</button>
              <input
                className={styles.lvInput}
                type="number"
                min={1} max={175}
                value={playerLvInput}
                onChange={e => {
                  const raw = e.target.value;
                  setPlayerLvInput(raw);
                  const n = parseInt(raw);
                  if (!isNaN(n) && n >= 1 && n <= 175) {
                    setPlayerLv(n); localStorage.setItem('xro_exp_lv', String(n)); setPage(0);
                  }
                }}
                onBlur={() => {
                  const n = Math.max(1, Math.min(175, parseInt(playerLvInput) || 1));
                  setPlayerLv(n); setPlayerLvInput(String(n)); localStorage.setItem('xro_exp_lv', String(n));
                }}
              />
              <button className={styles.lvBtn} onClick={() => { setPlayerLv(l => { const v = Math.min(175, l + 1); localStorage.setItem('xro_exp_lv', String(v)); setPlayerLvInput(String(v)); return v; }); setPage(0); }}>+</button>
            </div>
          </div>

          <div className={styles.controlCell}>
            <span className={styles.controlLabel}>Rango</span>
            <select
              className={styles.rangeSelect}
              value={range}
              onChange={e => { const v = Number(e.target.value); setRange(v); localStorage.setItem('xro_exp_range', String(v)); setPage(0); }}
            >
              {RANGES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>

          <div className={styles.controlCell}>
            <span className={styles.controlLabel}>Rate EXP</span>
            <div className={styles.rateRow}>
              <span className={styles.rateX}>×</span>
              <input
                className={styles.rateInput}
                type="number" min={0.1} step={0.5}
                value={rate}
                onChange={e => { const v = parseFloat(e.target.value); if (!isNaN(v) && v > 0) { setRate(v); localStorage.setItem('xro_exp_rate', String(v)); } }}
              />
            </div>
          </div>

          <div className={styles.controlCellSearch}>
            <div className={styles.searchWrap}>
              <svg className={styles.searchIcon} width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
                <circle cx="5.5" cy="5.5" r="4" stroke="currentColor" strokeWidth="1.3" />
                <path d="M9 9 L12.5 12.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              </svg>
              <input
                className={styles.searchInput}
                placeholder="Buscar mob por nombre…"
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(0); }}
              />
            </div>
            <span className={styles.statsPill}>
              <strong>{filtered.length.toLocaleString('es-ES')}</strong> mobs
            </span>
          </div>
        </div>

        {/* ── Filters ── */}
        <div className={styles.filtersBar}>
          <div className={styles.filterGroup}>
            <span className={styles.filterGroupLabel}>Raza</span>
            <div className={styles.filterChips}>
              {RACES.map(r => (
                <button
                  key={r}
                  className={`${styles.chip} ${races.has(r) ? styles.chipActive : ''}`}
                  onClick={() => toggleSet(races, r, setRaces)}
                >{r}</button>
              ))}
            </div>
          </div>
          <div className={styles.filterGroup}>
            <span className={styles.filterGroupLabel}>Elemento</span>
            <div className={styles.filterChips}>
              {ELEMENTS.map(e => (
                <button
                  key={e}
                  className={`${styles.chip} ${elements.has(e) ? styles.chipActive : ''}`}
                  onClick={() => toggleSet(elements, e, setElements)}
                >{e}</button>
              ))}
            </div>
          </div>
          <div className={styles.filterGroup}>
            <span className={styles.filterGroupLabel}>Tamaño</span>
            <div className={styles.filterChips}>
              {SIZES.map(s => (
                <button
                  key={s}
                  className={`${styles.chip} ${sizes.has(s) ? styles.chipActive : ''}`}
                  onClick={() => toggleSet(sizes, s, setSizes)}
                >{s}</button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Table ── */}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thSortable} onClick={() => toggleSort('Name')}>
                  Mob <SortIcon k="Name" />
                </th>
                <th className={`${styles.thSortable} ${styles.thNum}`} onClick={() => toggleSort('Level')}>
                  Lv <SortIcon k="Level" />
                </th>
                <th className={`${styles.thSortable} ${styles.thNum}`} onClick={() => toggleSort('Diff')}>
                  Dif <SortIcon k="Diff" />
                </th>
                <th className={styles.th}>Penalización</th>
                <th className={`${styles.thSortable} ${styles.thNum}`} onClick={() => toggleSort('BaseExp')}>
                  Base EXP <SortIcon k="BaseExp" />
                </th>
                <th className={`${styles.thSortable} ${styles.thNum}`} onClick={() => toggleSort('JobExp')}>
                  Job EXP <SortIcon k="JobExp" />
                </th>
                <th className={`${styles.thSortable} ${styles.thNum}`} onClick={() => toggleSort('TotalExp')}>
                  Total EXP <SortIcon k="TotalExp" />
                </th>
                <th className={`${styles.thSortable} ${styles.thNum}`} onClick={() => toggleSort('Hp')}>
                  HP <SortIcon k="Hp" />
                </th>
                <th className={styles.th}>Raza</th>
                <th className={styles.th}>Elemento</th>
                <th className={styles.th}>Tam.</th>
                <th className={styles.thNum}>Def</th>
                <th className={styles.thNum}>MDef</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map(mob => {
                const diff = mob.Level - playerLv;
                const pen = getPenalty(diff) / 100;
                const baseScaled = Math.round(mob.BaseExp * pen * rate);
                const jobScaled  = Math.round(mob.JobExp  * pen * rate);
                const totalScaled = baseScaled + jobScaled;
                const isSelected = selectedMob?.Id === mob.Id;
                return (
                  <Fragment key={mob.Id}>
                    <tr
                      className={`${styles.row} ${pen > 1 ? styles.rowBonus : pen < 1 ? styles.rowPenalty : ''} ${isSelected ? styles.rowSelected : ''}`}
                      onClick={() => setSelectedMob(isSelected ? null : mob)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td className={styles.tdName}>
                        <span className={styles.mobName}>{mob.Name}</span>
                        <span className={styles.mobSub}>{mob.AegisName}</span>
                      </td>
                      <td className={`${styles.td} ${styles.tdNum}`}>{mob.Level}</td>
                      <td className={`${styles.td} ${styles.tdNum} ${styles.tdDiff}`}>
                        {diff > 0 ? `+${diff}` : diff}
                      </td>
                      <td className={styles.td}>{penaltyBadge(diff)}</td>
                      <td className={`${styles.td} ${styles.tdNum} ${styles.tdBase}`}>
                        {baseScaled.toLocaleString('es-ES')}
                      </td>
                      <td className={`${styles.td} ${styles.tdNum} ${styles.tdJob}`}>
                        {jobScaled.toLocaleString('es-ES')}
                      </td>
                      <td className={`${styles.td} ${styles.tdNum} ${styles.tdTotal}`}>
                        {totalScaled.toLocaleString('es-ES')}
                      </td>
                      <td className={`${styles.td} ${styles.tdNum}`}>{mob.Hp.toLocaleString('es-ES')}</td>
                      <td className={styles.td}>{mob.Race}</td>
                      <td className={styles.td}>{mob.Element} {mob.ElementLevel}</td>
                      <td className={styles.td}>{mob.Size}</td>
                      <td className={`${styles.td} ${styles.tdNum}`}>{mob.Defense}</td>
                      <td className={`${styles.td} ${styles.tdNum}`}>{mob.MagicDefense}</td>
                    </tr>
                    {isSelected && (
                      <MobAccordion mob={mob} rate={rate} playerLv={playerLv} />
                    )}
                  </Fragment>
                );
              })}
              {pageData.length === 0 && (
                <tr>
                  <td colSpan={13} className={styles.empty}>Sin resultados con los filtros actuales</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button className={styles.pageBtn} disabled={page === 0} onClick={() => setPage(0)}>«</button>
            <button className={styles.pageBtn} disabled={page === 0} onClick={() => setPage(p => p - 1)}>‹</button>
            <span className={styles.pageInfo}>{page + 1} / {totalPages}</span>
            <button className={styles.pageBtn} disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)}>›</button>
            <button className={styles.pageBtn} disabled={page === totalPages - 1} onClick={() => setPage(totalPages - 1)}>»</button>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="footer-inner" style={{ justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--fg-faint)', fontSize: '13px' }}>
            rAthena mob_db Renewal · {mobs.length} mobs · Penalización según level_penalty.yml del server
          </span>
          <a href="/" style={{ color: 'var(--fg-muted)', fontSize: '13px' }}>← Inicio</a>
        </div>
      </footer>

    </>
  );
}

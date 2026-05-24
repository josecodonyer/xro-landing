'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './WikiSearch.module.css';

type Result = { id: string; name: string; kind: 'mob' | 'item'; href: string; meta?: string };

let cachedMobs: { Id: number; Name: string; Level: number; Element: string }[] | null = null;
let cachedItems: { id: number; name: string; type: string }[] | null = null;

async function loadData() {
  if (!cachedMobs || !cachedItems) {
    const [mobMod, wikiMod] = await Promise.all([
      import('../../public/mob_full.json'),
      import('../../public/wiki_data.json'),
    ]);
    cachedMobs = mobMod.default as typeof cachedMobs;
    cachedItems = Object.values((wikiMod.default as { items: Record<string, typeof cachedItems extends (infer T)[] | null ? T : never> }).items) as typeof cachedItems;
  }
  return { mobs: cachedMobs!, items: cachedItems! };
}

export default function WikiSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [loaded, setLoaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOut(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOut);
    return () => document.removeEventListener('mousedown', onClickOut);
  }, []);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setOpen(false); return; }
    const { mobs, items } = await loadData();
    setLoaded(true);
    const lq = q.toLowerCase();
    const mobHits: Result[] = mobs
      .filter(m => m.Name.toLowerCase().includes(lq))
      .slice(0, 5)
      .map(m => ({ id: String(m.Id), name: m.Name, kind: 'mob', href: `/wiki/mob/${m.Id}`, meta: `Lv ${m.Level} · ${m.Element}` }));
    const itemHits: Result[] = items
      .filter(i => i.name.toLowerCase().includes(lq))
      .slice(0, 5)
      .map(i => ({ id: String(i.id), name: i.name, kind: 'item', href: `/wiki/item/${i.id}`, meta: i.type }));
    setResults([...mobHits, ...itemHits]);
    setOpen(true);
    setActive(-1);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => search(query), 120);
    return () => clearTimeout(t);
  }, [query, search]);

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(a + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(a - 1, -1)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (active >= 0 && results[active]) {
        router.push(results[active].href);
        setOpen(false); setQuery('');
      } else if (query.trim()) {
        router.push(`/wiki?q=${encodeURIComponent(query.trim())}`);
        setOpen(false); setQuery('');
      }
    } else if (e.key === 'Escape') { setOpen(false); setQuery(''); }
  }

  function handleResultClick(r: Result) {
    router.push(r.href);
    setOpen(false); setQuery('');
  }

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <div className={styles.inputWrap}>
        <svg className={styles.icon} width="13" height="13" viewBox="0 0 16 16" fill="none">
          <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
          <path d="M10 10 L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <input
          ref={inputRef}
          className={styles.input}
          placeholder="Buscar en la wiki…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => { if (results.length) setOpen(true); }}
          onKeyDown={handleKey}
          autoComplete="off"
        />
        {query && <button className={styles.clear} onClick={() => { setQuery(''); setOpen(false); }}>×</button>}
      </div>

      {open && results.length > 0 && (
        <div className={styles.dropdown}>
          {results.map((r, i) => (
            <button
              key={r.href}
              className={`${styles.result} ${i === active ? styles.resultActive : ''}`}
              onMouseDown={() => handleResultClick(r)}
              onMouseEnter={() => setActive(i)}
            >
              <span className={`${styles.tag} ${r.kind === 'mob' ? styles.tagMob : styles.tagItem}`}>
                {r.kind === 'mob' ? 'MOB' : 'ITEM'}
              </span>
              <span className={styles.resultName}>{r.name}</span>
              {r.meta && <span className={styles.resultMeta}>{r.meta}</span>}
            </button>
          ))}
          {query.trim() && (
            <button
              className={`${styles.result} ${styles.resultMore}`}
              onMouseDown={() => { router.push(`/wiki?q=${encodeURIComponent(query.trim())}`); setOpen(false); setQuery(''); }}
            >
              Ver todos los resultados de &ldquo;{query}&rdquo; →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

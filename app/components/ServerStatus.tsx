'use client';

import { useEffect, useState } from 'react';

interface Status {
  online: boolean;
  players: number | null;
  episode: string | null;
  version: string | null;
  heroTitle: string | null;
  heroAccent: string | null;
}

const EMPTY: Status = {
  online: false, players: null, episode: null,
  version: null, heroTitle: null, heroAccent: null,
};

export function useServerStatus(): Status {
  const [status, setStatus] = useState<Status>(EMPTY);

  useEffect(() => {
    let cancelled = false;

    async function fetch_() {
      try {
        const res = await fetch('/api/status');
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setStatus({
          online:     !!data.online,
          players:    data.players     ?? null,
          episode:    data.episode     ?? null,
          version:    data.version     ?? null,
          heroTitle:  data.hero_title  ?? null,
          heroAccent: data.hero_accent ?? null,
        });
      } catch {}
    }

    fetch_();
    const id = setInterval(fetch_, 60_000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  return status;
}

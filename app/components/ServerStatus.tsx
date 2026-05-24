'use client';

import { useEffect, useState } from 'react';

interface Status {
  online: boolean;
  players: number | null;
}

export function useServerStatus(): Status {
  const [status, setStatus] = useState<Status>({ online: false, players: null });

  useEffect(() => {
    let cancelled = false;

    async function fetch_() {
      try {
        const res = await fetch('/api/status');
        if (!res.ok) return;
        const data: Status = await res.json();
        if (!cancelled) setStatus(data);
      } catch {}
    }

    fetch_();
    const id = setInterval(fetch_, 60_000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  return status;
}

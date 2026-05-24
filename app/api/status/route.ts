import { NextResponse } from 'next/server';

export const revalidate = 30;

export async function GET() {
  try {
    const res = await fetch('https://yinx-ragnarok.duckdns.org/api/status', {
      next: { revalidate: 30 },
    });
    if (!res.ok) throw new Error('upstream error');
    const data = await res.json();
    return NextResponse.json(
      { online: !!data.online, players: data.players ?? null },
      { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } },
    );
  } catch {
    return NextResponse.json({ online: false, players: null });
  }
}

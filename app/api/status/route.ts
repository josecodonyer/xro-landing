import { NextResponse } from 'next/server';

export const revalidate = 30;

// Endpoint de estado real del servidor. Se configura con la variable de entorno
// XRO_STATUS_URL (en Vercel). Debe devolver un JSON tipo:
//   { online: boolean, players: number, episode?: string, version?: string }
// El launcher consulta esta ruta (no el upstream directo) para no tener que
// mantener la URL en dos sitios ni lidiar con CORS desde el webview.
const UPSTREAM = process.env.XRO_STATUS_URL;

// CORS abierto: el launcher (rpatchur, origen file://) necesita poder leer esto.
const CORS = { 'Access-Control-Allow-Origin': '*' };

const OFFLINE = {
  online: false, players: null,
  episode: null, version: null,
  hero_title: null, hero_accent: null,
};

export function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { ...CORS, 'Access-Control-Allow-Methods': 'GET, OPTIONS' },
  });
}

export async function GET() {
  // Sin upstream configurado: respondemos offline en vez de inventar datos.
  if (!UPSTREAM) {
    return NextResponse.json(OFFLINE, { headers: CORS });
  }

  try {
    const res = await fetch(UPSTREAM, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error('upstream error');
    const data = await res.json();
    return NextResponse.json(
      {
        online:      !!data.online,
        players:     data.players     ?? null,
        episode:     data.episode     ?? null,
        version:     data.version     ?? null,
        hero_title:  data.hero_title  ?? null,
        hero_accent: data.hero_accent ?? null,
      },
      { headers: { ...CORS, 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } },
    );
  } catch {
    return NextResponse.json(OFFLINE, { headers: CORS });
  }
}

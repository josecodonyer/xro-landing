const API_KEY = process.env.DIVINE_PRIDE_KEY ?? '4dfb62d0df5090aa0b7b9d1622246a69';
const BASE    = 'https://www.divine-pride.net/api/database';

export type DPItem = {
  id: number;
  identifiedDescription: string[];
  attack: number;
  defense: number;
  magic_attack: number;
  requiredLevel: number;
  slots: number;
  refineable: boolean;
  gradeable: boolean;
  WeaponLevel: number;
  element: string | null;
  location: Record<string, boolean>;
  jobs: Record<string, boolean>;
  script: string;
};

export async function fetchDPItem(id: string | number): Promise<DPItem | null> {
  try {
    const res = await fetch(`${BASE}/Item/${id}?apiKey=${API_KEY}`, {
      next: { revalidate: 86400 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<DPItem>;
  } catch {
    return null;
  }
}

/* ── Helpers ── */

const LOCATION_LABELS: Record<string, string> = {
  Head_Top:          'Cabeza superior',
  Head_Mid:          'Cabeza media',
  Head_Bottom:       'Cabeza inferior',
  Body:              'Armadura',
  Right_Hand:        'Mano derecha',
  Left_Hand:         'Mano izquierda / Escudo',
  Garment:           'Capa',
  Shoes:             'Calzado',
  Right_Accessory:   'Accesorio der.',
  Left_Accessory:    'Accesorio izq.',
  Costume_Head_Top:  'Disfraz cabeza',
  Costume_Garment:   'Disfraz capa',
  Shadow_Armor:      'Shadow armadura',
  Shadow_Weapon:     'Shadow arma',
  Shadow_Shield:     'Shadow escudo',
  Shadow_Shoes:      'Shadow calzado',
  Shadow_Right_Accessory: 'Shadow acc. der.',
  Shadow_Left_Accessory:  'Shadow acc. izq.',
};

export function formatLocation(location: Record<string, boolean>): string {
  return Object.entries(location)
    .filter(([, v]) => v)
    .map(([k]) => LOCATION_LABELS[k] ?? k.replace(/_/g, ' '))
    .join(', ') || '—';
}

/* Collapse verbose job list → readable summary */
export function formatJobs(jobs: Record<string, boolean>): string {
  const active = Object.entries(jobs).filter(([, v]) => v).map(([k]) => k);
  if (active.length === 0) return 'Ninguna';
  // Check if all base/2nd jobs are included → "All Jobs"
  if (active.includes('All') || active.length > 20) return 'Todas las clases';
  // Short list
  return active.slice(0, 6).join(', ') + (active.length > 6 ? ` +${active.length - 6}` : '');
}

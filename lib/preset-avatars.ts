// Avatares predefinidos (artwork de clases 4th) en /public/avatars.
export const PRESET_AVATARS = [
  { id: 'avatar-1', label: 'Imperial Guard' },
  { id: 'avatar-2', label: 'Sky Emperor' },
  { id: 'avatar-3', label: 'Night Watch' },
  { id: 'avatar-4', label: 'Dragon Knight' },
  { id: 'avatar-5', label: 'Trouvère' },
  { id: 'avatar-6', label: 'Oboro' },
] as const;

export const PRESET_AVATAR_IDS = PRESET_AVATARS.map(a => a.id) as readonly string[];

export function avatarSrc(id: string | null | undefined): string | null {
  return id && PRESET_AVATAR_IDS.includes(id) ? `/avatars/${id}.png` : null;
}

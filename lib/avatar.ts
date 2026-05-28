// Server-only avatar helpers (use only in Server Components / API routes).
export { hairColorHex, jobSpriteUrl } from './avatar-shared';
import { db } from './db';

export type AvatarData = {
  charName: string; charClass: number; charSex: string;
  hair: number; hairColor: number; clothesColor: number;
  headTop: number; headMid: number; headBottom: number;
  weapon: number; shield: number;
};

export async function getUserAvatar(userId: string): Promise<AvatarData | null> {
  const p = await db.userProfile.findUnique({ where: { userId } });
  if (!p?.avatarCharClass) return null;
  return {
    charName:     p.avatarCharName     ?? '',
    charClass:    p.avatarCharClass,
    charSex:      p.avatarCharSex      ?? 'M',
    hair:         p.avatarHair         ?? 0,
    hairColor:    p.avatarHairColor    ?? 9,
    clothesColor: p.avatarClothesColor ?? 0,
    headTop:      p.avatarHeadTop      ?? 0,
    headMid:      p.avatarHeadMid      ?? 0,
    headBottom:   p.avatarHeadBottom   ?? 0,
    weapon:       p.avatarWeapon       ?? 0,
    shield:       p.avatarShield       ?? 0,
  };
}

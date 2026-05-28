import { db } from './db';

// divine-pride serves job sprite images at this path.
// Falls back to the colored badge in the UI if the image 404s.
export function jobSpriteUrl(charClass: number): string {
  return `https://static.divine-pride.net/images/jobs/png/${charClass}.png`;
}

export async function getUserAvatar(userId: string): Promise<{ charClass: number; charSex: string; charName: string } | null> {
  const profile = await db.userProfile.findUnique({ where: { userId } });
  if (!profile?.avatarCharClass) return null;
  return {
    charClass: profile.avatarCharClass,
    charSex: profile.avatarCharSex ?? 'M',
    charName: profile.avatarCharName ?? '',
  };
}

import { db } from './db';

// Devuelve el id del avatar predefinido elegido por el usuario (o null).
export async function getUserAvatarImage(userId: string): Promise<string | null> {
  const p = await db.userProfile.findUnique({ where: { userId } });
  return p?.avatarImage ?? null;
}

import { db } from './db';

export async function isAdmin(userId: string): Promise<boolean> {
  // Check env var list first (fast path)
  const envAdmins = (process.env.ADMIN_USERIDS ?? '').split(',').map(s => s.trim()).filter(Boolean);
  if (envAdmins.includes(userId)) return true;

  // Check database table
  const record = await db.adminUser.findUnique({ where: { userId } });
  return record !== null;
}

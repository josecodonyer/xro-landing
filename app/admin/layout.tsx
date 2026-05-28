import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { isAdmin } from '@/lib/admin';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session.accountId || !session.userid) redirect('/cuenta/login');

  const admin = await isAdmin(session.userid);
  if (!admin) redirect('/');

  return <>{children}</>;
}

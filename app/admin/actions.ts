'use server';

import { revalidatePath } from 'next/cache';
import { getSession } from '@/lib/session';
import { db } from '@/lib/db';
import { isAdmin } from '@/lib/admin';

const VALID_STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'] as const;
type TicketStatus = typeof VALID_STATUSES[number];

async function requireAdmin() {
  const session = await getSession();
  if (!session.accountId || !session.userid) throw new Error('Unauthorized');
  const admin = await isAdmin(session.userid);
  if (!admin) throw new Error('Forbidden');
  return session;
}

export async function updateTicketStatusAction(ticketId: number, status: string) {
  await requireAdmin();
  if (!VALID_STATUSES.includes(status as TicketStatus)) throw new Error('Invalid status');

  await db.ticket.update({
    where: { id: ticketId },
    data: { status },
  });

  revalidatePath('/admin');
  revalidatePath(`/admin/${ticketId}`);
  revalidatePath(`/soporte/${ticketId}`);
}

export async function adminReplyAction(_: unknown, fd: FormData) {
  const session = await requireAdmin();

  const ticketId = parseInt(fd.get('ticketId') as string, 10);
  const message = (fd.get('message') as string)?.trim();

  if (!ticketId || isNaN(ticketId)) return { error: 'Ticket inválido.' };
  if (!message || message.length < 2) return { error: 'El mensaje es demasiado corto.' };

  const ticket = await db.ticket.findUnique({ where: { id: ticketId } });
  if (!ticket) return { error: 'Ticket no encontrado.' };

  await db.ticketReply.create({
    data: {
      ticketId,
      userId: session.userid!,
      isAdmin: true,
      message,
    },
  });

  revalidatePath(`/admin/${ticketId}`);
  revalidatePath(`/soporte/${ticketId}`);
  return { success: true };
}

export async function addAdminUserAction(userId: string) {
  await requireAdmin();
  await db.adminUser.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
  revalidatePath('/admin');
}

export async function removeAdminUserAction(userId: string) {
  await requireAdmin();
  await db.adminUser.deleteMany({ where: { userId } });
  revalidatePath('/admin');
}

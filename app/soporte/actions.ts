'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import path from 'path';
import fs from 'fs/promises';
import { getSession } from '@/lib/session';
import { db } from '@/lib/db';
import { verifyCaptcha } from '@/lib/captcha';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'tickets');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const VALID_CATEGORIES = ['BUG', 'SUGGESTION', 'SUPPORT'];
const VALID_STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

export async function createTicketAction(_: unknown, fd: FormData) {
  const session = await getSession();
  if (!session.accountId || !session.userid) return { error: 'Debes iniciar sesión.' };

  const captchaToken = fd.get('h-captcha-response') as string | null;
  const captchaOk = await verifyCaptcha(captchaToken);
  if (!captchaOk) return { error: 'Verificación CAPTCHA fallida. Inténtalo de nuevo.' };

  const title = (fd.get('title') as string)?.trim();
  const category = (fd.get('category') as string)?.toUpperCase();
  const message = (fd.get('message') as string)?.trim();

  if (!title || title.length < 5) return { error: 'El título debe tener al menos 5 caracteres.' };
  if (!VALID_CATEGORIES.includes(category)) return { error: 'Categoría inválida.' };
  if (!message || message.length < 20) return { error: 'El mensaje debe tener al menos 20 caracteres.' };

  const ticket = await db.ticket.create({
    data: {
      title,
      category,
      message,
      userId: session.userid,
      userEmail: session.email ?? '',
    },
  });

  // Handle file attachments
  const files = fd.getAll('attachments') as File[];
  for (const file of files) {
    if (!(file instanceof File) || file.size === 0) continue;
    if (file.size > MAX_FILE_SIZE) continue;
    if (!ALLOWED_TYPES.includes(file.type)) continue;

    const ext = file.name.split('.').pop() ?? 'bin';
    const storedAs = `${crypto.randomUUID()}.${ext}`;
    const filePath = path.join(UPLOAD_DIR, storedAs);

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    await db.ticketAttachment.create({
      data: {
        ticketId: ticket.id,
        filename: file.name,
        storedAs,
        mimeType: file.type,
        size: file.size,
      },
    });
  }

  redirect(`/soporte/${ticket.id}`);
}

export async function addReplyAction(_: unknown, fd: FormData) {
  const session = await getSession();
  if (!session.accountId || !session.userid) return { error: 'Debes iniciar sesión.' };

  const ticketId = parseInt(fd.get('ticketId') as string, 10);
  const message = (fd.get('message') as string)?.trim();

  if (!ticketId || isNaN(ticketId)) return { error: 'Ticket inválido.' };
  if (!message || message.length < 2) return { error: 'El mensaje es demasiado corto.' };

  const ticket = await db.ticket.findUnique({ where: { id: ticketId } });
  if (!ticket) return { error: 'Ticket no encontrado.' };
  if (ticket.userId !== session.userid) return { error: 'No tienes permiso.' };
  if (ticket.status === 'CLOSED') return { error: 'Este ticket está cerrado.' };

  await db.ticketReply.create({
    data: {
      ticketId,
      userId: session.userid,
      isAdmin: false,
      message,
    },
  });

  revalidatePath(`/soporte/${ticketId}`);
  return { success: true };
}

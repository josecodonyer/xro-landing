'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { put } from '@vercel/blob';
import { getSession } from '@/lib/session';
import { db } from '@/lib/db';
import { verifyCaptcha } from '@/lib/captcha';

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

  // Adjuntos → Vercel Blob. Si no hay store configurado, se omiten sin romper el ticket.
  const canUpload = !!process.env.BLOB_READ_WRITE_TOKEN;
  const files = fd.getAll('attachments') as File[];
  for (const file of files) {
    if (!(file instanceof File) || file.size === 0) continue;
    if (file.size > MAX_FILE_SIZE) continue;
    if (!ALLOWED_TYPES.includes(file.type)) continue;
    if (!canUpload) continue;

    const ext = file.name.split('.').pop() ?? 'bin';
    const blob = await put(`tickets/${ticket.id}/${crypto.randomUUID()}.${ext}`, file, {
      access: 'public',
      contentType: file.type,
    });

    await db.ticketAttachment.create({
      data: {
        ticketId: ticket.id,
        filename: file.name,
        storedAs: blob.url, // URL pública (sufijo aleatorio no adivinable)
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

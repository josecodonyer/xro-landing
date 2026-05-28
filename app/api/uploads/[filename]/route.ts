import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { db } from '@/lib/db';
import { isAdmin } from '@/lib/admin';
import path from 'path';
import fs from 'fs/promises';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'tickets');

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const session = await getSession();
  if (!session.accountId || !session.userid) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  // Sanitize filename - only allow UUID-based names
  if (!/^[0-9a-f-]+\.[a-z]+$/i.test(filename)) {
    return new NextResponse('Not found', { status: 404 });
  }

  const attachment = await db.ticketAttachment.findFirst({
    where: { storedAs: filename },
    include: { ticket: true },
  });

  if (!attachment) return new NextResponse('Not found', { status: 404 });

  const adminOk = await isAdmin(session.userid);
  if (attachment.ticket.userId !== session.userid && !adminOk) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const filePath = path.join(UPLOAD_DIR, filename);
  try {
    const buffer = await fs.readFile(filePath);
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': attachment.mimeType,
        'Cache-Control': 'private, max-age=3600',
        'Content-Disposition': `inline; filename="${attachment.filename}"`,
      },
    });
  } catch {
    return new NextResponse('Not found', { status: 404 });
  }
}

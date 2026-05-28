import { NextResponse } from 'next/server';
import { getUserAvatar, jobSpriteUrl, hairColorHex } from '@/lib/avatar';

export async function GET(
  _: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  const avatar = await getUserAvatar(userId);
  if (!avatar) {
    return NextResponse.json({ found: false }, {
      headers: { 'Cache-Control': 'public, max-age=30' },
    });
  }
  return NextResponse.json({
    found:     true,
    spriteUrl: jobSpriteUrl(avatar.charClass),
    hairColor: hairColorHex(avatar.hairColor),
    charClass: avatar.charClass,
    charName:  avatar.charName,
  }, {
    headers: { 'Cache-Control': 'public, max-age=60' },
  });
}

import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getUserAvatar, jobSpriteUrl } from '@/lib/avatar';

export async function GET() {
  const session = await getSession();
  if (!session.accountId || !session.userid) {
    return NextResponse.json({ loggedIn: false });
  }

  const avatar = await getUserAvatar(session.userid);
  return NextResponse.json({
    loggedIn: true,
    userid: session.userid,
    avatar: avatar ? {
      spriteUrl: jobSpriteUrl(avatar.charClass),
      charClass: avatar.charClass,
      charSex: avatar.charSex,
      charName: avatar.charName,
    } : null,
  });
}

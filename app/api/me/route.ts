import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getUserAvatarImage } from '@/lib/avatar';

export async function GET() {
  const session = await getSession();
  if (!session.accountId || !session.userid) {
    return NextResponse.json({ loggedIn: false });
  }

  const avatarImage = await getUserAvatarImage(session.userid);
  return NextResponse.json({
    loggedIn: true,
    userid: session.userid,
    avatarImage,
  });
}

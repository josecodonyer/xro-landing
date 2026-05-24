import { getIronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

export interface SessionData {
  accountId?: number;
  userid?:    string;
  email?:     string;
}

const opts: SessionOptions = {
  cookieName: 'xro_session',
  password:   process.env.SESSION_SECRET!,
  cookieOptions: {
    secure:   process.env.NODE_ENV === 'production',
    maxAge:   60 * 60 * 24 * 7, // 7 días
    httpOnly: true,
    sameSite: 'lax',
  },
};

export async function getSession() {
  return getIronSession<SessionData>(await cookies(), opts);
}

import { NextRequest } from 'next/server';
import { sealData } from 'iron-session';
import { verifyCredentials } from '@/lib/auth';
import { SESSION_COOKIE, SESSION_PASSWORD } from '@/lib/session';

export async function POST(request: NextRequest) {
  const { username, password } = (await request.json()) as {
    username: string;
    password: string;
  };

  if (!username || !password || !verifyCredentials(username, password)) {
    return Response.json(
      { error: 'Usuario o contraseña incorrectos' },
      { status: 401 }
    );
  }

  const sealed = await sealData({ isAdmin: true }, { password: SESSION_PASSWORD });

  const response = Response.json({ success: true });
  response.headers.set(
    'Set-Cookie',
    `${SESSION_COOKIE}=${sealed}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 8}`
  );

  return response;
}

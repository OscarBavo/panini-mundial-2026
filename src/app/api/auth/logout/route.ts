import { SESSION_COOKIE } from '@/lib/session';

export async function POST() {
  const response = Response.json({ success: true });
  response.headers.set(
    'Set-Cookie',
    `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`
  );
  return response;
}

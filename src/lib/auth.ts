import { createHash, timingSafeEqual } from 'crypto';

const ADMIN_USERNAME = 'administrador';
const ADMIN_PASS_HASH = createHash('sha256').update('G4rm1n_92').digest('hex');

export function verifyCredentials(username: string, password: string): boolean {
  if (username !== ADMIN_USERNAME) return false;
  const inputHash = createHash('sha256').update(password).digest();
  const storedHash = Buffer.from(ADMIN_PASS_HASH, 'hex');
  return timingSafeEqual(inputHash, storedHash);
}

import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  const sticker_id = request.nextUrl.searchParams.get('sticker_id');
  const db = getDb();

  if (sticker_id) {
    const exchanges = db.prepare(
      'SELECT * FROM exchange_requests WHERE sticker_id = ? ORDER BY created_at DESC'
    ).all(sticker_id);
    return Response.json(exchanges);
  }

  const exchanges = db.prepare(`
    SELECT er.*, s.player_name, s.selection, s.number
    FROM exchange_requests er
    JOIN stickers s ON er.sticker_id = s.id
    ORDER BY er.created_at DESC
  `).all();
  return Response.json(exchanges);
}

export async function POST(request: NextRequest) {
  const { sticker_id, requester_name, requester_email, sticker_to_exchange } =
    await request.json() as {
      sticker_id: number;
      requester_name: string;
      requester_email: string;
      sticker_to_exchange: string;
    };

  if (!sticker_id || !requester_name || !requester_email || !sticker_to_exchange) {
    return Response.json({ error: 'Todos los campos son requeridos' }, { status: 400 });
  }

  const db = getDb();
  const sticker = db.prepare(
    'SELECT id FROM stickers WHERE id = ? AND is_active = 1 AND quantity > 0'
  ).get(sticker_id);

  if (!sticker) {
    return Response.json({ error: 'Estampa no disponible para intercambio' }, { status: 404 });
  }

  const result = db.prepare(
    'INSERT INTO exchange_requests (sticker_id, requester_name, requester_email, sticker_to_exchange) VALUES (?, ?, ?, ?)'
  ).run(sticker_id, requester_name, requester_email, sticker_to_exchange);

  return Response.json({ id: result.lastInsertRowid, success: true }, { status: 201 });
}

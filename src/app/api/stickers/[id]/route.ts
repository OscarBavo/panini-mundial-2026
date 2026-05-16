import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json() as { is_active?: boolean; quantity?: number };
  const db = getDb();

  const existing = db.prepare('SELECT id, quantity FROM stickers WHERE id = ?').get(id) as
    | { id: number; quantity: number }
    | undefined;
  if (!existing) {
    return Response.json({ error: 'Estampa no encontrada' }, { status: 404 });
  }

  if (typeof body.is_active === 'boolean') {
    const isActive = body.is_active ? 1 : 0;
    const newQuantity = body.is_active ? Math.max(existing.quantity, 1) : 0;
    db.prepare('UPDATE stickers SET is_active = ?, quantity = ? WHERE id = ?')
      .run(isActive, newQuantity, id);
  } else if (typeof body.quantity === 'number') {
    db.prepare('UPDATE stickers SET quantity = ? WHERE id = ?').run(body.quantity, id);
  }

  const updated = db.prepare('SELECT * FROM stickers WHERE id = ?').get(id);
  return Response.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  db.prepare('DELETE FROM exchange_requests WHERE sticker_id = ?').run(id);
  db.prepare('DELETE FROM stickers WHERE id = ?').run(id);
  return Response.json({ success: true });
}

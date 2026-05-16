import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function GET() {
  const db = getDb();
  const stickers = db.prepare(
    'SELECT * FROM stickers ORDER BY created_at DESC'
  ).all();
  return Response.json(stickers);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const selection = (formData.get('selection') as string)?.trim();
  const player_name = (formData.get('player_name') as string)?.trim();
  const number = (formData.get('number') as string)?.trim();
  const quantity = parseInt(formData.get('quantity') as string) || 1;
  const image = formData.get('image') as File | null;

  if (!selection || !player_name || !number) {
    return Response.json(
      { error: 'Selección, nombre y número son requeridos' },
      { status: 400 }
    );
  }

  let image_path: string | null = null;
  if (image && image.size > 0) {
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = image.name.split('.').pop() ?? 'jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    await writeFile(
      path.join(process.cwd(), 'public', 'uploads', filename),
      buffer
    );
    image_path = `/uploads/${filename}`;
  }

  const db = getDb();
  const result = db.prepare(
    'INSERT INTO stickers (selection, player_name, number, quantity, image_path) VALUES (?, ?, ?, ?, ?)'
  ).run(selection, player_name, number, quantity, image_path);

  return Response.json({ id: result.lastInsertRowid, success: true }, { status: 201 });
}

import Database from 'better-sqlite3';
import path from 'path';
import { mkdirSync } from 'fs';

const DB_PATH = path.join(process.cwd(), 'panini.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    mkdirSync(path.join(process.cwd(), 'public', 'uploads'), { recursive: true });
    db = new Database(DB_PATH);
    db.exec(`
      CREATE TABLE IF NOT EXISTS stickers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        selection TEXT NOT NULL,
        player_name TEXT NOT NULL,
        number TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        image_path TEXT,
        is_active INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS exchange_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sticker_id INTEGER NOT NULL,
        requester_name TEXT NOT NULL,
        requester_email TEXT NOT NULL,
        sticker_to_exchange TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sticker_id) REFERENCES stickers(id)
      );
    `);
  }
  return db;
}

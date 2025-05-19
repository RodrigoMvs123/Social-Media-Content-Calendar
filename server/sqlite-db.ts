import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '@shared/schema';

// Create SQLite database
const sqlite = new Database('local.db');
export const db = drizzle(sqlite);

export async function testDatabaseConnection() {
  try {
    sqlite.prepare('SELECT 1').get();
    console.log("✅ SQLite connection successful");
    return true;
  } catch (error) {
    console.error("❌ SQLite connection failed:", error);
    return false;
  }
}

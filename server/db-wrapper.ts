import { DatabaseAdapter } from './db-adapter';
import { SQLiteAdapter } from './sqlite-db';
import { PostgresAdapter } from './postgres-db';
import { validateEnv } from './validateEnv';

// Get database type from environment variables
const dbType = process.env.DB_TYPE || 'sqlite';
const dbPath = process.env.DB_PATH || './data.sqlite';

// Create database adapter based on configuration
let dbAdapter: DatabaseAdapter;

switch (dbType.toLowerCase()) {
  case 'sqlite':
    dbAdapter = new SQLiteAdapter(dbPath);
    break;
  case 'postgres':
    dbAdapter = new PostgresAdapter();
    break;
  default:
    console.warn(`Unknown database type: ${dbType}, falling back to SQLite`);
    dbAdapter = new SQLiteAdapter(dbPath);
}

// Initialize database
const initializeDb = async () => {
  try {
    await dbAdapter.initialize();
    console.log(`Database (${dbType}) initialized successfully`);
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }
};

// Export the database adapter
export const db = dbAdapter;
export const initDb = initializeDb;
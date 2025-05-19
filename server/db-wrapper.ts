// This file provides a unified interface for database operations
// It will use either the real database or the mock database based on environment

import { mockDb, testDatabaseConnection as mockTestConnection } from './mock-db';

let useRealDb = false;
let realDb: any = null;
let realTestConnection: any = null;

// Try to import the real database, but fall back to mock if it fails
try {
  if (process.env.DATABASE_URL) {
    // Only attempt to use real DB if DATABASE_URL is set
    const { db, testDatabaseConnection } = await import('./db');
    realDb = db;
    realTestConnection = testDatabaseConnection;
    useRealDb = true;
    console.log('Using real database connection');
  } else {
    console.log('DATABASE_URL not set, using mock database');
  }
} catch (error) {
  console.log('Error connecting to real database, using mock database instead');
  console.error(error);
}

// Export the appropriate database interface
export const db = useRealDb ? realDb : mockDb;
export const testDatabaseConnection = useRealDb ? realTestConnection : mockTestConnection;

// For debugging
export const isDatabaseMocked = !useRealDb;
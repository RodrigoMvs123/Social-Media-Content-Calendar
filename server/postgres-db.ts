import { Pool } from 'pg';
import { DatabaseAdapter, SocialAccount, Post } from './db-adapter';

// PostgreSQL implementation of the database adapter
export class PostgresAdapter implements DatabaseAdapter {
  private pool: Pool;
  
  constructor(connectionString?: string) {
    this.pool = new Pool({
      connectionString: connectionString || process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false // Required for Render and other cloud providers
      }
    });
  }
  
  async initialize(): Promise<void> {
    // Create tables if they don't exist
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS social_accounts (
        id SERIAL PRIMARY KEY,
        userId TEXT NOT NULL,
        platform TEXT NOT NULL,
        username TEXT NOT NULL,
        accessToken TEXT NOT NULL,
        refreshToken TEXT,
        tokenExpiry TEXT,
        connected BOOLEAN NOT NULL DEFAULT TRUE,
        connectedAt TEXT NOT NULL,
        profileData TEXT,
        UNIQUE(userId, platform)
      );
      
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        userId TEXT NOT NULL,
        platform TEXT NOT NULL,
        content TEXT NOT NULL,
        scheduledTime TEXT NOT NULL,
        status TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);
  }
  
  socialAccounts = {
    findAll: async (userId: string): Promise<SocialAccount[]> => {
      const result = await this.pool.query<SocialAccount>(
        'SELECT * FROM social_accounts WHERE userId = $1',
        [userId]
      );
      return result.rows;
    },
    
    findByPlatform: async (userId: string, platform: string): Promise<SocialAccount | null> => {
      const result = await this.pool.query<SocialAccount>(
        'SELECT * FROM social_accounts WHERE userId = $1 AND platform = $2',
        [userId, platform]
      );
      return result.rows[0] || null;
    },
    
    create: async (account: SocialAccount): Promise<SocialAccount> => {
      const result = await this.pool.query(
        `INSERT INTO social_accounts 
         (userId, platform, username, accessToken, refreshToken, tokenExpiry, connected, connectedAt, profileData)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          account.userId, 
          account.platform, 
          account.username, 
          account.accessToken,
          account.refreshToken, 
          account.tokenExpiry, 
          account.connected, 
          account.connectedAt, 
          account.profileData
        ]
      );
      
      return result.rows[0];
    },
    
    update: async (account: Partial<SocialAccount>): Promise<SocialAccount> => {
      if (!account.userId || !account.platform) {
        throw new Error('userId and platform are required for update');
      }
      
      const fields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;
      
      Object.entries(account).forEach(([key, value]) => {
        if (key !== 'userId' && key !== 'platform' && key !== 'id') {
          fields.push(`${key} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      });
      
      if (fields.length === 0) {
        throw new Error('No fields to update');
      }
      
      values.push(account.userId, account.platform);
      
      const result = await this.pool.query(
        `UPDATE social_accounts SET ${fields.join(', ')} 
         WHERE userId = $${paramIndex} AND platform = $${paramIndex + 1}
         RETURNING *`,
        values
      );
      
      return result.rows[0];
    },
    
    upsert: async (account: SocialAccount): Promise<SocialAccount> => {
      const existing = await this.socialAccounts.findByPlatform(account.userId, account.platform);
      
      if (existing) {
        return this.socialAccounts.update(account);
      } else {
        return this.socialAccounts.create(account);
      }
    },
    
    delete: async (userId: string, platform: string): Promise<void> => {
      await this.pool.query(
        'DELETE FROM social_accounts WHERE userId = $1 AND platform = $2',
        [userId, platform]
      );
    }
  };
  
  posts = {
    findAll: async (userId: string): Promise<Post[]> => {
      const result = await this.pool.query<Post>(
        'SELECT * FROM posts WHERE userId = $1 ORDER BY scheduledTime ASC',
        [userId]
      );
      return result.rows;
    },
    
    findById: async (id: number | string): Promise<Post | null> => {
      const result = await this.pool.query<Post>(
        'SELECT * FROM posts WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    },
    
    create: async (post: Post): Promise<Post> => {
      const now = new Date().toISOString();
      
      const result = await this.pool.query(
        `INSERT INTO posts 
         (userId, platform, content, scheduledTime, status, createdAt, updatedAt)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [
          post.userId, 
          post.platform, 
          post.content, 
          post.scheduledTime,
          post.status, 
          post.createdAt || now, 
          post.updatedAt || now
        ]
      );
      
      return result.rows[0];
    },
    
    update: async (post: Partial<Post>): Promise<Post> => {
      if (!post.id) {
        throw new Error('Post ID is required for update');
      }
      
      const fields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;
      
      Object.entries(post).forEach(([key, value]) => {
        if (key !== 'id') {
          fields.push(`${key} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      });
      
      // Always update the updatedAt field
      fields.push(`updatedAt = $${paramIndex}`);
      values.push(new Date().toISOString());
      paramIndex++;
      
      values.push(post.id);
      
      const result = await this.pool.query(
        `UPDATE posts SET ${fields.join(', ')} 
         WHERE id = $${paramIndex}
         RETURNING *`,
        values
      );
      
      return result.rows[0];
    },
    
    delete: async (id: number | string): Promise<void> => {
      await this.pool.query('DELETE FROM posts WHERE id = $1', [id]);
    }
  };
}
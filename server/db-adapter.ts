// Database adapter interface
// This file defines the interface for database operations
// Implementations can be created for different database systems

export interface SocialAccount {
  id?: number | string;
  userId: string;
  platform: string;
  username: string;
  accessToken: string;
  refreshToken?: string | null;
  tokenExpiry?: string | null;
  connected: boolean;
  connectedAt: string;
  profileData?: string;
}

export interface Post {
  id?: number | string;
  userId: string;
  platform: string;
  content: string;
  scheduledTime: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseAdapter {
  // Social accounts
  socialAccounts: {
    findAll: (userId: string) => Promise<SocialAccount[]>;
    findByPlatform: (userId: string, platform: string) => Promise<SocialAccount | null>;
    create: (account: SocialAccount) => Promise<SocialAccount>;
    update: (account: Partial<SocialAccount>) => Promise<SocialAccount>;
    upsert: (account: SocialAccount) => Promise<SocialAccount>;
    delete: (userId: string, platform: string) => Promise<void>;
  };
  
  // Posts
  posts: {
    findAll: (userId: string) => Promise<Post[]>;
    findById: (id: number | string) => Promise<Post | null>;
    create: (post: Post) => Promise<Post>;
    update: (post: Partial<Post>) => Promise<Post>;
    delete: (id: number | string) => Promise<void>;
  };
  
  // Database initialization
  initialize: () => Promise<void>;
}
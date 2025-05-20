import { Post, SocialMediaAccount } from './types';

// Mock data for posts
let posts: Post[] = [
  {
    id: 1,
    platform: 'Twitter',
    content: 'Just launched our new product! Check it out at example.com #launch #product',
    scheduledTime: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    platform: 'LinkedIn',
    content: 'Excited to announce our latest feature that will revolutionize how you work. Learn more: example.com/feature',
    scheduledTime: new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    platform: 'Instagram',
    content: 'Behind the scenes at our office. #worklife #culture',
    scheduledTime: new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    status: 'published',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock data for social media accounts
let socialMediaAccounts: SocialMediaAccount[] = [
  {
    id: 1,
    platform: 'Twitter',
    username: 'exampleuser',
    connected: true,
    connectedAt: new Date().toISOString(),
    accessToken: 'mock-token-123',
    tokenExpiry: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  },
  {
    id: 2,
    platform: 'LinkedIn',
    username: 'example.user',
    connected: true,
    connectedAt: new Date().toISOString(),
    accessToken: 'mock-token-456',
    tokenExpiry: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
  },
];

// Mock API functions
export const mockApi = {
  // Posts
  getPosts: () => {
    return Promise.resolve([...posts]);
  },
  
  getPostById: (id: number) => {
    const post = posts.find(p => p.id === id);
    if (!post) {
      return Promise.reject(new Error('Post not found'));
    }
    return Promise.resolve({...post});
  },
  
  createPost: (post: Omit<Post, 'id'>) => {
    const newPost = {
      ...post,
      id: posts.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    posts.push(newPost);
    return Promise.resolve({...newPost});
  },
  
  updatePost: (id: number, updates: Partial<Post>) => {
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Post not found'));
    }
    
    posts[index] = {
      ...posts[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    return Promise.resolve({...posts[index]});
  },
  
  deletePost: (id: number) => {
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) {
      return Promise.reject(new Error('Post not found'));
    }
    
    const deletedPost = posts[index];
    posts = posts.filter(p => p.id !== id);
    
    return Promise.resolve({...deletedPost});
  },
  
  // Social Media Accounts
  getSocialMediaAccounts: () => {
    return Promise.resolve([...socialMediaAccounts]);
  },
  
  connectSocialMediaAccount: (account: Omit<SocialMediaAccount, 'id'>) => {
    const existingIndex = socialMediaAccounts.findIndex(a => a.platform === account.platform);
    
    if (existingIndex !== -1) {
      // Update existing account
      socialMediaAccounts[existingIndex] = {
        ...socialMediaAccounts[existingIndex],
        ...account,
        connected: true,
        connectedAt: new Date().toISOString(),
      };
      
      return Promise.resolve({...socialMediaAccounts[existingIndex]});
    } else {
      // Create new account
      const newAccount = {
        ...account,
        id: socialMediaAccounts.length + 1,
        connected: true,
        connectedAt: new Date().toISOString(),
      };
      
      socialMediaAccounts.push(newAccount);
      return Promise.resolve({...newAccount});
    }
  },
  
  disconnectSocialMediaAccount: (platform: string) => {
    const index = socialMediaAccounts.findIndex(a => a.platform === platform);
    if (index === -1) {
      return Promise.reject(new Error('Account not found'));
    }
    
    socialMediaAccounts = socialMediaAccounts.filter(a => a.platform !== platform);
    
    return Promise.resolve({ success: true });
  },
  
  // AI Content Generation
  generateAIContent: (prompt: string) => {
    return Promise.resolve({
      content: `Generated content for: ${prompt}`,
      hashtags: ['#ai', '#generated', '#content']
    });
  },
  
  generateContentIdeas: (topic: string) => {
    return Promise.resolve([
      `Idea 1 for ${topic}`,
      `Idea 2 for ${topic}`,
      `Idea 3 for ${topic}`,
      `Idea 4 for ${topic}`,
      `Idea 5 for ${topic}`
    ]);
  }
};
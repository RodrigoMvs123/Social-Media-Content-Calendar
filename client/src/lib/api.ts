import { Post, SocialMediaAccount } from './types';
import { mockApi } from './mockApi';

// Use mock API for development
const api = mockApi;

// Posts API functions
export const fetchCalendarPosts = () => api.getPosts();
export const getPostById = (id: number) => api.getPostById(id);
export const createPost = (post: Omit<Post, 'id'>) => api.createPost(post);
export const updatePost = (id: number, post: Partial<Post>) => api.updatePost(id, post);
export const deletePost = (id: number) => api.deletePost(id);

// Social Media Accounts API
export const socialAccountsApi = {
  getAll: () => api.getSocialMediaAccounts(),
  connect: (account: Omit<SocialMediaAccount, 'id'>) => api.connectSocialMediaAccount(account),
  disconnect: (platform: string) => api.disconnectSocialMediaAccount(platform),
};

// AI Content Generation
export const generateAIContent = (prompt: string) => api.generateAIContent(prompt);
export const generateContentIdeas = (topic: string) => api.generateContentIdeas(topic);
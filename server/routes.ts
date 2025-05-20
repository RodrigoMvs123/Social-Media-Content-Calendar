import express from 'express';
import { db } from './db-wrapper';

const router = express.Router();

// Social Media Accounts Routes
router.get('/social-accounts', async (req, res) => {
  try {
    const userId = req.session.userId || 'demo-user';
    const accounts = await db.socialAccounts.findAll(userId);
    res.json(accounts);
  } catch (error) {
    console.error('Error fetching social accounts:', error);
    res.status(500).json({ error: 'Failed to fetch social accounts' });
  }
});

router.get('/social-accounts/:platform', async (req, res) => {
  try {
    const userId = req.session.userId || 'demo-user';
    const { platform } = req.params;
    const account = await db.socialAccounts.findByPlatform(userId, platform);
    
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    
    res.json(account);
  } catch (error) {
    console.error('Error fetching social account:', error);
    res.status(500).json({ error: 'Failed to fetch social account' });
  }
});

router.delete('/social-accounts/:platform', async (req, res) => {
  try {
    const userId = req.session.userId || 'demo-user';
    const { platform } = req.params;
    
    await db.socialAccounts.update({
      userId,
      platform,
      connected: false
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error disconnecting account:', error);
    res.status(500).json({ error: 'Failed to disconnect account' });
  }
});

router.post('/social-accounts/:platform/refresh', async (req, res) => {
  try {
    const userId = req.session.userId || 'demo-user';
    const { platform } = req.params;
    
    const account = await db.socialAccounts.findByPlatform(userId, platform);
    
    if (!account || !account.refreshToken) {
      return res.status(404).json({ error: 'Account not found or no refresh token available' });
    }
    
    // In a real implementation, this would call the OAuth provider to refresh the token
    // For demo purposes, we'll just generate a new mock token
    const newToken = `refreshed_token_${Math.random().toString(36).substring(2)}`;
    const expiresIn = 3600; // 1 hour
    
    const updatedAccount = await db.socialAccounts.update({
      userId,
      platform,
      accessToken: newToken,
      tokenExpiry: new Date(Date.now() + expiresIn * 1000).toISOString()
    });
    
    res.json({
      accessToken: newToken,
      tokenExpiry: new Date(Date.now() + expiresIn * 1000).toISOString()
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ error: 'Failed to refresh token' });
  }
});

// Posts Routes
router.get('/posts', async (req, res) => {
  try {
    const userId = req.session.userId || 'demo-user';
    const posts = await db.posts.findAll(userId);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

router.get('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const post = await db.posts.findById(id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

router.post('/posts', async (req, res) => {
  try {
    const userId = req.session.userId || 'demo-user';
    const post = req.body;
    
    // Validate required fields
    if (!post.content || !post.platform || !post.scheduledTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if the user has a connected account for this platform
    const account = await db.socialAccounts.findByPlatform(userId, post.platform);
    
    if (!account || !account.connected) {
      return res.status(400).json({ error: `No connected ${post.platform} account found` });
    }
    
    // Create the post
    const now = new Date().toISOString();
    const newPost = await db.posts.create({
      ...post,
      userId,
      createdAt: now,
      updatedAt: now
    });
    
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

router.put('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const post = await db.posts.findById(id);
    
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    // Update the post
    const updatedPost = await db.posts.update({
      id,
      ...updates,
      updatedAt: new Date().toISOString()
    });
    
    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

router.delete('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.posts.delete(id);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

export default router;
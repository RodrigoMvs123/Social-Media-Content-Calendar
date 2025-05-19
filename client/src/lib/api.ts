import { Post } from "./types";
import { mockPosts } from "./mockApi";

const API_BASE_URL = window.location.origin;
const USE_MOCK_DATA = true; // Set to true to use mock data instead of API calls

export async function fetchCalendarPosts(): Promise<Post[]> {
  if (USE_MOCK_DATA) {
    console.log("Using mock calendar data");
    return Promise.resolve(mockPosts);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/calendar`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching calendar data:", error);
    throw error;
  }
}

export async function createPost(post: Omit<Post, 'id'>): Promise<Post> {
  if (USE_MOCK_DATA) {
    console.log("Creating mock post:", post);
    const newPost = {
      ...post,
      id: mockPosts.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    mockPosts.push(newPost as Post);
    return Promise.resolve(newPost as Post);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/calendar/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(post),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

export async function deletePost(id: number): Promise<boolean> {
  if (USE_MOCK_DATA) {
    console.log("Deleting mock post with ID:", id);
    const index = mockPosts.findIndex(post => post.id === id);
    if (index !== -1) {
      mockPosts.splice(index, 1);
      return Promise.resolve(true);
    }
    return Promise.resolve(false);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/calendar/posts/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

export async function updatePost(id: number, updates: Partial<Post>): Promise<Post> {
  if (USE_MOCK_DATA) {
    console.log("Updating mock post with ID:", id, updates);
    const index = mockPosts.findIndex(post => post.id === id);
    if (index !== -1) {
      const updatedPost = {
        ...mockPosts[index],
        ...updates,
        updatedAt: new Date()
      };
      mockPosts[index] = updatedPost;
      return Promise.resolve(updatedPost);
    }
    throw new Error("Post not found");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/calendar/posts/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

export async function generateAIContent(prompt: string, platform?: string): Promise<string> {
  if (USE_MOCK_DATA) {
    console.log("Generating mock AI content for:", prompt);
    return Promise.resolve(`Generated content for "${prompt}" on ${platform || 'general'} platform.`);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/calendar/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, platform }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("Error generating AI content:", error);
    throw error;
  }
}

export async function generateContentIdeas(topic: string, count: number = 5): Promise<string[]> {
  if (USE_MOCK_DATA) {
    console.log("Generating mock content ideas for:", topic);
    return Promise.resolve([
      `Idea 1 for ${topic}`,
      `Idea 2 for ${topic}`,
      `Idea 3 for ${topic}`,
      `Idea 4 for ${topic}`,
      `Idea 5 for ${topic}`
    ]);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/calendar/ideas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic, count }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.ideas || [];
  } catch (error) {
    console.error("Error generating content ideas:", error);
    throw error;
  }
}

export async function analyzePostSentiment(content: string): Promise<{
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  feedback?: string;
}> {
  if (USE_MOCK_DATA) {
    console.log("Analyzing mock sentiment for:", content);
    return Promise.resolve({
      sentiment: 'positive',
      score: 0.8,
      feedback: 'This post has a positive tone and is likely to be well-received.'
    });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/calendar/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error analyzing post sentiment:", error);
    throw error;
  }
}

export async function optimizePostContent(content: string, platform?: string): Promise<string> {
  if (USE_MOCK_DATA) {
    console.log("Optimizing mock content for:", platform);
    return Promise.resolve(`Optimized: ${content} (for ${platform || 'general'})`);
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/calendar/optimize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, platform }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("Error optimizing post content:", error);
    throw error;
  }
}
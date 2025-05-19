export interface Post {
  id: number;
  platform: string;
  content: string;
  scheduledTime: string | Date;
  status?: 'draft' | 'scheduled' | 'published' | 'needs_approval' | 'ready';
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface PostsGroupedByDate {
  date: string;
  title: string;
  posts: Post[];
}

export interface FilterOptions {
  platform: string;
  dateRange: string;
  status: string;
  searchQuery: string;
}
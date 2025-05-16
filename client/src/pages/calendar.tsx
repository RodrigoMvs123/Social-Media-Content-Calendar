import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCalendarPosts } from "@/lib/api";
import { Post, FilterOptions } from "@/lib/types";
import { Helmet } from "react-helmet";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CalendarView from "@/components/calendar/CalendarView";
import FilterBar from "@/components/filters/FilterBar";
import AddPostDialog from "@/components/dialogs/AddPostDialog";
import EmptyState from "@/components/calendar/EmptyState";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Plus, LayoutGrid, List, CalendarDays } from "lucide-react";

const Calendar = () => {
  const [isAddPostDialogOpen, setIsAddPostDialogOpen] = useState(false);
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterOptions>({
    platform: '',
    dateRange: 'upcoming',
    status: '',
    searchQuery: '',
  });

  const { data: posts, isLoading, isError, refetch } = useQuery({
    queryKey: ['/api/calendar'],
    queryFn: fetchCalendarPosts,
  });

  const handleGenerateAIContent = () => {
    // Implementation for AI generation will be added in a future update
    alert("AI content generation will be added soon!");
  };

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Apply filters to posts
  const filteredPosts = posts?.filter((post: Post) => {
    // Filter by platform
    if (filters.platform && filters.platform !== 'all' && post.platform !== filters.platform) {
      return false;
    }
    
    // Filter by status
    if (filters.status && filters.status !== 'all' && post.status !== filters.status) {
      return false;
    }
    
    // Filter by search query
    if (filters.searchQuery && !post.content.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
      return false;
    }
    
    // Filter by date range will be implemented in a more complete version
    
    return true;
  }) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Calendar - Social Media Content Calendar</title>
        <meta name="description" content="View and manage your social media content calendar" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header with Actions */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <CalendarDays className="mr-2 h-6 w-6 text-blue-600" />
                  Content Calendar
                </h2>
                <p className="text-gray-600 mt-1">View and manage your scheduled social media posts</p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleGenerateAIContent}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate AI Content
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddPostDialogOpen(true)}
                  className="border border-gray-300 text-gray-800"
                >
                  <Plus className="h-5 w-5 mr-2 text-blue-600" />
                  Add New Post
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <FilterBar filters={filters} onFilterChange={handleFilterChange} />

          {/* View Toggle */}
          <div className="flex justify-end mb-6">
            <Tabs defaultValue={activeView} onValueChange={(value) => setActiveView(value as 'grid' | 'list')}>
              <TabsList>
                <TabsTrigger value="list" className="flex items-center">
                  <List size={16} className="mr-1" />
                  List
                </TabsTrigger>
                <TabsTrigger value="grid" className="flex items-center">
                  <LayoutGrid size={16} className="mr-1" />
                  Grid
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          {/* Calendar Content */}
          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Loading posts...</p>
            </div>
          ) : isError ? (
            <div className="text-center py-10">
              <p className="text-red-500">Error loading calendar. Try again later.</p>
              <Button variant="outline" onClick={() => refetch()} className="mt-4">
                Retry
              </Button>
            </div>
          ) : filteredPosts.length === 0 ? (
            <EmptyState onCreatePost={() => setIsAddPostDialogOpen(true)} />
          ) : (
            <CalendarView posts={filteredPosts} viewType={activeView} />
          )}
        </div>
      </main>
      
      <Footer />
      
      <AddPostDialog
        open={isAddPostDialogOpen}
        onOpenChange={setIsAddPostDialogOpen}
        onPostCreated={() => refetch()}
      />
    </div>
  );
};

export default Calendar;
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { socialAccountsApi, createPost } from '@/lib/api';
import { SocialMediaAccount } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface AddPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPostCreated: () => void;
  initialContent?: string;
}

// Check if token is valid
const isTokenValid = (account: SocialMediaAccount): boolean => {
  if (!account.accessToken || !account.tokenExpiry) return false;
  return new Date(account.tokenExpiry) > new Date();
};

const AddPostDialog = ({ open, onOpenChange, onPostCreated, initialContent = '' }: AddPostDialogProps) => {
  const [content, setContent] = useState(initialContent);
  const [platform, setPlatform] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('12:00');
  const [connectedAccounts, setConnectedAccounts] = useState<SocialMediaAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Update content when initialContent changes
  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);
  
  // Load connected accounts on mount
  useEffect(() => {
    const loadAccounts = async () => {
      if (!open) return;
      
      try {
        // Use a safer approach to get accounts
        const accounts = await socialAccountsApi.getAll().catch(() => []);
        setConnectedAccounts(accounts || []);
      } catch (error) {
        console.error('Failed to load accounts:', error);
        // Don't show toast to avoid potential errors
        setConnectedAccounts([]);
      }
    };
    
    if (open) {
      loadAccounts();
    }
  }, [open]);
  
  const handleSubmit = async () => {
    if (!content || !platform || !date) return;
    
    try {
      setIsLoading(true);
      
      // Combine date and time
      const [hours, minutes] = time.split(':').map(Number);
      const scheduledTime = new Date(date);
      scheduledTime.setHours(hours, minutes);
      
      await createPost({
        content,
        platform,
        scheduledTime: scheduledTime.toISOString(),
        status: 'scheduled',
      });
      
      toast({
        title: "Post scheduled",
        description: "Your post has been scheduled successfully.",
      });
      
      // Reset form
      setContent('');
      setPlatform('');
      setDate(new Date());
      setTime('12:00');
      
      // Close dialog and refresh posts
      onOpenChange(false);
      onPostCreated();
    } catch (error) {
      console.error('Failed to create post:', error);
      toast({
        title: "Error",
        description: "Failed to schedule post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Simplified platform selection - avoid complex filtering that might cause issues
  const platforms = ['Twitter', 'LinkedIn', 'Instagram', 'Facebook'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Post</DialogTitle>
          <DialogDescription>
            Create a new post to schedule across your social media platforms.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="platform">Platform</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Select platform" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map(p => (
                  <SelectItem key={p} value={p}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What do you want to share?"
              className="min-h-[100px]"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!content || !platform || !date || isLoading}
          >
            {isLoading ? 'Scheduling...' : 'Schedule Post'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPostDialog;
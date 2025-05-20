import { useState } from 'react';
import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Twitter, Linkedin, Instagram, Facebook } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

// Social Media Account interface
interface SocialMediaAccount {
  id: number;
  platform: string;
  username: string;
  connected: boolean;
  connectedAt: string;
}

// Mock function to simulate connecting to social media
const connectToSocialMedia = (platform: string, username: string, password: string) => {
  // In a real app, this would make an API call to authenticate
  return new Promise<SocialMediaAccount>((resolve) => {
    setTimeout(() => {
      resolve({
        id: Math.floor(Math.random() * 1000),
        platform,
        username,
        connected: true,
        connectedAt: new Date().toISOString(),
      });
    }, 1000);
  });
};

interface SocialMediaLoginDialogProps {
  platform: string;
  icon: React.ReactNode;
  onConnect: (account: SocialMediaAccount) => void;
}

const SocialMediaLoginDialog = ({ platform, icon, onConnect }: SocialMediaLoginDialogProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleConnect = async () => {
    if (!username || !password) return;
    
    setIsLoading(true);
    try {
      const account = await connectToSocialMedia(platform, username, password);
      onConnect(account);
      setOpen(false);
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Failed to connect:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">Connect {platform}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {icon}
            Connect to {platform}
          </DialogTitle>
          <DialogDescription>
            Enter your {platform} credentials to connect your account.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleConnect} disabled={isLoading}>
            {isLoading ? 'Connecting...' : 'Connect'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ConnectPage = () => {
  const [connectedAccounts, setConnectedAccounts] = useState<SocialMediaAccount[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  // Load accounts from localStorage on mount
  useState(() => {
    const savedAccounts = localStorage.getItem('socialMediaAccounts');
    if (savedAccounts) {
      setConnectedAccounts(JSON.parse(savedAccounts));
    }
  });

  // Save accounts to localStorage when they change
  useState(() => {
    if (connectedAccounts.length > 0) {
      localStorage.setItem('socialMediaAccounts', JSON.stringify(connectedAccounts));
    }
  });

  const handleConnect = (account: SocialMediaAccount) => {
    setConnectedAccounts((prev) => {
      // Replace if already exists, otherwise add
      const exists = prev.findIndex((a) => a.platform === account.platform);
      if (exists >= 0) {
        const updated = [...prev];
        updated[exists] = account;
        return updated;
      }
      return [...prev, account];
    });
  };

  const handleDisconnect = (platform: string) => {
    setConnectedAccounts((prev) => prev.filter((account) => account.platform !== platform));
    setSelectedPlatforms((prev) => prev.filter(p => p !== platform));
  };

  const getAccountByPlatform = (platform: string) => {
    return connectedAccounts.find((account) => account.platform === platform);
  };

  const togglePlatformSelection = (platform: string) => {
    setSelectedPlatforms(prev => {
      if (prev.includes(platform)) {
        return prev.filter(p => p !== platform);
      } else {
        return [...prev, platform];
      }
    });
  };

  const renderSocialMediaCard = (
    platform: string,
    icon: React.ReactNode,
    description: string
  ) => {
    const account = getAccountByPlatform(platform);
    const isSelected = selectedPlatforms.includes(platform);
    
    return (
      <Card className={isSelected ? 'border-blue-500 ring-2 ring-blue-200' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {icon}
            {platform}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          {account ? (
            <div className="text-sm">
              <p className="font-medium text-green-600 flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-green-600"></span>
                Connected
              </p>
              <p className="text-gray-500 mt-1">Username: {account.username}</p>
              <p className="text-gray-500 text-xs mt-1">
                Connected on {new Date(account.connectedAt).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Not connected</p>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {account ? (
            <>
              <Button 
                variant="outline" 
                onClick={() => togglePlatformSelection(platform)}
                className="w-full"
              >
                {isSelected ? 'Deselect' : 'Select for Publishing'}
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleDisconnect(platform)}
                className="w-full"
              >
                Disconnect
              </Button>
            </>
          ) : (
            <SocialMediaLoginDialog
              platform={platform}
              icon={icon}
              onConnect={handleConnect}
            />
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Connect Social Media - Social Media Content Calendar</title>
        <meta name="description" content="Connect your social media accounts" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Connect Social Media</h2>
            <p className="text-gray-600 mt-1">Connect your social media accounts to schedule and publish content</p>
          </div>
          
          {selectedPlatforms.length > 0 && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Selected Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {selectedPlatforms.map(platform => (
                  <Badge key={platform} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    {platform}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Posts will be published to these platforms when scheduled
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {renderSocialMediaCard(
              "Twitter",
              <Twitter className="h-5 w-5 text-blue-400" />,
              "Schedule and publish tweets"
            )}
            
            {renderSocialMediaCard(
              "LinkedIn",
              <Linkedin className="h-5 w-5 text-blue-700" />,
              "Share professional updates"
            )}
            
            {renderSocialMediaCard(
              "Instagram",
              <Instagram className="h-5 w-5 text-pink-600" />,
              "Schedule photo and video posts"
            )}
            
            {renderSocialMediaCard(
              "Facebook",
              <Facebook className="h-5 w-5 text-blue-600" />,
              "Manage page posts and updates"
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ConnectPage;
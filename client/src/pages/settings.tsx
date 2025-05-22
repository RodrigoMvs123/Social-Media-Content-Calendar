import { Helmet } from "react-helmet";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SlackSettings from "@/components/slack/SlackSettings";
import SlackStatus from "@/components/slack/SlackStatus";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, User, Lock } from 'lucide-react';

const Settings = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Settings - Social Media Content Calendar</title>
        <meta name="description" content="Configure your social media calendar settings" />
      </Helmet>
      
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            <p className="text-gray-600 mt-1">Configure your social media calendar app</p>
          </div>
          
          <SlackStatus className="mb-8" />
          
          <Tabs defaultValue="slack" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="slack">Slack Integration</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="slack">
              <SlackSettings />
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>
                    Configure how and when you receive notifications about your social media posts.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                      <p className="text-gray-600 mb-2">Receive updates about your scheduled posts via email</p>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="daily-digest" defaultChecked className="h-4 w-4" />
                        <label htmlFor="daily-digest" className="text-sm">Daily digest of upcoming posts</label>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <input type="checkbox" id="post-published" defaultChecked className="h-4 w-4" />
                        <label htmlFor="post-published" className="text-sm">When a post is published</label>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <input type="checkbox" id="post-failed" defaultChecked className="h-4 w-4" />
                        <label htmlFor="post-failed" className="text-sm">When a post fails to publish</label>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Browser Notifications</h3>
                      <p className="text-gray-600 mb-2">Receive real-time notifications in your browser</p>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="browser-notifications" defaultChecked className="h-4 w-4" />
                        <label htmlFor="browser-notifications" className="text-sm">Enable browser notifications</label>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Notification Settings</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="account">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Account Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Profile Information</h3>
                      <div className="space-y-3">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                          <input 
                            type="text" 
                            id="name" 
                            defaultValue="Demo User" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                          <input 
                            type="email" 
                            id="email" 
                            defaultValue="user@example.com" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Password</h3>
                      <div className="space-y-3">
                        <div>
                          <label htmlFor="current-password" className="block text-sm font-medium mb-1">Current Password</label>
                          <input 
                            type="password" 
                            id="current-password" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label htmlFor="new-password" className="block text-sm font-medium mb-1">New Password</label>
                          <input 
                            type="password" 
                            id="new-password" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">Confirm New Password</label>
                          <input 
                            type="password" 
                            id="confirm-password" 
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="flex gap-3">
                    <Button>Save Profile</Button>
                    <Button variant="outline">Change Password</Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Settings;
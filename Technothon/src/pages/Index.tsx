import { useEffect, useState } from 'react';
import { QueryResult } from '@/types';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { ContextPanel } from '@/components/panels/ContextPanel';
import { AuditLogs } from '@/components/admin/AuditLogs';
import { UserManagement } from '@/components/admin/UserManagement';

import { DatabaseIndicator } from '@/components/common/DatabaseIndicator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable';
import { MessageSquare, Shield, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [currentSQL, setCurrentSQL] = useState<string | null>(null);
  const [currentResults, setCurrentResults] = useState<QueryResult | null>(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [activeMainTab, setActiveMainTab] = useState<'chat' | 'admin'>('chat');
  const [isDark, setIsDark] = useState(true);

  // 🔐 ROLE CHECK — BACKEND (localStorage) IS SOURCE OF TRUTH
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      const admin = user.role === "admin";

      setIsAdmin(admin);
      setActiveMainTab(admin ? "admin" : "chat");
    } else {
      setIsAdmin(false);
      setActiveMainTab("chat");
    }
  }, []);

  const handleQueryGenerated = (sql: string, results: QueryResult) => {
    setCurrentSQL(sql);
    setCurrentResults(results);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('light', !isDark);
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">
      {/* Sidebar */}
      <AppSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        onNewChat={() => {
          setActiveChatId(null);
          setCurrentSQL(null);
          setCurrentResults(null);
        }}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-14 border-b border-border/50 flex items-center justify-between px-4 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold text-lg hidden sm:block">
              Query<span className="text-gradient-primary">AI</span>
            </h1>
            <DatabaseIndicator engine="postgresql" isConnected />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </header>

        {/* Tabs */}
        <Tabs
          value={activeMainTab}
          onValueChange={(val) => {
            if (val === "admin" && !isAdmin) return; // 🚫 hard block
            setActiveMainTab(val as 'chat' | 'admin');
          }}
          className="flex-1 flex flex-col min-h-0"
        >
          <div className="px-4 py-2 border-b border-border/50 bg-card/30">
            <TabsList className="glass-card p-1">
              <TabsTrigger value="chat" className="gap-2 data-[state=active]:bg-primary/20">
                <MessageSquare className="w-4 h-4" />
                Query Dashboard
              </TabsTrigger>

              {isAdmin && (
                <TabsTrigger value="admin" className="gap-2 data-[state=active]:bg-warning/20">
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          {/* CHAT TAB */}
          <TabsContent value="chat" className="flex-1 m-0 min-h-0">
            <ResizablePanelGroup direction="horizontal" className="h-full">
              <ResizablePanel defaultSize={50} minSize={35} className="min-h-0">
                <ChatInterface onQueryGenerated={handleQueryGenerated} />
              </ResizablePanel>

              <ResizableHandle withHandle className="bg-border/50 hover:bg-primary/30 transition-colors" />

              <ResizablePanel defaultSize={50} minSize={30} className="min-h-0">
                <ContextPanel
                  sql={currentSQL}
                  results={currentResults}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </TabsContent>

          {/* ADMIN TAB — ONLY RENDERS FOR ADMINS */}
          {isAdmin && (
            <TabsContent value="admin" className="flex-1 m-0 p-4 min-h-0 overflow-auto">
              <div className="grid lg:grid-cols-2 gap-4">
                <AuditLogs />
                <UserManagement />
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Index;

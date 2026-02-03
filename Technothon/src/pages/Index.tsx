import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QueryResult } from "@/types";

import { AppSidebar } from "@/components/layout/AppSidebar";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { ContextPanel } from "@/components/panels/ContextPanel";
import { AuditLogs } from "@/components/admin/AuditLogs";
import { UserManagement } from "@/components/admin/UserManagement";
import { DatabaseIndicator } from "@/components/common/DatabaseIndicator";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";
import { Button } from "@/components/ui/button";

import {
  MessageSquare,
  Shield,
  Sun,
  Moon,
  User,
  LogOut
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [currentSQL, setCurrentSQL] = useState<string | null>(null);
  const [currentResults, setCurrentResults] =
    useState<QueryResult | null>(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [activeMainTab, setActiveMainTab] =
    useState<"chat" | "admin">("chat");

  const [isDark, setIsDark] = useState(true);
  const [user, setUser] = useState<any>(null);

  // 🔥 NEW: sidebar mode
  const [sidebarView, setSidebarView] = useState<"chats" | "settings">("chats");

  // 🔐 AUTH
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const parsed = JSON.parse(storedUser);
    setUser(parsed);

    const admin = parsed.role === "admin";
    setIsAdmin(admin);
    setActiveMainTab(admin ? "admin" : "chat");
  }, [navigate]);

  const handleQueryGenerated = (sql: string, results: QueryResult) => {
    setCurrentSQL(sql);
    setCurrentResults(results);
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("light", !isDark);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden">

      {/* SIDEBAR */}
      <AppSidebar
        isCollapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activeChatId={activeChatId}
        onSelectChat={(id) => {
          setSidebarView("chats");
          setActiveChatId(id);
        }}
        onNewChat={() => {
          setSidebarView("chats");
          setActiveChatId(null);
          setCurrentSQL(null);
          setCurrentResults(null);
        }}
        onOpenSettings={() => setSidebarView("settings")}
        onBackFromSettings={() => setSidebarView("chats")}
        sidebarView={sidebarView}
      >

        {/* 🔧 SETTINGS PANEL (INSIDE SIDEBAR) */}
        {sidebarView === "settings" && (
          <div className="p-4 space-y-6">

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={toggleTheme}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              Toggle Theme
            </Button>

            <Button
              variant="destructive"
              className="w-full justify-start gap-3"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        )}
      </AppSidebar>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* HEADER */}
        <header className="h-14 border-b border-border/50 flex items-center justify-between px-4 bg-card/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <h1 className="font-semibold text-lg hidden sm:block">
              Query<span className="text-gradient-primary">AI</span>
            </h1>
            <DatabaseIndicator engine="postgresql" isConnected />
          </div>
        </header>

        {/* TABS */}
        <Tabs
          value={activeMainTab}
          onValueChange={(val) => {
            if (val === "admin" && !isAdmin) return;
            setActiveMainTab(val as "chat" | "admin");
          }}
          className="flex-1 flex flex-col min-h-0"
        >
          <div className="px-4 py-2 border-b border-border/50 bg-card/30">
            <TabsList className="glass-card p-1">
              <TabsTrigger value="chat" className="gap-2">
                <MessageSquare className="w-4 h-4" />
                Query Dashboard
              </TabsTrigger>

              {isAdmin && (
                <TabsTrigger value="admin" className="gap-2">
                  <Shield className="w-4 h-4" />
                  Admin Panel
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          {/* CHAT */}
          <TabsContent value="chat" className="flex-1 m-0 min-h-0">
            <ResizablePanelGroup direction="horizontal" className="h-full">
              <ResizablePanel defaultSize={50} minSize={35}>
                <ChatInterface onQueryGenerated={handleQueryGenerated} />
              </ResizablePanel>

              <ResizableHandle withHandle />

              <ResizablePanel defaultSize={50} minSize={30}>
                <ContextPanel sql={currentSQL} results={currentResults} />
              </ResizablePanel>
            </ResizablePanelGroup>
          </TabsContent>

          {/* ADMIN */}
          {isAdmin && (
            <TabsContent
              value="admin"
              className="flex-1 m-0 p-4 min-h-0 overflow-auto"
            >
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

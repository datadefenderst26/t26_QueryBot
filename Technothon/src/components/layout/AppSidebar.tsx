import { useState, ReactNode } from "react";
import {
  Star,
  Database,
  ChevronRight,
  Plus,
  Search,
  Settings,
  ChevronLeft,
  FileText,
  Clock,
  LogOut,
  ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  mockChatSessions,
  mockFavorites,
  mockTemplates,
  mockDatabaseSchema
} from "@/data/mockData";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { SidebarSection } from "@/components/sidebar/SidebarSection";
import { SchemaTree } from "@/components/sidebar/SchemaTree";

interface AppSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  activeChatId: string | null;
  onSelectChat: (id: string) => void;

  // 🔥 SETTINGS MODE CONTROL
  sidebarView: "chats" | "settings";
  onOpenSettings: () => void;
  onBackFromSettings: () => void;

  // injected settings UI
  children?: ReactNode;
}

export function AppSidebar({
  isCollapsed,
  onToggle,
  onNewChat,
  activeChatId,
  onSelectChat,
  sidebarView,
  onOpenSettings,
  onBackFromSettings,
  children
}: AppSidebarProps) {
  const [favoritesOpen, setFavoritesOpen] = useState(true);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [schemaOpen, setSchemaOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredHistory = mockChatSessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300",
        isCollapsed ? "w-16" : "w-72"
      )}
    >
      {/* HEADER */}
      <div className="h-14 flex items-center justify-between px-3 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center glow-primary">
              <Database className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold">QueryAI</span>
          </div>
        )}

        <Button variant="ghost" size="icon" onClick={onToggle}>
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* 🔁 SETTINGS MODE */}
      {sidebarView === "settings" ? (
        <>
          {!isCollapsed && (
            <div className="p-3 border-b border-sidebar-border">
              <Button
                variant="ghost"
                className="justify-start w-full gap-2"
                onClick={onBackFromSettings}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </div>
          )}

          <ScrollArea className="flex-1">{children}</ScrollArea>
        </>
      ) : (
        <>
          {/* NEW CHAT */}
          <div className="p-3">
            <Button
              onClick={onNewChat}
              className="w-full bg-primary hover:bg-primary/90"
              size={isCollapsed ? "icon" : "default"}
            >
              <Plus className="w-4 h-4 mr-0 sm:mr-2" />
              {!isCollapsed && "New Chat"}
            </Button>
          </div>

          {/* SEARCH */}
          {!isCollapsed && (
            <div className="px-3 pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                <Input
                  placeholder="Search chats..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          )}

          {/* CHAT CONTENT */}
          <ScrollArea className="flex-1 px-3">
            <div className="space-y-1 py-2">
              <SidebarSection
                title="Favorites"
                icon={<Star className="w-4 h-4" />}
                isOpen={favoritesOpen}
                onOpenChange={setFavoritesOpen}
                isCollapsed={isCollapsed}
                badge={mockFavorites.length}
              >
                {mockFavorites.map(item => (
                  <button
                    key={item.id}
                    onClick={() => onSelectChat(item.id)}
                    className={cn(
                      "w-full px-3 py-2 rounded-lg text-sm text-left",
                      activeChatId === item.id &&
                        "bg-sidebar-accent border-l-2 border-primary"
                    )}
                  >
                    {item.title}
                  </button>
                ))}
              </SidebarSection>

              <SidebarSection
                title="Templates"
                icon={<FileText className="w-4 h-4" />}
                isOpen={templatesOpen}
                onOpenChange={setTemplatesOpen}
                isCollapsed={isCollapsed}
              >
                {mockTemplates.map(t => (
                  <div key={t.id} className="px-3 py-2 text-sm">
                    {t.name}
                  </div>
                ))}
              </SidebarSection>

              <SidebarSection
                title="Schema"
                icon={<Database className="w-4 h-4" />}
                isOpen={schemaOpen}
                onOpenChange={setSchemaOpen}
                isCollapsed={isCollapsed}
              >
                <SchemaTree tables={mockDatabaseSchema} />
              </SidebarSection>

              <SidebarSection
                title="Recent Chats"
                icon={<Clock className="w-4 h-4" />}
                isOpen={historyOpen}
                onOpenChange={setHistoryOpen}
                isCollapsed={isCollapsed}
              >
                {filteredHistory.map(session => (
                  <button
                    key={session.id}
                    onClick={() => onSelectChat(session.id)}
                    className="w-full px-3 py-2 text-sm text-left rounded-lg"
                  >
                    {session.title}
                  </button>
                ))}
              </SidebarSection>
            </div>
          </ScrollArea>
        </>
      )}

      {/* FOOTER */}
      <div className="p-3 border-t border-sidebar-border">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={onOpenSettings}
            >
              <Settings className="w-4 h-4 mr-2" />
              {!isCollapsed && "Settings"}
            </Button>
          </TooltipTrigger>
          {isCollapsed && (
            <TooltipContent side="right">Settings</TooltipContent>
          )}
        </Tooltip>
      </div>
    </aside>
  );
}

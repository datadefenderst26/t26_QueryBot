import { useState } from 'react';
import { 
  MessageSquare, 
  Star, 
  Database, 
  ChevronRight, 
  Plus,
  Search,
  Settings,
  HelpCircle,
  ChevronLeft,
  FileText,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { mockChatSessions, mockFavorites, mockTemplates, mockDatabaseSchema } from '@/data/mockData';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { SidebarSection } from '@/components/sidebar/SidebarSection';
import { SchemaTree } from '@/components/sidebar/SchemaTree';

interface AppSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onNewChat: () => void;
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
}

export function AppSidebar({ 
  isCollapsed, 
  onToggle, 
  onNewChat, 
  activeChatId, 
  onSelectChat 
}: AppSidebarProps) {
  const [favoritesOpen, setFavoritesOpen] = useState(true);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [schemaOpen, setSchemaOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHistory = mockChatSessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <aside 
      className={cn(
        "h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-72"
      )}
    >
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-3 border-b border-sidebar-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center glow-primary">
              <Database className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold text-sidebar-foreground">QueryAI</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggle}
          className="h-8 w-8 text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        {isCollapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={onNewChat}
                className="w-full h-10 bg-primary hover:bg-primary/90 glow-primary"
                size="icon"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">New Chat</TooltipContent>
          </Tooltip>
        ) : (
          <Button 
            onClick={onNewChat}
            className="w-full bg-primary hover:bg-primary/90 glow-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        )}
      </div>

      {/* Search */}
      {!isCollapsed && (
        <div className="px-3 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search chats..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      )}

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3">
        <div className="space-y-1 py-2">
          {/* Favorites */}
          <SidebarSection
            title="Favorites"
            icon={<Star className="w-4 h-4" />}
            isOpen={favoritesOpen}
            onOpenChange={setFavoritesOpen}
            isCollapsed={isCollapsed}
            badge={mockFavorites.length}
          >
            {mockFavorites.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelectChat(item.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                  "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent",
                  activeChatId === item.id && "bg-sidebar-accent text-sidebar-foreground border-l-2 border-primary"
                )}
              >
                <div className="flex items-center gap-2">
                  <Star className="w-3 h-3 text-warning fill-warning" />
                  <span className="truncate">{item.title}</span>
                </div>
              </button>
            ))}
          </SidebarSection>

          {/* Templates */}
          <SidebarSection
            title="Templates"
            icon={<FileText className="w-4 h-4" />}
            isOpen={templatesOpen}
            onOpenChange={setTemplatesOpen}
            isCollapsed={isCollapsed}
            badge={mockTemplates.length}
          >
            {mockTemplates.map((template) => (
              <button
                key={template.id}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
              >
                <div className="truncate">{template.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5 truncate">
                  {template.description}
                </div>
              </button>
            ))}
          </SidebarSection>

          {/* Schema Browser */}
          <SidebarSection
            title="Schema"
            icon={<Database className="w-4 h-4" />}
            isOpen={schemaOpen}
            onOpenChange={setSchemaOpen}
            isCollapsed={isCollapsed}
          >
            <SchemaTree tables={mockDatabaseSchema} />
          </SidebarSection>

          {/* Section Divider */}
          {!isCollapsed && (
            <div className="py-2">
              <div className="h-px bg-sidebar-border" />
            </div>
          )}

          {/* Recent Chats */}
          <SidebarSection
            title="Recent Chats"
            icon={<Clock className="w-4 h-4" />}
            isOpen={historyOpen}
            onOpenChange={setHistoryOpen}
            isCollapsed={isCollapsed}
            badge={filteredHistory.length}
          >
            {filteredHistory.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectChat(session.id)}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                  "text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent",
                  activeChatId === session.id && "bg-sidebar-accent text-sidebar-foreground border-l-2 border-primary"
                )}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{session.title}</span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5 pl-5">
                  {session.updatedAt.toLocaleDateString()}
                </div>
              </button>
            ))}
          </SidebarSection>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border space-y-1">
        {isCollapsed ? (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-full h-10 text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="w-full h-10 text-sidebar-foreground hover:bg-sidebar-accent"
                >
                  <HelpCircle className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Help</TooltipContent>
            </Tooltip>
          </>
        ) : (
          <>
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent">
              <HelpCircle className="w-4 h-4 mr-2" />
              Help & Support
            </Button>
          </>
        )}
      </div>
    </aside>
  );
}

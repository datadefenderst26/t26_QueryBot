import { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SidebarSectionProps {
  title: string;
  icon: ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  isCollapsed: boolean;
  children: ReactNode;
  badge?: number;
}

export function SidebarSection({
  title,
  icon,
  isOpen,
  onOpenChange,
  isCollapsed,
  children,
  badge,
}: SidebarSectionProps) {
  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-full h-10 text-sidebar-foreground hover:bg-sidebar-accent relative"
          >
            {icon}
            {badge !== undefined && badge > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-medium bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                {badge > 9 ? '9+' : badge}
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">{title}</TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="ghost" 
          className="w-full justify-between text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm">{title}</span>
            {badge !== undefined && badge > 0 && (
              <span className="ml-auto text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </div>
          <ChevronRight className={cn(
            "w-4 h-4 transition-transform",
            isOpen && "rotate-90"
          )} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-0.5 pt-1">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

import { cn } from '@/lib/utils';
import { Shield, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface RoleToggleProps {
  isAdmin: boolean;
  onToggle: () => void;
  className?: string;
}

export function RoleToggle({ isAdmin, onToggle, className }: RoleToggleProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className={cn(
            "h-8 px-3 gap-2",
            isAdmin 
              ? "bg-warning/10 text-warning hover:bg-warning/20" 
              : "bg-primary/10 text-primary hover:bg-primary/20",
            className
          )}
        >
          {isAdmin ? (
            <>
              <Shield className="w-4 h-4" />
              <span className="text-xs font-medium">Admin</span>
            </>
          ) : (
            <>
              <User className="w-4 h-4" />
              <span className="text-xs font-medium">User</span>
            </>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        Click to switch to {isAdmin ? 'User' : 'Admin'} view
      </TooltipContent>
    </Tooltip>
  );
}

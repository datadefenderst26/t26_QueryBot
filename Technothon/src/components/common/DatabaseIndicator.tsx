import { DatabaseEngine } from '@/types';
import { cn } from '@/lib/utils';
import { 
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface DatabaseIndicatorProps {
  engine: DatabaseEngine;
  isConnected?: boolean;
  className?: string;
}

const engineConfig: Record<DatabaseEngine, { name: string; color: string }> = {
  postgresql: { name: 'PostgreSQL', color: 'bg-[#336791]' },
  mysql: { name: 'MySQL', color: 'bg-[#4479A1]' },
  sqlite: { name: 'SQLite', color: 'bg-[#003B57]' },
  mssql: { name: 'SQL Server', color: 'bg-[#CC2927]' },
};

export function DatabaseIndicator({ engine, isConnected = true, className }: DatabaseIndicatorProps) {
  const config = engineConfig[engine];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium",
          "bg-muted/50 border border-border/50",
          className
        )}>
          <div className={cn(
            "w-2.5 h-2.5 rounded-full",
            isConnected ? config.color : "bg-muted-foreground"
          )} />
          <span className="text-muted-foreground">{config.name}</span>
          {isConnected && (
            <div className="status-dot status-online ml-1" />
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        {isConnected ? `Connected to ${config.name}` : `${config.name} - Disconnected`}
      </TooltipContent>
    </Tooltip>
  );
}

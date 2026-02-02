import { Table2, Key, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DatabaseTable } from '@/types';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface SchemaTreeProps {
  tables: DatabaseTable[];
}

export function SchemaTree({ tables }: SchemaTreeProps) {
  return (
    <div className="space-y-0.5">
      {tables.map((table) => (
        <Collapsible key={table.name}>
          <CollapsibleTrigger asChild>
            <button className="w-full text-left px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors flex items-center justify-between group">
              <div className="flex items-center gap-2">
                <Table2 className="w-3.5 h-3.5" />
                <span>{table.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {table.rowCount.toLocaleString()}
              </span>
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pl-6 space-y-0.5">
            {table.columns.map((col) => (
              <div 
                key={col.name}
                className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground"
              >
                {col.isPrimaryKey && <Key className="w-3 h-3 text-warning" />}
                {col.isForeignKey && <Link2 className="w-3 h-3 text-primary" />}
                {!col.isPrimaryKey && !col.isForeignKey && <span className="w-3" />}
                <span className="truncate">{col.name}</span>
                <span className="text-muted-foreground/60 ml-auto">{col.type.split('(')[0]}</span>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}

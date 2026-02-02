import { useState } from 'react';
import { Copy, Check, Zap, AlertTriangle, Play, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

interface SQLPanelProps {
  sql: string;
  onExecute?: () => void;
  onShowSafetyModal?: () => void;
}

export function SQLPanel({ sql, onExecute, onShowSafetyModal }: SQLPanelProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  const handleCopy = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isDestructive = sql.toLowerCase().includes('delete') || sql.toLowerCase().includes('update');
  const hasOptimization = sql.toLowerCase().includes('select');

  const formatSQL = (sql: string) => {
    // Simple SQL syntax highlighting
    const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT', 'RIGHT', 'INNER', 'ON', 'AND', 'OR', 'GROUP BY', 'ORDER BY', 'LIMIT', 'AS', 'COUNT', 'SUM', 'AVG', 'DATE_TRUNC', 'CURRENT_DATE', 'INTERVAL', 'DESC', 'ASC', 'INSERT', 'UPDATE', 'DELETE', 'INTO', 'VALUES', 'SET'];
    
    let formatted = sql;
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      formatted = formatted.replace(regex, `<span class="text-accent">${keyword}</span>`);
    });
    
    // Highlight strings
    formatted = formatted.replace(/'[^']*'/g, '<span class="text-success">$&</span>');
    
    // Highlight numbers
    formatted = formatted.replace(/\b\d+\b/g, '<span class="text-warning">$&</span>');
    
    return formatted;
  };

  return (
    <div className="glass-card overflow-hidden">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-3">
              <h3 className="font-medium text-sm">Generated SQL</h3>
              {hasOptimization && (
                <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                  <Zap className="w-3 h-3 mr-1" />
                  Optimized
                </Badge>
              )}
              {isDestructive && (
                <Badge variant="outline" className="text-xs bg-destructive/10 text-destructive border-destructive/30">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Destructive
                </Badge>
              )}
            </div>
            <ChevronDown className={cn(
              "w-4 h-4 text-muted-foreground transition-transform",
              isExpanded && "rotate-180"
            )} />
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4">
            <div className="sql-code-block p-4 overflow-x-auto">
              <pre 
                className="text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: formatSQL(sql) }}
              />
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCopy}
                  className="h-8 text-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 mr-1 text-success" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1" />
                      Copy SQL
                    </>
                  )}
                </Button>
              </div>

              <Button 
                size="sm"
                onClick={isDestructive ? onShowSafetyModal : onExecute}
                className={cn(
                  "h-8",
                  isDestructive 
                    ? "bg-destructive hover:bg-destructive/90" 
                    : "bg-accent hover:bg-accent/90 glow-accent"
                )}
              >
                <Play className="w-3 h-3 mr-1" />
                {isDestructive ? 'Review & Execute' : 'Run Query'}
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

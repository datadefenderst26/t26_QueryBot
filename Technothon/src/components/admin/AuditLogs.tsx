import { mockAuditLogs } from '@/data/mockData';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export function AuditLogs() {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-warning" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return null;
    }
  };

  const getActionBadge = (action: string) => {
    const variants: Record<string, string> = {
      'SELECT': 'bg-primary/20 text-primary border-primary/30',
      'INSERT': 'bg-success/20 text-success border-success/30',
      'UPDATE': 'bg-warning/20 text-warning border-warning/30',
      'DELETE': 'bg-destructive/20 text-destructive border-destructive/30',
    };
    return variants[action] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="glass-card overflow-hidden h-full">
      <div className="px-4 py-3 border-b border-border/50">
        <h3 className="font-medium">Audit Logs</h3>
        <p className="text-xs text-muted-foreground mt-1">Recent database operations</p>
      </div>
      
      <ScrollArea className="h-[400px]">
        <Table>
          <TableHeader>
            <TableRow className="table-header hover:bg-transparent">
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead>User</TableHead>
              <TableHead className="w-[100px]">Action</TableHead>
              <TableHead>SQL Query</TableHead>
              <TableHead className="w-[100px]">Rows</TableHead>
              <TableHead className="w-[150px]">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAuditLogs.map((log, index) => (
              <TableRow 
                key={log.id} 
                className="table-row-hover animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(log.status)}
                    <span className="text-xs capitalize">{log.status}</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">{log.user}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("text-xs", getActionBadge(log.action))}>
                    {log.action}
                  </Badge>
                </TableCell>
                <TableCell>
                  <code className="text-xs bg-muted/50 px-2 py-1 rounded font-mono max-w-[300px] truncate block">
                    {log.sql.length > 50 ? log.sql.substring(0, 50) + '...' : log.sql}
                  </code>
                </TableCell>
                <TableCell className="text-sm font-mono">
                  {log.affectedRows?.toLocaleString() || '—'}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {log.timestamp.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}

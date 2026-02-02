import { Database, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DatabaseInfo {
  id: string;
  name: string;
  engine: string;
  isConnected: boolean;
}

const mockDatabases: DatabaseInfo[] = [
  { id: '1', name: 'Production DB', engine: 'PostgreSQL', isConnected: true },
  { id: '2', name: 'Analytics DB', engine: 'PostgreSQL', isConnected: true },
  { id: '3', name: 'Staging DB', engine: 'MySQL', isConnected: true },
  { id: '4', name: 'Legacy DB', engine: 'SQL Server', isConnected: false },
  { id: '5', name: 'Backup DB', engine: 'PostgreSQL', isConnected: false },
  { id: '6', name: 'Dev DB', engine: 'SQLite', isConnected: true },
];

export function DatabaseStatus() {
  const connectedCount = mockDatabases.filter(db => db.isConnected).length;
  const disconnectedCount = mockDatabases.filter(db => !db.isConnected).length;

  return (
    <Card className="glass-card border-border/50">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Database className="w-5 h-5 text-primary" />
            Database Status
          </CardTitle>
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5 text-success">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              {connectedCount} Connected
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <div className="w-2 h-2 rounded-full bg-muted-foreground" />
              {disconnectedCount} Offline
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {mockDatabases.map((db) => (
            <div
              key={db.id}
              className={cn(
                "relative p-4 rounded-xl border transition-all duration-200",
                "bg-muted/30 hover:bg-muted/50",
                db.isConnected 
                  ? "border-success/30 hover:border-success/50" 
                  : "border-border/50 hover:border-muted-foreground/50"
              )}
              style={db.isConnected ? { 
                boxShadow: '0 0 20px -8px hsl(142 71% 45% / 0.3)' 
              } : {}}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{db.name}</h4>
                  <p className="text-xs text-muted-foreground">{db.engine}</p>
                </div>
                <div className={cn(
                  "flex-shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
                  db.isConnected 
                    ? "bg-success/20 text-success" 
                    : "bg-muted text-muted-foreground"
                )}>
                  {db.isConnected ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      Connected
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3" />
                      Offline
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, Database, Table2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SafetyModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  sql: string;
  affectedTables: string[];
  estimatedRows: number;
}

export function SafetyModal({ 
  open, 
  onClose, 
  onConfirm, 
  sql, 
  affectedTables, 
  estimatedRows 
}: SafetyModalProps) {
  const isDelete = sql.toLowerCase().includes('delete');
  const isUpdate = sql.toLowerCase().includes('update');

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="glass-card-elevated max-w-lg">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <AlertDialogTitle className="text-lg">
                {isDelete ? 'Confirm Deletion' : 'Confirm Update'}
              </AlertDialogTitle>
              <Badge variant="outline" className="mt-1 bg-destructive/10 text-destructive border-destructive/30">
                Destructive Operation
              </Badge>
            </div>
          </div>
          <AlertDialogDescription className="text-muted-foreground">
            This action will {isDelete ? 'permanently delete' : 'modify'} data in your database. 
            Please review the impact before proceeding.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4 py-4">
          {/* Affected Tables */}
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 text-sm font-medium mb-3">
              <Database className="w-4 h-4 text-primary" />
              Affected Tables
            </div>
            <div className="flex flex-wrap gap-2">
              {affectedTables.map((table) => (
                <div 
                  key={table}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 text-sm"
                >
                  <Table2 className="w-3.5 h-3.5 text-muted-foreground" />
                  {table}
                </div>
              ))}
            </div>
          </div>

          {/* Impact Summary */}
          <div className="glass-card p-4">
            <div className="text-sm font-medium mb-3">Impact Summary</div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">Estimated Rows</div>
                <div className="text-xl font-semibold text-destructive">
                  {estimatedRows.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-muted-foreground">Operation Type</div>
                <div className="text-xl font-semibold">
                  {isDelete ? 'DELETE' : 'UPDATE'}
                </div>
              </div>
            </div>
          </div>

          {/* SQL Preview */}
          <div className="sql-code-block p-3">
            <pre className="text-xs text-muted-foreground overflow-x-auto">
              {sql.length > 200 ? sql.substring(0, 200) + '...' : sql}
            </pre>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel className="bg-muted hover:bg-muted/80">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-destructive hover:bg-destructive/90"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Yes, {isDelete ? 'Delete' : 'Update'} Data
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

import { useState } from 'react';
import { QueryResult } from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  Download, 
  FileSpreadsheet,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface DataTableProps {
  result: QueryResult;
  onExportCSV?: () => void;
  onExportSheets?: () => void;
}

type SortDirection = 'asc' | 'desc' | null;

export function DataTable({ result, onExportCSV, onExportSheets }: DataTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [filter, setFilter] = useState('');

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedRows = [...result.rows].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;
    
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    
    if (sortDirection === 'asc') {
      return aStr.localeCompare(bStr);
    }
    return bStr.localeCompare(aStr);
  });

  const filteredRows = sortedRows.filter(row => 
    Object.values(row).some(val => 
      String(val).toLowerCase().includes(filter.toLowerCase())
    )
  );

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'number') {
      if (value >= 1000) return value.toLocaleString();
      if (value % 1 !== 0) return value.toFixed(2);
    }
    return String(value);
  };

  return (
    <div className="glass-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-4">
          <h3 className="font-medium text-sm">Query Results</h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{result.rowCount} rows</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {result.executionTime}s
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Filter results..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="h-8 w-48 pl-8 text-xs bg-muted/50 border-border/50"
            />
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-xs"
            onClick={onExportCSV}
          >
            <Download className="w-3 h-3 mr-1" />
            CSV
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-xs"
            onClick={onExportSheets}
          >
            <FileSpreadsheet className="w-3 h-3 mr-1" />
            Sheets
          </Button>
        </div>
      </div>

      {/* Table */}
      <ScrollArea className="w-full">
        <Table>
          <TableHeader>
            <TableRow className="table-header hover:bg-transparent">
              {result.columns.map((column) => (
                <TableHead 
                  key={column}
                  className="cursor-pointer select-none"
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-2">
                    <span>{column.replace(/_/g, ' ')}</span>
                    {sortColumn === column ? (
                      sortDirection === 'asc' ? (
                        <ArrowUp className="w-3 h-3" />
                      ) : (
                        <ArrowDown className="w-3 h-3" />
                      )
                    ) : (
                      <ArrowUpDown className="w-3 h-3 opacity-50" />
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRows.length === 0 ? (
              <TableRow>
                <TableCell 
                  colSpan={result.columns.length} 
                  className="text-center py-8 text-muted-foreground"
                >
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              filteredRows.map((row, index) => (
                <TableRow 
                  key={index} 
                  className="table-row-hover animate-fade-in"
                  style={{ animationDelay: `${index * 20}ms` }}
                >
                  {result.columns.map((column) => (
                    <TableCell 
                      key={column}
                      className={cn(
                        "text-sm",
                        typeof row[column] === 'number' && "font-mono"
                      )}
                    >
                      {formatValue(row[column])}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}

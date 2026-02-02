import { useState } from 'react';
import { QueryResult } from '@/types';
import { SQLPanel } from '@/components/sql/SQLPanel';
import { SafetyModal } from '@/components/sql/SafetyModal';
import { DataTable } from '@/components/data/DataTable';
import { ChartWidget } from '@/components/data/ChartWidget';
import { LoadingSkeleton } from '@/components/data/LoadingSkeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Code, Table2, BarChart3, Database } from 'lucide-react';

interface ContextPanelProps {
  sql: string | null;
  results: QueryResult | null;
  isLoading?: boolean;
}

export function ContextPanel({ sql, results, isLoading }: ContextPanelProps) {
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [activeTab, setActiveTab] = useState('sql');

  // Transform results for charts
  const barChartData = results?.rows.slice(0, 6).map(row => ({
    name: String(row[results.columns[0]]).slice(0, 10),
    value: Number(row[results.columns[2]]) || 0,
  })) || [];

  const lineChartData = results?.rows.slice(0, 6).map(row => ({
    name: String(row[results.columns[0]]).slice(0, 10),
    value: Number(row[results.columns[1]]) || 0,
  })) || [];

  const pieChartData = results?.rows.slice(0, 4).map(row => ({
    name: String(row[results.columns[3] || results.columns[0]]),
    value: Number(row[results.columns[2] || results.columns[1]]) || 1,
  })) || [];

  if (!sql && !results && !isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center">
            <Database className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-muted-foreground mb-2">No Query Results</h3>
          <p className="text-sm text-muted-foreground/60 max-w-xs mx-auto">
            Ask a question in the chat to generate SQL queries and visualize your data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 pt-4">
          <TabsList className="glass-card p-1 w-full justify-start">
            <TabsTrigger value="sql" className="gap-2 data-[state=active]:bg-primary/20">
              <Code className="w-4 h-4" />
              SQL
            </TabsTrigger>
            <TabsTrigger value="table" className="gap-2 data-[state=active]:bg-primary/20">
              <Table2 className="w-4 h-4" />
              Table
            </TabsTrigger>
            <TabsTrigger value="charts" className="gap-2 data-[state=active]:bg-primary/20">
              <BarChart3 className="w-4 h-4" />
              Charts
            </TabsTrigger>
          </TabsList>
        </div>

        <ScrollArea className="flex-1 p-4">
          <TabsContent value="sql" className="mt-0 space-y-4">
            {isLoading ? (
              <LoadingSkeleton type="sql" />
            ) : sql ? (
              <SQLPanel 
                sql={sql} 
                onExecute={() => console.log('Execute query')}
                onShowSafetyModal={() => setShowSafetyModal(true)}
              />
            ) : null}
          </TabsContent>

          <TabsContent value="table" className="mt-0">
            {isLoading ? (
              <LoadingSkeleton type="table" />
            ) : results ? (
              <DataTable 
                result={results}
                onExportCSV={() => console.log('Export CSV')}
                onExportSheets={() => console.log('Export to Sheets')}
              />
            ) : null}
          </TabsContent>

          <TabsContent value="charts" className="mt-0 space-y-4">
            {isLoading ? (
              <>
                <LoadingSkeleton type="chart" />
                <LoadingSkeleton type="chart" />
              </>
            ) : results ? (
              <div className="grid gap-4">
                <ChartWidget
                  type="bar"
                  data={barChartData}
                  dataKey="value"
                  nameKey="name"
                  title="Revenue by Customer"
                />
                <div className="grid grid-cols-2 gap-4">
                  <ChartWidget
                    type="line"
                    data={lineChartData}
                    dataKey="value"
                    nameKey="name"
                    title="Order Trends"
                  />
                  <ChartWidget
                    type="pie"
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    title="Segment Distribution"
                  />
                </div>
              </div>
            ) : null}
          </TabsContent>
        </ScrollArea>
      </Tabs>

      <SafetyModal
        open={showSafetyModal}
        onClose={() => setShowSafetyModal(false)}
        onConfirm={() => {
          setShowSafetyModal(false);
          console.log('Confirmed destructive operation');
        }}
        sql={sql || ''}
        affectedTables={['orders', 'order_items']}
        estimatedRows={89}
      />
    </div>
  );
}

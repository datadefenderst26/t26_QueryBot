export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sql?: string;
  results?: QueryResult;
  isLoading?: boolean;
}

export interface QueryResult {
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  executionTime: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SavedTemplate {
  id: string;
  name: string;
  description: string;
  prompt: string;
  category: string;
}

export interface DatabaseTable {
  name: string;
  columns: DatabaseColumn[];
  rowCount: number;
}

export interface DatabaseColumn {
  name: string;
  type: string;
  isPrimaryKey: boolean;
  isForeignKey: boolean;
  isNullable: boolean;
  references?: {
    table: string;
    column: string;
  };
}

export interface AuditLogEntry {
  id: string;
  user: string;
  action: string;
  sql: string;
  timestamp: Date;
  status: 'success' | 'error' | 'warning';
  affectedRows?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  status: 'active' | 'inactive';
  lastActive: Date;
}

export type DatabaseEngine = 'postgresql' | 'mysql' | 'sqlite' | 'mssql';

export interface ChartData {
  type: 'bar' | 'line' | 'pie';
  data: unknown[];
  labels: string[];
}

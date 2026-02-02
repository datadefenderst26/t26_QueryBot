import { 
  ChatSession, 
  SavedTemplate, 
  DatabaseTable, 
  AuditLogEntry, 
  User,
  QueryResult 
} from '@/types';

export const mockChatSessions: ChatSession[] = [
  {
    id: '1',
    title: 'Monthly Sales Analysis',
    messages: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Customer Segmentation',
    messages: [],
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
  },
  {
    id: '3',
    title: 'Inventory Report Q4',
    messages: [],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: '4',
    title: 'Revenue by Region',
    messages: [],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
];

export const mockFavorites: ChatSession[] = [
  {
    id: 'fav-1',
    title: 'Top Revenue Query',
    messages: [],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'fav-2',
    title: 'Daily Active Users',
    messages: [],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-14'),
  },
];

export const mockTemplates: SavedTemplate[] = [
  {
    id: '1',
    name: 'Top Customers',
    description: 'Find top customers by revenue',
    prompt: 'Show me the top 10 customers by total revenue',
    category: 'Sales',
  },
  {
    id: '2',
    name: 'Monthly Trends',
    description: 'Analyze monthly sales trends',
    prompt: 'What are the sales trends for the last 12 months?',
    category: 'Analytics',
  },
  {
    id: '3',
    name: 'Low Stock Alert',
    description: 'Products with low inventory',
    prompt: 'Which products have less than 10 units in stock?',
    category: 'Inventory',
  },
  {
    id: '4',
    name: 'User Activity',
    description: 'Recent user login activity',
    prompt: 'Show user login activity for the past week',
    category: 'Users',
  },
];

export const mockDatabaseSchema: DatabaseTable[] = [
  {
    name: 'customers',
    rowCount: 15420,
    columns: [
      { name: 'id', type: 'uuid', isPrimaryKey: true, isForeignKey: false, isNullable: false },
      { name: 'name', type: 'varchar(255)', isPrimaryKey: false, isForeignKey: false, isNullable: false },
      { name: 'email', type: 'varchar(255)', isPrimaryKey: false, isForeignKey: false, isNullable: false },
      { name: 'created_at', type: 'timestamp', isPrimaryKey: false, isForeignKey: false, isNullable: false },
      { name: 'segment', type: 'varchar(50)', isPrimaryKey: false, isForeignKey: false, isNullable: true },
    ],
  },
  {
    name: 'orders',
    rowCount: 89234,
    columns: [
      { name: 'id', type: 'uuid', isPrimaryKey: true, isForeignKey: false, isNullable: false },
      { name: 'customer_id', type: 'uuid', isPrimaryKey: false, isForeignKey: true, isNullable: false, references: { table: 'customers', column: 'id' } },
      { name: 'total', type: 'decimal(10,2)', isPrimaryKey: false, isForeignKey: false, isNullable: false },
      { name: 'status', type: 'varchar(20)', isPrimaryKey: false, isForeignKey: false, isNullable: false },
      { name: 'created_at', type: 'timestamp', isPrimaryKey: false, isForeignKey: false, isNullable: false },
    ],
  },
  {
    name: 'products',
    rowCount: 2847,
    columns: [
      { name: 'id', type: 'uuid', isPrimaryKey: true, isForeignKey: false, isNullable: false },
      { name: 'name', type: 'varchar(255)', isPrimaryKey: false, isForeignKey: false, isNullable: false },
      { name: 'category', type: 'varchar(100)', isPrimaryKey: false, isForeignKey: false, isNullable: false },
      { name: 'price', type: 'decimal(10,2)', isPrimaryKey: false, isForeignKey: false, isNullable: false },
      { name: 'stock', type: 'integer', isPrimaryKey: false, isForeignKey: false, isNullable: false },
    ],
  },
  {
    name: 'order_items',
    rowCount: 234567,
    columns: [
      { name: 'id', type: 'uuid', isPrimaryKey: true, isForeignKey: false, isNullable: false },
      { name: 'order_id', type: 'uuid', isPrimaryKey: false, isForeignKey: true, isNullable: false, references: { table: 'orders', column: 'id' } },
      { name: 'product_id', type: 'uuid', isPrimaryKey: false, isForeignKey: true, isNullable: false, references: { table: 'products', column: 'id' } },
      { name: 'quantity', type: 'integer', isPrimaryKey: false, isForeignKey: false, isNullable: false },
      { name: 'unit_price', type: 'decimal(10,2)', isPrimaryKey: false, isForeignKey: false, isNullable: false },
    ],
  },
];

export const mockAuditLogs: AuditLogEntry[] = [
  {
    id: '1',
    user: 'john.doe@company.com',
    action: 'SELECT',
    sql: 'SELECT * FROM customers WHERE segment = \'enterprise\'',
    timestamp: new Date('2024-01-15T14:32:00'),
    status: 'success',
    affectedRows: 1247,
  },
  {
    id: '2',
    user: 'jane.smith@company.com',
    action: 'UPDATE',
    sql: 'UPDATE products SET price = price * 1.05 WHERE category = \'electronics\'',
    timestamp: new Date('2024-01-15T13:15:00'),
    status: 'success',
    affectedRows: 342,
  },
  {
    id: '3',
    user: 'mike.johnson@company.com',
    action: 'DELETE',
    sql: 'DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE status = \'cancelled\')',
    timestamp: new Date('2024-01-15T11:45:00'),
    status: 'warning',
    affectedRows: 89,
  },
  {
    id: '4',
    user: 'sarah.wilson@company.com',
    action: 'SELECT',
    sql: 'SELECT COUNT(*) FROM orders WHERE created_at > \'2024-01-01\'',
    timestamp: new Date('2024-01-15T10:22:00'),
    status: 'success',
    affectedRows: 1,
  },
  {
    id: '5',
    user: 'john.doe@company.com',
    action: 'INSERT',
    sql: 'INSERT INTO customers (name, email) VALUES (\'Test User\', \'test@example.com\')',
    timestamp: new Date('2024-01-15T09:10:00'),
    status: 'error',
  },
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@company.com',
    role: 'admin',
    status: 'active',
    lastActive: new Date('2024-01-15T14:32:00'),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@company.com',
    role: 'user',
    status: 'active',
    lastActive: new Date('2024-01-15T13:15:00'),
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike.johnson@company.com',
    role: 'user',
    status: 'active',
    lastActive: new Date('2024-01-15T11:45:00'),
  },
  {
    id: '4',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@company.com',
    role: 'viewer',
    status: 'inactive',
    lastActive: new Date('2024-01-10T16:20:00'),
  },
];

export const mockQueryResult: QueryResult = {
  columns: ['customer_name', 'total_orders', 'total_revenue', 'segment'],
  rows: [
    { customer_name: 'Acme Corp', total_orders: 156, total_revenue: 245780.50, segment: 'Enterprise' },
    { customer_name: 'TechStart Inc', total_orders: 89, total_revenue: 178340.25, segment: 'Enterprise' },
    { customer_name: 'Global Systems', total_orders: 234, total_revenue: 156890.00, segment: 'Enterprise' },
    { customer_name: 'DataFlow Ltd', total_orders: 67, total_revenue: 134560.75, segment: 'Mid-Market' },
    { customer_name: 'CloudNine Solutions', total_orders: 45, total_revenue: 98760.00, segment: 'Mid-Market' },
    { customer_name: 'InnovateTech', total_orders: 78, total_revenue: 87650.25, segment: 'Startup' },
    { customer_name: 'NextGen Labs', total_orders: 34, total_revenue: 76540.50, segment: 'Startup' },
    { customer_name: 'SmartBiz Co', total_orders: 56, total_revenue: 65430.00, segment: 'Mid-Market' },
  ],
  rowCount: 8,
  executionTime: 0.042,
};

export const mockChartData = {
  bar: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [65000, 78000, 82000, 91000, 95000, 102000],
      },
    ],
  },
  line: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Orders',
        data: [1200, 1450, 1380, 1620],
      },
    ],
  },
  pie: {
    labels: ['Enterprise', 'Mid-Market', 'Startup', 'SMB'],
    datasets: [
      {
        data: [45, 28, 15, 12],
      },
    ],
  },
};

export const suggestedPrompts = [
  'Show me top 10 customers by revenue',
  'What are the monthly sales trends?',
  'Find products with low stock',
  'Compare revenue by region',
  'List recent orders with issues',
  'Analyze customer segments',
];

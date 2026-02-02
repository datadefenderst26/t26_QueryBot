import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { PromptChips } from './PromptChips';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Database, Sparkles } from 'lucide-react';
import { mockQueryResult } from '@/data/mockData';

interface ChatInterfaceProps {
  onQueryGenerated: (sql: string, results: typeof mockQueryResult) => void;
}

export function ChatInterface({ onQueryGenerated }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateMockSQL = (prompt: string): string => {
    // Mock SQL generation based on prompt keywords
    if (prompt.toLowerCase().includes('customer')) {
      return `SELECT 
  c.name AS customer_name,
  COUNT(o.id) AS total_orders,
  SUM(o.total) AS total_revenue,
  c.segment
FROM customers c
LEFT JOIN orders o ON c.id = o.customer_id
WHERE o.created_at >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 months')
GROUP BY c.id, c.name, c.segment
ORDER BY total_revenue DESC
LIMIT 10;`;
    }
    if (prompt.toLowerCase().includes('sales') || prompt.toLowerCase().includes('trend')) {
      return `SELECT 
  DATE_TRUNC('month', created_at) AS month,
  COUNT(*) AS order_count,
  SUM(total) AS revenue
FROM orders
WHERE created_at >= DATE_TRUNC('year', CURRENT_DATE)
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month ASC;`;
    }
    if (prompt.toLowerCase().includes('stock') || prompt.toLowerCase().includes('inventory')) {
      return `SELECT 
  name,
  category,
  stock,
  price
FROM products
WHERE stock < 10
ORDER BY stock ASC;`;
    }
    return `SELECT * FROM orders
WHERE status = 'completed'
ORDER BY created_at DESC
LIMIT 100;`;
  };

  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const sql = generateMockSQL(content);
    
    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `I've analyzed your request and generated the following SQL query. The results show the top performers based on your criteria.\n\nThe query joins the relevant tables and applies appropriate filters to get you the most accurate data.`,
      timestamp: new Date(),
      sql,
      results: mockQueryResult,
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
    onQueryGenerated(sql, mockQueryResult);
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <ScrollArea className="flex-1 px-4" ref={scrollRef}>
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 animate-float">
              <Database className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">
              Welcome to <span className="text-gradient-primary">QueryAI</span>
            </h2>
            <p className="text-muted-foreground max-w-md mb-8">
              Ask questions about your data in plain English. I'll generate SQL queries and visualize the results for you.
            </p>
            <PromptChips onSelectPrompt={handleSendMessage} />
          </div>
        ) : (
          <div className="space-y-6 py-6">
            {messages.map((message) => (
              <ChatBubble 
                key={message.id} 
                message={message} 
                onRefine={() => {/* Would open refinement modal */}}
              />
            ))}
            {isLoading && (
              <ChatBubble 
                message={{
                  id: 'loading',
                  role: 'assistant',
                  content: '',
                  timestamp: new Date(),
                  isLoading: true,
                }} 
              />
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-border/50">
        {!isEmpty && (
          <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
            <Sparkles className="w-3 h-3" />
            <span>Try: "Show monthly trends" or "Find low stock items"</span>
          </div>
        )}
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}

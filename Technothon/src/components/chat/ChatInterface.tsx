import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { PromptChips } from './PromptChips';
import { ScrollArea } from '@/components/ui/scroll-area';
import {  Sparkles } from 'lucide-react';
import { QueryResult } from "@/types";

interface ChatInterfaceProps {
  onQueryGenerated: (sql: string, results: QueryResult) => void;
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

  const handleSendMessage = async (content: string) => {
  // 1️⃣ Add user message to UI
  const userMessage: ChatMessage = {
    id: Date.now().toString(),
    role: 'user',
    content,
    timestamp: new Date(),
  };

  setMessages(prev => [...prev, userMessage]);
  setIsLoading(true);

  try {
    // 2️⃣ Send prompt to n8n webhook
    const res = await fetch(
      "https://datadefenders.app.n8n.cloud/webhook/querybot_t26", // 👈 your n8n webhook URL
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: content }),
      }
    );

    const data = await res.json();

    // 3️⃣ Add assistant message with REAL backend response
    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: "Here are the results based on your request.",
      timestamp: new Date(),
      sql: data.sql,
      results: data.results,
    };

    setMessages(prev => [...prev, aiMessage]);

    // 4️⃣ Send results upward (table / chart)
    onQueryGenerated(data.sql, data.results);

  } catch (error) {
    console.error("Backend (n8n) error:", error);
  } finally {
    setIsLoading(false);
  }
};


  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      {/* Chat Messages */}
<ScrollArea className="flex-1 px-4">
  <div ref={scrollRef}>
    {isEmpty ? (
      <div className="flex flex-col items-center mt-28 text-center">
        <h2 className="text-3xl font-bold mb-3 tracking-tight">
          Welcome to <span className="text-gradient-primary">QueryBot</span>
        </h2>

        <p className="text-muted-foreground max-w-md mb-8">
          Ask questions about your data in plain English. I'll generate SQL queries and visualize the results for you.
        </p>
      </div>
    ) : (
      <div className="space-y-6 py-6">
        {messages.map((message) => (
          <ChatBubble 
            key={message.id} 
            message={message} 
            onRefine={() => {}}
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
  </div>
</ScrollArea>

      {/* Input Area */}
<div className="p-4 border-t border-border/50">
  {!isEmpty && (
    <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
      <Sparkles className="w-3 h-3" />
      <span>Try: "Show monthly trends" or "Find low stock items"</span>
    </div>
  )}

  <ChatInput
    isLoading={isLoading}
    onSend={handleSendMessage}
  />
</div>
</div>
  );
}

import { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';
import { Bot, User, RefreshCw, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface ChatBubbleProps {
  message: ChatMessage;
  onRefine?: () => void;
}

export function ChatBubble({ message, onRefine }: ChatBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "flex gap-3 animate-fade-in",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
        isUser ? "bg-primary/20" : "bg-accent/20"
      )}>
        {isUser ? (
          <User className="w-4 h-4 text-primary" />
        ) : (
          <Bot className="w-4 h-4 text-accent" />
        )}
      </div>

      {/* Message Content */}
      <div className={cn(
        "max-w-[80%] group",
        isUser ? "items-end" : "items-start"
      )}>
        <div className={cn(
          "px-4 py-3",
          isUser ? "chat-bubble-user" : "chat-bubble-ai"
        )}>
          {message.isLoading ? (
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm text-muted-foreground">Generating response...</span>
            </div>
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        {/* Actions */}
        {!isUser && !message.isLoading && (
          <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="w-3 h-3 mr-1 text-success" />
              ) : (
                <Copy className="w-3 h-3 mr-1" />
              )}
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={onRefine}
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Refine
            </Button>
          </div>
        )}

        {/* Timestamp */}
        <div className={cn(
          "text-xs text-muted-foreground mt-1",
          isUser ? "text-right" : "text-left"
        )}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}

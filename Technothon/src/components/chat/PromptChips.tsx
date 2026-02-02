import { suggestedPrompts } from '@/data/mockData';
import { Sparkles } from 'lucide-react';

interface PromptChipsProps {
  onSelectPrompt: (prompt: string) => void;
}

export function PromptChips({ onSelectPrompt }: PromptChipsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="w-4 h-4 text-primary" />
        <span>Common queries</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestedPrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onSelectPrompt(prompt)}
            className="chip animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}

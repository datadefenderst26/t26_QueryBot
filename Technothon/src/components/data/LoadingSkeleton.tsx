import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  type: 'table' | 'chart' | 'sql' | 'chat';
  className?: string;
}

export function LoadingSkeleton({ type, className }: LoadingSkeletonProps) {
  if (type === 'table') {
    return (
      <div className={cn("glass-card overflow-hidden", className)}>
        <div className="px-4 py-3 border-b border-border/50">
          <div className="skeleton h-5 w-32" />
        </div>
        <div className="p-4 space-y-3">
          <div className="flex gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton h-4 flex-1" />
            ))}
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4" style={{ animationDelay: `${i * 100}ms` }}>
              {[...Array(4)].map((_, j) => (
                <div key={j} className="skeleton h-4 flex-1" />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className={cn("glass-card p-4", className)}>
        <div className="skeleton h-5 w-24 mb-4" />
        <div className="flex items-end gap-2 h-48">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="skeleton flex-1"
              style={{ 
                height: `${40 + Math.random() * 60}%`,
                animationDelay: `${i * 100}ms`
              }} 
            />
          ))}
        </div>
        <div className="flex justify-center gap-4 mt-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-4 w-16" />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'sql') {
    return (
      <div className={cn("glass-card overflow-hidden", className)}>
        <div className="px-4 py-3 border-b border-border/50">
          <div className="skeleton h-5 w-28" />
        </div>
        <div className="p-4 space-y-2">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="skeleton h-4"
              style={{ 
                width: `${50 + Math.random() * 50}%`,
                animationDelay: `${i * 50}ms`
              }} 
            />
          ))}
        </div>
      </div>
    );
  }

  if (type === 'chat') {
    return (
      <div className={cn("space-y-4", className)}>
        {[...Array(3)].map((_, i) => (
          <div 
            key={i} 
            className={cn(
              "flex gap-3",
              i % 2 === 0 ? "flex-row-reverse" : "flex-row"
            )}
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <div className="skeleton w-8 h-8 rounded-full flex-shrink-0" />
            <div className="space-y-2 max-w-[60%]">
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

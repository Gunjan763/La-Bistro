import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-bg-elevated rounded-md ${className}`} />
  );
};

export const TableSkeleton = ({ rows = 5, cols = 4 }) => {
  return (
    <div className="w-full">
      <div className="flex border-b border-border py-3">
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="flex-1 px-4">
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex border-b border-border py-4">
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="flex-1 px-4">
              <Skeleton className={j === 0 ? "h-5 w-32" : "h-4 w-20"} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="bg-bg-card border border-border rounded-2xl overflow-hidden p-4">
      <Skeleton className="w-full aspect-video rounded-xl mb-4" />
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-full mb-1" />
      <Skeleton className="h-4 w-5/6 mb-4" />
      <div className="flex justify-between items-center mt-4">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    </div>
  );
};

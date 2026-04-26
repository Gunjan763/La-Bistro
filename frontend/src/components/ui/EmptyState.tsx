import React from 'react';
import { FileQuestion } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-border rounded-xl bg-bg-card/50">
      <div className="w-16 h-16 bg-bg-elevated rounded-full flex items-center justify-center mb-4 text-text-muted">
        {icon || <FileQuestion size={32} />}
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2 font-display">{title}</h3>
      <p className="text-text-secondary text-sm max-w-sm mb-6">{description}</p>
      
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="secondary">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;

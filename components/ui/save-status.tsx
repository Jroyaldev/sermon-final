import React from 'react';
import { SaveStatus } from '@/hooks/useAutoSave';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SaveStatusIndicatorProps {
  status: SaveStatus;
  isDirty?: boolean;
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Component for displaying document save status with appropriate icons
 */
export function SaveStatusIndicator({
  status,
  isDirty = false,
  className,
  showText = true,
  size = 'sm'
}: SaveStatusIndicatorProps) {
  const sizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const iconClass = sizeClasses[size];
  const iconWrapperClass = cn('flex items-center gap-1.5', className);
  
  switch (status) {
    case 'saving':
      return (
        <span className={iconWrapperClass}>
          <Loader2 className={cn(iconClass, "animate-spin")} />
          {showText && <span>Saving...</span>}
        </span>
      );
      
    case 'saved':
      return (
        <span className={iconWrapperClass}>
          <CheckCircle className={cn(iconClass, "text-green-600 dark:text-green-500")} />
          {showText && <span>Saved</span>}
        </span>
      );
      
    case 'error':
      return (
        <span className={cn(iconWrapperClass, "text-destructive")}>
          <AlertCircle className={iconClass} />
          {showText && <span>Error saving</span>}
        </span>
      );
      
    case 'idle':
      return isDirty ? (
        <span className={iconWrapperClass}>
          {showText && <span>Unsaved changes</span>}
        </span>
      ) : (
        <span className={iconWrapperClass}>
          {showText && <span>All changes saved</span>}
        </span>
      );
      
    default:
      return null;
  }
}

export default SaveStatusIndicator; 
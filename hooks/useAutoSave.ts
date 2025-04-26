import { useState, useRef, useEffect, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import isEqual from 'lodash/isEqual';
import { toast } from 'sonner';
import { Block } from '@/types/sermon';

// Define types
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// Make ValueType generic to handle blocks properly
export interface ValueType {
  [key: string]: any;
  blocks?: Block[]; // Optional blocks field
}

export interface AutoSaveOptions<T extends ValueType> {
  initialValue: T;
  onSave: (value: T) => Promise<any>;
  interval?: number; // ms
  debounce?: number; // ms
  enabled?: boolean;
}

/**
 * Custom hook for handling auto-save functionality with dirty state tracking
 */
export function useAutoSave<T extends ValueType>({
  initialValue,
  onSave,
  interval = 60000, // Default: 1 minute
  debounce = 1000, // Default: 1 second
  enabled = true
}: AutoSaveOptions<T>) {
  // State for managing the save status
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [isDirty, setIsDirty] = useState(false);
  
  // Reference to the initial data (for dirty state comparison)
  const initialDataRef = useRef<T | null>(null);
  
  // Set initial data when the hook first mounts or when explicitly reset
  const setInitialData = useCallback((data: T) => {
    // Use a safer deep clone that handles undefined values
    initialDataRef.current = data ? structuredClone(data) : null;
    setIsDirty(false);
    setSaveStatus('idle');
  }, []);
  
  // Set initial data on first render
  useEffect(() => {
    if (!initialDataRef.current) {
      setInitialData(initialValue);
    }
  }, [initialValue, setInitialData]);
  
  // Function to perform the save operation
  const performSave = useCallback(async () => {
    if (!isDirty || saveStatus === 'saving' || !enabled) return;
    
    setSaveStatus('saving');
    
    try {
      const response = await onSave(initialValue);
      
      // Update reference data after successful save
      setInitialData(initialValue);
      setSaveStatus('saved');
      
      // Reset to idle after a delay
      setTimeout(() => setSaveStatus('idle'), 2000);
      
    } catch (error) {
      console.error("Auto-save error:", error);
      setSaveStatus('error');
      
      // Show error toast
      toast.error(`Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [initialValue, isDirty, saveStatus, onSave, setInitialData, enabled]);
  
  // Create a debounced version of the save function
  const debouncedSave = useDebouncedCallback(performSave, interval);
  
  // Check for dirty state whenever data changes
  useEffect(() => {
    if (!initialDataRef.current) return;
    
    // Compare current data with reference data
    const isDataChanged = !isEqual(initialValue, initialDataRef.current);
    
    if (isDataChanged) {
      setIsDirty(true);
      // Reset save status if dirty after being saved
      if (saveStatus === 'saved') setSaveStatus('idle');
    } else {
      setIsDirty(false);
    }
  }, [initialValue, saveStatus]);
  
  // Trigger auto-save when dirty
  useEffect(() => {
    if (isDirty && enabled) {
      debouncedSave();
    }
    
    // Clean up debounce on unmount
    return debouncedSave.cancel;
  }, [isDirty, debouncedSave, enabled]);
  
  // Manual save function (for save buttons)
  const manualSave = useCallback(async () => {
    // Skip if already saving or not dirty (to prevent unnecessary saves)
    if (saveStatus === 'saving' || !isDirty) return;
    
    // Immediately perform save
    performSave();
  }, [performSave, saveStatus, isDirty]);
  
  return {
    saveStatus,
    isDirty,
    manualSave, 
    reset: setInitialData // Allow resetting the initial data (e.g., after retrieving new data)
  };
}

export default useAutoSave; 
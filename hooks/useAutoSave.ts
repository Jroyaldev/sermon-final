import { useState, useRef, useEffect, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import isEqual from 'lodash/isEqual';
import { toast } from 'sonner';

// Define types
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export interface AutoSaveOptions<T> {
  data: T; // Current data
  onSave: (data: T) => Promise<any>; // Save function
  interval?: number; // Debounce interval in ms
  onSuccess?: (response: any) => void; // Optional success callback
  onError?: (error: Error) => void; // Optional error callback
  enabled?: boolean; // Whether auto-save is enabled
}

/**
 * Custom hook for handling auto-save functionality with dirty state tracking
 */
export function useAutoSave<T extends Record<string, any>>({
  data,
  onSave,
  interval = 2500,
  onSuccess,
  onError,
  enabled = true,
}: AutoSaveOptions<T>) {
  // State for managing the save status
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [isDirty, setIsDirty] = useState(false);
  
  // Reference to the initial data (for dirty state comparison)
  const initialDataRef = useRef<T | null>(null);
  
  // Set initial data when the hook first mounts or when explicitly reset
  const setInitialData = useCallback((data: T) => {
    initialDataRef.current = JSON.parse(JSON.stringify(data)); // Deep clone
    setIsDirty(false);
    setSaveStatus('idle');
  }, []);
  
  // Set initial data on first render
  useEffect(() => {
    if (!initialDataRef.current) {
      setInitialData(data);
    }
  }, [data, setInitialData]);
  
  // Function to perform the save operation
  const performSave = useCallback(async () => {
    if (!isDirty || saveStatus === 'saving' || !enabled) return;
    
    setSaveStatus('saving');
    
    try {
      const response = await onSave(data);
      
      // Update reference data after successful save
      setInitialData(data);
      setSaveStatus('saved');
      
      // Reset to idle after a delay
      setTimeout(() => setSaveStatus('idle'), 2000);
      
      // Call success callback if provided
      if (onSuccess) onSuccess(response);
      
    } catch (error) {
      console.error("Auto-save error:", error);
      setSaveStatus('error');
      
      // Show error toast
      toast.error(`Failed to save: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      // Call error callback if provided
      if (onError && error instanceof Error) onError(error);
    }
  }, [data, isDirty, saveStatus, onSave, setInitialData, enabled, onSuccess, onError]);
  
  // Create a debounced version of the save function
  const debouncedSave = useDebouncedCallback(performSave, interval);
  
  // Check for dirty state whenever data changes
  useEffect(() => {
    if (!initialDataRef.current) return;
    
    // Compare current data with reference data
    const isDataChanged = !isEqual(data, initialDataRef.current);
    
    if (isDataChanged) {
      setIsDirty(true);
      // Reset save status if dirty after being saved
      if (saveStatus === 'saved') setSaveStatus('idle');
    } else {
      setIsDirty(false);
    }
  }, [data, saveStatus]);
  
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
import { useState, useCallback, useRef, useEffect } from "react";

interface UseSavingStateResult {
  isSaving: boolean;
  withSaving: <T>(asyncOperation: () => Promise<T>) => Promise<T>;
}

/**
 * Custom hook to manage saving state with a delay.
 * Only shows the saving indicator if operations take longer than 500ms.
 * Handles concurrent save operations correctly with ref counting.
 *
 * @returns Object containing isSaving state and withSaving wrapper function
 */
export const useSavingState = (): UseSavingStateResult => {
  const [isSaving, setIsSaving] = useState(false);
  const savingCountRef = useRef(0);
  const savingTimeoutRef = useRef<number | null>(null);

  const withSaving = useCallback(
    async <T>(asyncOperation: () => Promise<T>): Promise<T> => {
      savingCountRef.current += 1;

      // Only show the saving indicator if the operation takes longer than 500ms
      const timeoutId = window.setTimeout(() => {
        if (savingCountRef.current > 0) {
          setIsSaving(true);
        }
      }, 500);

      savingTimeoutRef.current = timeoutId;

      try {
        return await asyncOperation();
      } finally {
        savingCountRef.current -= 1;

        // Clear the timeout if the operation completes before 500ms
        if (savingCountRef.current === 0) {
          if (savingTimeoutRef.current !== null) {
            clearTimeout(savingTimeoutRef.current);
            savingTimeoutRef.current = null;
          }
          setIsSaving(false);
        }
      }
    },
    []
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (savingTimeoutRef.current !== null) {
        clearTimeout(savingTimeoutRef.current);
      }
    };
  }, []);

  return {
    isSaving,
    withSaving,
  };
};

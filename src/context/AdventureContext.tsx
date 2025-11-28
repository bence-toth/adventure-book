/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { loadAdventureById } from "@/data/adventureLoader";
import type { Adventure } from "@/data/types";

export interface AdventureContextType {
  adventure: Adventure | null;
  adventureId: string | null;
  loading: boolean;
  error: string | null;
  debugModeEnabled: boolean;
  isSaving: boolean;
  setDebugModeEnabled: (enabled: boolean) => void;
  reloadAdventure: () => void;
  updateAdventure: (updater: (adventure: Adventure) => Adventure) => void;
  withSaving: <T>(asyncOperation: () => Promise<T>) => Promise<T>;
}

export const AdventureContext = createContext<AdventureContextType | undefined>(
  undefined
);

export const AdventureProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { adventureId } = useParams<{ adventureId: string }>();
  const [adventure, setAdventure] = useState<Adventure | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugModeEnabled, setDebugModeEnabled] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const savingCountRef = useRef(0);
  const savingTimeoutRef = useRef<number | null>(null);

  const reloadAdventure = () => {
    setReloadTrigger((prev) => prev + 1);
  };

  const updateAdventure = useCallback(
    (updater: (adventure: Adventure) => Adventure) => {
      setAdventure((prev) => {
        if (!prev) return prev;
        return updater(prev);
      });
    },
    []
  );

  const withSaving = useCallback(
    async <T,>(asyncOperation: () => Promise<T>): Promise<T> => {
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

  useEffect(() => {
    if (!adventureId) {
      setAdventure(null);
      setLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;

    const loadAdventure = async () => {
      try {
        if (isMounted) {
          setLoading(true);
          setError(null);
        }
        const loadedAdventure = await loadAdventureById(adventureId);
        if (isMounted) {
          setAdventure(loadedAdventure);
        }
      } catch (err) {
        if (isMounted) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Failed to load adventure");
          }
          setAdventure(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadAdventure();

    return () => {
      isMounted = false;
    };
  }, [adventureId, reloadTrigger]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (savingTimeoutRef.current !== null) {
        clearTimeout(savingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <AdventureContext.Provider
      value={{
        adventure,
        adventureId: adventureId ?? null,
        loading,
        error,
        debugModeEnabled,
        isSaving,
        setDebugModeEnabled,
        reloadAdventure,
        updateAdventure,
        withSaving,
      }}
    >
      {children}
    </AdventureContext.Provider>
  );
};

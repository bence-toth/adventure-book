/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAdventureLoader } from "./useAdventureLoader";
import { useSavingState } from "./useSavingState";
import { useAdventureUpdater } from "./useAdventureUpdater";
import type { Adventure, Passage } from "@/data/types";

export interface AdventureContextType {
  adventure: Adventure | null;
  adventureId: string | null;
  isLoading: boolean;
  error: string | null;
  isDebugModeEnabled: boolean;
  isSaving: boolean;
  setIsDebugModeEnabled: (isEnabled: boolean) => void;
  reloadAdventure: () => void;
  updateAdventure: (updater: (adventure: Adventure) => Adventure) => void;
  updateIntroduction: (title: string, text: string) => Promise<void>;
  updatePassage: (passageId: number, passage: Passage) => Promise<void>;
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
  const [isDebugModeEnabled, setIsDebugModeEnabled] = useState(false);

  // Use custom hooks for complex logic
  const { adventure, isLoading, error, reloadAdventure } =
    useAdventureLoader(adventureId);

  const { isSaving, withSaving } = useSavingState();

  // Track local adventure state for optimistic updates
  // Initialize with null, sync in useEffect
  const [localAdventure, setLocalAdventure] = useState<Adventure | null>(null);

  // Sync localAdventure with loaded adventure
  // This updates when adventure changes from the loader
  useEffect(() => {
    setLocalAdventure(adventure);
  }, [adventure]);

  const { updateIntroduction, updatePassage } = useAdventureUpdater(
    localAdventure,
    adventureId ?? null,
    setLocalAdventure,
    withSaving
  );

  const updateAdventure = useCallback(
    (updater: (adventure: Adventure) => Adventure) => {
      setLocalAdventure((prev) => {
        if (!prev) return prev;
        return updater(prev);
      });
    },
    []
  );

  return (
    <AdventureContext.Provider
      value={{
        // Use localAdventure if available (for optimistic updates), otherwise use adventure (while loading)
        adventure: localAdventure ?? adventure,
        adventureId: adventureId ?? null,
        isLoading,
        error,
        isDebugModeEnabled,
        isSaving,
        setIsDebugModeEnabled,
        reloadAdventure,
        updateAdventure,
        updateIntroduction,
        updatePassage,
        withSaving,
      }}
    >
      {children}
    </AdventureContext.Provider>
  );
};

import { useState, useEffect } from "react";
import {
  loadAdventureById,
  invalidateAdventureCache,
} from "@/data/adventureLoader";
import type { Adventure } from "@/data/types";

interface UseAdventureLoaderResult {
  adventure: Adventure | null;
  isLoading: boolean;
  error: string | null;
  reloadAdventure: () => void;
}

/**
 * Custom hook to handle adventure loading from IndexedDB.
 * Manages loading state, error handling, and provides a reload mechanism.
 *
 * @param adventureId - The ID of the adventure to load
 * @returns Object containing adventure data, loading state, error, and reload function
 */
export const useAdventureLoader = (
  adventureId: string | undefined
): UseAdventureLoaderResult => {
  const [adventure, setAdventure] = useState<Adventure | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const reloadAdventure = () => {
    // Invalidate the cache for this adventure before reloading
    if (adventureId) {
      invalidateAdventureCache(adventureId);
    }
    setReloadTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    if (!adventureId) {
      setAdventure(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let isMounted = true;

    const loadAdventure = async () => {
      try {
        if (isMounted) {
          setIsLoading(true);
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
          setIsLoading(false);
        }
      }
    };

    loadAdventure();

    return () => {
      isMounted = false;
    };
  }, [adventureId, reloadTrigger]);

  return {
    adventure,
    isLoading,
    error,
    reloadAdventure,
  };
};

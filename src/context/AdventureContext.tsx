/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { loadAdventureById } from "@/data/adventureLoader";
import type { Adventure } from "@/data/types";

export interface AdventureContextType {
  adventure: Adventure | null;
  adventureId: string | null;
  loading: boolean;
  error: string | null;
  debugModeEnabled: boolean;
  setDebugModeEnabled: (enabled: boolean) => void;
  reloadAdventure: () => void;
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

  const reloadAdventure = () => {
    setReloadTrigger((prev) => prev + 1);
  };

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

  return (
    <AdventureContext.Provider
      value={{
        adventure,
        adventureId: adventureId ?? null,
        loading,
        error,
        debugModeEnabled,
        setDebugModeEnabled,
        reloadAdventure,
      }}
    >
      {children}
    </AdventureContext.Provider>
  );
};

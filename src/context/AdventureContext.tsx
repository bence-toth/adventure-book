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

  useEffect(() => {
    if (!adventureId) {
      setAdventure(null);
      setLoading(false);
      setError(null);
      return;
    }

    const loadAdventure = async () => {
      try {
        setLoading(true);
        setError(null);
        const loadedAdventure = await loadAdventureById(adventureId);
        setAdventure(loadedAdventure);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load adventure");
        }
        setAdventure(null);
      } finally {
        setLoading(false);
      }
    };

    loadAdventure();
  }, [adventureId]);

  return (
    <AdventureContext.Provider
      value={{
        adventure,
        adventureId: adventureId ?? null,
        loading,
        error,
      }}
    >
      {children}
    </AdventureContext.Provider>
  );
};

import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  listStories,
  deleteAdventure,
  createAdventure,
  type StoredAdventure,
} from "@/data/adventureDatabase";
import adventureTemplate from "@/data/adventure.yaml?raw";
import { getAdventureTestRoute } from "@/constants/routes";

type AdventureStoriesError = "load" | "create" | "delete" | null;

interface UseAdventureStoriesResult {
  stories: StoredAdventure[];
  loading: boolean;
  error: AdventureStoriesError;
  handleOpenAdventure: (id: string) => void;
  handleCreateAdventure: () => Promise<void>;
  handleDeleteAdventure: (id: string) => Promise<void>;
  loadStories: () => Promise<void>;
}

export const useAdventureStories = (): UseAdventureStoriesResult => {
  const [stories, setStories] = useState<StoredAdventure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AdventureStoriesError>(null);
  const navigate = useNavigate();

  const loadStories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedStories = await listStories();
      setStories(loadedStories);
    } catch (err) {
      console.error("Error loading stories:", err);
      setError("load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  const handleOpenAdventure = useCallback(
    (id: string) => {
      navigate(getAdventureTestRoute(id));
    },
    [navigate]
  );

  const handleCreateAdventure = useCallback(async () => {
    const title = "Untitled adventure";

    try {
      // Use the adventure.yaml template and replace the title
      const contentWithNewTitle = adventureTemplate.replace(
        /title:\s*"[^"]*"/,
        `title: "${title}"`
      );

      const id = await createAdventure(title, contentWithNewTitle);
      navigate(getAdventureTestRoute(id));
    } catch (err) {
      console.error("Error creating adventure:", err);
      setError("create");
      // Don't throw - let component handle error state
    }
  }, [navigate]);

  const handleDeleteAdventure = useCallback(
    async (id: string) => {
      try {
        await deleteAdventure(id);
        await loadStories();
      } catch (err) {
        console.error("Error deleting adventure:", err);
        setError("delete");
        // Don't throw - let component handle error state
      }
    },
    [loadStories]
  );

  return {
    stories,
    loading,
    error,
    handleOpenAdventure,
    handleCreateAdventure,
    handleDeleteAdventure,
    loadStories,
  };
};

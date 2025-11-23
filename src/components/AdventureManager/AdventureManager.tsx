import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  listStories,
  deleteAdventure,
  createAdventure,
  type StoredAdventure,
} from "@/data/adventureDatabase";
import { Button } from "@/components/common";
import adventureTemplate from "@/data/adventure.yaml?raw";
import { getAdventureTestRoute, getPassageRoute } from "@/constants/routes";
import { getCurrentPassageId } from "@/utils/localStorage";
import { NewAdventureCard } from "./NewAdventureCard/NewAdventureCard";
import { AdventureCard } from "./AdventureCard/AdventureCard";
import {
  AdventureManagerContainer,
  AdventureManagerLoading,
  AdventureManagerError,
  AdventureManagerList,
} from "./AdventureManager.styles";

export const AdventureManager = () => {
  const [stories, setStories] = useState<StoredAdventure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadStories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedStories = await listStories();
      setStories(loadedStories);
    } catch (err) {
      setError("Failed to load stories");
      console.error("Error loading stories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStories();
  }, [loadStories]);

  const handleOpenAdventure = useCallback(
    (id: string) => {
      // Check if there's a saved passage for this adventure
      const savedPassageId = getCurrentPassageId(id);

      if (savedPassageId !== null) {
        // Navigate directly to the saved passage
        navigate(getPassageRoute(id, savedPassageId));
      } else {
        // Navigate to the introduction if no saved progress
        navigate(getAdventureTestRoute(id));
      }
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
      setError("Failed to create adventure");
      console.error("Error creating adventure:", err);
    }
  }, [navigate]);

  const handleDeleteAdventure = useCallback(
    async (adventureId: string) => {
      try {
        await deleteAdventure(adventureId);
        await loadStories();
      } catch (err) {
        setError("Failed to delete adventure");
        console.error("Error deleting adventure:", err);
      }
    },
    [loadStories]
  );

  if (loading) {
    return (
      <AdventureManagerContainer>
        <AdventureManagerLoading>Loading stories...</AdventureManagerLoading>
      </AdventureManagerContainer>
    );
  }

  if (error) {
    return (
      <AdventureManagerContainer>
        <AdventureManagerError>
          {error}
          <Button onClick={loadStories}>Retry</Button>
        </AdventureManagerError>
      </AdventureManagerContainer>
    );
  }

  return (
    <AdventureManagerContainer>
      <AdventureManagerList>
        <NewAdventureCard onClick={handleCreateAdventure} />
        {stories.map((adventure) => (
          <AdventureCard
            key={adventure.id}
            adventure={adventure}
            onOpen={handleOpenAdventure}
            onDelete={() => handleDeleteAdventure(adventure.id)}
          />
        ))}
      </AdventureManagerList>
    </AdventureManagerContainer>
  );
};

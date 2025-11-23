import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  listStories,
  deleteStory,
  createStory,
  type StoredStory,
} from "@/data/storyDatabase";
import { Button } from "@/components/common";
import storyTemplate from "@/data/story.yaml?raw";
import { getStoryTestRoute, getPassageRoute } from "@/constants/routes";
import { getCurrentPassageId } from "@/utils/localStorage";
import { NewStoryCard } from "./NewStoryCard/NewStoryCard";
import { StoryCard } from "./StoryCard/StoryCard";
import {
  DocumentManagerContainer,
  DocumentManagerLoading,
  DocumentManagerError,
  DocumentManagerList,
} from "./DocumentManager.styles";

export const DocumentManager = () => {
  const [stories, setStories] = useState<StoredStory[]>([]);
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

  const handleOpenStory = useCallback(
    (id: string) => {
      // Check if there's a saved passage for this story
      const savedPassageId = getCurrentPassageId(id);

      if (savedPassageId !== null) {
        // Navigate directly to the saved passage
        navigate(getPassageRoute(id, savedPassageId));
      } else {
        // Navigate to the introduction if no saved progress
        navigate(getStoryTestRoute(id));
      }
    },
    [navigate]
  );

  const handleCreateStory = useCallback(async () => {
    const title = "Untitled adventure";

    try {
      // Use the story.yaml template and replace the title
      const contentWithNewTitle = storyTemplate.replace(
        /title:\s*"[^"]*"/,
        `title: "${title}"`
      );

      const id = await createStory(title, contentWithNewTitle);
      navigate(getStoryTestRoute(id));
    } catch (err) {
      setError("Failed to create story");
      console.error("Error creating story:", err);
    }
  }, [navigate]);

  const handleDeleteStory = useCallback(
    async (storyId: string) => {
      try {
        await deleteStory(storyId);
        await loadStories();
      } catch (err) {
        setError("Failed to delete story");
        console.error("Error deleting story:", err);
      }
    },
    [loadStories]
  );

  if (loading) {
    return (
      <DocumentManagerContainer>
        <DocumentManagerLoading>Loading stories...</DocumentManagerLoading>
      </DocumentManagerContainer>
    );
  }

  if (error) {
    return (
      <DocumentManagerContainer>
        <DocumentManagerError>
          {error}
          <Button onClick={loadStories}>Retry</Button>
        </DocumentManagerError>
      </DocumentManagerContainer>
    );
  }

  return (
    <DocumentManagerContainer>
      <DocumentManagerList>
        <NewStoryCard onClick={handleCreateStory} />
        {stories.map((story) => (
          <StoryCard
            key={story.id}
            story={story}
            onOpen={handleOpenStory}
            onDelete={() => handleDeleteStory(story.id)}
          />
        ))}
      </DocumentManagerList>
    </DocumentManagerContainer>
  );
};

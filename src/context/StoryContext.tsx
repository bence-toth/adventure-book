/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { loadStoryById } from "../data/storyLoader";
import type { Story } from "../data/types";

export interface StoryContextType {
  story: Story | null;
  storyId: string | null;
  loading: boolean;
  error: string | null;
}

export const StoryContext = createContext<StoryContextType | undefined>(
  undefined
);

export const StoryProvider = ({ children }: { children: React.ReactNode }) => {
  const { storyId } = useParams<{ storyId: string }>();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!storyId) {
      setStory(null);
      setLoading(false);
      setError(null);
      return;
    }

    const loadStory = async () => {
      try {
        setLoading(true);
        setError(null);
        const loadedStory = await loadStoryById(storyId);
        setStory(loadedStory);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load story");
        setStory(null);
      } finally {
        setLoading(false);
      }
    };

    loadStory();
  }, [storyId]);

  return (
    <StoryContext.Provider
      value={{ story, storyId: storyId ?? null, loading, error }}
    >
      {children}
    </StoryContext.Provider>
  );
};

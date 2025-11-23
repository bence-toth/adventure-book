import { useState, useEffect, useCallback } from "react";
import { updateStoryTitle, getStory } from "@/data/storyDatabase";
import { TopBarTitleInput } from "./StoryTitleInput.styles";

export interface StoryTitleInputProps {
  storyId: string;
}

export const StoryTitleInput = ({ storyId }: StoryTitleInputProps) => {
  const [storyTitle, setStoryTitle] = useState<string>("");

  useEffect(() => {
    const loadStoryTitle = async () => {
      if (storyId) {
        const story = await getStory(storyId);
        if (story) {
          setStoryTitle(story.title);
        }
      }
    };
    loadStoryTitle();
  }, [storyId]);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setStoryTitle(e.target.value);
    },
    []
  );

  const handleTitleBlur = useCallback(async () => {
    if (storyId && storyTitle.trim()) {
      try {
        await updateStoryTitle(storyId, storyTitle.trim());
      } catch (err) {
        console.error("Failed to update story title:", err);
      }
    }
  }, [storyId, storyTitle]);

  const handleTitleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.currentTarget.blur();
      }
    },
    []
  );

  return (
    <TopBarTitleInput
      type="text"
      value={storyTitle}
      onChange={handleTitleChange}
      onBlur={handleTitleBlur}
      onKeyDown={handleTitleKeyDown}
      placeholder="Untitled adventure"
      aria-label="Story title"
    />
  );
};

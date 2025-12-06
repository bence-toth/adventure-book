import { useCallback } from "react";
import { updateAdventureContent } from "@/data/adventureDatabase";
import { AdventureSerializer } from "@/data/adventureSerializer";
import type { Adventure, Passage } from "@/data/types";

interface UseAdventureUpdaterResult {
  updateIntroduction: (title: string, text: string) => Promise<void>;
  updatePassage: (passageId: number, passage: Passage) => Promise<void>;
}

/**
 * Custom hook to handle adventure update operations.
 * Provides functions to update introduction and passages with database persistence.
 *
 * @param adventure - The current adventure data
 * @param adventureId - The ID of the adventure
 * @param setAdventure - Function to update the adventure state
 * @param withSaving - Wrapper function to track saving operations
 * @returns Object containing update functions
 */
export const useAdventureUpdater = (
  adventure: Adventure | null,
  adventureId: string | null,
  setAdventure: (adventure: Adventure) => void,
  withSaving: <T>(asyncOperation: () => Promise<T>) => Promise<T>
): UseAdventureUpdaterResult => {
  const updateIntroduction = useCallback(
    async (title: string, text: string) => {
      if (!adventure || !adventureId) return;

      await withSaving(async () => {
        // Split text into paragraphs
        const paragraphs = text
          .split("\n\n")
          .map((p) => p.trim())
          .filter((p) => p.length > 0);

        // Update adventure state
        const updatedAdventure: Adventure = {
          ...adventure,
          metadata: {
            ...adventure.metadata,
            title,
          },
          intro: {
            ...adventure.intro,
            paragraphs,
          },
        };

        setAdventure(updatedAdventure);

        // Serialize and save to database
        const yamlContent =
          AdventureSerializer.serializeToString(updatedAdventure);
        await updateAdventureContent(adventureId, yamlContent);
      });
    },
    [adventure, adventureId, setAdventure, withSaving]
  );

  const updatePassage = useCallback(
    async (passageId: number, passage: Passage) => {
      if (!adventure || !adventureId) return;

      await withSaving(async () => {
        // Update adventure state
        const updatedAdventure: Adventure = {
          ...adventure,
          passages: {
            ...adventure.passages,
            [passageId]: passage,
          },
        };

        setAdventure(updatedAdventure);

        // Serialize and save to database
        const yamlContent =
          AdventureSerializer.serializeToString(updatedAdventure);
        await updateAdventureContent(adventureId, yamlContent);
      });
    },
    [adventure, adventureId, setAdventure, withSaving]
  );

  return {
    updateIntroduction,
    updatePassage,
  };
};

import { useState, useEffect, useCallback } from "react";
import { updateAdventureTitle, getAdventure } from "@/data/adventureDatabase";
import { TopBarTitleInput } from "./AdventureTitleInput.styles";

export interface AdventureTitleInputProps {
  adventureId: string | null;
}

export const AdventureTitleInput = ({
  adventureId,
}: AdventureTitleInputProps) => {
  const [adventureTitle, setAdventureTitle] = useState<string>("");

  useEffect(() => {
    if (!adventureId) return;

    const loadAdventureTitle = async () => {
      const adventure = await getAdventure(adventureId);
      if (adventure) {
        setAdventureTitle(adventure.title);
      }
    };
    loadAdventureTitle();
  }, [adventureId]);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAdventureTitle(e.target.value);
    },
    []
  );

  const handleTitleBlur = useCallback(async () => {
    if (adventureId && adventureTitle.trim()) {
      try {
        await updateAdventureTitle(adventureId, adventureTitle.trim());
      } catch (err) {
        console.error("Failed to update adventure title:", err);
      }
    }
  }, [adventureId, adventureTitle]);

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
      value={adventureTitle}
      onChange={handleTitleChange}
      onBlur={handleTitleBlur}
      onKeyDown={handleTitleKeyDown}
      placeholder="Untitled adventure"
      aria-label="Adventure title"
    />
  );
};

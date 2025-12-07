import { useState, useCallback, useRef, useEffect } from "react";
import { updateAdventureTitle } from "@/data/adventureDatabase";
import { invalidateAdventureCache } from "@/data/adventureLoader";
import { useAdventure } from "@/context/useAdventure";
import { TopBarTitleInput } from "./AdventureTitleInput.styles";

interface AdventureTitleInputProps {
  adventureId: string | null;
}

export const AdventureTitleInput = ({
  adventureId,
}: AdventureTitleInputProps) => {
  const { adventure, updateAdventure, withSaving } = useAdventure();

  // Track the title that the user is currently editing, or null if not editing
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const prevAdventureTitleRef = useRef<string>("");

  // Keep a reference to the adventure's persisted title for change detection.
  // The component needs to distinguish between user edits (local state) and external
  // changes to the adventure (e.g., from cache invalidation or database updates).
  // This maintains a ref tracking the last known persisted title by updating the ref
  // whenever the adventure prop changes, without triggering re-renders, which
  // allows comparison in event handlers to detect whether the title actually changed.
  useEffect(() => {
    if (adventure) {
      prevAdventureTitleRef.current = adventure.metadata.title;
    }
  }, [adventure]);

  // Display either the editing title or the adventure title
  const displayTitle = editingTitle ?? adventure?.metadata.title ?? "";

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setEditingTitle(e.target.value);
    },
    []
  );

  const handleTitleBlur = useCallback(async () => {
    if (!adventureId || !editingTitle || !editingTitle.trim()) {
      // Clear editing state without saving
      setEditingTitle(null);
      return;
    }

    const trimmedTitle = editingTitle.trim();

    // Clear editing state first
    setEditingTitle(null);

    // Update local state immediately (optimistic update)
    updateAdventure((currentAdventure) => ({
      ...currentAdventure,
      metadata: {
        ...currentAdventure.metadata,
        title: trimmedTitle,
      },
    }));

    // Save to database asynchronously
    try {
      await withSaving(() => updateAdventureTitle(adventureId, trimmedTitle));
      // Invalidate the cache so the next load gets fresh data
      invalidateAdventureCache(adventureId);
    } catch (err) {
      console.error("Failed to update adventure title:", err);
      // Could add error recovery here - reload adventure or show toast
    }
  }, [adventureId, editingTitle, updateAdventure, withSaving]);

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
      name="adventure-title"
      value={displayTitle}
      onChange={handleTitleChange}
      onBlur={handleTitleBlur}
      onKeyDown={handleTitleKeyDown}
      placeholder="Untitled adventure"
      aria-label="Adventure title"
    />
  );
};

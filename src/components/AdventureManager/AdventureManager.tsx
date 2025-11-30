import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  listStories,
  deleteAdventure,
  createAdventure,
  type StoredAdventure,
} from "@/data/adventureDatabase";
import adventureTemplate from "@/data/adventure.yaml?raw";
import { getAdventureTestRoute, getPassageRoute } from "@/constants/routes";
import { getCurrentPassageId } from "@/utils/localStorage";
import {
  StoriesLoadError,
  StoryCreateError,
  StoryDeleteError,
} from "@/utils/errors";
import { FileDropArea } from "@/components/common/FileDropArea/FileDropArea";
import { AdventureManagerTopBar } from "./AdventureManagerTopBar/AdventureManagerTopBar";
import { NewAdventureCard } from "./NewAdventureCard/NewAdventureCard";
import { AdventureCard } from "./AdventureCard/AdventureCard";
import {
  AdventureManagerContainer,
  AdventureManagerLoading,
  AdventureManagerList,
} from "./AdventureManager.styles";

export const AdventureManager = () => {
  const [stories, setStories] = useState<StoredAdventure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<"load" | "create" | "delete" | null>(null);
  const [deletingAdventureId, setDeletingAdventureId] = useState<string | null>(
    null
  );
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
      console.error("Error creating adventure:", err);
      setError("create");
    }
  }, [navigate]);

  const handleDeleteClick = useCallback((adventureId: string) => {
    setDeletingAdventureId(adventureId);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingAdventureId) return;

    try {
      await deleteAdventure(deletingAdventureId);
      await loadStories();
      setDeletingAdventureId(null);
    } catch (err) {
      console.error("Error deleting adventure:", err);
      setError("delete");
    }
  }, [deletingAdventureId, loadStories]);

  const handleCancelDelete = useCallback(() => {
    setDeletingAdventureId(null);
  }, []);

  const handleFileDrop = useCallback((file: File) => {
    // Check file extension
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    const acceptedFileTypes = [".yaml", ".yml"];
    const isAccepted = acceptedFileTypes.some((type) => {
      const ext = type.startsWith(".") ? type.slice(1) : type;
      return ext.toLowerCase() === fileExtension;
    });

    if (!isAccepted) {
      console.warn(
        `File type not accepted. Please drop a ${acceptedFileTypes.join(" or ")} file`
      );
      return;
    }

    console.log("YAML file dropped:", file.name);
    // TODO: Implement file import logic
  }, []);

  if (loading) {
    return (
      <>
        <AdventureManagerTopBar />
        <AdventureManagerContainer>
          <AdventureManagerLoading>Loading stories...</AdventureManagerLoading>
        </AdventureManagerContainer>
      </>
    );
  }

  // Throw appropriate error based on error type
  if (error === "load") {
    throw new StoriesLoadError();
  }
  if (error === "create") {
    throw new StoryCreateError();
  }
  if (error === "delete") {
    throw new StoryDeleteError();
  }

  return (
    <>
      <AdventureManagerTopBar />
      <FileDropArea
        onFileDrop={handleFileDrop}
        dropLabel="Drop YAML file here"
        disabled={deletingAdventureId !== null}
        data-testid="adventure-manager-drop-area"
      >
        <AdventureManagerContainer>
          <AdventureManagerList>
            <NewAdventureCard onClick={handleCreateAdventure} />
            {stories.map((adventure) => (
              <AdventureCard
                key={adventure.id}
                adventure={adventure}
                onOpen={handleOpenAdventure}
                onDeleteClick={() => handleDeleteClick(adventure.id)}
                deleteModalOpen={deletingAdventureId === adventure.id}
                onConfirmDelete={handleConfirmDelete}
                onCancelDelete={handleCancelDelete}
              />
            ))}
          </AdventureManagerList>
        </AdventureManagerContainer>
      </FileDropArea>
    </>
  );
};

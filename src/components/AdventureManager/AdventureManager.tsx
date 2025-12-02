import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  listStories,
  deleteAdventure,
  createAdventure,
  type StoredAdventure,
} from "@/data/adventureDatabase";
import adventureTemplate from "@/data/adventure.yaml?raw";
import { getAdventureTestRoute } from "@/constants/routes";
import { importYamlFile } from "@/utils/importYaml";
import {
  StoriesLoadError,
  StoryCreateError,
  StoryDeleteError,
} from "@/utils/errors";
import { FileDropArea } from "@/components/common/FileDropArea/FileDropArea";
import { ModalDialog } from "@/components/common/ModalDialog/ModalDialog";
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
  const [importError, setImportError] = useState<string | null>(null);
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

  const handleFileImport = useCallback(
    async (file: File) => {
      const result = await importYamlFile(file);

      if (result.success) {
        // Reload stories to show the new adventure
        await loadStories();
        // Navigate to the imported adventure
        navigate(getAdventureTestRoute(result.adventureId));
      } else {
        // Show error modal
        setImportError(result.error);
      }
    },
    [loadStories, navigate]
  );

  const handleFileDrop = useCallback(
    (file: File) => {
      handleFileImport(file);
    },
    [handleFileImport]
  );

  const handleCloseImportError = useCallback(() => {
    setImportError(null);
  }, []);

  if (loading) {
    return (
      <>
        <AdventureManagerTopBar onFileSelect={handleFileImport} />
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

  const isModalOpen = deletingAdventureId !== null || importError !== null;

  return (
    <>
      <AdventureManagerTopBar onFileSelect={handleFileImport} />
      <FileDropArea
        onFileDrop={handleFileDrop}
        dropLabel="Drop YAML file here"
        isDisabled={isModalOpen}
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
                isDeleteModalOpen={deletingAdventureId === adventure.id}
                onConfirmDelete={handleConfirmDelete}
                onCancelDelete={handleCancelDelete}
              />
            ))}
          </AdventureManagerList>
        </AdventureManagerContainer>
      </FileDropArea>
      <ModalDialog
        isOpen={importError !== null}
        onOpenChange={handleCloseImportError}
        title="Import Failed"
        message={importError || ""}
        actions={[
          {
            label: "Close",
            onClick: handleCloseImportError,
            variant: "primary",
          },
        ]}
      />
    </>
  );
};

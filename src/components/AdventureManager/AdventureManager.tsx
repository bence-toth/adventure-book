import { useCallback } from "react";
import {
  StoriesLoadError,
  StoryCreateError,
  StoryDeleteError,
} from "@/utils/errors";
import { FileDropArea } from "@/components/common/FileDropArea/FileDropArea";
import { ModalDialog } from "@/components/common/ModalDialog/ModalDialog";
import { ADVENTURE_MANAGER_TEST_IDS } from "./testIds";
import { AdventureManagerTopBar } from "./AdventureManagerTopBar/AdventureManagerTopBar";
import { NewAdventureCard } from "./NewAdventureCard/NewAdventureCard";
import { AdventureCard } from "./AdventureCard/AdventureCard";
import {
  AdventureManagerContainer,
  AdventureManagerLoading,
  AdventureManagerList,
} from "./AdventureManager.styles";
import { useAdventureStories } from "./useAdventureStories";
import { useAdventureImport } from "./useAdventureImport";
import { useDeleteConfirmation } from "./useDeleteConfirmation";

export const AdventureManager = () => {
  const {
    stories,
    loading,
    error,
    handleOpenAdventure,
    handleCreateAdventure,
    handleDeleteAdventure,
    loadStories,
  } = useAdventureStories();

  const { importError, handleFileImport, handleCloseImportError } =
    useAdventureImport(loadStories);

  const {
    deletingAdventureId,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  } = useDeleteConfirmation(handleDeleteAdventure);

  const handleFileDrop = useCallback(
    (file: File) => {
      handleFileImport(file);
    },
    [handleFileImport]
  );

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
        data-testid={ADVENTURE_MANAGER_TEST_IDS.DROP_AREA}
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

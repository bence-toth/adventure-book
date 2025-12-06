import { useState, useCallback } from "react";

interface UseDeleteConfirmationResult {
  deletingAdventureId: string | null;
  handleDeleteClick: (adventureId: string) => void;
  handleConfirmDelete: () => Promise<void>;
  handleCancelDelete: () => void;
}

export const useDeleteConfirmation = (
  onConfirmDelete: (id: string) => Promise<void>
): UseDeleteConfirmationResult => {
  const [deletingAdventureId, setDeletingAdventureId] = useState<string | null>(
    null
  );

  const handleDeleteClick = useCallback((adventureId: string) => {
    setDeletingAdventureId(adventureId);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingAdventureId) return;

    await onConfirmDelete(deletingAdventureId);
    setDeletingAdventureId(null);
  }, [deletingAdventureId, onConfirmDelete]);

  const handleCancelDelete = useCallback(() => {
    setDeletingAdventureId(null);
  }, []);

  return {
    deletingAdventureId,
    handleDeleteClick,
    handleConfirmDelete,
    handleCancelDelete,
  };
};

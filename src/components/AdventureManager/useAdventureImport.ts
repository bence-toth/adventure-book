import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { importYamlFile } from "@/utils/importYaml";
import { getAdventureTestRoute } from "@/constants/routes";

interface UseAdventureImportResult {
  importError: string | null;
  handleFileImport: (file: File) => Promise<void>;
  handleCloseImportError: () => void;
}

export const useAdventureImport = (
  onImportSuccess?: () => Promise<void>
): UseAdventureImportResult => {
  const [importError, setImportError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleFileImport = useCallback(
    async (file: File) => {
      const result = await importYamlFile(file);

      if (result.success) {
        // Trigger optional callback (e.g., reload stories)
        if (onImportSuccess) {
          await onImportSuccess();
        }
        // Navigate to the imported adventure
        navigate(getAdventureTestRoute(result.adventureId));
      } else {
        // Show error modal
        setImportError(result.error);
      }
    },
    [navigate, onImportSuccess]
  );

  const handleCloseImportError = useCallback(() => {
    setImportError(null);
  }, []);

  return {
    importError,
    handleFileImport,
    handleCloseImportError,
  };
};

import { AdventureParser } from "@/data/adventureParser";
import { createAdventure } from "@/data/adventureDatabase";

interface ImportResult {
  success: true;
  adventureId: string;
}

interface ImportError {
  success: false;
  error: string;
}

type ImportYamlResult = ImportResult | ImportError;

export const importYamlFile = async (file: File): Promise<ImportYamlResult> => {
  // Validate file type
  const fileExtension = file.name.split(".").pop()?.toLowerCase();
  if (!fileExtension || !["yaml", "yml"].includes(fileExtension)) {
    return {
      success: false,
      error: "File must be a YAML file (.yaml or .yml)",
    };
  }

  try {
    // Read file content
    const content = await file.text();

    if (!content.trim()) {
      return {
        success: false,
        error: "File is empty",
      };
    }

    // Parse and validate YAML structure
    let adventure;
    try {
      adventure = AdventureParser.parseFromString(content);
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to parse YAML file",
      };
    }

    // Import to database
    try {
      const adventureId = await createAdventure(
        adventure.metadata.title,
        content
      );

      return {
        success: true,
        adventureId,
      };
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to save adventure to database",
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to read file",
    };
  }
};

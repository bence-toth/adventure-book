import { useState, useCallback, useMemo } from "react";
import { validateTitle, validateIntroductionText } from "@/utils/validation";
import type { Adventure } from "@/data/types";

interface UseIntroductionEditParams {
  adventure: Adventure;
  onSave: (title: string, text: string) => Promise<void>;
}

interface UseIntroductionEditReturn {
  title: string;
  text: string;
  titleError: string | undefined;
  textError: string | undefined;
  hasChanges: boolean;
  handleTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTextChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSave: () => Promise<void>;
  handleReset: () => void;
}

export const useIntroductionEdit = ({
  adventure,
  onSave,
}: UseIntroductionEditParams): UseIntroductionEditReturn => {
  const [title, setTitle] = useState(adventure.metadata.title);
  const [text, setText] = useState(adventure.intro.paragraphs.join("\n\n"));
  const [titleError, setTitleError] = useState<string | undefined>();
  const [textError, setTextError] = useState<string | undefined>();

  // Check if any changes have been made
  const hasChanges = useMemo(() => {
    if (title !== adventure.metadata.title) return true;
    if (text !== adventure.intro.paragraphs.join("\n\n")) return true;
    return false;
  }, [title, text, adventure]);

  const handleSave = useCallback(async () => {
    // Validate
    const titleValidationError = validateTitle(title);
    const textValidationError = validateIntroductionText(text);

    if (titleValidationError || textValidationError) {
      setTitleError(titleValidationError);
      setTextError(textValidationError);
      return;
    }

    // Save
    await onSave(title, text);
  }, [title, text, onSave]);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(e.target.value);
      if (titleError) {
        setTitleError(undefined);
      }
    },
    [titleError]
  );

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
      if (textError) {
        setTextError(undefined);
      }
    },
    [textError]
  );

  const handleReset = useCallback(() => {
    setTitle(adventure.metadata.title);
    setText(adventure.intro.paragraphs.join("\n\n"));
    setTitleError(undefined);
    setTextError(undefined);
  }, [adventure]);

  return {
    title,
    text,
    titleError,
    textError,
    hasChanges,
    handleTitleChange,
    handleTextChange,
    handleSave,
    handleReset,
  };
};

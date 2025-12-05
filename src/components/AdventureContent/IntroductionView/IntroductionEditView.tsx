import { useState, useCallback } from "react";
import { useAdventure } from "@/context/useAdventure";
import { Input } from "@/components/common/Input/Input";
import { Textarea } from "@/components/common/Textarea/Textarea";
import { Button } from "@/components/common/Button/Button";
import { validateTitle, validateIntroductionText } from "@/utils/validation";
import type { Adventure } from "@/data/types";
import {
  EditViewLayout,
  EditScrollableContent,
  ContentWrapper,
  EditContainer,
  EditFooter,
  FormSection,
} from "./IntroductionEditView.styles";

interface IntroductionEditViewProps {
  adventure: Adventure;
}

export const IntroductionEditView = ({
  adventure,
}: IntroductionEditViewProps) => {
  const { updateIntroduction } = useAdventure();
  const [title, setTitle] = useState(adventure.metadata.title);
  const [text, setText] = useState(adventure.intro.paragraphs.join("\n\n"));
  const [titleError, setTitleError] = useState<string | undefined>();
  const [textError, setTextError] = useState<string | undefined>();

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
    await updateIntroduction(title, text);
  }, [title, text, updateIntroduction]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (titleError) {
      setTitleError(undefined);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (textError) {
      setTextError(undefined);
    }
  };

  return (
    <EditViewLayout>
      <EditScrollableContent>
        <ContentWrapper>
          <EditContainer>
            <FormSection>
              <Input
                label="Title"
                value={title}
                onChange={handleTitleChange}
                error={titleError}
                data-testid="introduction-title-input"
              />
            </FormSection>
            <FormSection>
              <Textarea
                label="Introduction content"
                value={text}
                onChange={handleTextChange}
                error={textError}
                rows={10}
                data-testid="introduction-text-input"
              />
            </FormSection>
          </EditContainer>
        </ContentWrapper>
      </EditScrollableContent>
      <EditFooter>
        <Button
          onClick={handleSave}
          variant="primary"
          data-testid="save-button"
        >
          Save introduction
        </Button>
        <Button variant="neutral" data-testid="reset-button">
          Undo changes
        </Button>
      </EditFooter>
    </EditViewLayout>
  );
};

import { useState, useCallback } from "react";
import { useAdventure } from "@/context/useAdventure";
import { Textarea } from "@/components/common/Textarea/Textarea";
import { Button } from "@/components/common/Button/Button";
import { validateIntroductionText } from "@/utils/validation";
import type { Adventure } from "@/data/types";
import {
  EditContainer,
  EditTitle,
  FormSection,
  ButtonGroup,
} from "./IntroductionEditView.styles";

interface IntroductionEditViewProps {
  adventure: Adventure;
}

export const IntroductionEditView = ({
  adventure,
}: IntroductionEditViewProps) => {
  const { updateIntroduction } = useAdventure();
  const [text, setText] = useState(adventure.intro.paragraphs.join("\n\n"));
  const [textError, setTextError] = useState<string | undefined>();

  const handleSave = useCallback(async () => {
    // Validate
    const error = validateIntroductionText(text);
    if (error) {
      setTextError(error);
      return;
    }

    // Save
    await updateIntroduction(text);
  }, [text, updateIntroduction]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (textError) {
      setTextError(undefined);
    }
  };

  return (
    <EditContainer>
      <EditTitle>{adventure.metadata.title}</EditTitle>
      <FormSection>
        <Textarea
          label="Introduction Text"
          value={text}
          onChange={handleTextChange}
          error={textError}
          rows={10}
          data-testid="introduction-text-input"
        />
      </FormSection>
      <ButtonGroup>
        <Button onClick={handleSave} variant="primary">
          Save
        </Button>
      </ButtonGroup>
    </EditContainer>
  );
};

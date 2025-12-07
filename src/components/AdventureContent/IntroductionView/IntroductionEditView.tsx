import { useAdventure } from "@/context/useAdventure";
import { Input } from "@/components/common/Input/Input";
import { Textarea } from "@/components/common/Textarea/Textarea";
import { Button } from "@/components/common/Button/Button";
import { UnsavedChangesModal } from "../UnsavedChangesModal/UnsavedChangesModal";
import { useUnsavedChangesWarning } from "@/utils/useUnsavedChangesWarning";
import { useIntroductionEdit } from "./useIntroductionEdit";
import type { Adventure } from "@/data/types";
import {
  EditViewLayout,
  EditScrollableContent,
  ContentWrapper,
  EditContainer,
  EditFooter,
  FormSection,
  PageTitle,
} from "./IntroductionEditView.styles";

interface IntroductionEditViewProps {
  adventure: Adventure;
}

export const IntroductionEditView = ({
  adventure,
}: IntroductionEditViewProps) => {
  const { updateIntroduction } = useAdventure();

  const {
    title,
    text,
    titleError,
    textError,
    hasChanges,
    handleTitleChange,
    handleTextChange,
    handleSave,
    handleReset,
  } = useIntroductionEdit({
    adventure,
    onSave: updateIntroduction,
  });

  // Use custom hook for unsaved changes warning
  const { isModalOpen, proceedNavigation, cancelNavigation } =
    useUnsavedChangesWarning({
      hasUnsavedChanges: hasChanges,
    });

  return (
    <EditViewLayout>
      <EditScrollableContent>
        <ContentWrapper>
          <PageTitle>Introduction</PageTitle>
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
          disabled={!hasChanges}
          data-testid="save-button"
        >
          Save introduction
        </Button>
        <Button
          onClick={handleReset}
          variant="neutral"
          disabled={!hasChanges}
          data-testid="reset-button"
        >
          Undo changes
        </Button>
      </EditFooter>
      <UnsavedChangesModal
        isOpen={isModalOpen}
        onStay={cancelNavigation}
        onLeave={proceedNavigation}
      />
    </EditViewLayout>
  );
};

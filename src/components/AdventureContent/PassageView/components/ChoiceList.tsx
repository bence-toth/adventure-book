import { Plus } from "lucide-react";
import type { ChoiceData } from "../usePassageEditState";
import {
  FormSection,
  SectionTitle,
  AddButton,
  ErrorText,
} from "./ChoiceList.styles";
import { ChoiceItem } from "./ChoiceItem";

interface ChoiceListProps {
  choices: ChoiceData[];
  choicesError?: string;
  passageOptions: Array<{ value: string; label: string }>;
  choiceRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
  onAddChoice: () => void;
  onRemoveChoice: (index: number) => void;
  onChoiceTextChange: (index: number, value: string) => void;
  onChoiceGotoChange: (index: number, value: string) => void;
}

export const ChoiceList = ({
  choices,
  choicesError,
  passageOptions,
  choiceRefs,
  onAddChoice,
  onRemoveChoice,
  onChoiceTextChange,
  onChoiceGotoChange,
}: ChoiceListProps) => {
  return (
    <FormSection>
      <SectionTitle>Choices</SectionTitle>
      {choicesError && <ErrorText>{choicesError}</ErrorText>}
      {choices.map((choice, index) => (
        <ChoiceItem
          key={index}
          choice={choice}
          index={index}
          passageOptions={passageOptions}
          onTextChange={onChoiceTextChange}
          onGotoChange={onChoiceGotoChange}
          onRemove={onRemoveChoice}
          choiceRef={(el) => {
            choiceRefs.current[index] = el;
          }}
        />
      ))}
      <AddButton
        onClick={onAddChoice}
        icon={Plus}
        variant="neutral"
        size="small"
        data-testid="add-choice-button"
      >
        Add choice
      </AddButton>
    </FormSection>
  );
};

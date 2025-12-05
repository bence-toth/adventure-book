import { Trash2 } from "lucide-react";
import { Input } from "@/components/common/Input/Input";
import { Select } from "@/components/common/Select/Select";
import type { ChoiceData } from "../usePassageEditState";
import { ChoiceRow, ChoiceControls, RemoveButton } from "./ChoiceItem.styles";

interface ChoiceItemProps {
  choice: ChoiceData;
  index: number;
  passageOptions: Array<{ value: string; label: string }>;
  onTextChange: (index: number, value: string) => void;
  onGotoChange: (index: number, value: string) => void;
  onRemove: (index: number) => void;
  choiceRef?: (el: HTMLInputElement | null) => void;
}

export const ChoiceItem = ({
  choice,
  index,
  passageOptions,
  onTextChange,
  onGotoChange,
  onRemove,
  choiceRef,
}: ChoiceItemProps) => {
  return (
    <ChoiceRow>
      <ChoiceControls>
        <Input
          ref={choiceRef}
          id={`choice-text-${index}`}
          label="Text"
          value={choice.text}
          onChange={(e) => onTextChange(index, e.target.value)}
          error={choice.textError}
          data-testid={`choice-text-${index}`}
        />
        <Select
          id={`choice-goto-${index}`}
          label="Go to"
          options={passageOptions}
          value={choice.goto ? String(choice.goto) : ""}
          onChange={(e) => onGotoChange(index, e.target.value)}
          error={choice.gotoError}
          placeholder="Select passage"
          data-testid={`choice-goto-${index}`}
        />
      </ChoiceControls>
      <RemoveButton
        onClick={() => onRemove(index)}
        icon={Trash2}
        variant="danger"
        size="small"
        aria-label="Remove choice"
        data-testid={`remove-choice-${index}`}
      />
    </ChoiceRow>
  );
};

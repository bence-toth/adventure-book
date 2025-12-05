import { Plus } from "lucide-react";
import type { EffectData } from "../usePassageEditState";
import {
  FormSection,
  SectionTitle,
  AddButton,
  ErrorText,
} from "./EffectList.styles";
import { EffectItem } from "./EffectItem";

interface EffectListProps {
  effects: EffectData[];
  effectsError?: string;
  itemOptions: Array<{ value: string; label: string }>;
  effectRefs: React.MutableRefObject<(HTMLSelectElement | null)[]>;
  onAddEffect: () => void;
  onRemoveEffect: (index: number) => void;
  onEffectTypeChange: (index: number, value: string) => void;
  onEffectItemChange: (index: number, value: string) => void;
}

export const EffectList = ({
  effects,
  effectsError,
  itemOptions,
  effectRefs,
  onAddEffect,
  onRemoveEffect,
  onEffectTypeChange,
  onEffectItemChange,
}: EffectListProps) => {
  return (
    <FormSection>
      <SectionTitle>Effects</SectionTitle>
      {effectsError && <ErrorText>{effectsError}</ErrorText>}
      {effects.map((effect, index) => (
        <EffectItem
          key={index}
          effect={effect}
          index={index}
          itemOptions={itemOptions}
          onTypeChange={onEffectTypeChange}
          onItemChange={onEffectItemChange}
          onRemove={onRemoveEffect}
          effectRef={(el) => {
            effectRefs.current[index] = el;
          }}
        />
      ))}
      <AddButton
        onClick={onAddEffect}
        icon={Plus}
        variant="neutral"
        size="small"
        data-testid="add-effect-button"
      >
        Add effect
      </AddButton>
    </FormSection>
  );
};

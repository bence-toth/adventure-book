import type { ComponentType } from "react";
import {
  Skull,
  Trophy,
  PackagePlus,
  PackageMinus,
  Split,
  MoveUp,
} from "lucide-react";
import { useAdventure } from "@/context/useAdventure";
import type { Passage } from "@/data/types";
import { Textarea } from "@/components/common/Textarea/Textarea";
import { Select } from "@/components/common/Select/Select";
import { UnsavedChangesModal } from "../UnsavedChangesModal/UnsavedChangesModal";
import { useUnsavedChangesWarning } from "@/utils/useUnsavedChangesWarning";
import {
  EditViewLayout,
  EditScrollableContent,
  ContentWrapper,
  EditContainer,
  FormSection,
  PageTitle,
} from "./PassageEditView.styles";
import { usePassageEditState } from "./usePassageEditState";
import { usePassageSaveActions } from "./usePassageSaveActions";
import { ChoiceList } from "./components/ChoiceList";
import { EffectList } from "./components/EffectList";
import { PassageEditFooter } from "./components/PassageEditFooter";

interface PassageEditViewProps {
  passageId: number;
  passage: Passage;
}

export const PassageEditView = ({
  passageId,
  passage,
}: PassageEditViewProps) => {
  const { adventure, updatePassage } = useAdventure();

  // Use custom hook for state management
  const state = usePassageEditState({ passage });

  // Use custom hook for save/reset actions
  const { handleSave, handleReset } = usePassageSaveActions({
    passageId,
    updatePassage,
    text: state.text,
    notes: state.notes,
    isEnding: state.isEnding,
    endingType: state.endingType,
    choices: state.choices,
    effects: state.effects,
    setTextError: state.setTextError,
    setChoicesError: state.setChoicesError,
    setEffectsError: state.setEffectsError,
    setEndingTypeError: state.setEndingTypeError,
    setChoices: state.setChoices,
    setEffects: state.setEffects,
    resetState: state.resetState,
  });

  // Use custom hook for unsaved changes warning
  const { isModalOpen, proceedNavigation, cancelNavigation } =
    useUnsavedChangesWarning({
      hasUnsavedChanges: state.hasChanges,
    });

  // Get available passage IDs for choice dropdowns
  const availablePassages = adventure
    ? Object.keys(adventure.passages)
        .map(Number)
        .sort((a, b) => a - b)
    : [];

  // Helper function to get icon for a passage (same logic as sidebar)
  const getPassageIcon = (
    passage: Passage
  ): ComponentType<{ size?: number; strokeWidth?: number }> => {
    // Check if it's an ending
    if (passage.ending) {
      if (passage.type === "defeat") {
        return Skull;
      }
      return Trophy; // victory or neutral
    }

    // Check for effects
    if (passage.effects) {
      const hasAddItem = passage.effects.some(
        (effect) => effect.type === "add_item"
      );
      const hasRemoveItem = passage.effects.some(
        (effect) => effect.type === "remove_item"
      );

      if (hasAddItem) {
        return PackagePlus;
      }
      if (hasRemoveItem) {
        return PackageMinus;
      }
    }

    // Check number of choices
    if (passage.choices) {
      if (passage.choices.length > 1) {
        return Split;
      }
      if (passage.choices.length === 1) {
        return MoveUp;
      }
    }

    // Default icon
    return MoveUp;
  };

  const passageOptions = availablePassages.map((id) => ({
    value: String(id),
    label: `Passage ${id}`,
    icon: adventure?.passages[id]
      ? getPassageIcon(adventure.passages[id])
      : undefined,
  }));

  // Get available items for effect dropdowns
  const itemOptions = (adventure?.items || []).map((item) => ({
    value: item.id,
    label: item.name,
  }));

  return (
    <EditViewLayout>
      <EditScrollableContent>
        <ContentWrapper>
          <PageTitle>Passage {passageId}</PageTitle>
          <EditContainer>
            <FormSection>
              <Textarea
                label="Passage content"
                value={state.text}
                onChange={state.handleTextChange}
                error={state.textError}
                rows={10}
                data-testid="passage-text-input"
              />
            </FormSection>
            <FormSection>
              <Textarea
                label="Notes"
                value={state.notes}
                onChange={state.handleNotesChange}
                rows={3}
                data-testid="passage-notes-input"
              />
            </FormSection>
            <FormSection>
              <Select
                label="Passage type"
                options={[
                  { value: "regular", label: "Regular passage" },
                  { value: "ending", label: "Ending passage" },
                ]}
                value={state.isEnding ? "ending" : "regular"}
                onChange={(value) =>
                  state.handleIsEndingChange(value === "ending")
                }
                data-testid="passage-type-select"
              />
            </FormSection>
            {state.isEnding ? (
              <FormSection>
                <Select
                  label="Ending type"
                  options={[
                    { value: "victory", label: "Victory" },
                    { value: "defeat", label: "Defeat" },
                    { value: "neutral", label: "Neutral" },
                  ]}
                  value={state.endingType}
                  onChange={(value) => state.handleEndingTypeChange(value)}
                  error={state.endingTypeError}
                  placeholder="Select ending type"
                  data-testid="ending-type-select"
                />
              </FormSection>
            ) : (
              <>
                {itemOptions.length > 0 && (
                  <EffectList
                    effects={state.effects}
                    effectsError={state.effectsError}
                    itemOptions={itemOptions}
                    onAddEffect={state.handleAddEffect}
                    onRemoveEffect={state.handleRemoveEffect}
                    onEffectTypeChange={state.handleEffectTypeChange}
                    onEffectItemChange={state.handleEffectItemChange}
                  />
                )}

                <ChoiceList
                  choices={state.choices}
                  choicesError={state.choicesError}
                  passageOptions={passageOptions}
                  choiceRefs={state.choiceRefs}
                  onAddChoice={state.handleAddChoice}
                  onRemoveChoice={state.handleRemoveChoice}
                  onChoiceTextChange={state.handleChoiceTextChange}
                  onChoiceGotoChange={state.handleChoiceGotoChange}
                />
              </>
            )}
          </EditContainer>
        </ContentWrapper>
      </EditScrollableContent>
      <PassageEditFooter
        hasChanges={state.hasChanges}
        onSave={handleSave}
        onReset={handleReset}
      />
      <UnsavedChangesModal
        isOpen={isModalOpen}
        onStay={cancelNavigation}
        onLeave={proceedNavigation}
      />
    </EditViewLayout>
  );
};

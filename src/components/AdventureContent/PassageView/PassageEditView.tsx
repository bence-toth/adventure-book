import { useAdventure } from "@/context/useAdventure";
import { Textarea } from "@/components/common/Textarea/Textarea";
import { Select } from "@/components/common/Select/Select";
import type { Passage } from "@/data/types";
import {
  EditViewLayout,
  EditScrollableContent,
  ContentWrapper,
  EditContainer,
  FormSection,
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

  // Get available passage IDs for choice dropdowns
  const availablePassages = adventure
    ? Object.keys(adventure.passages)
        .map(Number)
        .sort((a, b) => a - b)
    : [];

  const passageOptions = availablePassages.map((id) => ({
    value: String(id),
    label: `Passage ${id}`,
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
                onChange={(e) =>
                  state.handleIsEndingChange(e.target.value === "ending")
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
                  onChange={(e) => state.handleEndingTypeChange(e.target.value)}
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
                    effectRefs={state.effectRefs}
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
    </EditViewLayout>
  );
};

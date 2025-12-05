import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useAdventure } from "@/context/useAdventure";
import { Textarea } from "@/components/common/Textarea/Textarea";
import { Input } from "@/components/common/Input/Input";
import { Select } from "@/components/common/Select/Select";
import { Button } from "@/components/common/Button/Button";
import {
  validatePassageText,
  validateChoiceText,
  validateChoiceTarget,
  validateEffects,
  validateEndingType,
} from "@/utils/validation";
import type { Passage, Effect } from "@/data/types";
import {
  EditViewLayout,
  EditScrollableContent,
  ContentWrapper,
  EditContainer,
  EditFooter,
  FormSection,
  SectionTitle,
  EffectRow,
  EffectControls,
  ChoiceRow,
  ChoiceControls,
  RemoveButton,
  AddButton,
  ErrorText,
} from "./PassageEditView.styles";

interface PassageEditViewProps {
  passageId: number;
  passage: Passage;
}

interface ChoiceData {
  text: string;
  goto: number | null;
  textError?: string;
  gotoError?: string;
}

interface EffectData {
  type: "add_item" | "remove_item" | "";
  item: string;
  error?: string;
}

export const PassageEditView = ({
  passageId,
  passage,
}: PassageEditViewProps) => {
  const { adventure, updatePassage } = useAdventure();
  const [text, setText] = useState(passage.paragraphs.join("\n\n"));
  const [notes, setNotes] = useState(passage.notes || "");
  const [textError, setTextError] = useState<string | undefined>();
  const [choicesError, setChoicesError] = useState<string | undefined>();
  const [effectsError, setEffectsError] = useState<string | undefined>();

  // Initialize choices
  const [choices, setChoices] = useState<ChoiceData[]>(
    passage.ending
      ? []
      : passage.choices!.map((c) => ({
          text: c.text,
          goto: c.goto,
        }))
  );

  // Initialize effects
  const [effects, setEffects] = useState<EffectData[]>(
    passage.ending
      ? []
      : (passage.effects || []).map((e) => ({
          type: e.type,
          item: e.item,
        }))
  );

  // Initialize ending type
  const [endingType, setEndingType] = useState<string>(
    passage.ending ? passage.type || "" : ""
  );
  const [endingTypeError, setEndingTypeError] = useState<string | undefined>();

  const [isEnding, setIsEnding] = useState(passage.ending || false);

  // Refs for auto-focusing newly added items
  const choiceRefs = useRef<(HTMLInputElement | null)[]>([]);
  const effectRefs = useRef<(HTMLSelectElement | null)[]>([]);
  const shouldFocusChoice = useRef<number | null>(null);
  const shouldFocusEffect = useRef<number | null>(null);

  // Refs for preserving state when switching between regular and ending passages
  const savedChoices = useRef<ChoiceData[]>([]);
  const savedEffects = useRef<EffectData[]>([]);
  const savedEndingType = useRef<string>("");

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

  // Auto-focus newly added choice
  useEffect(() => {
    if (shouldFocusChoice.current !== null) {
      const index = shouldFocusChoice.current;
      choiceRefs.current[index]?.focus();
      shouldFocusChoice.current = null;
    }
  }, [choices]);

  // Auto-focus newly added effect
  useEffect(() => {
    if (shouldFocusEffect.current !== null) {
      const index = shouldFocusEffect.current;
      effectRefs.current[index]?.focus();
      shouldFocusEffect.current = null;
    }
  }, [effects]);

  // Check if any changes have been made
  const hasChanges = useMemo(() => {
    // Check text changes
    if (text !== passage.paragraphs.join("\n\n")) return true;

    // Check notes changes
    if (notes !== (passage.notes || "")) return true;

    // Check passage type changes
    const originalIsEnding = passage.ending || false;
    if (isEnding !== originalIsEnding) return true;

    // If it's an ending, check ending type
    if (isEnding) {
      const originalEndingType = passage.ending ? passage.type || "" : "";
      if (endingType !== originalEndingType) return true;
    } else {
      // If it's a regular passage, check choices and effects
      const originalChoices = passage.ending
        ? []
        : passage.choices!.map((c) => ({
            text: c.text,
            goto: c.goto,
          }));

      // Check if choices length changed
      if (choices.length !== originalChoices.length) return true;

      // Check if any choice changed
      for (let i = 0; i < choices.length; i++) {
        if (
          choices[i].text !== originalChoices[i].text ||
          choices[i].goto !== originalChoices[i].goto
        ) {
          return true;
        }
      }

      // Check effects
      const originalEffects = passage.ending
        ? []
        : (passage.effects || []).map((e) => ({
            type: e.type,
            item: e.item,
          }));

      // Check if effects length changed
      if (effects.length !== originalEffects.length) return true;

      // Check if any effect changed
      for (let i = 0; i < effects.length; i++) {
        if (
          effects[i].type !== originalEffects[i].type ||
          effects[i].item !== originalEffects[i].item
        ) {
          return true;
        }
      }
    }

    return false;
  }, [text, notes, isEnding, endingType, choices, effects, passage]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (textError) setTextError(undefined);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  const handleAddChoice = () => {
    const newIndex = choices.length;
    setChoices([...choices, { text: "", goto: null }]);
    shouldFocusChoice.current = newIndex;
    if (choicesError) setChoicesError(undefined);
  };

  const handleRemoveChoice = (index: number) => {
    setChoices(choices.filter((_, i) => i !== index));
  };

  const handleChoiceTextChange = (index: number, value: string) => {
    const newChoices = [...choices];
    newChoices[index] = {
      ...newChoices[index],
      text: value,
      textError: undefined,
    };
    setChoices(newChoices);
  };

  const handleChoiceGotoChange = (index: number, value: string) => {
    const newChoices = [...choices];
    newChoices[index] = {
      ...newChoices[index],
      goto: value ? parseInt(value, 10) : null,
      gotoError: undefined,
    };
    setChoices(newChoices);
  };

  const handleAddEffect = () => {
    const newIndex = effects.length;
    setEffects([...effects, { type: "", item: "" }]);
    shouldFocusEffect.current = newIndex;
    if (effectsError) setEffectsError(undefined);
  };

  const handleRemoveEffect = (index: number) => {
    setEffects(effects.filter((_, i) => i !== index));
    if (effectsError) setEffectsError(undefined);
  };

  const handleEffectTypeChange = (index: number, value: string) => {
    const newEffects = [...effects];
    newEffects[index] = {
      ...newEffects[index],
      type: value as "add_item" | "remove_item" | "",
      error: undefined,
    };
    setEffects(newEffects);
    if (effectsError) setEffectsError(undefined);
  };

  const handleEffectItemChange = (index: number, value: string) => {
    const newEffects = [...effects];
    newEffects[index] = {
      ...newEffects[index],
      item: value,
      error: undefined,
    };
    setEffects(newEffects);
    if (effectsError) setEffectsError(undefined);
  };

  const handleEndingTypeChange = (value: string) => {
    setEndingType(value);
    if (endingTypeError) setEndingTypeError(undefined);
  };

  const handleIsEndingChange = (value: boolean) => {
    setIsEnding(value);
    if (value) {
      // Save current choices and effects before switching to ending
      savedChoices.current = [...choices];
      savedEffects.current = [...effects];
      // Clear choices and effects when switching to ending
      setChoices([]);
      setEffects([]);
      // Restore previously saved ending type
      if (savedEndingType.current) {
        setEndingType(savedEndingType.current);
      }
    } else {
      // Save current ending type before switching to regular
      savedEndingType.current = endingType;
      // Clear ending type when switching to regular passage
      setEndingType("");
      // Restore previously saved choices and effects
      if (savedChoices.current.length > 0) {
        setChoices(savedChoices.current);
      }
      if (savedEffects.current.length > 0) {
        setEffects(savedEffects.current);
      }
    }
  };

  const handleSave = useCallback(async () => {
    let hasErrors = false;

    // Validate text
    const textValidationError = validatePassageText(text);
    if (textValidationError) {
      setTextError(textValidationError);
      hasErrors = true;
    }

    if (isEnding) {
      // Validate ending type
      const endingValidationError = validateEndingType(false, endingType);
      if (endingValidationError) {
        setEndingTypeError(endingValidationError);
        hasErrors = true;
      }
    } else {
      // Validate that there is at least one choice
      if (choices.length === 0) {
        setChoicesError("Regular passages must have at least one choice");
        hasErrors = true;
      }

      // Validate choices
      const newChoices = [...choices];
      for (let i = 0; i < newChoices.length; i++) {
        const choice = newChoices[i];
        const textErr = validateChoiceText(choice.text);
        const gotoErr = validateChoiceTarget(choice.goto);
        if (textErr || gotoErr) {
          newChoices[i] = { ...choice, textError: textErr, gotoError: gotoErr };
          hasErrors = true;
        }
      }
      if (hasErrors) {
        setChoices(newChoices);
      }

      // Validate effects
      const validEffects: Effect[] = [];
      const newEffects = [...effects];
      for (let i = 0; i < newEffects.length; i++) {
        const effect = newEffects[i];
        if (!effect.type || !effect.item) {
          newEffects[i] = {
            ...effect,
            error: "Effect type and item must be selected",
          };
          hasErrors = true;
        } else {
          validEffects.push({ type: effect.type, item: effect.item });
        }
      }
      if (hasErrors) {
        setEffects(newEffects);
      }

      // Validate effects as a group
      const effectsValidationError = validateEffects(validEffects);
      if (effectsValidationError) {
        setEffectsError(effectsValidationError);
        hasErrors = true;
      }
    }

    if (hasErrors) return;

    // Build updated passage
    const paragraphs = text
      .split("\n\n")
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    let updatedPassage: Passage;
    if (isEnding) {
      updatedPassage = {
        paragraphs,
        ...(notes && { notes }),
        ending: true,
        ...(endingType && {
          type: endingType as "victory" | "defeat" | "neutral",
        }),
      };
    } else {
      const validChoices = choices.map((c) => ({
        text: c.text,
        goto: c.goto!,
      }));
      const validEffects: Effect[] = effects
        .filter((e) => e.type && e.item)
        .map((e) => ({
          type: e.type as "add_item" | "remove_item",
          item: e.item,
        }));

      updatedPassage = {
        paragraphs,
        ...(notes && { notes }),
        choices: validChoices,
        ...(validEffects.length > 0 && { effects: validEffects }),
      };
    }

    await updatePassage(passageId, updatedPassage);
  }, [
    text,
    notes,
    isEnding,
    endingType,
    choices,
    effects,
    updatePassage,
    passageId,
  ]);

  const handleReset = useCallback(() => {
    // Reset all fields to their initial values from the passage prop
    setText(passage.paragraphs.join("\n\n"));
    setNotes(passage.notes || "");
    setTextError(undefined);
    setChoicesError(undefined);
    setEffectsError(undefined);

    const isPassageEnding = passage.ending || false;
    setIsEnding(isPassageEnding);

    if (isPassageEnding) {
      setEndingType(passage.type || "");
      setEndingTypeError(undefined);
      setChoices([]);
      setEffects([]);
    } else {
      setChoices(
        passage.choices!.map((c) => ({
          text: c.text,
          goto: c.goto,
        }))
      );
      setEffects(
        (passage.effects || []).map((e) => ({
          type: e.type,
          item: e.item,
        }))
      );
      setEndingType("");
      setEndingTypeError(undefined);
    }

    // Clear saved state in refs
    savedChoices.current = [];
    savedEffects.current = [];
    savedEndingType.current = "";
  }, [passage]);

  return (
    <EditViewLayout>
      <EditScrollableContent>
        <ContentWrapper>
          <EditContainer>
            <FormSection>
              <Textarea
                label="Passage content"
                value={text}
                onChange={handleTextChange}
                error={textError}
                rows={10}
                data-testid="passage-text-input"
              />
            </FormSection>

            <FormSection>
              <Textarea
                label="Notes"
                value={notes}
                onChange={handleNotesChange}
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
                value={isEnding ? "ending" : "regular"}
                onChange={(e) =>
                  handleIsEndingChange(e.target.value === "ending")
                }
                data-testid="passage-type-select"
              />
            </FormSection>

            {isEnding ? (
              <FormSection>
                <Select
                  label="Ending type"
                  options={[
                    { value: "victory", label: "Victory" },
                    { value: "defeat", label: "Defeat" },
                    { value: "neutral", label: "Neutral" },
                  ]}
                  value={endingType}
                  onChange={(e) => handleEndingTypeChange(e.target.value)}
                  error={endingTypeError}
                  placeholder="Select ending type"
                  data-testid="ending-type-select"
                />
              </FormSection>
            ) : (
              <>
                {itemOptions.length > 0 && (
                  <FormSection>
                    <SectionTitle>Effects</SectionTitle>
                    {effectsError && <ErrorText>{effectsError}</ErrorText>}
                    {effects.map((effect, index) => (
                      <EffectRow key={index}>
                        <EffectControls>
                          <Select
                            ref={(el) => {
                              effectRefs.current[index] = el;
                            }}
                            id={`effect-type-${index}`}
                            label="Effect type"
                            options={[
                              {
                                value: "add_item",
                                label: "Add item to inventory",
                              },
                              {
                                value: "remove_item",
                                label: "Remove item from inventory",
                              },
                            ]}
                            value={effect.type}
                            onChange={(e) =>
                              handleEffectTypeChange(index, e.target.value)
                            }
                            placeholder="Select effect type"
                            error={effect.error}
                            data-testid={`effect-type-${index}`}
                          />
                          <Select
                            id={`effect-item-${index}`}
                            label="Item"
                            options={itemOptions}
                            value={effect.item}
                            onChange={(e) =>
                              handleEffectItemChange(index, e.target.value)
                            }
                            placeholder="Select item"
                            data-testid={`effect-item-${index}`}
                          />
                        </EffectControls>
                        <RemoveButton
                          onClick={() => handleRemoveEffect(index)}
                          icon={Trash2}
                          variant="danger"
                          size="small"
                          aria-label="Remove effect"
                          data-testid={`remove-effect-${index}`}
                        />
                      </EffectRow>
                    ))}
                    <AddButton
                      onClick={handleAddEffect}
                      icon={Plus}
                      variant="neutral"
                      size="small"
                      data-testid="add-effect-button"
                    >
                      Add effect
                    </AddButton>
                  </FormSection>
                )}

                <FormSection>
                  <SectionTitle>Choices</SectionTitle>
                  {choicesError && <ErrorText>{choicesError}</ErrorText>}
                  {choices.map((choice, index) => (
                    <ChoiceRow key={index}>
                      <ChoiceControls>
                        <Input
                          ref={(el) => {
                            choiceRefs.current[index] = el;
                          }}
                          id={`choice-text-${index}`}
                          label="Text"
                          value={choice.text}
                          onChange={(e) =>
                            handleChoiceTextChange(index, e.target.value)
                          }
                          error={choice.textError}
                          data-testid={`choice-text-${index}`}
                        />
                        <Select
                          id={`choice-goto-${index}`}
                          label="Go to"
                          options={passageOptions}
                          value={choice.goto ? String(choice.goto) : ""}
                          onChange={(e) =>
                            handleChoiceGotoChange(index, e.target.value)
                          }
                          error={choice.gotoError}
                          placeholder="Select passage"
                          data-testid={`choice-goto-${index}`}
                        />
                      </ChoiceControls>
                      <RemoveButton
                        onClick={() => handleRemoveChoice(index)}
                        icon={Trash2}
                        variant="danger"
                        size="small"
                        aria-label="Remove choice"
                        data-testid={`remove-choice-${index}`}
                      />
                    </ChoiceRow>
                  ))}
                  <AddButton
                    onClick={handleAddChoice}
                    icon={Plus}
                    variant="neutral"
                    size="small"
                    data-testid="add-choice-button"
                  >
                    Add choice
                  </AddButton>
                </FormSection>
              </>
            )}
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
          Save passage
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
    </EditViewLayout>
  );
};

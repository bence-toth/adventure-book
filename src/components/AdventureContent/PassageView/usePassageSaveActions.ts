import { useCallback } from "react";
import {
  validatePassageText,
  validateChoiceText,
  validateChoiceTarget,
  validateEffects,
  validateEndingType,
} from "@/utils/validation";
import type { Passage, Effect } from "@/data/types";
import type { ChoiceData, EffectData } from "./usePassageEditState";

interface UsePassageSaveActionsProps {
  passageId: number;
  updatePassage: (passageId: number, passage: Passage) => Promise<void>;
  text: string;
  notes: string;
  isEnding: boolean;
  endingType: string;
  choices: ChoiceData[];
  effects: EffectData[];
  setTextError: (error: string | undefined) => void;
  setChoicesError: (error: string | undefined) => void;
  setEffectsError: (error: string | undefined) => void;
  setEndingTypeError: (error: string | undefined) => void;
  setChoices: (choices: ChoiceData[]) => void;
  setEffects: (effects: EffectData[]) => void;
  resetState: () => void;
}

export const usePassageSaveActions = ({
  passageId,
  updatePassage,
  text,
  notes,
  isEnding,
  endingType,
  choices,
  effects,
  setTextError,
  setChoicesError,
  setEffectsError,
  setEndingTypeError,
  setChoices,
  setEffects,
  resetState,
}: UsePassageSaveActionsProps) => {
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
      const endingValidationError = validateEndingType(isEnding, endingType);
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
    setTextError,
    setChoicesError,
    setEffectsError,
    setEndingTypeError,
    setChoices,
    setEffects,
  ]);

  const handleReset = useCallback(() => {
    resetState();
  }, [resetState]);

  return {
    handleSave,
    handleReset,
  };
};

import { useState, useRef, useEffect, useMemo } from "react";
import type { Passage } from "@/data/types";

export interface ChoiceData {
  text: string;
  goto: number | null;
  textError?: string;
  gotoError?: string;
}

export interface EffectData {
  type: "add_item" | "remove_item" | "";
  item: string;
  error?: string;
}

interface UsePassageEditStateProps {
  passage: Passage;
}

export const usePassageEditState = ({ passage }: UsePassageEditStateProps) => {
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

  const resetState = () => {
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
  };

  return {
    // State
    text,
    notes,
    textError,
    choicesError,
    effectsError,
    choices,
    effects,
    endingType,
    endingTypeError,
    isEnding,
    hasChanges,
    // Refs
    choiceRefs,
    effectRefs,
    // Handlers
    handleTextChange,
    handleNotesChange,
    handleAddChoice,
    handleRemoveChoice,
    handleChoiceTextChange,
    handleChoiceGotoChange,
    handleAddEffect,
    handleRemoveEffect,
    handleEffectTypeChange,
    handleEffectItemChange,
    handleEndingTypeChange,
    handleIsEndingChange,
    resetState,
    // Setters for validation errors
    setTextError,
    setChoicesError,
    setEffectsError,
    setEndingTypeError,
    setChoices,
    setEffects,
  };
};

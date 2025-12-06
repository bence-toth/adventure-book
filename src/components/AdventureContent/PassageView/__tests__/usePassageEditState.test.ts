import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { usePassageEditState } from "../usePassageEditState";
import type { Passage } from "@/data/types";

describe("usePassageEditState", () => {
  describe("Initial state for regular passage", () => {
    it("initializes with passage data for a regular passage", () => {
      const passage: Passage = {
        paragraphs: ["First paragraph", "Second paragraph"],
        notes: "Test notes",
        choices: [
          { text: "Choice 1", goto: 2 },
          { text: "Choice 2", goto: 3 },
        ],
        effects: [{ type: "add_item", item: "key" }],
      };

      const { result } = renderHook(() => usePassageEditState({ passage }));

      expect(result.current.text).toBe("First paragraph\n\nSecond paragraph");
      expect(result.current.notes).toBe("Test notes");
      expect(result.current.isEnding).toBe(false);
      expect(result.current.choices).toEqual([
        { text: "Choice 1", goto: 2 },
        { text: "Choice 2", goto: 3 },
      ]);
      expect(result.current.effects).toEqual([
        { type: "add_item", item: "key" },
      ]);
      expect(result.current.endingType).toBe("");
      expect(result.current.hasChanges).toBe(false);
    });

    it("initializes with empty notes when not provided", () => {
      const passage: Passage = {
        paragraphs: ["Test paragraph"],
        choices: [{ text: "Choice", goto: 2 }],
      };

      const { result } = renderHook(() => usePassageEditState({ passage }));

      expect(result.current.notes).toBe("");
    });

    it("initializes with empty effects when not provided", () => {
      const passage: Passage = {
        paragraphs: ["Test paragraph"],
        choices: [{ text: "Choice", goto: 2 }],
      };

      const { result } = renderHook(() => usePassageEditState({ passage }));

      expect(result.current.effects).toEqual([]);
    });
  });

  describe("Initial state for ending passage", () => {
    it("initializes with passage data for an ending passage", () => {
      const passage: Passage = {
        paragraphs: ["Ending paragraph"],
        notes: "Ending notes",
        ending: true,
        type: "victory",
      };

      const { result } = renderHook(() => usePassageEditState({ passage }));

      expect(result.current.text).toBe("Ending paragraph");
      expect(result.current.notes).toBe("Ending notes");
      expect(result.current.isEnding).toBe(true);
      expect(result.current.endingType).toBe("victory");
      expect(result.current.choices).toEqual([]);
      expect(result.current.effects).toEqual([]);
      expect(result.current.hasChanges).toBe(false);
    });

    it("initializes with empty ending type when not provided", () => {
      const passage: Passage = {
        paragraphs: ["Ending paragraph"],
        ending: true,
      };

      const { result } = renderHook(() => usePassageEditState({ passage }));

      expect(result.current.endingType).toBe("");
    });
  });

  describe("Text handlers", () => {
    it("updates text and clears text error", () => {
      const passage: Passage = {
        paragraphs: ["Original text"],
        choices: [{ text: "Choice", goto: 2 }],
      };

      const { result } = renderHook(() => usePassageEditState({ passage }));

      // Set an error first
      act(() => {
        result.current.setTextError("Test error");
      });

      expect(result.current.textError).toBe("Test error");

      // Update text
      act(() => {
        result.current.handleTextChange({
          target: { value: "New text" },
        } as React.ChangeEvent<HTMLTextAreaElement>);
      });

      expect(result.current.text).toBe("New text");
      expect(result.current.textError).toBeUndefined();
      expect(result.current.hasChanges).toBe(true);
    });

    it("updates notes", () => {
      const passage: Passage = {
        paragraphs: ["Test"],
        choices: [{ text: "Choice", goto: 2 }],
      };

      const { result } = renderHook(() => usePassageEditState({ passage }));

      act(() => {
        result.current.handleNotesChange({
          target: { value: "New notes" },
        } as React.ChangeEvent<HTMLTextAreaElement>);
      });

      expect(result.current.notes).toBe("New notes");
      expect(result.current.hasChanges).toBe(true);
    });
  });

  describe("Choice handlers", () => {
    let passage: Passage;

    beforeEach(() => {
      passage = {
        paragraphs: ["Test"],
        choices: [
          { text: "Choice 1", goto: 2 },
          { text: "Choice 2", goto: 3 },
        ],
      };
    });

    it("adds a new choice", () => {
      const { result } = renderHook(() => usePassageEditState({ passage }));

      act(() => {
        result.current.handleAddChoice();
      });

      expect(result.current.choices).toHaveLength(3);
      expect(result.current.choices[2]).toEqual({ text: "", goto: null });
      expect(result.current.hasChanges).toBe(true);
    });

    it("clears choices error when adding a choice", () => {
      const { result } = renderHook(() => usePassageEditState({ passage }));

      act(() => {
        result.current.setChoicesError("Test error");
      });

      expect(result.current.choicesError).toBe("Test error");

      act(() => {
        result.current.handleAddChoice();
      });

      expect(result.current.choicesError).toBeUndefined();
    });

    it("removes a choice", () => {
      const { result } = renderHook(() => usePassageEditState({ passage }));

      act(() => {
        result.current.handleRemoveChoice(0);
      });

      expect(result.current.choices).toHaveLength(1);
      expect(result.current.choices[0]).toEqual({ text: "Choice 2", goto: 3 });
      expect(result.current.hasChanges).toBe(true);
    });

    it("updates choice text and clears error", () => {
      const { result } = renderHook(() => usePassageEditState({ passage }));

      act(() => {
        result.current.setChoices([
          { text: "Choice 1", goto: 2, textError: "Error" },
          { text: "Choice 2", goto: 3 },
        ]);
      });

      expect(result.current.choices[0].textError).toBe("Error");

      act(() => {
        result.current.handleChoiceTextChange(0, "Updated choice");
      });

      expect(result.current.choices[0].text).toBe("Updated choice");
      expect(result.current.choices[0].textError).toBeUndefined();
      expect(result.current.hasChanges).toBe(true);
    });

    it("updates choice goto and clears error", () => {
      const { result } = renderHook(() => usePassageEditState({ passage }));

      act(() => {
        result.current.setChoices([
          { text: "Choice 1", goto: 2, gotoError: "Error" },
          { text: "Choice 2", goto: 3 },
        ]);
      });

      expect(result.current.choices[0].gotoError).toBe("Error");

      act(() => {
        result.current.handleChoiceGotoChange(0, "5");
      });

      expect(result.current.choices[0].goto).toBe(5);
      expect(result.current.choices[0].gotoError).toBeUndefined();
      expect(result.current.hasChanges).toBe(true);
    });

    it("handles empty goto value", () => {
      const { result } = renderHook(() => usePassageEditState({ passage }));

      act(() => {
        result.current.handleChoiceGotoChange(0, "");
      });

      expect(result.current.choices[0].goto).toBeNull();
    });
  });

  describe("Effect handlers", () => {
    let passage: Passage;

    beforeEach(() => {
      passage = {
        paragraphs: ["Test"],
        choices: [{ text: "Choice", goto: 2 }],
        effects: [
          { type: "add_item", item: "key" },
          { type: "remove_item", item: "sword" },
        ],
      };
    });

    it("adds a new effect", () => {
      const { result } = renderHook(() => usePassageEditState({ passage }));

      act(() => {
        result.current.handleAddEffect();
      });

      expect(result.current.effects).toHaveLength(3);
      expect(result.current.effects[2]).toEqual({ type: "", item: "" });
      expect(result.current.hasChanges).toBe(true);
    });

    it("clears effects error when adding an effect", () => {
      const { result } = renderHook(() => usePassageEditState({ passage }));

      act(() => {
        result.current.setEffectsError("Test error");
      });

      expect(result.current.effectsError).toBe("Test error");

      act(() => {
        result.current.handleAddEffect();
      });

      expect(result.current.effectsError).toBeUndefined();
    });

    it("removes an effect", () => {
      const { result } = renderHook(() => usePassageEditState({ passage }));

      act(() => {
        result.current.handleRemoveEffect(0);
      });

      expect(result.current.effects).toHaveLength(1);
      expect(result.current.effects[0]).toEqual({
        type: "remove_item",
        item: "sword",
      });
      expect(result.current.hasChanges).toBe(true);
    });

    it("clears effects error when removing an effect", () => {
      const { result } = renderHook(() => usePassageEditState({ passage }));

      act(() => {
        result.current.setEffectsError("Test error");
      });

      act(() => {
        result.current.handleRemoveEffect(0);
      });

      expect(result.current.effectsError).toBeUndefined();
    });

    it("updates effect type and clears error", () => {
      const { result } = renderHook(() => usePassageEditState({ passage }));

      act(() => {
        result.current.setEffects([
          { type: "add_item", item: "key", error: "Error" },
          { type: "remove_item", item: "sword" },
        ]);
      });

      expect(result.current.effects[0].error).toBe("Error");

      act(() => {
        result.current.handleEffectTypeChange(0, "remove_item");
      });

      expect(result.current.effects[0].type).toBe("remove_item");
      expect(result.current.effects[0].error).toBeUndefined();
      expect(result.current.effectsError).toBeUndefined();
      expect(result.current.hasChanges).toBe(true);
    });

    it("clears effectsError when changing effect type", () => {
      const { result } = renderHook(() => usePassageEditState({ passage }));

      act(() => {
        result.current.setEffects([{ type: "add_item", item: "key" }]);
        result.current.setEffectsError("Test effects error");
      });

      expect(result.current.effectsError).toBe("Test effects error");

      act(() => {
        result.current.handleEffectTypeChange(0, "remove_item");
      });

      expect(result.current.effectsError).toBeUndefined();
      expect(result.current.effects[0].type).toBe("remove_item");
    });

    it("updates effect item and clears error", () => {
      const { result } = renderHook(() => usePassageEditState({ passage }));

      act(() => {
        result.current.setEffects([
          { type: "add_item", item: "key", error: "Error" },
          { type: "remove_item", item: "sword" },
        ]);
      });

      expect(result.current.effects[0].error).toBe("Error");

      act(() => {
        result.current.handleEffectItemChange(0, "map");
      });

      expect(result.current.effects[0].item).toBe("map");
      expect(result.current.effects[0].error).toBeUndefined();
      expect(result.current.effectsError).toBeUndefined();
      expect(result.current.hasChanges).toBe(true);
    });

    it("clears effectsError when changing effect item", () => {
      const { result } = renderHook(() => usePassageEditState({ passage }));

      act(() => {
        result.current.setEffects([{ type: "add_item", item: "key" }]);
        result.current.setEffectsError("Test effects error");
      });

      expect(result.current.effectsError).toBe("Test effects error");

      act(() => {
        result.current.handleEffectItemChange(0, "sword");
      });

      expect(result.current.effectsError).toBeUndefined();
      expect(result.current.effects[0].item).toBe("sword");
    });
  });

  describe("Ending type handlers", () => {
    it("updates ending type and clears error", () => {
      const passage: Passage = {
        paragraphs: ["Test"],
        ending: true,
      };

      const { result } = renderHook(() => usePassageEditState({ passage }));

      act(() => {
        result.current.setEndingTypeError("Test error");
      });

      expect(result.current.endingTypeError).toBe("Test error");

      act(() => {
        result.current.handleEndingTypeChange("victory");
      });

      expect(result.current.endingType).toBe("victory");
      expect(result.current.endingTypeError).toBeUndefined();
      expect(result.current.hasChanges).toBe(true);
    });
  });

  describe("Passage type switching", () => {
    it("switches from regular to ending passage and preserves choices/effects", () => {
      const passage: Passage = {
        paragraphs: ["Test"],
        choices: [{ text: "Choice", goto: 2 }],
        effects: [{ type: "add_item", item: "key" }],
      };

      const { result } = renderHook(() => usePassageEditState({ passage }));

      expect(result.current.isEnding).toBe(false);
      expect(result.current.choices).toHaveLength(1);
      expect(result.current.effects).toHaveLength(1);

      act(() => {
        result.current.handleIsEndingChange(true);
      });

      expect(result.current.isEnding).toBe(true);
      expect(result.current.choices).toEqual([]);
      expect(result.current.effects).toEqual([]);
      expect(result.current.hasChanges).toBe(true);
    });

    it("switches from ending to regular passage and restores saved choices/effects", () => {
      const passage: Passage = {
        paragraphs: ["Test"],
        choices: [{ text: "Choice", goto: 2 }],
        effects: [{ type: "add_item", item: "key" }],
      };

      const { result } = renderHook(() => usePassageEditState({ passage }));

      // Switch to ending
      act(() => {
        result.current.handleIsEndingChange(true);
      });

      expect(result.current.choices).toEqual([]);
      expect(result.current.effects).toEqual([]);

      // Switch back to regular
      act(() => {
        result.current.handleIsEndingChange(false);
      });

      expect(result.current.isEnding).toBe(false);
      expect(result.current.choices).toEqual([{ text: "Choice", goto: 2 }]);
      expect(result.current.effects).toEqual([
        { type: "add_item", item: "key" },
      ]);
      expect(result.current.endingType).toBe("");
    });

    it("restores ending type when switching back to ending", () => {
      const passage: Passage = {
        paragraphs: ["Test"],
        ending: true,
        type: "victory",
      };

      const { result } = renderHook(() => usePassageEditState({ passage }));

      // Switch to regular
      act(() => {
        result.current.handleIsEndingChange(false);
      });

      expect(result.current.endingType).toBe("");

      // Switch back to ending
      act(() => {
        result.current.handleIsEndingChange(true);
      });

      expect(result.current.endingType).toBe("victory");
    });
  });

  describe("Change detection", () => {
    it("detects text changes", () => {
      const passage: Passage = {
        paragraphs: ["Original"],
        choices: [{ text: "Choice", goto: 2 }],
      };

      const { result } = renderHook(() => usePassageEditState({ passage }));

      expect(result.current.hasChanges).toBe(false);

      act(() => {
        result.current.handleTextChange({
          target: { value: "Modified" },
        } as React.ChangeEvent<HTMLTextAreaElement>);
      });

      expect(result.current.hasChanges).toBe(true);
    });

    it("detects notes changes", () => {
      const passage: Passage = {
        paragraphs: ["Test"],
        notes: "Original notes",
        choices: [{ text: "Choice", goto: 2 }],
      };

      const { result } = renderHook(() => usePassageEditState({ passage }));

      act(() => {
        result.current.handleNotesChange({
          target: { value: "Modified notes" },
        } as React.ChangeEvent<HTMLTextAreaElement>);
      });

      expect(result.current.hasChanges).toBe(true);
    });

    it("detects choice text changes", () => {
      const passage: Passage = {
        paragraphs: ["Test"],
        choices: [{ text: "Original", goto: 2 }],
      };

      const { result } = renderHook(() => usePassageEditState({ passage }));

      act(() => {
        result.current.handleChoiceTextChange(0, "Modified");
      });

      expect(result.current.hasChanges).toBe(true);
    });

    it("detects choice goto changes", () => {
      const passage: Passage = {
        paragraphs: ["Test"],
        choices: [{ text: "Choice", goto: 2 }],
      };

      const { result } = renderHook(() => usePassageEditState({ passage }));

      act(() => {
        result.current.handleChoiceGotoChange(0, "3");
      });

      expect(result.current.hasChanges).toBe(true);
    });

    it("detects effect changes", () => {
      const passage: Passage = {
        paragraphs: ["Test"],
        choices: [{ text: "Choice", goto: 2 }],
        effects: [{ type: "add_item", item: "key" }],
      };

      const { result } = renderHook(() => usePassageEditState({ passage }));

      act(() => {
        result.current.handleEffectItemChange(0, "sword");
      });

      expect(result.current.hasChanges).toBe(true);
    });

    it("detects ending type changes", () => {
      const passage: Passage = {
        paragraphs: ["Test"],
        ending: true,
        type: "victory",
      };

      const { result } = renderHook(() => usePassageEditState({ passage }));

      act(() => {
        result.current.handleEndingTypeChange("defeat");
      });

      expect(result.current.hasChanges).toBe(true);
    });

    it("detects passage type changes", () => {
      const passage: Passage = {
        paragraphs: ["Test"],
        choices: [{ text: "Choice", goto: 2 }],
      };

      const { result } = renderHook(() => usePassageEditState({ passage }));

      act(() => {
        result.current.handleIsEndingChange(true);
      });

      expect(result.current.hasChanges).toBe(true);
    });

    it("detects changes when switching ending passage to regular and modifying effects", () => {
      const passage: Passage = {
        paragraphs: ["Test"],
        ending: true,
        type: "victory",
      };

      const { result } = renderHook(() => usePassageEditState({ passage }));

      // Switch to regular passage
      act(() => {
        result.current.handleIsEndingChange(false);
      });

      // Add an effect
      act(() => {
        result.current.handleAddEffect();
      });

      expect(result.current.hasChanges).toBe(true);
    });

    it("detects changes comparing ending type when passage was not originally ending", () => {
      const passage: Passage = {
        paragraphs: ["Test"],
        choices: [{ text: "Choice", goto: 2 }],
      };

      const { result } = renderHook(() => usePassageEditState({ passage }));

      // Switch to ending and set type
      act(() => {
        result.current.handleIsEndingChange(true);
        result.current.handleEndingTypeChange("victory");
      });

      expect(result.current.hasChanges).toBe(true);
    });

    it("detects changes comparing choices when original passage was ending", () => {
      const passage: Passage = {
        paragraphs: ["Test"],
        ending: true,
        type: "victory",
      };

      const { result } = renderHook(() => usePassageEditState({ passage }));

      // Switch to regular passage and add choices
      act(() => {
        result.current.handleIsEndingChange(false);
        result.current.handleAddChoice();
      });

      expect(result.current.hasChanges).toBe(true);
    });

    it("detects changes comparing effects when original passage was ending", () => {
      const passage: Passage = {
        paragraphs: ["Test"],
        ending: true,
        type: "victory",
      };

      const { result } = renderHook(() => usePassageEditState({ passage }));

      // Switch to regular passage and add effects
      act(() => {
        result.current.handleIsEndingChange(false);
        result.current.handleAddEffect();
      });

      expect(result.current.hasChanges).toBe(true);
    });
  });

  describe("Reset state", () => {
    it("resets all state for regular passage", () => {
      const passage: Passage = {
        paragraphs: ["Original"],
        notes: "Original notes",
        choices: [{ text: "Original choice", goto: 2 }],
        effects: [{ type: "add_item", item: "key" }],
      };

      const { result } = renderHook(() => usePassageEditState({ passage }));

      // Make changes
      act(() => {
        result.current.handleTextChange({
          target: { value: "Modified" },
        } as React.ChangeEvent<HTMLTextAreaElement>);
        result.current.handleNotesChange({
          target: { value: "Modified notes" },
        } as React.ChangeEvent<HTMLTextAreaElement>);
        result.current.handleChoiceTextChange(0, "Modified choice");
        result.current.setTextError("Error");
      });

      expect(result.current.hasChanges).toBe(true);
      expect(result.current.textError).toBe("Error");

      // Reset
      act(() => {
        result.current.resetState();
      });

      expect(result.current.text).toBe("Original");
      expect(result.current.notes).toBe("Original notes");
      expect(result.current.choices).toEqual([
        { text: "Original choice", goto: 2 },
      ]);
      expect(result.current.effects).toEqual([
        { type: "add_item", item: "key" },
      ]);
      expect(result.current.textError).toBeUndefined();
      expect(result.current.hasChanges).toBe(false);
    });

    it("resets all state for ending passage", () => {
      const passage: Passage = {
        paragraphs: ["Original"],
        ending: true,
        type: "victory",
      };

      const { result } = renderHook(() => usePassageEditState({ passage }));

      // Make changes
      act(() => {
        result.current.handleTextChange({
          target: { value: "Modified" },
        } as React.ChangeEvent<HTMLTextAreaElement>);
        result.current.handleEndingTypeChange("defeat");
        result.current.setEndingTypeError("Test error");
      });

      expect(result.current.hasChanges).toBe(true);
      expect(result.current.endingTypeError).toBe("Test error");

      // Reset
      act(() => {
        result.current.resetState();
      });

      expect(result.current.text).toBe("Original");
      expect(result.current.isEnding).toBe(true);
      expect(result.current.endingType).toBe("victory");
      expect(result.current.choices).toEqual([]);
      expect(result.current.effects).toEqual([]);
      expect(result.current.endingTypeError).toBeUndefined();
      expect(result.current.hasChanges).toBe(false);
    });

    it("resets ending passage without type to empty string", () => {
      const passage: Passage = {
        paragraphs: ["Test ending"],
        ending: true,
      };

      const { result } = renderHook(() => usePassageEditState({ passage }));

      // Make a change
      act(() => {
        result.current.handleEndingTypeChange("victory");
      });

      expect(result.current.endingType).toBe("victory");
      expect(result.current.hasChanges).toBe(true);

      // Reset
      act(() => {
        result.current.resetState();
      });

      expect(result.current.endingType).toBe("");
      expect(result.current.hasChanges).toBe(false);
    });
  });
});

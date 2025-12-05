import { screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import { PassageEditView } from "../PassageEditView";
import { mockAdventure } from "@/__tests__/mockAdventureData";
import { renderWithAdventure } from "@/__tests__/testUtils";
import type { Passage } from "@/data/types";

// Mock the useAdventure hook
const mockUpdatePassage = vi.fn();

vi.mock("@/context/useAdventure", () => ({
  useAdventure: () => ({
    adventure: mockAdventure,
    updatePassage: mockUpdatePassage,
  }),
}));

describe("PassageEditView Component", () => {
  beforeEach(() => {
    mockUpdatePassage.mockClear();
  });

  describe("Auto-focus functionality", () => {
    it("focuses the first input when a new choice is added", async () => {
      const passage: Passage = {
        paragraphs: ["Test paragraph"],
        choices: [{ text: "Existing choice", goto: 2 }],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      const addChoiceButton = screen.getByTestId("add-choice-button");
      fireEvent.click(addChoiceButton);

      await waitFor(() => {
        const newChoiceInput = screen.getByTestId("choice-text-1");
        expect(newChoiceInput).toHaveFocus();
      });
    });

    it("focuses the first select when a new effect is added", async () => {
      const passage: Passage = {
        paragraphs: ["Test paragraph"],
        choices: [{ text: "Test choice", goto: 2 }],
        effects: [{ type: "add_item", item: "key" }],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      const addEffectButton = screen.getByTestId("add-effect-button");
      fireEvent.click(addEffectButton);

      await waitFor(() => {
        const newEffectSelect = screen.getByTestId("effect-type-1");
        expect(newEffectSelect).toHaveFocus();
      });
    });

    it("focuses correctly when multiple choices are added sequentially", async () => {
      const passage: Passage = {
        paragraphs: ["Test paragraph"],
        choices: [],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      const addChoiceButton = screen.getByTestId("add-choice-button");

      // Add first choice
      fireEvent.click(addChoiceButton);
      await waitFor(() => {
        const firstChoice = screen.getByTestId("choice-text-0");
        expect(firstChoice).toHaveFocus();
      });

      // Add second choice
      fireEvent.click(addChoiceButton);
      await waitFor(() => {
        const secondChoice = screen.getByTestId("choice-text-1");
        expect(secondChoice).toHaveFocus();
      });
    });

    it("focuses correctly when multiple effects are added sequentially", async () => {
      const passage: Passage = {
        paragraphs: ["Test paragraph"],
        choices: [{ text: "Test choice", goto: 2 }],
        effects: [],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      const addEffectButton = screen.getByTestId("add-effect-button");

      // Add first effect
      fireEvent.click(addEffectButton);
      await waitFor(() => {
        const firstEffect = screen.getByTestId("effect-type-0");
        expect(firstEffect).toHaveFocus();
      });

      // Add second effect
      fireEvent.click(addEffectButton);
      await waitFor(() => {
        const secondEffect = screen.getByTestId("effect-type-1");
        expect(secondEffect).toHaveFocus();
      });
    });
  });

  describe("Choice management", () => {
    it("renders existing choices", () => {
      const passage: Passage = {
        paragraphs: ["Test paragraph"],
        choices: [
          { text: "First choice", goto: 2 },
          { text: "Second choice", goto: 3 },
        ],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      const firstChoiceInput = screen.getByTestId("choice-text-0");
      const secondChoiceInput = screen.getByTestId("choice-text-1");

      expect(firstChoiceInput).toHaveValue("First choice");
      expect(secondChoiceInput).toHaveValue("Second choice");
    });

    it("removes a choice when remove button is clicked", () => {
      const passage: Passage = {
        paragraphs: ["Test paragraph"],
        choices: [
          { text: "First choice", goto: 2 },
          { text: "Second choice", goto: 3 },
        ],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      const removeButton = screen.getByTestId("remove-choice-0");
      fireEvent.click(removeButton);

      const firstChoiceInput = screen.getByTestId("choice-text-0");
      expect(firstChoiceInput).toHaveValue("Second choice");
    });
  });

  describe("Effect management", () => {
    it("renders existing effects", () => {
      const passage: Passage = {
        paragraphs: ["Test paragraph"],
        choices: [{ text: "Test choice", goto: 2 }],
        effects: [
          { type: "add_item", item: "key" },
          { type: "remove_item", item: "sword" },
        ],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      const firstEffectType = screen.getByTestId("effect-type-0");
      const secondEffectType = screen.getByTestId("effect-type-1");

      expect(firstEffectType).toHaveValue("add_item");
      expect(secondEffectType).toHaveValue("remove_item");
    });

    it("removes an effect when remove button is clicked", () => {
      const passage: Passage = {
        paragraphs: ["Test paragraph"],
        choices: [{ text: "Test choice", goto: 2 }],
        effects: [
          { type: "add_item", item: "key" },
          { type: "remove_item", item: "sword" },
        ],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      const removeButton = screen.getByTestId("remove-effect-0");
      fireEvent.click(removeButton);

      const firstEffectType = screen.getByTestId("effect-type-0");
      expect(firstEffectType).toHaveValue("remove_item");
    });
  });

  describe("Passage type handling", () => {
    it("renders ending type selector for ending passages", () => {
      const passage: Passage = {
        paragraphs: ["You win!"],
        ending: true,
        type: "victory",
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      const endingTypeSelect = screen.getByTestId("ending-type-select");
      expect(endingTypeSelect).toBeInTheDocument();
      expect(endingTypeSelect).toHaveValue("victory");
    });

    it("renders choices and effects for regular passages", () => {
      const passage: Passage = {
        paragraphs: ["Test paragraph"],
        choices: [{ text: "Test choice", goto: 2 }],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      const addChoiceButton = screen.getByTestId("add-choice-button");
      expect(addChoiceButton).toBeInTheDocument();
    });

    it("preserves choices and effects when switching to ending and back", () => {
      const passage: Passage = {
        paragraphs: ["Test paragraph"],
        choices: [{ text: "Test choice", goto: 2 }],
        effects: [{ type: "add_item", item: "key" }],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      // Verify initial state
      expect(screen.getByTestId("choice-text-0")).toHaveValue("Test choice");
      expect(screen.getByTestId("effect-type-0")).toHaveValue("add_item");

      // Switch to ending
      const passageTypeSelect = screen.getByTestId("passage-type-select");
      fireEvent.change(passageTypeSelect, { target: { value: "ending" } });

      // Verify choices and effects are hidden
      expect(screen.queryByTestId("choice-text-0")).not.toBeInTheDocument();
      expect(screen.queryByTestId("effect-type-0")).not.toBeInTheDocument();
      expect(screen.getByTestId("ending-type-select")).toBeInTheDocument();

      // Switch back to regular
      fireEvent.change(passageTypeSelect, { target: { value: "regular" } });

      // Verify choices and effects are restored
      expect(screen.getByTestId("choice-text-0")).toHaveValue("Test choice");
      expect(screen.getByTestId("effect-type-0")).toHaveValue("add_item");
    });

    it("preserves ending type when switching to regular and back", () => {
      const passage: Passage = {
        paragraphs: ["You win!"],
        ending: true,
        type: "victory",
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      // Verify initial state
      expect(screen.getByTestId("ending-type-select")).toHaveValue("victory");

      // Switch to regular
      const passageTypeSelect = screen.getByTestId("passage-type-select");
      fireEvent.change(passageTypeSelect, { target: { value: "regular" } });

      // Verify ending type is hidden
      expect(
        screen.queryByTestId("ending-type-select")
      ).not.toBeInTheDocument();
      expect(screen.getByTestId("add-choice-button")).toBeInTheDocument();

      // Switch back to ending
      fireEvent.change(passageTypeSelect, { target: { value: "ending" } });

      // Verify ending type is restored
      expect(screen.getByTestId("ending-type-select")).toHaveValue("victory");
    });

    it("preserves user-entered choices when switching passage types multiple times", () => {
      const passage: Passage = {
        paragraphs: ["Test paragraph"],
        choices: [{ text: "Original choice", goto: 2 }],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      // Modify the choice text
      const choiceInput = screen.getByTestId("choice-text-0");
      fireEvent.change(choiceInput, { target: { value: "Modified choice" } });
      expect(choiceInput).toHaveValue("Modified choice");

      // Add a new choice
      fireEvent.click(screen.getByTestId("add-choice-button"));
      const newChoiceInput = screen.getByTestId("choice-text-1");
      fireEvent.change(newChoiceInput, { target: { value: "New choice" } });

      // Switch to ending
      const passageTypeSelect = screen.getByTestId("passage-type-select");
      fireEvent.change(passageTypeSelect, { target: { value: "ending" } });

      // Select ending type
      const endingTypeSelect = screen.getByTestId("ending-type-select");
      fireEvent.change(endingTypeSelect, { target: { value: "defeat" } });

      // Switch back to regular
      fireEvent.change(passageTypeSelect, { target: { value: "regular" } });

      // Verify modified choices are restored
      expect(screen.getByTestId("choice-text-0")).toHaveValue(
        "Modified choice"
      );
      expect(screen.getByTestId("choice-text-1")).toHaveValue("New choice");

      // Switch to ending again
      fireEvent.change(passageTypeSelect, { target: { value: "ending" } });

      // Verify ending type is restored
      expect(screen.getByTestId("ending-type-select")).toHaveValue("defeat");
    });
  });

  describe("Reset functionality", () => {
    it("resets text to original value", () => {
      const passage: Passage = {
        paragraphs: ["Original text"],
        choices: [{ text: "Test choice", goto: 2 }],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      const textInput = screen.getByTestId("passage-text-input");
      fireEvent.change(textInput, { target: { value: "Modified text" } });
      expect(textInput).toHaveValue("Modified text");

      const resetButton = screen.getByTestId("reset-button");
      fireEvent.click(resetButton);

      expect(textInput).toHaveValue("Original text");
    });

    it("resets notes to original value", () => {
      const passage: Passage = {
        paragraphs: ["Test paragraph"],
        notes: "Original notes",
        choices: [{ text: "Test choice", goto: 2 }],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      const notesInput = screen.getByTestId("passage-notes-input");
      fireEvent.change(notesInput, { target: { value: "Modified notes" } });
      expect(notesInput).toHaveValue("Modified notes");

      const resetButton = screen.getByTestId("reset-button");
      fireEvent.click(resetButton);

      expect(notesInput).toHaveValue("Original notes");
    });

    it("resets choices to original values", () => {
      const passage: Passage = {
        paragraphs: ["Test paragraph"],
        choices: [
          { text: "Original choice 1", goto: 2 },
          { text: "Original choice 2", goto: 3 },
        ],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      // Modify first choice
      const choiceInput0 = screen.getByTestId("choice-text-0");
      fireEvent.change(choiceInput0, { target: { value: "Modified choice" } });

      // Remove second choice
      fireEvent.click(screen.getByTestId("remove-choice-1"));

      // Add a new choice
      fireEvent.click(screen.getByTestId("add-choice-button"));

      const resetButton = screen.getByTestId("reset-button");
      fireEvent.click(resetButton);

      // Verify original choices are restored
      expect(screen.getByTestId("choice-text-0")).toHaveValue(
        "Original choice 1"
      );
      expect(screen.getByTestId("choice-text-1")).toHaveValue(
        "Original choice 2"
      );
      expect(screen.queryByTestId("choice-text-2")).not.toBeInTheDocument();
    });

    it("resets effects to original values", () => {
      const passage: Passage = {
        paragraphs: ["Test paragraph"],
        choices: [{ text: "Test choice", goto: 2 }],
        effects: [
          { type: "add_item", item: "key" },
          { type: "remove_item", item: "sword" },
        ],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      // Remove first effect
      fireEvent.click(screen.getByTestId("remove-effect-0"));

      // Modify second effect (which is now first)
      const effectTypeSelect = screen.getByTestId("effect-type-0");
      fireEvent.change(effectTypeSelect, { target: { value: "add_item" } });

      const resetButton = screen.getByTestId("reset-button");
      fireEvent.click(resetButton);

      // Verify original effects are restored
      expect(screen.getByTestId("effect-type-0")).toHaveValue("add_item");
      expect(screen.getByTestId("effect-type-1")).toHaveValue("remove_item");
    });

    it("resets ending type to original value", () => {
      const passage: Passage = {
        paragraphs: ["You win!"],
        ending: true,
        type: "victory",
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      const endingTypeSelect = screen.getByTestId("ending-type-select");
      fireEvent.change(endingTypeSelect, { target: { value: "defeat" } });
      expect(endingTypeSelect).toHaveValue("defeat");

      const resetButton = screen.getByTestId("reset-button");
      fireEvent.click(resetButton);

      expect(endingTypeSelect).toHaveValue("victory");
    });

    it("resets passage type from ending to regular", () => {
      const passage: Passage = {
        paragraphs: ["Test paragraph"],
        choices: [{ text: "Test choice", goto: 2 }],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      // Switch to ending
      const passageTypeSelect = screen.getByTestId("passage-type-select");
      fireEvent.change(passageTypeSelect, { target: { value: "ending" } });
      expect(screen.getByTestId("ending-type-select")).toBeInTheDocument();

      const resetButton = screen.getByTestId("reset-button");
      fireEvent.click(resetButton);

      // Verify it's back to regular
      expect(
        screen.queryByTestId("ending-type-select")
      ).not.toBeInTheDocument();
      expect(screen.getByTestId("choice-text-0")).toHaveValue("Test choice");
    });

    it("resets passage type from regular to ending", () => {
      const passage: Passage = {
        paragraphs: ["You win!"],
        ending: true,
        type: "victory",
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      // Switch to regular
      const passageTypeSelect = screen.getByTestId("passage-type-select");
      fireEvent.change(passageTypeSelect, { target: { value: "regular" } });
      expect(screen.getByTestId("add-choice-button")).toBeInTheDocument();

      const resetButton = screen.getByTestId("reset-button");
      fireEvent.click(resetButton);

      // Verify it's back to ending
      expect(screen.getByTestId("ending-type-select")).toHaveValue("victory");
    });

    it("clears saved state in refs when reset is clicked", () => {
      const passage: Passage = {
        paragraphs: ["Test paragraph"],
        choices: [{ text: "Original choice", goto: 2 }],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      // Modify choice
      const choiceInput = screen.getByTestId("choice-text-0");
      fireEvent.change(choiceInput, { target: { value: "Modified choice" } });

      // Switch to ending (this saves choices to ref)
      const passageTypeSelect = screen.getByTestId("passage-type-select");
      fireEvent.change(passageTypeSelect, { target: { value: "ending" } });

      // Reset (this should clear saved state)
      const resetButton = screen.getByTestId("reset-button");
      fireEvent.click(resetButton);

      // Now switch to ending again
      fireEvent.change(passageTypeSelect, { target: { value: "ending" } });

      // Switch back to regular - should show original, not modified
      fireEvent.change(passageTypeSelect, { target: { value: "regular" } });

      expect(screen.getByTestId("choice-text-0")).toHaveValue(
        "Original choice"
      );
    });
  });
});

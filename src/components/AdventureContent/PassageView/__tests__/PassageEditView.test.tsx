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
  });
});

import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

// Mock react-router-dom's useBlocker
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useBlocker: vi.fn(() => ({
      state: "unblocked",
      proceed: vi.fn(),
      reset: vi.fn(),
    })),
  };
});

describe("PassageEditView Integration", () => {
  beforeEach(() => {
    mockUpdatePassage.mockClear();
  });

  describe("Component integration with hooks", () => {
    it("integrates usePassageEditState and usePassageSaveActions to save changes", async () => {
      const passage: Passage = {
        paragraphs: ["Original text"],
        choices: [{ text: "Choice 1", goto: 2 }],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      // Modify text using state hook
      const textarea = screen.getByTestId("passage-text-input");
      fireEvent.change(textarea, { target: { value: "Updated text" } });

      // Save using save actions hook
      const saveButton = screen.getByTestId("save-button");
      await waitFor(() => {
        expect(saveButton).not.toBeDisabled();
      });

      fireEvent.click(saveButton);

      // Verify integration worked
      await waitFor(() => {
        expect(mockUpdatePassage).toHaveBeenCalledWith(
          1,
          expect.objectContaining({
            paragraphs: ["Updated text"],
          })
        );
      });
    });

    it("resets state through integrated hooks", () => {
      const passage: Passage = {
        paragraphs: ["Original text"],
        choices: [{ text: "Choice 1", goto: 2 }],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      // Make changes
      const textarea = screen.getByTestId("passage-text-input");
      fireEvent.change(textarea, { target: { value: "Modified text" } });

      // Reset
      const resetButton = screen.getByTestId("reset-button");
      fireEvent.click(resetButton);

      // Verify reset worked
      expect(textarea).toHaveValue("Original text");
    });
  });

  describe("Component integration with ChoiceList and ChoiceItem", () => {
    it("renders choices through ChoiceList component", () => {
      const passage: Passage = {
        paragraphs: ["Test"],
        choices: [
          { text: "First choice", goto: 2 },
          { text: "Second choice", goto: 3 },
        ],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      expect(screen.getByTestId("choice-text-0")).toHaveValue("First choice");
      expect(screen.getByTestId("choice-text-1")).toHaveValue("Second choice");
    });

    it("adds choices through ChoiceList integration", async () => {
      const passage: Passage = {
        paragraphs: ["Test"],
        choices: [{ text: "Existing", goto: 2 }],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      const addButton = screen.getByTestId("add-choice-button");
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByTestId("choice-text-1")).toBeInTheDocument();
      });
    });

    it("removes choices through ChoiceItem integration", () => {
      const passage: Passage = {
        paragraphs: ["Test"],
        choices: [
          { text: "First", goto: 2 },
          { text: "Second", goto: 3 },
        ],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      const removeButton = screen.getByTestId("remove-choice-0");
      fireEvent.click(removeButton);

      expect(screen.queryByTestId("choice-text-1")).not.toBeInTheDocument();
      expect(screen.getByTestId("choice-text-0")).toHaveValue("Second");
    });

    it("updates choice text through ChoiceItem integration", () => {
      const passage: Passage = {
        paragraphs: ["Test"],
        choices: [{ text: "Original", goto: 2 }],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      const input = screen.getByTestId("choice-text-0");
      fireEvent.change(input, { target: { value: "Updated choice" } });

      expect(input).toHaveValue("Updated choice");
    });
  });

  describe("Component integration with EffectList and EffectItem", () => {
    it("renders effects through EffectList component", () => {
      const passage: Passage = {
        paragraphs: ["Test"],
        choices: [{ text: "Go", goto: 2 }],
        effects: [
          { type: "add_item", item: "test_key" },
          { type: "remove_item", item: "test_map" },
        ],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      // Verify effects are rendered
      expect(screen.getByTestId("effect-type-0")).toBeInTheDocument();
      expect(screen.getByTestId("effect-type-1")).toBeInTheDocument();
      expect(screen.getByTestId("effect-type-0")).toHaveTextContent(
        "Add item to inventory"
      );
      expect(screen.getByTestId("effect-type-1")).toHaveTextContent(
        "Remove item from inventory"
      );
    });

    it("adds effects through EffectList integration", async () => {
      const passage: Passage = {
        paragraphs: ["Test"],
        choices: [{ text: "Go", goto: 2 }],
        effects: [{ type: "add_item", item: "key" }],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      const addButton = screen.getByTestId("add-effect-button");
      fireEvent.click(addButton);

      await waitFor(() => {
        expect(screen.getByTestId("effect-type-1")).toBeInTheDocument();
      });
    });

    it("removes effects through EffectItem integration", () => {
      const passage: Passage = {
        paragraphs: ["Test"],
        choices: [{ text: "Go", goto: 2 }],
        effects: [
          { type: "add_item", item: "key" },
          { type: "remove_item", item: "map" },
        ],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      const removeButton = screen.getByTestId("remove-effect-0");
      fireEvent.click(removeButton);

      expect(screen.queryByTestId("effect-type-1")).not.toBeInTheDocument();
      expect(screen.getByTestId("effect-type-0")).toHaveTextContent(
        "Remove item from inventory"
      );
    });

    it("updates effect values through EffectItem integration", async () => {
      const passage: Passage = {
        paragraphs: ["Test"],
        choices: [{ text: "Go", goto: 2 }],
        effects: [{ type: "add_item", item: "key" }],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      const effectType = screen.getByTestId("effect-type-0");
      fireEvent.click(effectType);
      const removeItemOption = await screen.findByTestId(
        "effect-type-0-option-remove_item"
      );
      fireEvent.click(removeItemOption);

      // Verify the change was applied
      expect(effectType).toHaveTextContent("Remove item from inventory");
    });
  });

  describe("Component integration with PassageEditFooter", () => {
    it("shows footer with save and reset buttons", () => {
      const passage: Passage = {
        paragraphs: ["Test"],
        choices: [{ text: "Go", goto: 2 }],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      expect(screen.getByTestId("save-button")).toBeInTheDocument();
      expect(screen.getByTestId("reset-button")).toBeInTheDocument();
    });

    it("disables save button when no changes through footer integration", () => {
      const passage: Passage = {
        paragraphs: ["Test"],
        choices: [{ text: "Go", goto: 2 }],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      expect(screen.getByTestId("save-button")).toBeDisabled();
    });

    it("enables save button when changes detected through footer integration", () => {
      const passage: Passage = {
        paragraphs: ["Test"],
        choices: [{ text: "Go", goto: 2 }],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      const textarea = screen.getByTestId("passage-text-input");
      fireEvent.change(textarea, { target: { value: "Modified" } });

      expect(screen.getByTestId("save-button")).not.toBeDisabled();
    });
  });

  describe("Full workflow integration", () => {
    it("saves simple text edits", async () => {
      const passage: Passage = {
        paragraphs: ["Original passage"],
        choices: [{ text: "Original choice", goto: 2 }],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      // Edit text
      const textarea = screen.getByTestId("passage-text-input");
      fireEvent.change(textarea, { target: { value: "New passage text" } });

      // Wait for save button to be enabled
      const saveButton = screen.getByTestId("save-button");
      await waitFor(() => {
        expect(saveButton).not.toBeDisabled();
      });

      // Click save
      fireEvent.click(saveButton);

      // Verify save was called
      await waitFor(() => {
        expect(mockUpdatePassage).toHaveBeenCalledWith(
          1,
          expect.objectContaining({
            paragraphs: ["New passage text"],
            choices: [{ text: "Original choice", goto: 2 }],
          })
        );
      });
    });

    it("handles ending passage workflow through all components", async () => {
      const user = userEvent.setup();
      const passage: Passage = {
        paragraphs: ["Ending text"],
        choices: [{ text: "Should disappear", goto: 2 }],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      // Switch to ending using the select dropdown
      const passageTypeSelect = screen.getByTestId("passage-type-select");
      await user.click(passageTypeSelect);
      const endingOption = await screen.findByTestId(
        "passage-type-select-option-ending"
      );
      await user.click(endingOption);

      // Verify choices are hidden
      expect(screen.queryByTestId("choice-text-0")).not.toBeInTheDocument();

      // Set ending type
      const endingTypeSelect = screen.getByTestId("ending-type-select");
      await user.click(endingTypeSelect);

      const victoryOption = await screen.findByTestId(
        "ending-type-select-option-victory"
      );
      await user.click(victoryOption);

      // Wait for dropdown to close
      await waitFor(() => {
        expect(
          screen.queryByTestId("ending-type-select-option-victory")
        ).not.toBeInTheDocument();
      });

      // Save
      const saveButton = screen.getByTestId("save-button");
      await user.click(saveButton);

      // Verify the passage was saved with the correct ending type
      await waitFor(
        () => {
          expect(mockUpdatePassage).toHaveBeenCalledWith(
            1,
            expect.objectContaining({
              ending: true,
              type: "victory",
              paragraphs: ["Ending text"],
            })
          );
        },
        { timeout: 2000 }
      );
    });
  });

  describe("Self-referencing prevention", () => {
    it("excludes current passage from choice dropdown options", async () => {
      const passage: Passage = {
        paragraphs: ["Test passage"],
        choices: [{ text: "Go somewhere", goto: 2 }],
      };

      renderWithAdventure(<PassageEditView passageId={1} passage={passage} />);

      // Open the goto dropdown for the first choice
      const gotoSelect = screen.getByTestId("choice-goto-0");
      fireEvent.click(gotoSelect);

      // Wait for options to appear
      await waitFor(() => {
        // Verify passage 2 is available
        expect(
          screen.getByTestId("choice-goto-0-option-2")
        ).toBeInTheDocument();
        // Verify passage 3 is available
        expect(
          screen.getByTestId("choice-goto-0-option-3")
        ).toBeInTheDocument();
      });

      // Verify current passage (1) is NOT available
      expect(
        screen.queryByTestId("choice-goto-0-option-1")
      ).not.toBeInTheDocument();
    });

    it("excludes current passage from dropdown when adding new choice", async () => {
      const passage: Passage = {
        paragraphs: ["Test passage"],
        choices: [{ text: "Existing choice", goto: 2 }],
      };

      renderWithAdventure(<PassageEditView passageId={5} passage={passage} />);

      // Add a new choice
      const addButton = screen.getByTestId("add-choice-button");
      fireEvent.click(addButton);

      // Open the goto dropdown for the new choice
      await waitFor(() => {
        expect(screen.getByTestId("choice-goto-1")).toBeInTheDocument();
      });

      const gotoSelect = screen.getByTestId("choice-goto-1");
      fireEvent.click(gotoSelect);

      // Wait for options to appear
      await waitFor(() => {
        expect(
          screen.getByTestId("choice-goto-1-option-1")
        ).toBeInTheDocument();
      });

      // Verify current passage (5) is NOT available but others are
      expect(
        screen.queryByTestId("choice-goto-1-option-5")
      ).not.toBeInTheDocument();
      expect(screen.getByTestId("choice-goto-1-option-1")).toBeInTheDocument();
    });
  });
});

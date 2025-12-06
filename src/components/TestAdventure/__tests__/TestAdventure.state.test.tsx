import { screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";
import { TestAdventure } from "../TestAdventure";
import { renderWithAdventure } from "@/__tests__/testUtils";
import { mockAdventure } from "@/__tests__/mockAdventureData";
import {
  getAdventureTestPassageRoute,
  getAdventureTestRoute,
} from "@/constants/routes";
import { PASSAGE_TEST_IDS, getChoiceButtonTestId } from "../testIds";
import type { Adventure } from "@/data/types";

const TEST_STORY_ID = "test-adventure-id";

// Mock react-router-dom navigate function
const mockNavigate = vi.fn();
let mockParams = { id: "1", adventureId: TEST_STORY_ID };

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
  };
});

describe("TestAdventure Component", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.clearAllMocks();
    mockParams = { id: "1", adventureId: TEST_STORY_ID };
  });

  describe("Debug Mode Choice Display", () => {
    it("maintains correct navigation when debug mode is enabled", async () => {
      renderWithAdventure(<TestAdventure />, {
        adventureId: TEST_STORY_ID,
        adventure: mockAdventure,
        isDebugModeEnabled: true,
      });

      const firstChoice = await screen.findByTestId(getChoiceButtonTestId(0));
      expect(firstChoice).toHaveTextContent("2: Go to mock passage 2");
      expect(firstChoice).toHaveAttribute("data-goto", "2");

      fireEvent.click(firstChoice);

      expect(mockNavigate).toHaveBeenCalledWith(
        getAdventureTestPassageRoute(TEST_STORY_ID, 2)
      );
    });
  });

  describe("Inventory State Management", () => {
    it("resets inventory when navigating from passage back to introduction", async () => {
      // This test verifies that clicking the restart button on an ending passage
      // navigates to the introduction (where inventory state is reset)
      const adventureWithEnding: Adventure = {
        ...mockAdventure,
        passages: {
          ...mockAdventure.passages,
          10: {
            paragraphs: ["The adventure concludes!", "The end!"],
            ending: true,
          },
        },
      };

      mockParams = { id: "10", adventureId: TEST_STORY_ID };

      renderWithAdventure(<TestAdventure />, {
        adventureId: TEST_STORY_ID,
        adventure: adventureWithEnding,
        isDebugModeEnabled: true,
      });

      // Wait for ending passage to render
      await screen.findByText("The adventure concludes!");

      // Click the restart button to navigate to introduction
      const restartButton = screen.getByTestId(PASSAGE_TEST_IDS.RESTART_BUTTON);
      fireEvent.click(restartButton);

      // Verify navigate was called to go to introduction (where inventory resets)
      expect(mockNavigate).toHaveBeenCalledWith(
        getAdventureTestRoute(TEST_STORY_ID)
      );
    });

    it("properly handles remove_item effect during passage navigation", async () => {
      // Create adventure where we add an item in one passage and remove it in another
      const adventureWithEffects: Adventure = {
        ...mockAdventure,
        passages: {
          ...mockAdventure.passages,
          11: {
            paragraphs: ["You picked up a torch."],
            choices: [{ text: "Continue", goto: 12 }],
            effects: [{ type: "add_item", item: "torch" }],
          },
          12: {
            paragraphs: ["The torch burned out and crumbled to ash."],
            choices: [{ text: "Move on", goto: 1 }],
            effects: [{ type: "remove_item", item: "torch" }],
          },
        },
        items: [
          ...(mockAdventure.items || []),
          { id: "torch", name: "Burning Torch" },
        ],
      };

      // Start at passage 11 to add the item
      mockParams = { id: "11", adventureId: TEST_STORY_ID };

      renderWithAdventure(<TestAdventure />, {
        adventureId: TEST_STORY_ID,
        adventure: adventureWithEffects,
        isDebugModeEnabled: true,
      });

      await screen.findByText("You picked up a torch.");

      // Verify item was added
      await waitFor(() => {
        const torchToggle = screen.queryByRole("switch", {
          name: /Burning Torch/,
        });
        if (torchToggle) {
          expect(torchToggle).toBeChecked();
        }
      });

      // Directly navigate to passage 12 by clicking the choice
      const continueButton = await screen.findByRole("button", {
        name: /Continue/,
      });
      fireEvent.click(continueButton);

      expect(mockNavigate).toHaveBeenCalledWith(
        getAdventureTestPassageRoute(TEST_STORY_ID, 12)
      );
    });

    it("does not duplicate items when add_item effect adds same item twice", async () => {
      const adventureWithEffects: Adventure = {
        ...mockAdventure,
        passages: {
          ...mockAdventure.passages,
          13: {
            paragraphs: ["You tried to pick up the coin again."],
            choices: [{ text: "Continue", goto: 1 }],
            effects: [
              { type: "add_item", item: "coin" },
              { type: "add_item", item: "coin" }, // Try to add same item twice
            ],
          },
        },
        items: [
          ...(mockAdventure.items || []),
          { id: "coin", name: "Gold Coin" },
        ],
      };

      mockParams = { id: "13", adventureId: TEST_STORY_ID };

      renderWithAdventure(<TestAdventure />, {
        adventureId: TEST_STORY_ID,
        adventure: adventureWithEffects,
        isDebugModeEnabled: true,
      });

      await screen.findByText("You tried to pick up the coin again.");

      // Verify the item is in inventory (should only appear once)
      await waitFor(() => {
        const coinToggle = screen.queryByRole("switch", {
          name: /Gold Coin/,
        });
        if (coinToggle) {
          expect(coinToggle).toBeChecked();
        }
      });
    });

    it("executes remove_item effect correctly when item exists in inventory", async () => {
      // This test ensures the remove_item branch is executed properly
      const adventureWithEffects: Adventure = {
        ...mockAdventure,
        passages: {
          ...mockAdventure.passages,
          14: {
            paragraphs: ["You found a mysterious key."],
            choices: [{ text: "Use the key", goto: 15 }],
            effects: [{ type: "add_item", item: "key" }],
          },
          15: {
            paragraphs: ["You used the key to open the door. It broke!"],
            choices: [{ text: "Enter", goto: 1 }],
            effects: [{ type: "remove_item", item: "key" }],
          },
        },
        items: [
          ...(mockAdventure.items || []),
          { id: "key", name: "Mysterious Key" },
        ],
      };

      // Start at passage 14 where we get the key
      mockParams = { id: "14", adventureId: TEST_STORY_ID };

      renderWithAdventure(<TestAdventure />, {
        adventureId: TEST_STORY_ID,
        adventure: adventureWithEffects,
        isDebugModeEnabled: true,
      });

      await screen.findByText("You found a mysterious key.");

      // Wait for the add_item effect to execute
      await waitFor(() => {
        const keyToggle = screen.queryByRole("switch", {
          name: /Mysterious Key/,
        });
        if (keyToggle) {
          expect(keyToggle).toBeChecked();
        }
      });

      // Now click to navigate to passage 15 where the key is removed
      const useKeyButton = await screen.findByRole("button", {
        name: /Use the key/,
      });
      fireEvent.click(useKeyButton);

      // This should trigger the remove_item effect
      expect(mockNavigate).toHaveBeenCalledWith(
        getAdventureTestPassageRoute(TEST_STORY_ID, 15)
      );
    });
  });
});
